<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;
use App\Mail\HelloMail;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;


Route::get('/', function () { return view('raymoch.pages.index'); })->name('/');

Route::get('login',[AuthController::class,'login'])->name('login');
Route::post('login',[AuthController::class,'loginPost'])->name('login.post');
Route::get('register',[AuthController::class,'register'])->name('register');
Route::post('register',[AuthController::class,'registerPost'])->name('register.post');
Route::get('dashboard',[AuthController::class,'dashboard'])->name('dashboard')->middleware('auth');;
Route::get('logout',[AuthController::class,'logout'])->name('logout');
Route::resource('permissions', PermissionController::class);
Route::resource('roles', RoleController::class)->middleware('auth');
Route::resource('permissions', PermissionController::class)->middleware('auth');
Route::get('/power_generation', function () {return view('raymoch.pages.project_business');})->name('power_generation');
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth_google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

Route::get('/send', function () {
   // return view('raymoch.pages.index');
Mail::to('steclezion@gmail.com')->send(new HelloMail());
return 'Email sent!';
});

Route::get('/test-email', function () {
    Mail::raw('This is a test email', function ($message) {
        $message->to('steclezion@gmail.com')
                ->subject('Test Email');
    });
    return 'Email sent!';
});


Route::get('forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');



Route::get('reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])
    ->name('password.reset');

Route::post('reset-password', [ResetPasswordController::class, 'reset'])
    ->name('password.update');







Route::get('/test-mail', function () {
    Mail::raw('Test email working!', function ($message) {
        $message->to('steclezion@gmai.com')
                ->subject('Mail Test');
    });

    return 'Mail sent!';
});


