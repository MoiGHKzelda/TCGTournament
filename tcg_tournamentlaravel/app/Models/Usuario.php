<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Authenticatable
{
    use HasFactory;

    protected $fillable = ['nombre', 'email', 'password', 'rol', 'avatar'];

    public function torneosOrganizados() {
        return $this->hasMany(Torneo::class, 'organizador_id');
    }

    public function participaciones() {
        return $this->hasMany(Participacion::class);
    }

    public function foros() {
        return $this->hasMany(Foro::class, 'creado_por_id');
    }

    public function mensajes() {
        return $this->hasMany(Mensaje::class, 'autor_id');
    }

    public function anuncios() {
        return $this->hasMany(Anuncio::class, 'creado_por_id');
    }

    public function logros() {
        return $this->hasMany(Logro::class);
    }
}
