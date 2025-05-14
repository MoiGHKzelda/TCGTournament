<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Participacion extends Model
{
    use HasFactory;

    protected $fillable = ['torneo_id', 'usuario_id', 'puntos', 'posicion_final', 'fecha_inscripcion'];

    public function usuario() {
        return $this->belongsTo(Usuario::class);
    }

    public function torneo() {
        return $this->belongsTo(Torneo::class);
    }
}
