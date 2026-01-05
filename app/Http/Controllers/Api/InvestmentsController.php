<?php

namespace App\Http\Controllers\Api;

use App\Models\investments;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Validation\Validator;
use App\Models\Project;
use App\Models\Profile;
use App\Notifications\ProjectFullyFunded;
class InvestmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $investors =User::where('user_type', 'investor')->get();
        return response()->json([
            'investors' => $investors
        ], 200);
    }

public function propose(Request $request)
{

    $documentPath = null;
    if ($request->hasFile('documents')) {
        $documentPath = $request->file('documents')->store('investments', 'public');
    }
    if(auth()->user()->user_type == 'investor') {
    $investment = investments::create([
        'investor_id'    => auth()->user()->id,
        'project_id'     => $request->project_id,
        'amount'         => $request->amount,
        'equity_offered' => $request->equity_offered,
        'status'         => 'proposed',
        'agreement_link' => $request->agreement_link??null,
        'documents'      => $documentPath??null,
        
    ]);
    }else {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to propose an investment'
            ], 401);
        }
        $project = Project::find($request->project_id);
        if ($project->budget_needed >= $investment->amount) {
    $project->profile->user->notify(new ProjectFullyFunded($project));
}

    return response()->json([
        'status' => 'success',
        'data'   => $investment
    ], 201);
}

  public function accept($id)
   {
    $user_id = auth()->user()->id;
    $profile = Profile::find($user_id);
    $investment = investments::find($id);
    $project = Project::find($investment->project_id);
    if($project->user_profile_id == $profile->id) {
        $investment->status = 'accepted';
        $investment->save();
        return response()->json([
            'status' => 'success',
            'id'=>$id,
            'data'   => $investment
        ], 200);
    }
    else {
        return response()->json([
            'status' => 'error',
            'message' => 'You are not authorized to accept this investment'
        ], 401);
    }
    }
public function reject($id)
{
    $user_id = auth()->user()->id;
    $profile = Profile::find($user_id);
    $investment = investments::find($id);
    $project = Project::find($investment->project_id);
    if($project->user_profile_id == $profile->id) {
        $investment->status = 'rejected';
        $investment->save();
        return response()->json([
            'status' => 'success',
            'id'=>$id,
            'data'   => $investment
        ], 200);
    }
    else {
        return response()->json([
            'status' => 'error',
            'message' => 'You are not authorized to reject this investment'
        ], 401);
    }
}
    public function show($id)
    {
        $user_id = auth()->user()->id;
        $investment = investments::find($id);
        $project = Project::find($investment->project_id);
        if($user_id == $project->user_profile_id) {
        return response()->json([
        'id'=>$id,
        'investment' => $investment
        ], 200);
    }else {
        return response()->json([
            'status' => 'error',
            'message' => 'You are not authorized to view this investment'
        ], 401);
    }
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(investments $investments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, investments $investments)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(investments $investments)
    {
        //
    }
}
