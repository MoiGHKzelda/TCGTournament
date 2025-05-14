<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('emparejamientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('torneo_id')->constrained('torneos');
            $table->integer('ronda');
            $table->foreignId('jugador1_id')->constrained('usuarios');
            $table->foreignId('jugador2_id')->constrained('usuarios');
            $table->foreignId('ganador_id')->nullable()->constrained('usuarios');
            $table->enum('estado', ['pendiente', 'finalizado'])->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('emparejamientos');
    }
};