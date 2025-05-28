<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TorneoJugador;
use App\Models\Torneo;

class TorneoJugadorController extends Controller
{
    public function inscribirse($id)
    {
        $usuario = auth()->user();

        // Validar si ya está inscrito
        $existe = TorneoJugador::where('usuario_id', $usuario->id)
            ->where('torneo_id', $id)
            ->exists();

        if ($existe) {
            return response()->json(['message' => 'Ya inscrito'], 409);
        }

        // Validar si hay plazas disponibles
        $torneo = Torneo::findOrFail($id);
        $inscritos = TorneoJugador::where('torneo_id', $id)->count();

        if ($inscritos >= $torneo->max_jugadores) {
            return response()->json(['message' => 'No hay plazas disponibles'], 403);
        }

        // Crear inscripción
        TorneoJugador::create([
            'usuario_id' => $usuario->id,
            'torneo_id' => $id
        ]);

        return response()->json(['message' => 'Inscripción correcta']);
    }

    public function desinscribirse($id)
    {
        $usuario = auth()->user();

        $inscripcion = TorneoJugador::where('usuario_id', $usuario->id)
            ->where('torneo_id', $id)
            ->first();

        if (!$inscripcion) {
            return response()->json(['message' => 'No inscrito'], 404);
        }

        $inscripcion->delete();

        return response()->json(['message' => 'Desinscripción correcta']);
    }

    public function listarPorTorneo($id)
    {
        $jugadores = TorneoJugador::where('torneo_id', $id)->with('usuario')->get();
        return response()->json($jugadores);
    }

}
