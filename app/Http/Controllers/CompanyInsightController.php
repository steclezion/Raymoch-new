<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyInsightController extends Controller
{
    public function select(Request $request, Company $company): JsonResponse
    {
        $id = (string) $company->getKey();
        $previous = $request->session()->get('company_insight.selections', []);
        $selections = array_values(array_unique([$id, ...$previous]));
        $request->session()->put('company_insight.selections', array_slice($selections, 0, 20));

        return response()->json([
            'company_id' => $id,
            'starters' => config('company_insight_prompt.starters', []),
            'corrections' => config('company_insight_prompt.corrections', []),
        ]);
    }

    public function question(Request $request, Company $company): JsonResponse
    {
        $id = (string) $company->getKey();
        abort_unless(in_array($id, $request->session()->get('company_insight.selections', []), true), 409,
            'Reopen the company profile before asking a question.');

        $validated = $request->validate(['question' => ['required', 'string', 'max:1500']]);
        $question = preg_replace_callback('/\p{L}+/u', function ($match) {
            $word = $match[0];

            return config('company_insight_prompt.corrections.'.mb_strtolower($word), $word);
        }, trim($validated['question']));

        if (preg_match(config('company_insight_prompt.restricted_question'), $question)) {
            return response()->json([
                'question' => $question,
                'answer' => config('company_insight_prompt.out_of_scope'),
                'sources' => [],
            ]);
        }

        $records = $this->retrieve($company, $question);
        $topics = config('company_insight_prompt.topics', []);
        $selected = array_keys(array_filter($topics, fn ($pattern) => preg_match($pattern, $question)));
        preg_match_all('/\b(?:19|20)\d{2}\b/', $question, $years);
        if ($years[0] && ! in_array('F', $selected, true)) {
            $selected[] = 'F';
        }
        $terms = $this->searchTerms($question);
        if (! $selected) {
            $selected = array_values(array_unique(array_map(
                fn ($reference) => $reference[0],
                array_keys(array_filter($records, fn ($record) => $this->relevance($record['data'], $terms) > 0)),
            )));
        }
        if (! $selected) {
            return response()->json([
                'question' => $question,
                'answer' => config('company_insight_prompt.no_match'),
                'sources' => [],
            ]);
        }

        $sections = [];
        $references = [];
        foreach ($selected as $prefix) {
            $matching = array_filter($records, fn ($reference) => str_starts_with($reference, $prefix), ARRAY_FILTER_USE_KEY);
            if ($prefix === 'F' && $years[0]) {
                $matching = array_filter($matching, fn ($record) => in_array((string) $record['data']['fiscal_year'], $years[0], true));
            }
            if (! $matching) {
                $sections[] = 'No matching records were found for '.match ($prefix) {
                    'F' => 'financials', 'T' => 'team', 'D' => 'public documents', 'L' => 'locations',
                    'O' => 'products and services', 'C' => 'capabilities', 'M' => 'operating and target markets',
                    'V' => 'verification', 'G' => 'gallery', 'B' => 'business contact', 'R' => 'published procurement',
                    'I' => 'published investment opportunities', 'W' => 'company ownership', default => 'company profile',
                }.'.';
                continue;
            }
            uasort($matching, fn ($left, $right) =>
                $this->relevance($right['data'], $terms) <=> $this->relevance($left['data'], $terms));
            foreach (array_slice($matching, 0, 5, true) as $reference => $record) {
                $data = $record['data'];
                $fields = [];
                foreach ($data as $field => $value) {
                    if (is_scalar($value) && $value !== '') {
                        $fields[] = ucfirst(str_replace('_', ' ', $field)).': '.$value;
                    }
                }
                if ($fields) {
                    $references[$reference] = $record['source'];
                    $sections[] = "[$reference] ".$record['source']."\n".implode("\n", $fields);
                }
            }
        }
        if (preg_match('/\b(market|competitor\w*|trend\w*|forecast\w*)\b/i', $question)) {
            $sections[] = config('company_insight_prompt.market_limit');
        }

        return response()->json([
            'question' => $question,
            'answer' => $sections ? implode("\n\n", $sections) : 'The matching records did not contain usable information.',
            'sources' => $references,
        ]);
    }

    private function searchTerms(string $question): array
    {
        preg_match_all('/[\p{L}\p{N}]{3,}/u', mb_strtolower($question), $matches);

        return array_slice(array_values(array_diff(array_unique($matches[0]), [
            'about', 'and', 'are', 'can', 'company', 'could', 'does', 'for', 'from', 'give',
            'have', 'how', 'information', 'its', 'please', 'records', 'show', 'tell', 'that',
            'the', 'their', 'this', 'what', 'which', 'who', 'with', 'would', 'you',
        ])), 0, 24);
    }

    private function relevance(array $data, array $terms): int
    {
        $values = array_filter($data, 'is_scalar');
        $text = mb_strtolower(implode(' ', $values));
        preg_match_all('/[\p{L}\p{N}]{3,}/u', $text, $matches);

        return count(array_intersect($terms, $matches[0]));
    }

    private function retrieve(Company $company, string $question): array
    {
        $id = $company->getKey();
        $profile = DB::table('companies as c')
            ->leftJoin('sectors as s', 's.id', '=', 'c.Sector')
            ->leftJoin('industries as i', 'i.id', '=', 'c.industry_id')
            ->leftJoin('countries_africans as co', 'co.id', '=', 'c.Country')
            ->leftJoin('regions as r', 'r.id', '=', 'c.Region')
            ->leftJoin('cities_all as ci', 'ci.id', '=', 'c.City')
            ->leftJoin('stages as st', 'st.id', '=', 'c.Stage')
            ->leftJoin('legal_structure as ls', 'ls.id', '=', 'c.legal_structure_id')
            ->where('c.id', $id)->first([
                'c.CompanyName as company_name', 's.title as sector', 'i.name as industry',
                'co.country_name as country', 'r.name as region', 'ci.name as city',
                'c.FoundedYear as founded_year', 'st.name as stage',
                'c.VerificationStatus as verification_status', 'c.business_description',
                'ls.name as legal_structure', 'c.public_listing_ticker', 'c.business_model',
            ]);

        $records = [
            'P1' => ['source' => 'Company profile', 'data' => array_map(
                fn ($value) => is_string($value) ? mb_substr($value, 0, 2400) : $value,
                (array) $profile + [
                    'summary' => $company->Summary ?? $company->summary,
                    'snapshot' => $company->Snapshot ?? $company->snapshot,
                ],
            )],
        ];

        $financials = $company->financials();
        preg_match_all('/\b(?:19|20)\d{2}\b/', $question, $years);
        $requestedYears = array_slice(array_unique($years[0]), 0, 10);
        if ($requestedYears) {
            $placeholders = implode(',', array_fill(0, count($requestedYears), '?'));
            $financials->orderByRaw("case when fiscal_year in ($placeholders) then 0 else 1 end", $requestedYears);
        }

        $groups = [
            ['F', 'Financial record', $financials->orderByDesc('fiscal_year')->orderByDesc('id')->limit(15)->get([
                'fiscal_year', 'currency', 'revenue', 'ebitda', 'net_income', 'total_assets',
                'total_liabilities', 'valuation', 'source', 'as_of_date',
            ])],
            ['T', 'Team record', $company->teamMembers()->orderBy('id')->limit(20)->get(['full_name', 'title', 'role_type', 'bio'])],
            ['W', 'Reported corporate ownership', collect([(object) [
                'reported_parent_company' => $company->who_is_parent_company ?: $company->ultimate_parent_company,
                'ownership_type' => $company->ownership_type,
                'reported_relationship' => $company->relationship_type,
                'reported_relationship_ownership_percent' => is_numeric($company->ownership_percentage)
                    ? $company->ownership_percentage.'%' : null,
            ]])],
            ['W', 'Reported ownership stake in company team records', $company->teamMembers()
                ->whereBetween('ownership_percent', [0.01, 100])
                ->orderByDesc('ownership_percent')->orderBy('id')->limit(20)
                ->get(['full_name', 'title', 'ownership_percent'])->map(fn ($member) => (object) [
                    'name' => $member->full_name,
                    'title' => $member->title,
                    'reported_ownership_percent' => $member->ownership_percent.'%',
                ])],
            ['D', 'Public document metadata', $company->documents()->where('is_public', true)
                ->orderByDesc('as_of_date')->orderByDesc('id')->limit(15)->get(['title', 'document_type', 'source', 'as_of_date'])],
            ['L', 'Company location', $company->location()->limit(1)->get(['city', 'state', 'country'])],
            ['P', 'Organization profile', $company->organizationProfile()->get([
                'mission', 'vision', 'business_summary', 'business_model', 'founded_date', 'export_ready',
            ])],
            ['O', 'Active product or service', $company->productServices()->where('is_active', true)
                ->orderBy('id')->limit(50)->get(['type', 'name', 'category', 'description', 'unit_of_measure', 'production_capacity', 'production_capacity_unit'])],
            ['C', 'Organization capability', $company->organizationCapabilities()
                ->join('capabilities as c', 'c.id', '=', 'organization_capabilities.capability_id')
                ->orderBy('organization_capabilities.id')->limit(50)->get([
                    'c.name', 'c.capability_type', 'organization_capabilities.description',
                    'capacity_value', 'capacity_unit', 'quality_certified', 'export_ready',
                ])],
            ['L', 'Organization site', $company->organizationLocations()
                ->join('countries_all as c', 'c.id', '=', 'organization_locations.country_id')
                ->orderByDesc('is_primary')->orderBy('organization_locations.id')->limit(30)
                ->get(['organization_locations.city', 'c.name as country', 'location_type'])],
            ['M', 'Company market', DB::table('organization_operating_countries_all as m')
                ->join('countries_all as c', 'c.id', '=', 'm.country_id')->where('m.company_id', $id)
                ->orderBy('m.id')->limit(50)->get(['c.name as country', 'm.market_role'])],
            ['V', 'Directory verification status', collect([(object) ['verification_status' => $profile?->verification_status]])],
            ['V', 'Verified organization credential', $company->organizationVerification()
                ->join('verification_types as t', 't.id', '=', 'organization_verifications.verification_type_id')
                ->where('organization_verifications.status', 'verified')
                ->where(fn ($query) => $query->whereNull('expiry_date')->orWhereDate('expiry_date', '>=', today()))
                ->orderByDesc('verified_at')->orderBy('organization_verifications.id')->limit(20)
                ->get(['t.name as verification_type', 'organization_verifications.status', 'verified_at', 'expiry_date'])],
            ['G', 'Gallery entry', $company->galleries()->orderBy('sort_order')->orderBy('id')->limit(30)->get(['caption', 'alt_text'])],
            ['B', 'Business website', $company->contacts()->whereNotNull('website')->orderBy('id')->limit(10)->get(['website'])],
            ['R', 'Published procurement request', $company->procurementRequests()->where('status', 'published')
                ->orderByDesc('id')->limit(30)->get(['title', 'description', 'category', 'deadline', 'status'])],
            ['I', 'Published investment opportunity', DB::table('investment_opportunities')->where('company_id', $id)
                ->where('status', 'open')->where('published_at', '<=', now())
                ->orderByDesc('published_at')->orderBy('id')->limit(30)
                ->get(['title', 'description', 'amount_min', 'amount_max', 'currency_code', 'closes_at'])],
        ];

        $sourceIndexes = ['P' => 1];
        foreach ($groups as [$prefix, $source, $rows]) {
            foreach ($rows as $row) {
                $data = array_map(
                    fn ($value) => is_string($value) ? mb_substr($value, 0, 1200) : ($value === true ? 'Yes' : ($value === false ? 'No' : $value)),
                    $row instanceof \Illuminate\Database\Eloquent\Model
                        ? $row->getAttributes()
                        : (array) $row,
                );
                if (! array_filter($data, fn ($value) => is_scalar($value) && $value !== '')) {
                    continue;
                }
                $sourceIndexes[$prefix] = ($sourceIndexes[$prefix] ?? 0) + 1;
                $records[$prefix.$sourceIndexes[$prefix]] = ['source' => $source, 'data' => $data];
            }
        }

        return $records;
    }
}
