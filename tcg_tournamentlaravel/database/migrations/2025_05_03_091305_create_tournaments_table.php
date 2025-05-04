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
    Schema::create('tournaments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
        $table->string('name');
        $table->text('description')->nullable();
        $table->enum('format', ['standard', 'modern', 'commander'])->default('standard');
        $table->boolean('is_private')->default(false);
        $table->string('password')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};
