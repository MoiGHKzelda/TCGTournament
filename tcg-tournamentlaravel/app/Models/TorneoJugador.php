<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TorneoJugador extends Model
{
    use HasFactory;

    protected $table = 'torneo_jugadors'; 

    protected $fillable = [
        'usuario_id',
        'torneo_id',
        'puntos',
        'eliminado'
    ];

    public $timestamps = false; 

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }
}
