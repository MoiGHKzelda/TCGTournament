<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; 

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $val = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'telefono' => 'required|string|max:20',
            'dni' => 'required|string|max:20',
        ]);

        if ($val->fails()) {
            return response()->json(['errors' => $val->errors()], 422);
        }

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono,
            'dni' => $request->dni,
            'rol' => 'jugador'
        ]);

        return response()->json(['message' => 'Usuario registrado correctamente', 'usuario' => $usuario], 201);
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    $usuario = Usuario::where('email', $credentials['email'])->first();

    if (!$usuario || !Hash::check($credentials['password'], $usuario->password)) {
        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    $token = $usuario->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login exitoso',
        'token' => $token,
        'usuario' => $usuario,
    ]);
}

}
