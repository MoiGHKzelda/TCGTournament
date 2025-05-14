<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('torneos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('formato');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin')->nullable();
            $table->enum('estado', ['activo', 'finalizado', 'en_espera'])->default('en_espera');
            $table->foreignId('organizador_id')->constrained('usuarios');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('torneos');
    }
};