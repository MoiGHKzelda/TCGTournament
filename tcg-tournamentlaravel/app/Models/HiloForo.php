<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HiloForo extends Model
{
    use HasFactory;

    protected $table = 'hilo_foros';

    protected $fillable = [
        'torneo_id',
        'usuario_id',
        'titulo',
        'contenido'
    ];

    public $timestamps = false;

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function mensajes()
    {
        return $this->hasMany(MensajeForo::class);
    }
}
