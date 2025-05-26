<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Models\Usuario;
use App\Models\Partida;
use App\Models\TorneoJugador;

class GestionTorneoController extends Controller
{
    public function iniciarRonda($torneoId)
    {
        $jugadores = TorneoJugador::where('torneo_id', $torneoId)->pluck('usuario_id')->shuffle();
        if ($jugadores->count() < 2) {
            return response()->json(['message' => 'No hay suficientes jugadores'], 400);
        }

        for ($i = 0; $i < $jugadores->count(); $i += 2) {
            $j1 = $jugadores[$i];
            $j2 = $jugadores[$i + 1] ?? null;

            Partida::create([
                'torneo_id' => $torneoId,
                'jugador1_id' => $j1,
                'jugador2_id' => $j2,
                'ronda' => 1
            ]);
        }

        return response()->json(['message' => 'Ronda iniciada']);
    }

    public function pasarRonda($torneoId)
    {
        $ultimaRonda = Partida::where('torneo_id', $torneoId)->max('ronda');
        $ganadores = Partida::where('torneo_id', $torneoId)
            ->where('ronda', $ultimaRonda)
            ->whereNotNull('ganador_id')
            ->pluck('ganador_id')
            ->shuffle();

        if ($ganadores->count() < 2) {
            return response()->json(['message' => 'No hay suficientes ganadores'], 400);
        }

        for ($i = 0; $i < $ganadores->count(); $i += 2) {
            $j1 = $ganadores[$i];
            $j2 = $ganadores[$i + 1] ?? null;

            Partida::create([
                'torneo_id' => $torneoId,
                'jugador1_id' => $j1,
                'jugador2_id' => $j2,
                'ronda' => $ultimaRonda + 1
            ]);
        }

        return response()->json(['message' => 'Ronda generada']);
    }

    public function asignarGanador(Request $request, $partidaId)
    {
        $request->validate([
            'ganador_id' => 'required|exists:usuarios,id'
        ]);

        $partida = Partida::findOrFail($partidaId);
        $partida->ganador_id = $request->ganador_id;
        $partida->resultado = 'Asignado manualmente';
        $partida->save();

        return response()->json(['message' => 'Ganador asignado']);
    }

    public function partidasPorTorneo($torneoId)
    {
        return Partida::with(['jugador1', 'jugador2', 'ganador'])
            ->where('torneo_id', $torneoId)
            ->orderBy('ronda')
            ->get();
    }
}
