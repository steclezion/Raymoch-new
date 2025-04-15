<?php

namespace App\Http\Requests;

use \Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
//use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Validation\Validator;


class StoreHomeWelcomeSecondPageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
   public function authorize():bool{

    return true;
   }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:3048',
            'description_one' => 'nullable|string',
            'description_two' => 'nullable|string',
            'description_three' => 'nullable|string',
            'status' => 'required|string|in:active,inactive'
        ];
    }

    public function withValidator($validator)
{
    $validator->after(function ($validator) {
        if ($this->input('status') === 'active' && empty($this->input('description_one'))) {
            $validator->errors()->add('description_one', 'Description One is required when status is active.');
        }
    });
}



protected function failedValidation(Validator $validator)
{
    // Optional: set a flash message (works with session)
   // session()->flash('danger', 'Validation failed. Please check the form and try again.');

    throw new HttpResponseException(
        redirect()
            ->back()
            ->withErrors($validator) // send all validation errors
            ->withInput()
    );
}



// protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
// {
//     throw new HttpResponseException(response()->json([
//         'success' => false,
//         'message' => 'Validation failed.',
//         'errors' => $validator->errors()
//     ], 422));
// }


}
