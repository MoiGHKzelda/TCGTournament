<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recompensa;
use App\Services\ScryfallService;

class RecompensaController extends Controller
{
    public function index()
    {
        return Recompensa::with('torneo')->get();
    }

    public function store(Request $request, ScryfallService $scryfall)
    {
        $request->validate([
            'torneo_id' => 'required|exists:torneos,id',
            'puesto' => 'required|integer|min:1',
            'nombre_carta' => 'required|string'
        ]);

        $carta = $scryfall->buscarCarta($request->input('nombre_carta'));

        if (!$carta) {
            return response()->json(['error' => 'Carta no encontrada en Scryfall'], 404);
        }

        $recompensa = Recompensa::create([
            'torneo_id' => $request->input('torneo_id'),
            'puesto' => $request->input('puesto'),
            'scryfall_id' => $carta['scryfall_id'],
            'nombre' => $carta['nombre'],
            'imagen_url' => $carta['imagen_url']
        ]);

        return response()->json($recompensa, 201);
    }

    public function show($id)
    {
        return Recompensa::with('torneo')->findOrFail($id);
    }

    public function destroy($id)
    {
        $recompensa = Recompensa::findOrFail($id);
        $recompensa->delete();

        return response()->json(['message' => 'Recompensa eliminada']);
    }
}
