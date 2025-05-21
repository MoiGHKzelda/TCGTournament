<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MensajeForo extends Model
{
    use HasFactory;

    protected $table = 'mensaje_foros';

    protected $fillable = [
        'hilo_foro_id',
        'usuario_id',
        'contenido'
    ];

    public $timestamps = false;

    public function hilo()
    {
        return $this->belongsTo(HiloForo::class, 'hilo_foro_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
