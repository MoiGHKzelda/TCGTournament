<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\TorneoController;
use App\Http\Controllers\TorneoJugadorController;
use App\Http\Controllers\PartidaController;
use App\Http\Controllers\HiloForoController;
use App\Http\Controllers\MensajeForoController;
use App\Http\Controllers\AnuncioController;
use App\Http\Controllers\CartaRecompensaController;
use App\Models\Usuario;

/*
|--------------------------------------------------------------------------
| Rutas públicas (sin autenticación)
|--------------------------------------------------------------------------
*/

// Registro y login
Route::post('/register', function (Request $request) {
    $val = Validator::make($request->all(), [
        'nombre' => 'required|string|max:100',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|string|min:6',
        'telefono' => 'required|string|max:20',
        'dni' => 'required|string|max:20|unique:usuarios,dni',
    ]);

    if ($val->fails()) {
        return response()->json(['errors' => $val->errors()], 422);
    }

    $usuario = Usuario::create([
        'nombre' => $request->nombre,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'telefono' => $request->telefono,
        'dni' => $request->dni,
        'rol' => 'jugador'
    ]);

    return response()->json([
        'message' => 'Usuario registrado correctamente',
        'usuario' => $usuario
    ], 201);
});
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren token Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Obtener usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Funciones personalizadas
    Route::get('/torneos/{id}/recompensas', [CartaRecompensaController::class, 'porTorneo']);
    Route::post('/torneos/{id}/recompensas', [CartaRecompensaController::class, 'asociarCarta']);
    Route::post('/torneos/{id}/inscribirse', [TorneoJugadorController::class, 'inscribirse']);
    Route::get('/torneos/{id}/jugadores', [TorneoJugadorController::class, 'listarPorTorneo']);

    // CRUD de modelos
    Route::apiResource('usuarios', UsuarioController::class);
    Route::apiResource('perfiles', PerfilController::class);
    Route::apiResource('torneos', TorneoController::class);
    Route::apiResource('torneo-jugadores', TorneoJugadorController::class);
    Route::apiResource('partidas', PartidaController::class);
    Route::apiResource('hilos', HiloForoController::class);
    Route::apiResource('mensajes', MensajeForoController::class);
    Route::apiResource('anuncios', AnuncioController::class);
    Route::apiResource('recompensas', CartaRecompensaController::class);
});

