<?php

namespace App\Http\Controllers;

use App\Models\Contacts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class ContactController extends Controller
{
    public function index(): View
    {
        return view('pages.Footer.Contact');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:191'],
            'organization' => ['nullable', 'string', 'max:160'],
            'topic' => ['required', Rule::in([
                'general',
                'business-support',
                'investor-support',
                'verification',
                'partnerships',
                'billing',
                'privacy',
                'careers',
            ])],
            'subject' => ['required', 'string', 'min:3', 'max:180'],
            'message' => ['required', 'string', 'min:20', 'max:5000'],
            'consent' => ['accepted'],
            'website' => ['nullable', 'string', 'max:0'],
        ]);

        $contact = Contacts::create([
            'reference' => (string) Str::uuid(),
            'user_id' => $request->user()?->id,
            'name' => trim($validated['name']),
            'email' => Str::lower(trim($validated['email'])),
            'organization' => filled($validated['organization'] ?? null)
                ? trim($validated['organization'])
                : null,
            'topic' => $validated['topic'],
            'subject' => trim($validated['subject']),
            'message' => trim($validated['message']),
            'consent_given' => true,
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Thank you. Your message has been received by Raymoch.',
            'reference' => $contact->reference,
        ], 201);
    }
}
