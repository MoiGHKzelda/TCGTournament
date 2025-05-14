<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Logro extends Model
{
    use HasFactory;

    protected $fillable = ['usuario_id', 'descripcion', 'fecha_obtencion'];

    public function usuario() {
        return $this->belongsTo(Usuario::class);
    }
}
