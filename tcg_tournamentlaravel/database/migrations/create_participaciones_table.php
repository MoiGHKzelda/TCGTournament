<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('participaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('torneo_id')->constrained('torneos');
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->integer('puntos')->default(0);
            $table->integer('posicion_final')->nullable();
            $table->timestamp('fecha_inscripcion')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('participaciones');
    }
};