<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TorneoJugador;
use App\Models\Torneo;
use Illuminate\Support\Facades\DB;

class TorneoJugadorController extends Controller
{
   

    public function inscribirse($id)
    {
        $usuario = auth()->user();

        return \DB::transaction(function () use ($usuario, $id) {
            $existe = TorneoJugador::where('usuario_id', $usuario->id)
                ->where('torneo_id', $id)
                ->exists();

            if ($existe) {
                return response()->json(['message' => 'Ya inscrito'], 409);
            }

            $torneo = Torneo::lockForUpdate()->findOrFail($id);

            if ($torneo->estado !== 'inscripcion') {
                return response()->json(['message' => 'No se puede inscribir, torneo cerrado'], 403);
            }

            $inscritos = TorneoJugador::where('torneo_id', $id)->count();

            if ($inscritos >= $torneo->max_jugadores) {
                return response()->json(['message' => 'No hay plazas disponibles'], 403);
            }

            TorneoJugador::create([
                'usuario_id' => $usuario->id,
                'torneo_id' => $id
            ]);

            return response()->json(['message' => 'Inscripción correcta'], 201);
        });
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
