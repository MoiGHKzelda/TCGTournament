<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deck extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'archetype',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
