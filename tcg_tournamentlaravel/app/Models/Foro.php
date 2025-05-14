<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Foro extends Model
{
    use HasFactory;

    protected $fillable = ['titulo', 'torneo_id', 'creado_por_id'];

    public function creador() {
        return $this->belongsTo(Usuario::class, 'creado_por_id');
    }

    public function torneo() {
        return $this->belongsTo(Torneo::class);
    }

    public function mensajes() {
        return $this->hasMany(Mensaje::class);
    }
}
