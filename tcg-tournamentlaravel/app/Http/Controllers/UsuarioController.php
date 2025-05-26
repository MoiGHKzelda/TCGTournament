<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Usuario::where('rol', 'jugador')->get();
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
    public function store(StoreUsuarioRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Usuario $usuario)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Usuario $usuario)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */


    // app/Http/Controllers/UsuarioController.php

    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        // Solo el usuario puede cambiar su avatar
        if (auth()->id() === $usuario->id) {
            $request->validate([
                'avatar' => 'required|string'
            ]);
            $usuario->avatar = $request->avatar;
            $usuario->save();

            return response()->json($usuario);
        }

        // Si no es el mismo usuario, asumimos que es admin y permitimos otros campos
        if (auth()->user()->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'nombre' => 'required|string|max:100',
            'email' => 'required|email',
            'telefono' => 'nullable|string|max:20',
        ]);

        $usuario->update($request->only(['nombre', 'email', 'telefono']));

        return response()->json($usuario);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Usuario $usuario)
    {
        // Solo un admin puede eliminar usuarios
        if (auth()->user()->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $usuario->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }
}
