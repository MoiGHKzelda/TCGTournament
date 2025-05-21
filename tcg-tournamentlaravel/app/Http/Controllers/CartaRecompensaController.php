<?php

namespace App\Http\Controllers;

use App\Models\CartaRecompensa;
use App\Http\Requests\StoreCartaRecompensaRequest;
use App\Http\Requests\UpdateCartaRecompensaRequest;
use Illuminate\Http\Request;
class CartaRecompensaController extends Controller
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
    public function store(Request $request)
    {
        $request->validate([
            'torneo_id' => 'required|exists:torneos,id',
            'nombre_carta' => 'required|string',
            'rareza' => 'nullable|string',
            'descripcion' => 'nullable|string'
        ]);

        $carta = CartaRecompensa::create($request->all());

        return response()->json($carta, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(CartaRecompensa $cartaRecompensa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CartaRecompensa $cartaRecompensa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCartaRecompensaRequest $request, CartaRecompensa $cartaRecompensa)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CartaRecompensa $cartaRecompensa)
    {
        //
    }
}
