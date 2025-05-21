<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Anuncio extends Model
{
    use HasFactory;

    protected $table = 'anuncios';

    protected $fillable = ['titulo', 'contenido', 'usuario_id', 'torneo_id', 'padre_id'];


    public $timestamps = true;

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    // Respuestas a este anuncio
    public function respuestas()
    {
        return $this->hasMany(Anuncio::class, 'padre_id');
    }
    
    public function padre()
    {
        return $this->belongsTo(Anuncio::class, 'padre_id');
    }
    
}
