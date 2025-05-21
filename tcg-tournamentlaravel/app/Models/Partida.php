<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partida extends Model
{
    use HasFactory;

    protected $table = 'partidas';

    protected $fillable = [
        'torneo_id',
        'jugador1_id',
        'jugador2_id',
        'ganador_id',
        'ronda',
        'resultado'
    ];

    public $timestamps = false;

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function jugador1()
    {
        return $this->belongsTo(Usuario::class, 'jugador1_id');
    }

    public function jugador2()
    {
        return $this->belongsTo(Usuario::class, 'jugador2_id');
    }

    public function ganador()
    {
        return $this->belongsTo(Usuario::class, 'ganador_id');
    }
}
