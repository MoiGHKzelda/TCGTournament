<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('anuncios', function (Blueprint $table) {
            $table->string('titulo')->nullable()->change();
        });
    }

    public function down(): void {
        Schema::table('anuncios', function (Blueprint $table) {
            $table->string('titulo')->nullable(false)->change(); // revertir si quieres
        });
    }
};