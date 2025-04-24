@extends('layouts_admin.app')

@section('content')
<div class="container">
    <h2>Edit Company Descriptions</h2>

    <form method="POST" action="{{ route('descriptions.update', $companyinfo->id) }}">
        @csrf
        @method('PUT')

        <!-- Select Company -->
        <div class="mb-3">
            <label>Select Company</label>
            <select name="companyinfo_id" class="form-control" required>
                <option value="">-- Choose Company --</option>
                @foreach($companies as $company)
                    <option value="{{ $company->id }}" {{ $company->id == $companyinfo->id ? 'selected' : '' }}>
                        {{ $company->company_title }}
                    </option>
                @endforeach
            </select>
        </div>

        <!-- Existing Descriptions -->
        <div id="description-rows">
            @foreach($descriptions as $desc)
            <div class="row description-row mb-2">
                <div class="col-md-4">
                    <select name="description_type[]" class="form-control">
                        <option value="">-- Type --</option>
                        <option value="mission" {{ $desc->description_type == 'mission' ? 'selected' : '' }}>Mission</option>
                        <option value="vision" {{ $desc->description_type == 'vision' ? 'selected' : '' }}>Vision</option>
                        <option value="goal" {{ $desc->description_type == 'goal' ? 'selected' : '' }}>Goal</option>
                        <option value="value" {{ $desc
