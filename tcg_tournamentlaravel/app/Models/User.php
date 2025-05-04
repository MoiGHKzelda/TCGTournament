<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nickname',
        'email',
        'birthdate',
        'password',
    ];

    public function participations(): HasMany
    {
        return $this->hasMany(Participation::class);
    }

    public function decks(): HasMany
    {
        return $this->hasMany(Deck::class);
    }

    public function forums(): HasMany
    {
        return $this->hasMany(Forum::class);
    }
}
