<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workshops', function (Blueprint $table) {
            $table->id();
            
            // Basic Info
            $table->string('title');
            $table->string('description'); // Short description
            $table->text('description_detailed')->nullable(); // Long description
            
            // Instructor Relation (Polymorphic is possible, but simple ID is better here)
            $table->foreignId('instructor_id')
                  ->constrained('users')
                  ->onDelete('cascade'); 

            // Logistics
            $table->string('category'); // e.g., 'Programming', 'Business'
            $table->date('date');
            $table->time('time');
            $table->string('location'); // Physical address or Zoom link
            $table->integer('capacity'); // Max students
            $table->float('duration'); // In hours (float allows 1.5 hours)
            
            // Details
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->decimal('price', 8, 2);
            $table->json('syllabus')->nullable(); // Flexible JSON structure for chapters/topics
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workshops');
    }
};
