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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->enum('stage', ['idea', 'prototype', 'mvp', 'launch']);
            $table->string('status')->default('active');
            $table->foreignId('user_profile_id')->constrained('profiles')->onDelete('cascade');
            $table->decimal('budget_needed', 15, 2)->nullable();
            $table->decimal('current_budget', 15, 2)->default(0);
            $table->integer('progress_percentage')->default(0);
            $table->date('start_date')->nullable();
            $table->date('deadline')->nullable();
            $table->string('documentation_url')->nullable();
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
