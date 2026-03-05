<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\File;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\OneTapController;

use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\TrialRequestController;
use App\Http\Controllers\RequestTrialController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\PremiumSignupController;

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Billing\StripeWebhookController;

use App\Http\Controllers\ControlLayoutController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

use App\Http\Controllers\HomePageWelcomeController;
use App\Http\Controllers\HomeWelcomeSecondPageController;
use App\Http\Controllers\HomeWelcomeThirdPageController;

use App\Http\Controllers\CompanyInfosController;
use App\Http\Controllers\CompanyClassificationController;
use App\Http\Controllers\company_description;
use App\Http\Controllers\company_description_type_controller;

use App\Http\Controllers\ExploreController;
use App\Http\Controllers\RoutePdfController;
use App\Http\Controllers\ServiceController;

use App\Http\Controllers\Auth\BusinessOtpController;
use App\Http\Controllers\Auth\BusinessAccountController;

use Illuminate\Support\Facades\Auth;

use Laravel\Cashier\Http\Controllers\WebhookController;

use App\Mail\TestPostmarkMail;
use App\Mail\HelloMail;
use App\Mail\EmailTestMailGun;
use App\Mail\GoogleVerifyMail;

/*
|--------------------------------------------------------------------------
| Public routes (NO auth)
|--------------------------------------------------------------------------
*/

Route::view('/', 'pages.entire')->name('home');
Route::view('/about', 'pages.about')->name('about');

Route::view('/services', 'pages.services')->name('services');
Route::view('/insights', 'pages.market-insight')->name('insights');

Route::view('/partner-programs', 'pages.services.partner-programs')->name('partner-programs');
Route::view('/matching', 'pages.services.matching')->name('matching');
Route::view('/visibility-listing', 'pages.services.visibility-listing')->name('visibility-listing');
Route::view('/verification', 'pages.services.verification')->name('verification');

Route::view('/careers', 'pages.entire')->name('careers');
Route::view('/press', 'pages.entire')->name('press');
Route::view('/contact', 'pages.entire')->name('contact');
Route::view('/blog', 'pages.entire')->name('blog');
Route::view('/help', 'pages.entire')->name('help');
Route::view('/security', 'pages.entire')->name('security');
Route::view('/status', 'pages.entire')->name('status');

Route::get('/privacy', fn() => view('pages.entire'))->name('privacy');
Route::get('/terms', fn() => view('pages.entire'))->name('terms');
Route::get('/cookies', fn() => view('pages.entire'))->name('cookies');

Route::get('/explore', [ExploreController::class, 'index'])->name('explore.index');
Route::get('/explore/data', [ExploreController::class, 'data'])->name('explore.data');

Route::get('/services/options', [ServiceController::class, 'options'])->name('services.options');

Route::post('/chatbot', [ChatbotController::class, 'respond'])->name('chatbot.respond');


/*
|--------------------------------------------------------------------------
| Stripe webhooks (NO auth, NO CSRF)
|--------------------------------------------------------------------------
| IMPORTANT: Put these in routes/api.php ideally, or exclude CSRF in VerifyCsrfToken.
*/
Route::post('/webhooks/stripe', [PaymentController::class, 'webhook'])->name('webhooks.stripe');
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])->name('cashier.webhook');
// If you use your own webhook controller:
Route::post('/stripe/webhook/custom', [StripeWebhookController::class, 'handle'])->name('stripe.webhook.custom');


/*
|--------------------------------------------------------------------------
| Guest-only routes (auth pages, signup flows)
|--------------------------------------------------------------------------
*/
Route::middleware(['guest', 'throttle:50,1'])->group(function () {
    // Login (choose ONE system; I recommend LoginController)
    Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
    Route::post('/login/json', [LoginController::class, 'loginJson'])->name('auth.login.json');

    // If you still need legacy AuthController login, keep it but don’t duplicate /login
    // Route::post('/login', [AuthController::class, 'loginPost'])->name('login.post');

    // Password reset
    Route::get('forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

    Route::get('reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

    // Trial request pages
    Route::get('/request-trial', fn() => view('pages.auth.trial'))->name('trial.page');
    Route::view('/trial/verify', 'pages.auth.trial-verify')->name('trial.verify.page');
    Route::view('/trial/success', 'pages.auth.trial-success')->name('trial.success.page');
    Route::get('/request', [RequestTrialController::class, 'show'])->name('request.show');

    // Signup entry
    Route::get('/signup', [SignupController::class, 'index'])->name('signup.index');
    Route::get('/signup/investor/create', [SignupController::class, 'createInvestor'])->name('signup.investor.create');
    Route::get('/signup/basic/create/individual', [SignupController::class, 'showPaymentPlansCreate'])->name('signup.basic.create.individual'); // Store the Basic account (JSON) Route::get('/signup/premium/create/individual/', [SignupController::class, 'showPaymentPlansCreate'])->name('signup.premium.create.individual');


    // Basic signup
    Route::get('/signup/basic/pricing', fn() => view('pages.auth.signup.basic.pricing'))->name('signup.basic.pricing');
    Route::get('/signup/basic/create/individual', [SignupController::class, 'showPaymentPlansCreate'])->name('signup.basic.create.individual');
    Route::post('/signup/basic/store', [SignupController::class, 'individualAccountStore'])->name('signup.basic.store');
    Route::post('/signup/basic/send-otp', [SignupController::class, 'sendOtp'])->name('signup.basic.send_otp');
    Route::post('/signup/basic/verify-otp', [SignupController::class, 'verifyOtp'])->name('signup.basic.verify_otp');
    Route::get('/signup/basic/create', [SignupController::class, 'createBasic'])->name('signup.basic.create');

    // Premium signup
    Route::get('/signup/premium/create/individual', [SignupController::class, 'showPaymentPlansCreate'])->name('signup.premium.create.individual');
    Route::post('/signup/premium/send-otp', [PremiumSignupController::class, 'sendOtp'])->name('signup.premium.send_otp');
    Route::post('/signup/premium/verify-otp', [PremiumSignupController::class, 'verifyOtp'])->name('signup.premium.verify_otp');
    // Premium finalize after payment success
    Route::post('/signup/premium/complete', [PaymentController::class, 'finalizePremiumSignup'])->name('signup.premium.complete');


    // Business signup
    Route::post('/auth/check-email', BusinessAccountController::class)->name('auth.check-email');
    Route::get('/signup/business/create', [BusinessAccountController::class, 'createBusiness'])->name('signup.business.create');
    Route::post('/signup/business/send-otp', [BusinessOtpController::class, 'sendOtp'])->name('signup.business.send_otp');
    Route::post('/signup/business/verify-otp', [BusinessOtpController::class, 'verifyOtp'])->name('signup.business.verify_otp');
});


/*
|--------------------------------------------------------------------------
| Authenticated routes (must be logged in)
|--------------------------------------------------------------------------
*/
Route::get('/auth/user', function () {
    if (!Auth::check()) {
        return response()->json(['authenticated' => false], 200);
    }

    return response()->json([
        'authenticated' => true,
        'user' => [
            'id' => Auth::id(),
            'name' => Auth::user()->name,
            'email' => Auth::user()->email,
        ]
    ], 200);
})->name('auth.user');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', fn() => view('pages.dashboard.dashboard'))->name('dashboard');

    // Logout must be POST
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');


    // Payment intents/subscription creation (only authed users should create)
    Route::post('/payment/create-payment-intent', [PaymentController::class, 'createPaymentIntent'])->name('payment.create_payment_intent');
    Route::post('/payment/create-subscription', [PaymentController::class, 'createSubscription'])->name('payment.create_subscription');

    // Admin-like pages (move into admin group below if needed)
    Route::get('/bussiness_menu', [ControlLayoutController::class, 'Business_menus'])->name('bussiness_menu');

    // Protected modules
    Route::resource('home-welcome-second-page', HomeWelcomeSecondPageController::class);
    Route::resource('home-welcome-third-page', HomeWelcomeThirdPageController::class);

    Route::get('/home-page-welcomes', [HomePageWelcomeController::class, 'index'])->name('home-page-welcomes.index');
    Route::get('/home-page-welcomes-data', [HomePageWelcomeController::class, 'data'])->name('home-page-welcomes.data');
    Route::post('/home-page-welcomes', [HomePageWelcomeController::class, 'store'])->name('home-page-welcomes.store');
    Route::delete('/home-page-welcomes/{homePageWelcome}', [HomePageWelcomeController::class, 'destroy'])->name('home-page-welcomes.destroy');
    Route::put('/home-page-welcomes/{homePageWelcome}', [HomePageWelcomeController::class, 'update'])->name('home-page-welcomes.update');

    Route::resource('companyinfos', CompanyInfosController::class);
    Route::resource('company_description_types', company_description_type_controller::class);

    Route::get('/descriptions', [company_description::class, 'index'])->name('descriptions.index');
    Route::get('/descriptions/create', [company_description::class, 'create'])->name('descriptions.create');
    Route::post('/descriptions', [company_description::class, 'store'])->name('descriptions.store');
    Route::get('/descriptions/{company}/{description}/edit', [company_description::class, 'edit'])->name('descriptions.edit');
    Route::put('/descriptions/{company}', [company_description::class, 'update'])->name('descriptions.update');
    Route::delete('/descriptions/{id}', [company_description::class, 'destroy'])->name('descriptions.destroy');
    Route::post('/company_classifications/import', [CompanyClassificationController::class, 'import'])->name('company_classifications.import');
    Route::resource('company_classifications', CompanyClassificationController::class);
    Route::view('/companies', 'pages.companies')->name('companies'); // main companies listing page // Static placeholders used in header/footer links (wire up later as you build them) 
    Route::view('/services', 'pages.services')->name('services'); // temp → point to real page later 
    Route::view('/insights', 'pages.market-insight')->name('insights'); // temp // services sub-pages 
    Route::view('/partner-programs', 'pages.services.partner-programs')->name('partner-programs'); // partner programs page



    // PDF export
    Route::get('/routes/pdf', [RoutePdfController::class, 'export'])->name('routes.pdf');

    // Protected documents
    Route::get('/documents/{filename}', function ($filename) {
        $path = storage_path('app/public/documents/' . $filename);
        if (!File::exists($path)) abort(404);
        return response()->file($path);
    })->where('filename', '.*')->name('documents.show');
});


/*
|--------------------------------------------------------------------------
| Admin-only routes (roles/permissions/users)
|--------------------------------------------------------------------------
| Requires spatie/laravel-permission or your own middleware.
*/
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
});


/*
|--------------------------------------------------------------------------
| Google auth (can be public, but callback usually logs user in)
|--------------------------------------------------------------------------
*/
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth_google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('auth_google_callback');
Route::post('/auth/google/onetap', [OneTapController::class, 'login'])->name('onetap.login');


/*
|--------------------------------------------------------------------------
| Trial APIs (public, but rate-limit them)
|--------------------------------------------------------------------------
*/
Route::middleware(['throttle:trial'])->group(function () {
    Route::post('/trial-requests', [TrialRequestController::class, 'store'])->name('api.trial-requests.store');
    Route::post('/trial-requests/check', [TrialRequestController::class, 'checkExisting'])->name('api.trial-requests.check');
});
