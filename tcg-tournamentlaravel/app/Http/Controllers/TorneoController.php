<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Torneo;
use App\Http\Requests\StoreTorneoRequest;
use App\Http\Requests\UpdateTorneoRequest;


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
        'hora_inicio' => 'required|date_format:H:i',
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

}
