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
        $userProfileId = Profile::where('user_id', auth()->id())->value('id');

        if (!$userProfileId) {
            return response()->json(['projects' => []], 200);
        }

        $projectIds = TeamMember::where('user_profile_id', $userProfileId)
            ->where('status', 'active')
            ->pluck('project_id');

        $projects = Project::whereIn('id', $projectIds)->get();

        return response()->json(['projects' => $projects], 200);
    }

    public function create(Request $request)
    {
        $user = auth()->user();
        $profile = Profile::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json(['message' => 'يجب عليك استكمال الملف الشخصي أولاً'], 400);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'stage' => 'required|string',
            'budget_needed' => 'nullable|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $imagePath = '/storage/' . $path;
        }

        $project = Project::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'stage' => $validated['stage'],
            'image' => $imagePath,
            'status' => 'active',
            'user_profile_id' => $profile->id,
            'budget_needed' => $request->budget_needed ?? 0,
            'current_budget' => 0,
            'progress_percentage' => 0,
            'start_date' => now(),
            'deadline' => now()->addMonths(6),
        ]);

        TeamMember::create([
            'project_id' => $project->id,
            'user_profile_id' => $profile->id,
            'status' => 'active',
            'role' => 'Leader',
        ]);

        return response()->json([
            'message' => 'تم إنشاء المشروع بنجاح',
            'project' => $project
        ], 201);
    }

    public function show($id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $requirements = $project->requirements()->get();

        $teamMembers = $project->teamMembers()->with('profile.user')->get()->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->profile->user->name ?? 'Unknown',
                'email' => $member->profile->user->email ?? 'Unknown',
                'image' => $member->profile->image ?? null,
                'role' => $member->role,
                'status' => $member->status
            ];
        });

        return response()->json([
            'project' => $project,
            'requirements' => $requirements,
            'teamMembers' => $teamMembers
        ], 200);
    }

    public function update(Request $request)
    {
        $userProfileId = Profile::where('user_id', auth()->id())->value('id');

        $project = Project::where('id', $request->id)
            ->where('user_profile_id', $userProfileId)
            ->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->update($request->only([
            'title',
            'description',
            'category',
            'stage',
            'status',
            'budget_needed',
            'current_budget',
            'progress_percentage',
            'start_date',
            'deadline',
            'documentation_url'
        ]));

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project
        ], 200);
    }

    public function destroy($id)
    {
        $userProfileId = Profile::where('user_id', auth()->id())->value('id');

        $project = Project::where('id', $id)
            ->where('user_profile_id', $userProfileId)
            ->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->teamMembers()->delete();
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }

    public function inviteMember(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|string',
        ]);

        $profile = Profile::where('user_id', auth()->id())->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $project = Project::where('user_profile_id', $profile->id)->first();
        if (!$project) {
            return response()->json(['message' => 'No project found'], 404);
        }

        $userToInvite = User::where('email', $request->email)->first();
        if (!$userToInvite) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $profileToInvite = Profile::where('user_id', $userToInvite->id)->first();
        if (!$profileToInvite) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        if (TeamMember::where('project_id', $project->id)
            ->where('user_profile_id', $profileToInvite->id)->exists()) {
            return response()->json(['message' => 'Already member'], 400);
        }

        TeamMember::create([
            'project_id' => $project->id,
            'user_profile_id' => $profileToInvite->id,
            'status' => 'pending',
            'role' => $request->role,
            'type' => 'invite' // ✅ FIX
        ]);

        $userToInvite->notify(new NewTeamJoinRequest($project, auth()->user()));

        return response()->json(['message' => 'Invitation sent'], 200);
    }

    public function myInvitations()
    {
        $profile = Profile::where('user_id', auth()->id())->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $invitations = TeamMember::with('project')
            ->where('user_profile_id', $profile->id)
            ->where('status', 'pending')
            ->where('type', 'invite')
            ->get();

        return response()->json(['invitations' => $invitations], 200);
    }

    public function getJoinRequests()
    {
        $profile = Profile::where('user_id', auth()->id())->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $leaderProject = TeamMember::where('user_profile_id', $profile->id)
            ->where('role', 'Leader')
            ->where('status', 'active')
            ->first();

        if (!$leaderProject) {
            return response()->json(['message' => 'Not a leader'], 403);
        }

        $requests = TeamMember::with('profile.user')
            ->where('project_id', $leaderProject->project_id)
            ->where('status', 'pending')
            ->where('type', 'request')
            ->get();

        return response()->json(['requests' => $requests], 200);
    }
}

