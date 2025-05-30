<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('torneo_jugadors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('torneo_id')->constrained('torneos')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');

            // Campos adicionales
            $table->integer('puntos')->default(0);
            $table->boolean('eliminado')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('torneo_jugadors');
    }
};
