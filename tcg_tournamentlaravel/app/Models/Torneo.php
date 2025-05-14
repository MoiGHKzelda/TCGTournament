<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Torneo extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion', 'formato', 'fecha_inicio', 'fecha_fin', 'estado', 'organizador_id'];

    public function organizador() {
        return $this->belongsTo(Usuario::class, 'organizador_id');
    }

    public function participaciones() {
        return $this->hasMany(Participacion::class);
    }

    public function emparejamientos() {
        return $this->hasMany(Emparejamiento::class);
    }

    public function foros() {
        return $this->hasMany(Foro::class);
    }
}
