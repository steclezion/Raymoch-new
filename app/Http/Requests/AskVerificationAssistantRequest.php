<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AskVerificationAssistantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Replace with your application policy if authentication is required.
    }

    public function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:2000000000'],
            'current_step' => ['required', 'integer', 'between:1,6'],
            'form_context' => ['sometimes', 'array'],
            'form_context.*' => ['nullable'],
            'conversation' => ['sometimes', 'array', 'max:8'],
            'conversation.*.role' => ['required_with:conversation', Rule::in(['user', 'assistant'])],
            'conversation.*.content' => ['required_with:conversation', 'string', 'max:2000'],
        ];
    }
}
