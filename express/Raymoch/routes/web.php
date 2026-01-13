<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MatchingController;

Route::get('/ping', fn () => 'pong');
Route::get('/', fn () => redirect()->route('match.index'));
Route::get('/match', [MatchingController::class, 'index'])->name('match.index');
