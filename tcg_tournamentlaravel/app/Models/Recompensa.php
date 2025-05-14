<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Recompensa extends Model
{
    use HasFactory;

    protected $fillable = [
        'torneo_id',
        'puesto',
        'scryfall_id',
        'nombre',
        'imagen_url'
    ];

    public function torneo() {
        return $this->belongsTo(Torneo::class);
    }
}
