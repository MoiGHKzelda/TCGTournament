<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('foro_id')->constrained('foros');
            $table->foreignId('autor_id')->constrained('usuarios');
            $table->text('contenido');
            $table->timestamp('fecha_posteo')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('mensajes');
    }
};