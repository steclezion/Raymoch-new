<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class ExploreTooltipController extends Controller
{
    public function show(Request $request)
    {
        $type = trim((string) $request->query('type', ''));
        $id = trim((string) $request->query('id', ''));

        if (!in_array($type, ['sector', 'industry'], true) || $id === '') {
            return response()->json([
                'ok' => false,
                'message' => 'Valid type and id are required.',
            ], 422);
        }

        if ($type === 'sector') {

            $totalCompanies = $this->Count('companies', 'Sector', 'Sector', $id, null)['count'];

            $verifiedCompanies = $this->Count('companies', 'Sector', 'VerificationStatus', $id, 'Verified')['count'];

            $regionsCount = $this->Count('companies', 'Sector', 'Region', $id, null)['count'];

            $topCountryBy = $this->topCountryBy('sectors', $id);
        }

        if ($type === 'industry') {
            $totalCompanies = $this->Count('industries', 'sector_id', null, $id, null)['count'];

            $verifiedCompanies = $this->Count('industries', 'sector_id', 'VerificationStatus', $id, 'Verified')['count'];

            $regionsCount = $this->Count('industries', 'sector_id', 'Region', $id, null)['count'];

            $topCountryBy = $this->topCountryBy('industries', $id);
        }



        return response()->json([
            'ok' => true,
            'data' => [
                'total_companies' => $totalCompanies,
                'verified_companies' => $verifiedCompanies,
                'regions_count' => $regionsCount,
                'top_country' => $topCountryBy['name'],
                'top_country_companies' => $topCountryBy['count'],
            ],
        ]);
    }



    protected function Count($table_name, $column_name, $column_name_b, $id, $condition = null): array
    {


        if ($table_name === 'companies') {

            $result = DB::table($table_name)
                ->select(DB::raw('COUNT(DISTINCT id) as company_count'))
                ->where($column_name, $id);

            if ($condition !== null) {
                $result = $result->where($column_name_b,  $condition);
            }

            $result = $result->first();
            // dd($result->getBindings());;
        } elseif ($table_name === 'industries') {

            $result = DB::table('companies')
                ->select(DB::raw('COUNT(DISTINCT id) as company_count'))
                ->where('industry_id', $id)
                ->first();
            // dd($result->getBindings(), $result->toSql());
        }
        return [
            // 'name' => (string) $result->country_name,
            'count' => (int) $result->company_count,
        ];
    }

    public function topCountryBy($table_name, $id)
    {
        try {
            if ($table_name === 'sectors') {

                $result = DB::table('companies as c')
                    ->join('countries_africans as co', 'co.id', '=', 'c.Country')
                    ->select(
                        'c.Country',
                        'co.country_name',
                        DB::raw('COUNT(*) as total')
                    )
                    ->where('c.Sector', $id)
                    ->groupBy('c.Country', 'co.id')
                    ->orderByDesc('total')
                    ->limit(15)
                    ->first();

                // dd($result->getBindings(), $result->toSql());
            } elseif ($table_name === 'industries') {



                $result = DB::table('companies as c')
                    ->join('countries_africans as co', 'co.id', '=', 'c.Country')
                    ->select(
                        'c.Country',
                        'co.country_name',
                        DB::raw('COUNT(*) as total')
                    )
                    ->where('c.industry_id', $id)
                    ->groupBy('c.Country', 'co.id')
                    ->orderByDesc('total')
                    ->limit(7)
                    ->first();
            } else {
                return null; // Invalid column name
            }




            return $result->total > 0 ? [
                'name' => (string) $result->country_name,
                'count' => (int) $result->total,
            ] : [
                'name' => null,
                'count' => 0,
            ];
        } catch (\Throwable $e) {

            // Log error for debugging
            Log::error('Top country query failed', [
                'sector_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return [
                'name'  => null,
                'count' => 0,
            ];
        }
    }
}
