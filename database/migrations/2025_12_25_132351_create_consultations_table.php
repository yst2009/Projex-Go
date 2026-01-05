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
    Schema::create('consultations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('professor_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
    $table->enum('field', ['technical', 'business', 'marketing']);
    $table->integer('hours_allocated')->default(1);
    $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
    $table->dateTime('scheduled_at')->nullable(); 
    $table->text('meeting_link')->nullable();
    $table->integer('rate')->nullable(); 
    $table->text('professor_notes')->nullable(); 
    $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
