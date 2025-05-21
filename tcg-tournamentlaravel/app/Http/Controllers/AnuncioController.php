<?php

namespace App\Http\Controllers;

use App\Models\Anuncio;
use Illuminate\Http\Request;

class AnuncioController extends Controller
{
    public function index()
    {
        $anuncios = Anuncio::with([
            'usuario:id,nombre,avatar',
            'torneo',
            'respuestas.usuario:id,nombre,avatar'
        ])
        ->whereNull('padre_id')
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($anuncios);
    }



    public function store(Request $request)
    {
        $rules = [
            'contenido' => 'required|string',
            'torneo_id' => 'nullable|exists:torneos,id',
            'padre_id' => 'nullable|exists:anuncios,id',
        ];

        // Solo validamos título si no es respuesta
        if (!$request->filled('padre_id')) {
            $rules['titulo'] = 'required|string|max:255';
        } else {
            $rules['titulo'] = 'nullable|string|max:255';
        }

        $request->validate($rules);

        $anuncio = Anuncio::create([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'usuario_id' => auth()->id(),
            'torneo_id' => $request->torneo_id,
            'padre_id' => $request->padre_id,
        ]);

        return response()->json($anuncio->load('usuario'), 201);
    }




    public function update(Request $request, Anuncio $anuncio)
    {
        if ($anuncio->usuario_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
        ]);

        $anuncio->update([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
        ]);

        return response()->json($anuncio->load('usuario'), 200);
    }

    public function destroy(Anuncio $anuncio)
    {
        if ($anuncio->usuario_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $anuncio->delete();
        return response()->json(['message' => 'Anuncio eliminado'], 200);
    }
}
