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
    Schema::create('mensaje_foros', function (Blueprint $table) {
        $table->id();
        $table->foreignId('hilo_foro_id')->constrained('hilo_foros')->onDelete('cascade');
        $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
        $table->text('contenido');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensaje_foros');
    }
};
