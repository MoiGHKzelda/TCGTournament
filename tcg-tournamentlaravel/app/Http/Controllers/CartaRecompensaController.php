<?php

namespace App\Http\Controllers;

use App\Models\CartaRecompensa;
use Illuminate\Http\Request;


class CartaRecompensaController extends Controller
{
    public function porTorneo($id)
    {
        return CartaRecompensa::where('torneo_id', $id)->orderBy('puesto')->get();
    }

    public function asociarCarta(Request $request, $id)
    {
        $request->validate([
            'nombre_carta' => 'required|string|max:255',
            'rareza'       => 'required|string|max:50',
            'descripcion'  => 'nullable|string',
            'puesto'       => 'required|integer|between:1,3',
            'imagen_url'   => 'nullable|string|max:255',
        ]);

        $yaExiste = CartaRecompensa::where('torneo_id', $id)
            ->where('puesto', $request->puesto)
            ->exists();

        if ($yaExiste) {
            return response()->json(['message' => 'Ya existe una recompensa para ese puesto'], 409);
        }

        $recompensa = CartaRecompensa::create([
            'torneo_id'    => $id,
            'nombre_carta' => $request->nombre_carta,
            'rareza'       => $request->rareza,
            'descripcion'  => $request->descripcion,
            'puesto'       => $request->puesto,
            'imagen_url'   => $request->imagen_url,
        ]);

        return response()->json($recompensa, 201);
    }
    public function destroy(CartaRecompensa $recompensa)
    {
        $recompensa->delete();
        return response()->json(['message' => 'Recompensa eliminada'], 200);
    }

}

