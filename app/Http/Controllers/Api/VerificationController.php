<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    public function store(StoreVerificationRequest $request): JsonResponse
    {
        $reference = (string) Str::uuid();
        $directory = "verification-submissions/{$reference}";
        $validated = $request->validated();
        $storedDocuments = [];

        foreach ($request->file('documents', []) as $index => $document) {
            $extension = strtolower($document->getClientOriginalExtension());
            $filename = sprintf('%02d-%s.%s', $index + 1, Str::uuid(), $extension);
            Storage::disk('local')->putFileAs($directory, $document, $filename);

            $storedDocuments[] = [
                'original_name' => $document->getClientOriginalName(),
                'stored_name' => $filename,
                'mime_type' => $document->getMimeType(),
                'size' => $document->getSize(),
            ];
        }

        $manifest = Arr::except($validated, ['documents']);
        $manifest['reference'] = $reference;
        $manifest['documents'] = $storedDocuments;
        $manifest['submitted_at'] = now()->toIso8601String();

        Storage::disk('local')->put(
            "{$directory}/manifest.json",
            json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        return response()->json([
            'message' => 'Verification submitted successfully.',
            'reference' => $reference,
        ], 201);
    }
}
