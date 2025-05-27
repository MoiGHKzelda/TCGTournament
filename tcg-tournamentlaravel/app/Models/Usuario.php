<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = ['nombre', 'email', 'password', 'telefono', 'dni', 'rol', 'avatar'];

    protected static function booted()
    {
        static::created(function ($usuario) {
            $usuario->perfil()->create([
                'torneos_jugados' => 0,
                'torneos_ganados' => 0,
                'logros' => null,
            ]);
        });
    }




    public $timestamps = false;

    public function perfil()
    {
        return $this->hasOne(Perfil::class, 'usuario_id');
    }

    public function torneosOrganizados()
    {
        return $this->hasMany(Torneo::class, 'organizador_id');
    }
    public function torneosInscritos()
    {
        return $this->belongsToMany(Torneo::class, 'torneo_jugadors', 'usuario_id', 'torneo_id');
    }
    public function partidasComoJugador1()
    {
        return $this->hasMany(Partida::class, 'jugador1_id');
    }

    public function partidasComoJugador2()
    {
        return $this->hasMany(Partida::class, 'jugador2_id');
    }
    public function hilos()
    {
        return $this->hasMany(HiloForo::class);
    }
    public function anuncios()
    {
        return $this->hasMany(Anuncio::class);
    }
}
