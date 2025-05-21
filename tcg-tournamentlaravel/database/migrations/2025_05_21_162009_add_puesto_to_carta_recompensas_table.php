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
        Schema::table('carta_recompensas', function (Blueprint $table) {
            $table->unsignedTinyInteger('puesto')->after('descripcion');
        });
    }

    public function down(): void
    {
        Schema::table('carta_recompensas', function (Blueprint $table) {
            $table->dropColumn('puesto');
        });
    }
};
