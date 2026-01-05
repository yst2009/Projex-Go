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
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('investor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            
            $table->decimal('amount', 15, 2); 
            $table->decimal('equity_offered', 5, 2); 
            
            $table->enum('status', ['proposed', 'accepted', 'rejected'])->default('proposed');
            $table->json('documents')->nullable(); 
            $table->string('agreement_link')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
