<?php

namespace App\Http\Controllers;

use App\Models\Partida;
use App\Http\Requests\StorePartidaRequest;
use App\Http\Requests\UpdatePartidaRequest;
use Illuminate\Http\Request;

class PartidaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StorePartidaRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Partida $partida)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Partida $partida)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartidaRequest $request, Partida $partida)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partida $partida)
    {
        //
    }

    // Obtener partidas de una ronda--
    public function partidasPorTorneoYRonda($torneoId, $ronda)
    {
        return Partida::with(['jugador1', 'jugador2', 'ganador'])
            ->where('torneo_id', $torneoId)
            ->where('ronda', $ronda)
            ->get();
    }

    // Guardar ganador de una partida
    public function asignarGanador(Request $request, $id)
    {
        $partida = Partida::findOrFail($id);

        $request->validate([
            'ganador_id' => 'required|exists:usuarios,id'
        ]);

        $partida->ganador_id = $request->ganador_id;
        $partida->resultado = $request->resultado ?? null;
        $partida->save();

        return response()->json(['message' => 'Ganador asignado correctamente']);
    }

}
