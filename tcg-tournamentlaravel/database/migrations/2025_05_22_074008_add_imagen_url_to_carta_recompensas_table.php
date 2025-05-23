<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('carta_recompensas', function (Blueprint $table) {
            $table->string('imagen_url')->nullable()->after('descripcion');
        });
    }

    public function down(): void
    {
        Schema::table('carta_recompensas', function (Blueprint $table) {
            $table->dropColumn('imagen_url');
        });
    }
};
