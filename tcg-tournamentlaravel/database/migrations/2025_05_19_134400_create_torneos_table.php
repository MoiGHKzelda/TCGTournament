<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('torneos', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->text('descripcion')->nullable();
        $table->date('fecha');
        $table->time('hora');
        $table->string('formato');
        $table->integer('max_jugadores');
        $table->enum('estado', ['inscripcion', 'activo', 'finalizado'])->default('inscripcion');
        $table->foreignId('organizador_id')->constrained('usuarios')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('torneos');
    }
};
