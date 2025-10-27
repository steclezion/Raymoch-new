<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CompanyApiController;
use App\Http\Controllers\Api\UpdateRequestController;
use App\Http\Controllers\TrialRequestController;




$base = rtrim(config('services.express.url'), '/'); // set in config/services.php

Route::get('/ping', fn() => response()->json(['ok' => true]));

// /api/companies
Route::get('/companies', function (Request $request) use ($base) {
    try {
        $target = rtrim($base, '/') . '/companies';
        $res = Http::timeout(10)->retry(1, 200)->acceptJson()
            ->get($target, $request->query());

        return response($res->body(), $res->status())
            ->header('Content-Type', $res->header('Content-Type', 'application/json'))
            ->header('X-Proxy-Target', $target . '?' . $request->getQueryString());
    } catch (\Throwable $e) {
        return response()->json(['error' => 'Express unavailable', 'detail' => $e->getMessage()], 502);
    }
});



// /api/companies/search
Route::get('/companies/search', function (Request $request) use ($base) {
    try {
        $res = Http::timeout(10)->retry(1, 200)->acceptJson()
            ->get("$base/companies/search", $request->query());
        return response($res->body(), $res->status())
            ->header('Content-Type', $res->header('Content-Type', 'application/json'));
    } catch (\Throwable $e) {
        return response()->json(['error' => 'Express unavailable', 'detail' => $e->getMessage()], 502);
    }
});




// /api/companies/{id}
Route::get('/companies/{id}', function (string $id) use ($base) {
    try {
        $res = Http::timeout(10)->retry(1, 200)->acceptJson()
            ->get("$base/companies/{$id}");
        return response($res->body(), $res->status())
            ->header('Content-Type', $res->header('Content-Type', 'application/json'));
    } catch (\Throwable $e) {
        return response()->json(['error' => 'Express unavailable', 'detail' => $e->getMessage()], 502);
    }
});


Route::get('/companies/{company}', [CompanyApiController::class, 'show'])->name('api.companies.show');

// Optional list/search endpoint if you need it later
Route::get('/companies', [CompanyApiController::class, 'index'])->name('api.companies.index');

// Receive “Request Update / Claim” form posts
Route::post('/company-update-request', [UpdateRequestController::class, 'store'])->name('api.company.update-request');


Route::post('/trial-requests', [TrialRequestController::class, 'store'])->name('api.trial-requests.store');


Route::post('trial-requests', [TrialRequestController::class, 'store'])->name('api.trial-requests.store');

Route::post('trial-requests/verify-code', [TrialRequestController::class, 'verifyCode'])->name('api.trial-requests.verify');
