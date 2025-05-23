<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TorneoJugador;
use App\Http\Requests\StoreTorneoJugadorRequest;
use App\Http\Requests\UpdateTorneoJugadorRequest;
use App\Models\Torneo;

class TorneoJugadorController extends Controller
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
    public function store(StoreTorneoJugadorRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TorneoJugador $torneoJugador)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TorneoJugador $torneoJugador)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTorneoJugadorRequest $request, TorneoJugador $torneoJugador)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TorneoJugador $torneoJugador)
    {
        //
    }

    public function inscribirse($id)
    {
        $usuario = auth()->user();

        $existe = TorneoJugador::where('usuario_id', $usuario->id)
                    ->where('torneo_id', $id)
                    ->exists();

        if ($existe) {
            return response()->json(['message' => 'Ya inscrito'], 409);
        }

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



}
