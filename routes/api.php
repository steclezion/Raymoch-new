<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CompanyApiController;
use App\Http\Controllers\Api\UpdateRequestController;
use App\Http\Controllers\TrialRequestController;
use App\Http\Controllers\AllCompaniesController;
use App\Http\Controllers\Api\DirectoryController;
use App\Http\Controllers\Api\CompanySearchLogController;
use App\Http\Controllers\CompanyDetailController;
use App\Http\Controllers\CompanyReactionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\Api\CountryCodeController;
use App\Http\Controllers\Api\SearchFilterController;
use App\Http\Controllers\Api\ExploreTooltipController;









Route::middleware('auth')->get('/me', function (\Illuminate\Http\Request $request) {
    $u = $request->user();
    return response()->json([
        'ok' => true,
        'user' => [
            'id' => $u->id,
            'name' => $u->name,
            'display_name' => $u->display_name,
            'email' => $u->email,
            'type_of_account' => $u->type_of_account,
            'trial_ends_at' => $u->trial_ends_at,
        ],
    ]);
});


Route::post('/company-search-logs', [CompanySearchLogController::class, 'store']);

$base = rtrim(config('services.express.url'), '/'); // set in config/services.php
Route::get('/ping', fn() => response()->json(['ok' => true]));
Route::get('/companies', [AllCompaniesController::class, 'index']);


// Receive “Request Update / Claim” form posts
Route::post('/company-update-request', [UpdateRequestController::class, 'store'])->name('api.company.update-request');


Route::post('/trial-requests', [TrialRequestController::class, 'store'])->name('api.trial-requests.store');


Route::post('trial-requests', [TrialRequestController::class, 'store'])->name('api.trial-requests.store');

Route::post('trial-requests/verify-code', [TrialRequestController::class, 'verifyCode'])->name('api.trial-requests.verify');


Route::get('/business-sectors', [DirectoryController::class, 'sectors']);
Route::get('/countries',        [DirectoryController::class, 'countries']);
Route::get('/country-codes', [CountryCodeController::class, 'index']);


// JSON API routes
Route::get('/api/companies', [AllCompaniesController::class, 'index'])
    ->name('api.companies.index');

Route::get('/api/companies/{id}', [AllCompaniesController::class, 'show'])
    ->name('api.companies.show');

Route::get('/services/options', [ServiceController::class, 'options']);


Route::get('/regions', [SearchFilterController::class, 'regions']);
Route::get('/countries-africans', [SearchFilterController::class, 'countries']);
Route::get('/country-region', [SearchFilterController::class, 'countryRegion']);
Route::get('/states-all', [SearchFilterController::class, 'states']);
Route::get('/cities-all', [SearchFilterController::class, 'cities']);
Route::get('/sectors', [SearchFilterController::class, 'sectors']);
Route::get('/industries', [SearchFilterController::class, 'industries']);



Route::get('/explore-card-stats', [ExploreTooltipController::class, 'show']);

Route::prefix('companies/{company}')->group(function () {
    Route::get('/overview',   [CompanyDetailController::class, 'overview']);
    Route::get('/financials', [CompanyDetailController::class, 'financials']);
    Route::get('/team',       [CompanyDetailController::class, 'team']);
    Route::get('/gallery',    [CompanyDetailController::class, 'gallery']);
    Route::get('/documents',  [CompanyDetailController::class, 'documents']);
    Route::get('/contact',    [CompanyDetailController::class, 'contact']);
    Route::get('/location',   [CompanyDetailController::class, 'location']); // 👈 NEW
    Route::post('/reactions', [CompanyReactionController::class, 'storeReaction']);
});
