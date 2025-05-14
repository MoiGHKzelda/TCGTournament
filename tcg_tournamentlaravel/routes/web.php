<?php

use Illuminate\Support\Facades\Route;

Route::match(['GET', 'OPTIONS', 'POST'], '/register', function () {
    return response()->json(['ok' => true]);
});
