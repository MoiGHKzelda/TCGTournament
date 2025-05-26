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
use App\Http\Controllers\GestionTorneoController;
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
        'rol' => 'jugador',
        'avatar' => 'avatar_1.png'
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

    // Usuario autenticado
    Route::get('/user', fn(Request $request) => $request->user());
    Route::get('/user/torneos', fn(Request $request) => $request->user()->torneosInscritos);

    // Funciones de torneo
    Route::get('/torneos/{id}/recompensas', [CartaRecompensaController::class, 'porTorneo']);
    Route::post('/torneos/{id}/recompensas', [CartaRecompensaController::class, 'asociarCarta']);

    Route::post('/torneos/{id}/inscribirse', [TorneoJugadorController::class, 'inscribirse']);
    Route::post('/torneos/{id}/desinscribirse', [TorneoJugadorController::class, 'desinscribirse']);
    Route::get('/torneos/{id}/jugadores', [TorneoJugadorController::class, 'listarPorTorneo']);

    Route::get('/torneos/{id}/partidas/ronda/{ronda}', [PartidaController::class, 'partidasPorTorneoYRonda']);
    Route::put('/partidas/{id}/ganador', [PartidaController::class, 'asignarGanador']);
    
    // TORNEO: iniciar, pasar ronda, guardar ganadores, etc.
    Route::post('/torneos/{id}/iniciar', [TorneoController::class, 'iniciarTorneo']);
    Route::post('/torneos/{id}/pasar-ronda', [TorneoController::class, 'pasarRonda']);
    Route::post('/torneos/{id}/guardar-ganadores', [TorneoController::class, 'guardarGanadores']);
    Route::get('/torneos/{id}/partidas-actuales', [TorneoController::class, 'partidasActuales']);
    Route::post('/torneos/{id}/finalizar', [TorneoController::class, 'finalizarTorneo']);
    Route::post('/torneos/{id}/ganador', [TorneoController::class, 'asignarGanador']);
    

    // CRUD de recursos
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


