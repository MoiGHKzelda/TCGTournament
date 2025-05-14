<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mensaje extends Model
{
    use HasFactory;

    protected $fillable = ['foro_id', 'autor_id', 'contenido'];

    public function foro() {
        return $this->belongsTo(Foro::class);
    }

    public function autor() {
        return $this->belongsTo(Usuario::class, 'autor_id');
    }
}
