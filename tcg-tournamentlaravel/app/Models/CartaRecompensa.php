<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartaRecompensa extends Model
{
    use HasFactory;

    protected $table = 'carta_recompensas';

    protected $fillable = [
        'torneo_id', 'nombre_carta', 'rareza', 'descripcion', 'puesto'
    ];
      

    public $timestamps = false;

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }
}
