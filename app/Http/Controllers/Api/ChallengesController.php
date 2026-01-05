<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\challenges;
use App\Models\User;
use App\Models\Project;
use App\Models\Profile;
use App\Models\challenge_submissions;
use App\Http\Controllers\Controller;
class ChallengesController extends Controller
{
    public function index()
    {
        $challenges = challenges::all();
        return response()->json(['challenges'=>$challenges]);
    }

    public function store(Request $request)
    {
        $count_id=challenges::count();

        $user_id = auth()->user()->id;
        $challenges = challenges::create([
            'company_id' => $user_id,
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'budget' => $request->budget,
            'requirements' => $request->requirements,
            'status' => $request->status,
            'winner_project_id' => $request->winner_project_id??null,
            'submissions_count' => $count_id+1,
        ]);
        return response()->json($challenges);
    }
    public function submit(Request $request, $challengeId)
    {
        $user_id = auth()->user()->id;
        $profile=Profile::where('user_id',$user_id)->first();
        $project=Project::where('user_profile_id',$profile->id)->first();
        try{
        $challenge_submissions = challenge_submissions::create([
            'challenge_id' => $challengeId,
            'project_id' => $project->id,
            'submission_url' => $request->submission_url,
            'description' => $request->description,
            'status' => 'submitted',
            'rating' => null,
            'feedback' => null,
        ]);
        return response()->json(["Submit Successfully"=>true,"Data"=>$challenge_submissions]);
    }
        catch(Exception $e){
            return response()->json(["Submit Successfully"=>false,"Error"=>$e]);
        }
    }
    public function Review($challengeId)
    {
        $challenge_submissions = challenge_submissions::where('challenge_id', $challengeId)->first();
        $challenge_submissions->update([
            'status' => 'reviewing',
        ]);
        return response()->json(["Review Successfully"=>true,"Data"=>$challenge_submissions]);
    }
    public function accept(Request $request, $challengeId)
    {
        $challenge_submissions = challenge_submissions::where('challenge_id', $challengeId)->first();
        $challenge_submissions->update([
            'status' => 'accepted',
            'feedback' => $request->feedback??null,
            'rating' => $request->rating??null,
        ]);
        return response()->json(["Accept Successfully"=>true,"Data"=>$challenge_submissions]);
    }
    public function reject(Request $request, $challengeId)
    {
        $challenge_submissions = challenge_submissions::where('challenge_id', $challengeId)->first();
        $challenge_submissions->update([
            'status' => 'rejected',
            'feedback' => $request->feedback??null,
            'rating' => $request->rating??null,
        ]);
        return response()->json(["Reject Successfully"=>true,"Data"=>$challenge_submissions]);
    }

}
