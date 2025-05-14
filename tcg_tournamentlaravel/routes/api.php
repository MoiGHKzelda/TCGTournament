<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);

// solo si necesitas responder a preflight:
Route::options('/register', fn () => response()->noContent());
