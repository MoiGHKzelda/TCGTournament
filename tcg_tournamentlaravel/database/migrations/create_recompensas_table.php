<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('recompensas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('torneo_id')->constrained('torneos');
            $table->integer('puesto');
            $table->string('scryfall_id');
            $table->string('nombre');
            $table->string('imagen_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('recompensas');
    }
};