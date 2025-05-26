<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('partidas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('torneo_id')->constrained('torneos')->onDelete('cascade');
            $table->foreignId('jugador1_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('jugador2_id')->nullable()->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('ganador_id')->nullable()->constrained('usuarios')->onDelete('set null');
            $table->integer('ronda');
            $table->string('resultado')->nullable();
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partidas');
    }
};
