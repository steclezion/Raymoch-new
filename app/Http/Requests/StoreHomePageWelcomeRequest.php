<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomePageWelcomeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'title' => 'required|string|max:255',
            'first_picture' => 'nullable|file|mimes:jpg,jpeg,png',
            'second_picture' => 'nullable|file|mimes:jpg,jpeg,png',
            'status' => 'required|string|in:active,inactive',
        ];
    }
}
