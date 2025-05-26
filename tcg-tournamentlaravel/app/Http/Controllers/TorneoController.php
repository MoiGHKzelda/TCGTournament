<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Http\Requests\StoreTorneoRequest;
use App\Http\Requests\UpdateTorneoRequest;
use App\Models\Partida;
use App\Models\Usuario;
use App\Models\TorneoJugador;
use App\Models\Perfil;




class TorneoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Torneo::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'formato' => 'required|string|max:100',
            'descripcion' => 'required|string',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|date_format:H:i',
            'max_jugadores' => 'required|integer|min:2'
        ]);

        $torneo = Torneo::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'formato' => $request->formato,
            'max_jugadores' => $request->max_jugadores,
            'organizador_id' => auth()->id(),
        ]);

        return response()->json($torneo, 201);
    }




    /**
     * Display the specified resource.
     */
    public function show(Torneo $torneo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Torneo $torneo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Torneo $torneo)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'fecha' => 'required|date',
            'hora' => 'required',
            'formato' => 'required|string|max:50',
            'max_jugadores' => 'required|integer|min:2',
        ]);

        $torneo->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'formato' => $request->formato,
            'max_jugadores' => $request->max_jugadores,
        ]);

        return response()->json($torneo, 200);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Torneo $torneo)
    {
        $torneo->delete();

        return response()->json(['message' => 'Torneo eliminado.']);
    }


    public function partidasActuales($id)
    {
        $rondaActual = Partida::where('torneo_id', $id)->max('ronda') ?? 1;

        $partidas = Partida::where('torneo_id', $id)
            ->where('ronda', $rondaActual)
            ->with(['jugador1', 'jugador2']) // importante para evitar N+1
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'jugador1' => $p->jugador1,
                    'jugador2' => $p->jugador2,
                    'ganador_id' => $p->ganador_id,
                    'resultado' => $p->resultado,
                ];
            });

        return response()->json($partidas);
    }

    public function guardarGanadores(Request $request, $id)
    {
        $ganadores = $request->input('ganadores');

        foreach ($ganadores as $partidaId => $ganadorId) {
            $partida = Partida::find($partidaId);

            if ($partida && in_array($ganadorId, [$partida->jugador1_id, $partida->jugador2_id])) {
                $partida->ganador_id = $ganadorId;
                $partida->resultado = "Ganó usuario $ganadorId";
                $partida->save();
            }
        }

        $rondaActual = Partida::where('torneo_id', $id)->max('ronda');

        // Corrección aquí
        $ganadorIds = Partida::where('torneo_id', $id)
            ->where('ronda', $rondaActual)
            ->pluck('ganador_id')
            ->filter();

        $ganadoresUsuarios = Usuario::whereIn('id', $ganadorIds)->get();

        if ($ganadoresUsuarios->count() === 1) {
            $torneo = Torneo::findOrFail($id);
            $torneo->estado = 'finalizado';
            $torneo->save();

            $ganador = $ganadoresUsuarios->first();
            $perfil = $ganador->perfil;
            if ($perfil) {
                $perfil->increment('torneos_ganados');
            }

            return response()->json([
                'message' => '¡Torneo finalizado! El ganador es ' . $ganador->nombre,
                'ganador_id' => $ganador->id
            ]);
        }

        //  Si quedan más de uno, crear nueva ronda
        $nuevaRonda = $rondaActual + 1;
        $parejas = $ganadoresUsuarios->chunk(2);

        foreach ($parejas as $par) {
            if (count($par) === 2) {
                Partida::create([
                    'torneo_id' => $id,
                    'jugador1_id' => $par[0]->id,
                    'jugador2_id' => $par[1]->id,
                    'ronda' => $nuevaRonda,
                ]);
            } elseif (count($par) === 1) {
                Partida::create([
                    'torneo_id' => $id,
                    'jugador1_id' => $par[0]->id,
                    'jugador2_id' => null,
                    'ganador_id' => $par[0]->id,
                    'ronda' => $nuevaRonda,
                    'resultado' => 'Pasa automáticamente',
                ]);
            }
        }

        return response()->json(['message' => 'Ronda actualizada correctamente']);
    }


    public function iniciarTorneo($id)
    {
        $torneo = Torneo::findOrFail($id);

        // Verificar si ya ha sido iniciado
        if ($torneo->estado !== 'inscripcion') {
            return response()->json(['message' => 'El torneo ya fue iniciado.'], 400);
        }

        // Obtener jugadores inscritos
        $jugadores = collect($torneo->jugadores->pluck('id'))->shuffle();

        if ($jugadores->count() < 2) {
            return response()->json(['message' => 'Se necesitan al menos 2 jugadores.'], 400);
        }

        // Sumar torneo jugado a cada jugador inscrito
        foreach ($jugadores as $jugadorId) {
            $usuario = Usuario::find($jugadorId);
            if ($usuario && $usuario->perfil) {
                $usuario->perfil->increment('torneos_jugados');
            }
        }

        // Generar partidas para la ronda 1
        $ronda = 1;
        $parejas = $jugadores->chunk(2);

        foreach ($parejas as $par) {
            $ids = $par->values(); // Asegura índices 0, 1

            if (count($ids) === 2) {
                Partida::create([
                    'torneo_id' => $torneo->id,
                    'jugador1_id' => $ids[0],
                    'jugador2_id' => $ids[1],
                    'ronda' => $ronda,
                ]);
            } elseif (count($ids) === 1) {
                Partida::create([
                    'torneo_id' => $torneo->id,
                    'jugador1_id' => $ids[0],
                    'jugador2_id' => null,
                    'ganador_id' => $ids[0],
                    'ronda' => $ronda,
                    'resultado' => 'Pasa automáticamente',
                ]);
            }
        }

        // Actualizar estado del torneo
        $torneo->estado = 'activo';
        $torneo->ronda_actual = 1;
        $torneo->save();

        return response()->json(['message' => 'Torneo iniciado correctamente.']);
    }




    
    public function pasarRonda($id)
    {
        $torneo = Torneo::findOrFail($id);

        if ($torneo->estado !== 'activo') {
            return response()->json(['message' => 'El torneo no está en curso.'], 400);
        }

        // Verificación opcional: que existan partidas en la ronda actual
        $partidas = Partida::where('torneo_id', $torneo->id)
            ->where('ronda', $torneo->ronda_actual)
            ->exists();

        if (!$partidas) {
            return response()->json(['message' => 'No hay partidas en la ronda actual.'], 400);
        }

        $torneo->ronda_actual += 1;
        $torneo->save();

        return response()->json(['message' => 'Ronda pasada correctamente.']);
    }

    public function finalizarTorneo($id)
    {
        $torneo = Torneo::findOrFail($id);

        if ($torneo->estado !== 'activo') {
            return response()->json(['message' => 'El torneo no está en curso.'], 400);
        }

        // (Opcional) Verificar si hay partidas sin ganador
        $partidasSinGanador = Partida::where('torneo_id', $torneo->id)
            ->whereNull('ganador_id')
            ->exists();

        if ($partidasSinGanador) {
            return response()->json(['message' => 'No se puede finalizar: hay partidas sin ganador.'], 400);
        }

        $torneo->estado = 'finalizado';
        $torneo->save();

        return response()->json(['message' => 'Torneo finalizado con éxito.']);
    }

    public function asignarGanador(Request $request, $id)
    {
        $torneo = Torneo::findOrFail($id);
        $ganadorId = $request->input('ganador_id');

        if (!$ganadorId) {
            return response()->json(['message' => 'ID del ganador no proporcionado.'], 422);
        }

        $usuario = Usuario::find($ganadorId);
        if (!$usuario || !$usuario->perfil) {
            return response()->json(['message' => 'Usuario no válido.'], 404);
        }

        // Sumar torneo ganado
        $usuario->perfil->increment('torneos_ganados');

        // Marcar torneo como finalizado
        $torneo->estado = 'finalizado';
        $torneo->save();

        return response()->json(['message' => 'Ganador registrado y torneo finalizado.']);
    }
}
