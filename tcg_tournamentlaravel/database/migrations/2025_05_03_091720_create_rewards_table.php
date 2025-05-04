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
    Schema::create('rewards', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tournament_id')->constrained('tournaments')->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->unsignedInteger('position'); // 1 = primer lugar, etc.
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};
