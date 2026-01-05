<?php

namespace App\Http\Controllers\Api;

use App\Models\Mentorships;
use App\Models\User;
use App\Models\Profile;
use App\Models\Project;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\MentorProgress;
use App\Notifications\MentorInvitation;
use App\Notifications\notify;


class MentorshipsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mentorships = Mentorships::all();
        return response()->json(['mentorships' => $mentorships], 200);
    }
    public function create()
    {
       
    }
    public function searchmentorbyskills(Request $request){
        $user_id=auth()->user()->id;
        $profiles=Profile::where('skills','like',"%{$request->skills}%")->get();
        $mentors=Mentorships::where('mentor_id','like',"%{$profiles->id}%")->get();
        return response()->json(['mentors' => $mentors], 200);
    }
    public function store(Request $request)
    {
       $user_id=auth()->user()->id;
       $mentorship=new Mentorships();
       $mentorship->mentor_id=$user_id;
       $mentorship->project_id=$request->project_id??null;
       $mentorship->status="pending";
       $mentorship->start_date=$request->start_date;
       $mentorship->end_date=$request->end_date;
       $mentorship->goals=$request->goals;
       $mentorship->sessions_count=$request->sessions_count??null;
       $mentorship->notes=$request->notes;
       $mentorship->rating=$request->rating;
       $mentorship->save();
       $mentorship->makeHidden(['mentor_id','project_id','created_at','updated_at']);
       return response()->json(['mentor_name'=>$mentorship->mentor->name,'mentorship' => $mentorship,'project name'=>$mentorship->project->name], 200);
    }
    public function invitemember(Request $request)
    {
        $email=$request->email;
        $user=User::where('email',$email)->first();

        $profile=Profile::where('user_id',auth()->user()->id)->first();
        $project=Project::where('user_profile_id',$profile->id)->first();
        $teamleader=TeamMember::where('project_id',$project->id)->where("role","Leader")->first();
        if($teamleader)
        {
        $profile=Profile::where('user_id',$user->id)->first();
        $team_member=TeamMember::where('user_profile_id',$profile->id)->where("role","Mentorship")->where("project_id","$project->id")->first();
        if($team_member)
        {
            return response()->json(['massage' =>"You are already invited"], 200);
        }
        else{
        $team_member=new TeamMember();
        $team_member->project_id=$project->id;
        $team_member->user_profile_id=$profile->id;
        $team_member->role="Mentorship";
        $team_member->status="pending";
        $team_member->save();
        $user->notify(new \App\Notifications\MentorInvitation($project)); 
        return response()->json(['massage' =>"Teamleader invite the mentorships "], 200);
        }
        }
    }
    public function accept(Request $request)
    {
        $profile=Profile::where('user_id',auth()->user()->id)->first();
        $team_member=TeamMember::where('user_profile_id',$profile->id)->where("role","Mentorship")->first();
        if($team_member)
        {
        $team_member->status="active";
        $team_member->save();
        Mentorships::updateOrCreate([
            'mentor_id' => auth()->user()->id,
        ], [
            'status' => 'active',
            'project_id' => $team_member->project_id,
        ]);
        return response()->json(['massage' =>"Teamleader accept the mentorships "], 200);
        }
        else{
            return response()->json(['massage' =>"You are not invited"], 200);
        }
    }
    public function reject(Request $request)
    {
        $profile=Profile::where('user_id',auth()->user()->id)->first();
        $team_member=TeamMember::where('user_profile_id',$profile->id)->where("role","Mentorship")->first();
        $team_member->status="rejected";
        $team_member->save();
        return response()->json(['massage' =>"Teamleader reject the mentorships "], 200);
    }
    public function show(Mentorships $mentorships)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mentorships $mentorships)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mentorships $mentorships)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mentorships $mentorships)
    {
        //
    }
    private function determineStatus(int $percentage)
    {
        $percentage = $percentage;
        $status="not_started";
        switch (true) {
            case $percentage >= 100:
                $status = 'completed';
                break;
                  
            case $percentage >= 80:
                $status = 'almost_done';
                break;
                
            case $percentage >= 60:
                $status = 'on_track';
                break;
                
            case $percentage >= 30:
                $status = 'active';
                break;
                
            default:
                $status = 'not_started';
        }
        
        return $status;
    }


public function Progress(Request $request)
{

    $user_id = auth()->user()->id;
    // حط ده في بداية دالة Progress
    $request->validate([
        'project_id' => 'required|integer', 
        'start_date' => 'required|date',
        'end_date' => 'required|date'
    ]);

    // --- 1. التحقق: هل المينتور ده مسؤول عن المشروع ده؟ ---
    $mentorship = Mentorships::where('mentor_id', $user_id)
                        ->where('project_id', $request->project_id)
                        ->where('status', 'active')->first();

    if (!$mentorship) {
        // debugging message عشان تعرف هو وقف ليه
        return response()->json([
            'message' => 'Unauthorized or Project Not Found for this Mentor',
            'debug_info' => [
                'looking_for_mentor' => $user_id,
                'looking_for_project' => $request->project_id
            ]
        ], 403);
    }

    // --- 2. الحسابات (زي ما هي) ---
    $start = Carbon::parse($request->start_date);
    $end   = Carbon::parse($request->end_date);
    $now   = Carbon::now();

    $totalDuration = $start->diffInDays($end) ?: 1;
    $progress = 0;
    $elapsed = 0;

    if ($now->gt($end)) {
        $progress = 100;
        $elapsed  = $totalDuration;
    } elseif ($now->lt($start)) {
        $progress = 0;
        $elapsed  = 0;
    } else {
        $elapsed  = $start->diffInDays($now);
        $progress = round(($elapsed / $totalDuration) * 100);
    }

    // --- 3. التحديث أو الإنشاء ---
    $mentorProgress = MentorProgress::updateOrCreate(
        [
            'mentorship_id' => $mentorship->id,
            'project_id'    => $mentorship->project_id
        ],
        [
            'start_date'          => $start,
            'end_date'            => $end,
            'progress_percentage' => $progress,
            'days_elapsed'        => $elapsed,
            'days_total'          => $totalDuration,
            'status'              => $this->determineStatus($progress)
        ]
    );

    // --- 4. تجهيز الرد الغني (Custom Response) ---
    // هنا بنرجع البيانات اللي طلبتها بالظبط
    return response()->json([
        "message" => "Progress updated successfully",
        "details" => [
            "mentor_name"  => $mentorship->mentor->name,            // اسم المينتور
            "project_title"=> $mentorship->project->title,        // اسم المشروع (من جدول projects)
            "progress"     => $progress . '%', // النسبة
            "status"       => $mentorProgress->status,
            "start"=> $start->format('Y-m-d'),
            "end"  => $end->format('Y-m-d')
        ]
    ], 200);
}
public function ShowProgress()
{

    $user_id = auth()->user()->id;
    // حط ده في بداية دالة Progress
   

    // --- 1. التحقق: هل المينتور ده مسؤول عن المشروع ده؟ ---
    $mentorship = Mentorships::where('mentor_id', $user_id)
                        ->where('status', 'active')->first();
    if (!$mentorship) {
        // debugging message عشان تعرف هو وقف ليه
        return response()->json([
            'message' => 'Unauthorized or Project Not Found for this Mentor',
            'debug_info' => [
                'looking_for_mentor' => $user_id,
                'looking_for_project' => $mentorship->project_id
            ]
        ], 403);
    }
    $allmentorprogress=MentorProgress::where('mentorship_id', $mentorship->id)->get();
    foreach ($allmentorprogress as $mentorprogress) {
        // --- 2. الحسابات (زي ما هي) ---
    $start = Carbon::parse($mentorprogress->start_date);
    $end   = Carbon::parse($mentorprogress->end_date);
    $now   = Carbon::now();

    $totalDuration = $start->diffInDays($end) ?: 1;
    $progress = 0;
    $elapsed = 0;

    if ($now->gt($end)) {
        $progress = 100;
        $elapsed  = $totalDuration;
    } elseif ($now->lt($start)) {
        $progress = 0;
        $elapsed  = 0;
    } else {
        $elapsed  = $start->diffInDays($now);
        $progress = round(($elapsed / $totalDuration) * 100);
    }

    // --- 3. التحديث أو الإنشاء ---
    $mentorProgress = MentorProgress::updateOrCreate(
        [
            'mentorship_id' => $mentorship->id,
            'project_id'    => $mentorship->project_id
        ],
        [
            'start_date'          => $start,
            'end_date'            => $end,
            'progress_percentage' => $progress,
            'days_elapsed'        => $elapsed,
            'days_total'          => $totalDuration,
            'status'              => $this->determineStatus($progress)
        ]
    );
}

    // --- 4. تجهيز الرد الغني (Custom Response) ---
    // هنا بنرجع البيانات اللي طلبتها بالظبط
    return response()->json([
        "message" => "Progress updated successfully",
        "details" => [
            "mentor_name"  => $mentorship->mentor->name,            // اسم المينتور
            "project_title"=> $mentorship->project->title,        // اسم المشروع (من جدول projects)
            "progress"     => $progress . '%', // النسبة
            "status"       => $mentorProgress->status,
            "start"=> $start->format('Y-m-d'),
            "end"  => $end->format('Y-m-d')
        ]
    ], 200);
}
}
