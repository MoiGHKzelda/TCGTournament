<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Emparejamiento extends Model
{
    use HasFactory;

    protected $fillable = ['torneo_id', 'ronda', 'jugador1_id', 'jugador2_id', 'ganador_id', 'estado'];

    public function torneo() {
        return $this->belongsTo(Torneo::class);
    }

    public function jugador1() {
        return $this->belongsTo(Usuario::class, 'jugador1_id');
    }

    public function jugador2() {
        return $this->belongsTo(Usuario::class, 'jugador2_id');
    }

    public function ganador() {
        return $this->belongsTo(Usuario::class, 'ganador_id');
    }
}
