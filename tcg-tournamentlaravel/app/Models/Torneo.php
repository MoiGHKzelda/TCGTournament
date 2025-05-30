<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Torneo extends Model
{
    use HasFactory;

    protected $table = 'torneos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha',
        'hora', 
        'formato',
        'max_jugadores',
        'estado',
        'organizador_id'
    ];
    public function index()
    {
        return response()->json(Torneo::all());
    }

    public $timestamps = false;

    public function organizador()
    {
        return $this->belongsTo(Usuario::class, 'organizador_id');
    }

    public function jugadores()
    {
        return $this->belongsToMany(Usuario::class, 'torneo_jugadors', 'torneo_id', 'usuario_id');
    }

    public function anuncios()
    {
        return $this->hasMany(Anuncio::class);
    }

    public function recompensas()
    {
        return $this->hasMany(CartaRecompensa::class);
    }

    public function partidas()
    {
        return $this->hasMany(Partida::class);
    }
}
