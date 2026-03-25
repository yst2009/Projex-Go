<?php

namespace App\Http\Controllers\Api;

use App\Models\messages;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class MessagesController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'content' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $message = messages::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $user->id,
            'subject' => $request->subject ?? null,
            'content' => $request->content,
            'read' => false,
            'attachments' => $request->attachments ?? null,
        ]);

        return response()->json([
            'sender_name' => auth()->user()->name,
            'receiver_name' => $user->name,
            'message' => $message,
        ], 201);
    }

    public function getConversation(Request $request)
    {
        $request->validate([
            'other_user_id' => 'required|exists:users,id'
        ]);

        $auth_user_id = auth()->id();
        $other_user_id = $request->other_user_id;

        $messages = messages::where(function ($query) use ($auth_user_id, $other_user_id) {
            $query->where('sender_id', $auth_user_id)
                  ->where('receiver_id', $other_user_id);
        })->orWhere(function ($query) use ($auth_user_id, $other_user_id) {
            $query->where('sender_id', $other_user_id)
                  ->where('receiver_id', $auth_user_id);
        })->orderBy('created_at', 'asc')->get();

        return response()->json([
            'messages' => $messages
        ], 200);
    }

    public function showallnotifications()
    {
        $notifications = auth()->user()->notifications()->latest()->get();

        return response()->json([
            'notifications' => $notifications,
        ], 200);
    }

    public function Make_Read($id)
    {
        $message = messages::find($id);

        if (!$message) {
            return response()->json(['message' => 'Not found'], 404);
        }

        if ($message->receiver_id != auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->read = true;
        $message->save();

        return response()->json([
            'message' => $message,
        ], 200);
    }
}
