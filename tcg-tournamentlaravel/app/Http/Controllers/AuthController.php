<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Perfil;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:usuarios,nombre',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'telefono' => 'required|string|size:9',
            'dni' => 'required|string|regex:/^[0-9]{8}[A-Za-z]$/|unique:usuarios,dni'
        ]);

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono,
            'dni' => $request->dni,
            'rol' => 'jugador',
            'avatar' => 'avatar_1.png'
        ]);

        // Asegura que el perfil se crea correctamente
        $usuario->perfil()->create([
            'torneos_jugados' => 0,
            'torneos_ganados' => 0,
            'logros' => null,
        ]);

        return response()->json(['usuario' => $usuario], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $user = Usuario::with('perfil')->find(Auth::id());

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado tras login'], 500);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
}
