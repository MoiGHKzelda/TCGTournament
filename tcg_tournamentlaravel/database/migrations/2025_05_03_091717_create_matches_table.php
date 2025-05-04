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
    Schema::create('matches', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tournament_id')->constrained('tournaments')->onDelete('cascade');
        $table->foreignId('player1_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('player2_id')->constrained('users')->onDelete('cascade');
        $table->unsignedTinyInteger('round');
        $table->foreignId('winner_id')->nullable()->constrained('users')->onDelete('set null');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
