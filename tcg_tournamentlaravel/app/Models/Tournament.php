<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'format',
        'is_public',
        'password',
        'date',
        'max_players',
        'reward',
    ];

    public function participations(): HasMany
    {
        return $this->hasMany(Participation::class);
    }

    public function reward(): HasOne
    {
        return $this->hasOne(Reward::class);
    }

    public function forums(): HasMany
    {
        return $this->hasMany(Forum::class);
    }
}
