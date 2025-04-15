<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomePageWelcomeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'title' => 'required|string|max:255',
            'description' => 'required|string|max:4550',
            'first_picture' => 'nullable|image|mimes:jpeg,jpg,png,svg|max:4048',
            'second_picture' => 'nullable|image|mimes:jpeg,jpg,png,svg|max:4048',
            'status' => 'required|string',
        ];
    }
}
