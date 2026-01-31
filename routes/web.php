<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\company_description;
use App\Http\Controllers\company_description_type_controller;
use App\Http\Controllers\CompanyClassificationController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyInfosController;
use App\Http\Controllers\ControlLayoutController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\HomePageWelcomeController;
use App\Http\Controllers\HomeWelcomeSecondPageController;
use App\Http\Controllers\HomeWelcomeThirdPageController;
use App\Http\Controllers\OneTapController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\searchcontroller;
use App\Http\Controllers\UserController;
use App\Mail\GoogleVerifyMail;
use App\Mail\HelloMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrialRequestController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\PolicyController; // example for privacy/terms/cookies
use App\Http\Controllers\RequestTrialController;
use App\Http\Controllers\PremiumSignupController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Auth\BusinessOtpController;
use App\Http\Controllers\Auth\BusinessAccountController;
use App\Http\Controllers\Billing\StripeWebhookController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\RoutePdfController;
use App\Http\Controllers\AllCompaniesController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\ServiceController;






Route::get('/bussiness_menu', [ControlLayoutController::class, 'Business_menus'])->name('bussiness_menu');

Route::get('login', [AuthController::class, 'login'])->name('login');
Route::post('login', [AuthController::class, 'loginPost'])->name('login.post');
Route::get('register', [AuthController::class, 'register'])->name('register');
Route::post('register', [AuthController::class, 'registerPost'])->name('register.post');
Route::get('dashboard', [AuthController::class, 'dashboard'])->name('dashboard')->middleware('auth');
Route::get('logout', [AuthController::class, 'logout'])->name('logout');
Route::resource('permissions', PermissionController::class);
Route::resource('roles', RoleController::class)->middleware('auth');
Route::resource('permissions', PermissionController::class)->middleware('auth');
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth_google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
Route::get('verify-email', [GoogleAuthController::class, 'verifyEmail'])->name('verify.email.link');
Route::get('/send', function () {
    // return view('raymoch.pages.index');
    Mail::to('steclezion@gmail.com')->send(new HelloMail);

    return 'Email sent!';
});
Route::post('/chatbot', [ChatbotController::class, 'respond']);

Route::get('/test-email', function () {
    Mail::raw('This is a test email', function ($message) {
        $message->to('samsonteclezion@gmail.com')
            ->subject('Test Email');
    });

    return 'Email sent!';
});

Route::get('/test-emaill', function () {
    $user = (object) ['name' => 'Test User'];
    $link = 'https://raymoch.com/verify?user=999';

    Mail::to('steclezion@gmail.com')->send(new GoogleVerifyMail($user, $link));

    return 'Email sent (check Mailtrap)';
});

Route::get('forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

Route::get('reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])
    ->name('password.reset');

Route::post('reset-password', [ResetPasswordController::class, 'reset'])
    ->name('password.update');

Route::get('/home-page-welcomes', [HomePageWelcomeController::class, 'index'])->name('home-page-welcomes.index')->middleware('auth');
Route::get('/home-page-welcomes-data', [HomePageWelcomeController::class, 'data'])->name('home-page-welcomes.data')->middleware('auth');
Route::post('/home-page-welcomes', [HomePageWelcomeController::class, 'store'])->name('home-page-welcomes.store')->middleware('auth');
Route::delete('/home-page-welcomes/{homePageWelcome}', [HomePageWelcomeController::class, 'destroy'])->name('home-page-welcomes.destroy')->middleware('auth');
Route::get('/home-page-welcomes/{homePageWelcome}', [HomePageWelcomeController::class, 'show'])->middleware('auth');
Route::put('/home-page-welcomes/{homePageWelcome}', [HomePageWelcomeController::class, 'update'])->name('home-page-welcomes.update')->middleware('auth');

Route::get('/test-mail', function () {
    Mail::raw('Test email working!', function ($message) {
        $message->to('steclezion@gmai.com')
            ->subject('Mail Test');
    });

    return 'Mail sent!';
});
Route::get('/phpinfo', function () {
    phpinfo();
});

Route::resource('users', UserController::class);

Route::get('/bussiness_menus', function () {
    return view('raymoch.pages.bussiness_menu.business_menu');
})->name('/');

Route::resource('home-welcome-second-page', HomeWelcomeSecondPageController::class)->middleware('auth');
Route::resource('home-welcome-third-page', HomeWelcomeThirdPageController::class)->middleware('auth');
Route::resource('companyinfos', CompanyInfosController::class)->middleware('auth');
Route::get('/descriptions', [company_description::class, 'index'])->name('descriptions.index');
Route::get('/descriptions/create', [company_description::class, 'create'])->name('descriptions.create');
Route::post('/descriptions', [company_description::class, 'store'])->name('descriptions.store');
Route::get('/descriptions/{company}/{description}/edit', [company_description::class, 'edit'])->name('descriptions.edit');
Route::put('/descriptions/{company}', [company_description::class, 'update'])->name('descriptions.update');
Route::delete('/descriptions/{id}', [company_description::class, 'destroy'])->name('descriptions.destroy');
Route::resource('company_description_types', company_description_type_controller::class)->middleware('auth');
Route::post('/company_classifications/import', [CompanyClassificationController::class, 'import'])->name('company_classifications.import');
Route::resource('company_classifications', CompanyClassificationController::class)->middleware('auth');
Route::get('/company-search', [CompanyInfosController::class, 'search'])->name('company.search');
Route::get('/power-generation', [CompanyInfosController::class, 'power_generation'])->name('power-generation');

Route::get('/search/{industry?}', [CompanyInfosController::class, 'search_query'])->name('search');

// Other routes...
Route::middleware(['auth'])->group(function () {
    // User Management (CRUD)
    Route::resource('users', UserController::class);
});

Route::get('/feature-x', function () {
    abort(503, 'This page is under construction.');
    // return response()->view('error.503', [], 503);
});

Route::post('/auth/google/onetap', [OneTapController::class, 'login'])->name('onetap.login');

Route::post('/search/businesses', [SearchController::class, 'businesses'])->name('search.businesses');

Route::get('/debug/csrf', function (\Illuminate\Http\Request $req) {
    return response()->json([
        'session_id' => $req->session()->getId(),
        'session__token' => $req->session()->get('_token'),
        'csrf_token_helper' => csrf_token(),
        'has_cookie_laravel_session' => $req->hasCookie(config('session.cookie')),
    ]);
});

// About
Route::view('/about', 'pages.about')->name('about');

Route::view('/business', 'pages.business')->name('explore2');

// Filtered results page
Route::view('/filtered', 'pages.filtered')->name('filtered');

// Page from 1.html
Route::view('/one', 'pages.one')->name('one');

Route::view('/', 'pages.entire')->name('entire');           // from Entire.html

Route::view('/e', 'pages.entiree')->name('entire');


Route::get('/explore2.html', function () {
    $qs = request()->getQueryString();

    return redirect()->to(route('explore') . ($qs ? ('?' . $qs) : ''));
});

Route::get('/companies-test', function () {
    dd(request()->fullUrl(), request()->query()); // shows the full URL & query array
});

Route::view('/companies', 'pages.companies')->name('companies');    // main companies listing page


// Static placeholders used in header/footer links (wire up later as you build them)
Route::view('/services', 'pages.services')->name('services');     // temp → point to real page later
Route::view('/insights', 'pages.market-insight')->name('insights');   // temp


// services sub-pages
Route::view('/partner-programs', 'pages.services.partner-programs')->name('partner-programs'); // partner programs page
Route::view('/matching', 'pages.services.matching')->name('matching'); // matching page
Route::view('/visibility-listing', 'pages.services.visibility-listing')->name('visibility-listing'); // visibility listing page
Route::view('/verification', 'pages.services.verification')->name('verification'); // verification page


Route::view('/careers', 'pages.entire')->name('careers');        // temp
Route::view('/press', 'pages.entire')->name('press');            // temp
Route::view('/contact', 'pages.entire')->name('contact');        // temp
Route::view('/blog', 'pages.entire')->name('blog');              // temp
Route::view('/help', 'pages.entire')->name('help');              // temp
Route::view('/security', 'pages.entire')->name('security');      // temp
Route::view('/status', 'pages.entire')->name('status');          // temp
Route::view('/privacy', 'pages.entire')->name('privacy');        // temp
Route::view('/terms', 'pages.entire')->name('terms');            // temp
Route::view('/Matching', 'pages.entire')->name('Matching');      // temp
Route::view('/Market_Insight', 'pages.entire')->name('Market_Insight');            // temp
Route::view('/incentives', 'pages.entire')->name('incentives');            // temp
Route::view('/whitespace', 'pages.entire')->name('whitespace');            // temp

// Auth placeholders referenced by header buttons
Route::view('/login', 'pages.entire')->name('login');            // temp
// Route::view('/signup', 'pages.entire')->name('signup');
Route::post('/trial-requests', [TrialRequestController::class, 'store'])->name('api.trial-requests.store');
// routes/web.php
Route::get('/request-trial', fn() => view('pages.auth.trial'))->name('trial.page');

Route::post('trial-requests', [TrialRequestController::class, 'store'])->name('api.trial-requests.store');

Route::post('trial-requests/check', [TrialRequestController::class, 'checkExisting'])->name('api.trial-requests.check');


Route::view('/trial/verify', 'pages.auth.trial-verify')->name('trial.verify.page');

Route::view('/trial/success', 'pages.auth.trial-success')->name('trial.success.page');

Route::get('/signup', [SignupController::class, 'index'])->name('signup.index');

Route::get('/signup/basic/create', [SignupController::class, 'createBasic'])->name('signup.basic.create');
Route::get('/signup/investor/create', [SignupController::class, 'createInvestor'])->name('signup.investor.create');

Route::get('/request', [RequestTrialController::class, 'show'])->name('request.show');

Route::get('/password/reset', fn() => view('auth.passwords.email'))->name('password.request');

Route::get('/privacy', [PolicyController::class, 'privacy'])->name('privacy');
Route::get('/terms',   [PolicyController::class, 'terms'])->name('terms');
Route::get('/cookies', [PolicyController::class, 'cookies'])->name('cookies');


// Basic plan chooser page (this page)
Route::get('/pricing/basic', fn() => view('pages.pricing.basic'))->name('pricing.basic');



// Pricing page (chooses plan and then navigates to basic create)
Route::get('/signup/basic/pricing', fn() => view('pages.auth.signup.basic.pricing'))->name('signup.basic.pricing');

// Show the Basic create form (React page above)

Route::get('/signup/basic/create/individual', [SignupController::class, 'showPaymentPlansCreate'])->name('signup.basic.create.individual');
// Store the Basic account (JSON)

Route::get('/signup/premium/create/individual/', [SignupController::class, 'showPaymentPlansCreate'])->name('signup.premium.create.individual');


Route::post('/signup/basic/store', [SignupController::class, 'individualAccountStore'])->name('signup.basic.store');

// OTP flow for Basic signup
Route::post('/signup/basic/send-otp',   [SignupController::class, 'sendOtp'])->name('signup.basic.send_otp');
Route::post('/signup/basic/verify-otp', [SignupController::class, 'verifyOtp'])->name('signup.basic.verify_otp');


Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
    Route::post('/login/json', [LoginController::class, 'loginJson'])->name('auth.login.json');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/dashboard', fn() => view('pages.dashboard')); // placeholder
});


// OTP (Premium)
Route::post('/signup/premium/send-otp', [PremiumSignupController::class, 'sendOtp'])->name('signup.premium.send_otp');
Route::post('/signup/premium/verify-otp', [PremiumSignupController::class, 'verifyOtp'])->name('signup.premium.verify_otp');

// Payment (Stripe)
Route::post('/payment/create-setup-intent', [PaymentController::class, 'createSetupIntent'])->name('payment.create_setup_intent');
Route::post('/payment/create-subscription', [PaymentController::class, 'createSubscription'])->name('payment.create_subscription');

// Stripe webhook (remember to add to Stripe dashboard)
// Consider adding to routes/api.php if you prefer.
Route::post('/webhooks/stripe', [PaymentController::class, 'webhook'])->name('webhooks.stripe');
// Finalize premium after successful $9 payment
Route::post('/signup/premium/complete', [PaymentController::class, 'finalizePremiumSignup'])->name('signup.premium.complete');


/* Business signup routes */

Route::post('/auth/check-email', BusinessAccountController::class)
    ->name('auth.check-email');

Route::get('/signup/business/create', [BusinessAccountController::class, 'createBusiness'])->name('signup.business.create');
// OTP (separate controller)
Route::post('/signup/business/send-otp', [BusinessOtpController::class, 'sendOtp']);
Route::post('/signup/business/verify-otp', [BusinessOtpController::class, 'verifyOtp']);

// Business account + subscription
Route::post('/signup/business/complete', [BusinessAccountController::class, 'complete']);
Route::post('/signup/business/finalize', [BusinessAccountController::class, 'finalize']);

// Stripe webhook
Route::post('/stripe/webhook', [StripeWebhookController::class, 'h
andle'])->name('stripe.webhook');

// Example dashboard route
Route::get('/dashboard', function () {
    return view('dashboard'); // or Inertia/SPA
})->name('dashboard')->middleware('auth');


Route::get('/explore', [ExploreController::class, 'index'])->name('explore.index');
Route::get('/explore/data', [ExploreController::class, 'data'])->name('explore.data');
Route::get('/routes/pdf', [RoutePdfController::class, 'export']);
Route::get('/services/options', [ServiceController::class, 'options']);



Route::get('/documents/{filename}', function ($filename) {
    $path = storage_path('app/public/documents/' . $filename);

    if (! File::exists($path)) {
        abort(404);
    }

    // Return the file inline (browser will open PDF)
    return response()->file($path);
    // If you want "Download" instead, use:
    // return response()->download($path);
})->where('filename', '.*');
