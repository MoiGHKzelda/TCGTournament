<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('foros', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->foreignId('torneo_id')->nullable()->constrained('torneos');
            $table->foreignId('creado_por_id')->constrained('usuarios');
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('foros');
    }
};