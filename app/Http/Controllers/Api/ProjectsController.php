<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Models\Profile;
use App\Models\User;
use App\Models\Project_Requirement;
use App\Notifications\NewTeamJoinRequest;
class ProjectsController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json(['projects' => $projects], 200);
    }
    
    public function create(Request $request)
    {
      
        $project = new Project();
        $project->title=$request->title;
        $project->description=$request->description;
        $project->category=$request->category;
        $project->stage=$request->stage;
        $project->status=$request->status;
        $project->user_profile_id=$request->user_profile_id;
        $project->budget_needed=$request->budget_needed;
        $project->current_budget=$request->current_budget;
        $project->progress_percentage=$request->progress_percentage;
        $project->start_date=$request->start_date;
        $project->deadline=$request->deadline;
        $project->documentation_url=$request->documentation_url;
        $project->save();
        $team=new TeamMember();
        $team->project_id=$project->id;
        $team->user_profile_id=$project->user_profile_id;
        $team->status='active';
        $team->role='Leader';
        $team->save();
        return response()->json(['message' => 'Project created successfully'], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $profile=Profile::where('user_id',auth()->user()->id)->first();
        $project=Project::where('id',$id)->where('user_profile_id',$profile->id)->first();
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $project_requirements=$project->requirements()->get();
        $project_requirements->makeHidden(['created_at', 'updated_at', 'project_id','id']);

        $project->makeHidden(['created_at', 'updated_at', 'user_profile_id','id']);

        $teamMembers = $project->teamMembers()->get()->map(function ($member) {
        return [
            'Name' => $member->profile->user->name ?? 'Unknown',         
            'role' => $member->role,
            'status' => $member->status
        ];
    });

        return response()->json(['project' => $project,'requirements'=>$project_requirements,'teamMembers'=>$teamMembers], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $project = Project::where('id', $request->id)->where('user_id', auth()->id())->first();
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $project->title=$request->title;
        $project->description=$request->description;
        $project->category=$request->category;
        $project->stage=$request->stage;
        $project->status=$request->status;
        $project->user_id=$request->user_id;
        $project->budget_needed=$request->budget_needed;
        $project->current_budget=$request->current_budget;
        $project->progress_percentage=$request->progress_percentage;
        $project->start_date=$request->start_date;
        $project->deadline=$request->deadline;
        $project->documentation_url=$request->documentation_url;
        $project->save();
        return response()->json(['message' => 'Project updated successfully','project' => $project], 200);
    }

    public function destroy()
    {
        $user_id=auth()->id();
        $profile=Profile::where('user_id', $user_id)->first();
        $project = Project::where('user_profile_id', $profile->id)->first();
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $project->delete();
        $teamleader=TeamMember::where('project_id', $project->id)->where('status', 'active')->where('role', "leader")->first();
        $teamleader->delete();
        return response()->json(['message' => 'Project deleted  successfully'], 200);
    }

    public function ShowAllTeam()
    {
        $user_id=auth()->id();
        $profile=Profile::where('user_id', $user_id)->first();
        $project=Project::where('user_profile_id', $profile->id)->first();
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $team=TeamMember::where('project_id', $project->id)->get();
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }
        $TeamMembers=[];
        foreach ($team as $member) {
            if ($member->profile && $member->profile->user->name&&$member->status=='active') {
                $TeamMembers[] = $member->profile->user->name;
            }
        }
        return response()->json(['team' => $TeamMembers], 200); 
    }

    public function inviteMember(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|string',
        ]);

        $user_id = auth()->id();
        $profile = Profile::where('user_id', $user_id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Your profile not found'], 404);
        }

        $project = Project::where('user_profile_id', $profile->id)->first();

        if (!$project) {
            return response()->json(['message' => 'You do not have a project'], 404);
        }

        $userToInvite = User::where('email', $request->email)->first();

        if (!$userToInvite) {
            return response()->json(['message' => 'User to invite not found'], 404);
        }
        $profileToInvite = Profile::where('user_id', $userToInvite->id)->first();

        if (!$profileToInvite) {
            return response()->json(['message' => 'User profile to invite not found'], 404);
        }

        $existingMember = TeamMember::where('project_id', $project->id)->where('user_profile_id', $profileToInvite->id)->first();

        if ($existingMember) {
            return response()->json(['message' => 'User is already a team member'], 400);
        }
        
        $team = new TeamMember();
        $team->project_id = $project->id;
        $team->user_profile_id = $profileToInvite->id;
        $team->status = 'pending';
        $team->role = $request->role;
        $team->save();
        $notification = new NewTeamJoinRequest($project, $userToInvite);
        $userToInvite->notify($notification);
        return response()->json(['message' => 'User invited successfully'], 200);
    }
    public function accept()
    {
        $email=auth()->user()->email;
        $userinvited=User::where('email', $email)->first();
        $userProfile =Profile::where('user_id', $userinvited->id)->first();
        if(!$userProfile){
            return response()->json(['message' => 'User profile not found'], 404);
        }
        $team=TeamMember::where('user_profile_id', $userProfile->id)->where('status', 'pending')->first();
        if (!$team) {
            return response()->json(['message' => 'No pending invitation found'], 404);
        }
        $team->status='active';
        $team->save();
        return response()->json(['message' => 'User accepted successfully'], 200);
    }
    public function reject()
    {
        $email=auth()->user()->email;
        $userinvited=User::where('email', $email)->first();
        $userProfile =Profile::where('user_id', $userinvited->id)->first();
        if(!$userProfile){
            return response()->json(['message' => 'User profile not found'], 404);
        }
        $team=TeamMember::where('user_profile_id', $userProfile->id)->where('status', 'pending')->first();
         if (!$team) {
            return response()->json(['message' => 'No pending invitation found'], 404);
        }
        $team->status='rejected';
        $team->delete();
        return response()->json(['message' => 'User rejected successfully'], 200);
    }
    public function DeleteMemeber(Request $request){
        $Memeber_id=$request->id;
        $id=auth()->user()->id;
        $userinvited=User::where('id', $id)->first();
        $userProfile =Profile::where('user_id', $userinvited->id)->first();
        if(!$userProfile){
            return response()->json(['message' => 'User profile not found'], 404);
        }
        $project = Project::where('user_profile_id', $userProfile->id)->first();
        if(!$project){
            return response()->json(['message' => 'you donot delete the person'], 404);
        }
        $teamleader=TeamMember::where('user_profile_id', $project->user_profile_id)->where('status', 'active')->where('role', "Leader")->first();
        if($teamleader && $Memeber_id==$teamleader->id){
            return response()->json(['message' => 'you donot delete the person'], 404);
        }
        $teammember=TeamMember::where('id', $Memeber_id)->first();
        if(!$teammember){
            return response()->json(['message' => 'User not found'], 404);
        }
        $teammember->delete();
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
    public function CreateRequirmentofTheProject(Request $request)
    {
        $user_id=auth()->user()->id;
        $profile=Profile::where('user_id',$user_id)->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        $project=Project::where('user_profile_id',$profile->id)->first();
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $project_requirement=new Project_Requirement();
        $project_requirement->project_id=$project->id;
        $project_requirement->requirement_type=$request->requirement_type;
        $project_requirement->skill_required=$request->skill_required;
        $project_requirement->count_needed=$request->count_needed;
        $project_requirement->filled_count=$request->filled_count;
        $project_requirement->status=$request->status;
        $project_requirement->priority=$request->priority;
        $project_requirement->description=$request->description;
        $project_requirement->save();
        return response()->json(['message' => 'Project requirement created successfully'], 200);
    }
}
