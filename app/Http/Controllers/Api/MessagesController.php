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
        $email=$request->email;
        $user=User::where('email', $email)->first();
        $message = messages::create([
            'sender_id' => auth()->user()->id,
            'receiver_id' => $user->id,
            'subject' => $request->subject??null,
            'content' => $request->content,
            'read' => false,
            'attachments' => $request->attachments??null,
        ]);
        $message->makeHidden(['sender_id','receiver_id','created_at','updated_at']);
        return response()->json([
            'sender name' => auth()->user()->name,
            'message' => $message,
            'receiver name' => $user->name,
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
        $notifications = auth()->user()->notifications()->orderBy('created_at', 'desc')->get();
        return response()->json([
            'notifications' => $notifications,
        ], 200);
    }
    public function getmessages_sender()
    {
        $messages = messages::where('sender_id', auth()->user()->id)->get();
        return response()->json([
            'messages' => $messages,
        ], 200);
    }
    public function getmessages_receiver()
    {
        $messages = messages::where('receiver_id', auth()->user()->id)->get();
        return response()->json([
            'messages' => $messages,
        ], 200);
    }
    public function Make_Read($id)
    {
        $user_id=auth()->user()->id;
        $message = messages::find($id);
        if($message->receiver_id == $user_id)
        {
            $message->read = true;
            $message->save();
            return response()->json([
            'id' => $id,
            'message' => $message,
        ], 200);
        }
        return response()->json([
            'id' => $id,
            'message' => 'not found',
        ], 404);
        
    }
    
}
