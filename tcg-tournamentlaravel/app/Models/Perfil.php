<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Perfil extends Model
{
    use HasFactory;

    protected $table = 'perfils';

    protected $fillable = [
        'usuario_id',
        'torneos_jugados',
        'torneos_ganados',
        'logros',
        'avatar'
    ];
    

    public $timestamps = false;

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
