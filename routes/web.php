<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\company_description;
use App\Http\Controllers\company_description_type_controller;
use App\Http\Controllers\CompanyClassificationController;
use App\Http\Controllers\CompanyInfosController;
use App\Http\Controllers\ControlLayoutController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\HomePageWelcomeController;
use App\Http\Controllers\HomeWelcomeSecondPageController;
use App\Http\Controllers\HomeWelcomeThirdPageController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Mail\GoogleVerifyMail;
use App\Mail\HelloMail;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;







// Route::get('/', function () { return view('raymoch.pages.index'); })->name('/');

Route::get('/',[ControlLayoutController::class,'index'])->name('/');

Route::get('login',[AuthController::class,'login'])->name('login');
Route::post('login',[AuthController::class,'loginPost'])->name('login.post');
Route::get('register',[AuthController::class,'register'])->name('register');
Route::post('register',[AuthController::class,'registerPost'])->name('register.post');
Route::get('dashboard',[AuthController::class,'dashboard'])->name('dashboard')->middleware('auth');;
Route::get('logout',[AuthController::class,'logout'])->name('logout');
Route::resource('permissions', PermissionController::class);
Route::resource('roles', RoleController::class)->middleware('auth');
Route::resource('permissions', PermissionController::class)->middleware('auth');
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth_google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
Route::get('verify-email', [GoogleAuthController::class, 'verifyEmail'])->name('verify.email.link');
Route::get('/send', function () {
   // return view('raymoch.pages.index');
Mail::to('steclezion@gmail.com')->send(new HelloMail());
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
    $user = (object)[ 'name' => 'Test User' ];
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

Route::resource('home-welcome-second-page', HomeWelcomeSecondPageController::class)->middleware('auth');

Route::resource('home-welcome-third-page', HomeWelcomeThirdPageController::class)->middleware('auth');


Route::resource('companyinfos', CompanyInfosController::class)->middleware('auth');


Route::get('/descriptions', [company_description::class, 'index'])->name('descriptions.index');
Route::get('/descriptions/create', [company_description::class, 'create'])->name('descriptions.create');
Route::post('/descriptions', [company_description::class, 'store'])->name('descriptions.store');
Route::get('/descriptions/{company}/{description}/edit', [Company_description::class, 'edit'])->name('descriptions.edit');
Route::put('/descriptions/{company}', [company_description::class, 'update'])->name('descriptions.update');
Route::delete('/descriptions/{id}', [company_description::class, 'destroy'])->name('descriptions.destroy');

Route::resource('company_description_types', company_description_type_controller::class)->middleware('auth');

Route::post('/company_classifications/import', [CompanyClassificationController::class, 'import'])->name('company_classifications.import');
Route::resource('company_classifications', CompanyClassificationController::class)->middleware('auth');
Route::get('/company-search', [CompanyInfosController::class, 'search'])->name('company.search');


//Route::get('/power-generation', function () {return view('raymoch.pages.project_business');})->name('power-generation');
Route::get('/power-generation', [CompanyInfosController::class, 'power_generation'])->name('power-generation');

// Other routes...
Route::middleware(['auth'])->group(function () {
// User Management (CRUD)
Route::resource('users', UserController::class);

});
