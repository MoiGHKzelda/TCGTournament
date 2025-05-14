<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Anuncio extends Model
{
    use HasFactory;

    protected $fillable = ['titulo', 'contenido', 'creado_por_id'];

    public function creador() {
        return $this->belongsTo(Usuario::class, 'creado_por_id');
    }
}
