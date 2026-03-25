import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { sendMessage, getConversation, getAllNotifications, searchUsers } from '../api/messageService';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send, MessageSquare, BellRing, Check, X, Loader2, Users, Search, UserCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const NotificationsView = () => {
    const [invitations, setInvitations] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [systemNotifs, setSystemNotifs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllNotifications();
    }, []);

    const fetchAllNotifications = async () => {
        try {

            const [invRes, reqRes, sysRes] = await Promise.all([
                apiClient.get('/projects/invitations').catch(() => ({ data: { invitations: [] } })),
                apiClient.get('/projects/join-requests').catch(() => ({ data: { requests: [] } })),
                getAllNotifications().catch(() => ({ data: { notifications: [] } }))
            ]);

            setInvitations(invRes.data?.invitations || []);
            setJoinRequests(reqRes.data?.requests || []);
            setSystemNotifs(sysRes.data?.notifications || []);
        } catch (err) {
            console.error("خطأ في جلب الإشعارات:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" /> جاري التحميل...</div>;

    return (
        <div className="space-y-6">

            {systemNotifs.length > 0 && (
                <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-900">
                        <BellRing className="w-5 h-5 text-blue-500" /> إشعارات النظام
                    </h3>
                    <div className="grid gap-3">
                        {systemNotifs.map(notif => (
                            <Card key={notif.id} className="border-blue-200 bg-blue-50/50">
                                <CardContent className="p-4">
                                 <p className="text-gray-800">{notif.data?.body || notif.data?.title || "إشعار جديد"}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            
            {invitations.length === 0 && joinRequests.length === 0 && systemNotifs.length === 0 && (
                 <div className="text-center text-gray-400 mt-10">لا توجد إشعارات حالياً</div>
            )}
        </div>
    );
};
const Chat = () => {
    const [activeTab, setActiveTab] = useState('chat'); 

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);
    

    const currentUser = JSON.parse(localStorage.getItem('user')) || { id: 1 }; 

    const handleSearch = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 2) {
            try {
                const res = await searchUsers(e.target.value);
                setSearchResults(res.data?.users || res.data || []);
            } catch (err) { console.error(err); }
        } else {
            setSearchResults([]);
        }
    };

    useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => {
        fetchConversation(selectedUser.id);
    }, 3000); 
    return () => clearInterval(interval);
}, [selectedUser]);;

    const fetchConversation = async (otherUserId) => {
        setLoadingChat(true);
        try {
            const res = await getConversation({ other_user_id: otherUserId });
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error("خطأ في جلب المحادثة", err);
        } finally {
            setLoadingChat(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedUser) return;
        try {
            const res = await sendMessage({
                email: selectedUser.email,
                content: newMessage
            });

            setMessages(prev => [...prev, res.data.message]);
            setNewMessage("");
        } catch (err) { 
            console.error(err); 
            alert("حدث خطأ أثناء إرسال الرسالة");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border">
            <div className="bg-blue-600 text-white flex items-center justify-between">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 p-4 flex justify-center items-center gap-2 font-bold transition-colors ${activeTab === 'chat' ? 'bg-blue-700 border-b-4 border-white' : 'hover:bg-blue-700/50 text-blue-100 border-b-4 border-transparent'}`}
                >
                    <MessageSquare className="w-5 h-5" /> الرسائل
                </button>
                <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`flex-1 p-4 flex justify-center items-center gap-2 font-bold transition-colors ${activeTab === 'notifications' ? 'bg-blue-700 border-b-4 border-white' : 'hover:bg-blue-700/50 text-blue-100 border-b-4 border-transparent'}`}
                >
                    <BellRing className="w-5 h-5" /> الإشعارات
                </button>
            </div>

            {activeTab === 'notifications' ? (
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    <NotificationsView />
                </div>
            ) : (
                <div className="flex flex-1 overflow-hidden">

                    <div className="w-1/3 border-l bg-white flex flex-col">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" />
                                <Input 
                                    placeholder="ابحث عن شخص للمراسلة..." 
                                    className="pl-4 pr-10"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <div 
                                        key={user.id} 
                                        onClick={() => setSelectedUser(user)}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${selectedUser?.id === user.id ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100 border border-transparent'}`}
                                    >
                                        <UserCircle className="w-10 h-10 text-gray-400" />
                                        <div>
                                            <h4 className="font-bold text-gray-800">{user.name}</h4>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 mt-10 text-sm">
                                    ابحث عن اسم أو بريد للبدء في المراسلة
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-2/3 flex flex-col bg-gray-50">
                        {selectedUser ? (
                            <>

                                <div className="p-4 border-b bg-white flex items-center gap-3">
                                    <UserCircle className="w-8 h-8 text-blue-600" />
                                    <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
                                    {loadingChat ? (
                                        <Loader2 className="w-8 h-8 animate-spin m-auto text-blue-600" />
                                    ) : messages.length === 0 ? (
                                        <div className="m-auto text-center text-gray-400">ابدأ المحادثة مع {selectedUser.name}</div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            const isMe = msg.sender_id === currentUser.id;
                                            return (
                                                <div key={idx} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`p-3 px-5 rounded-2xl max-w-[70%] shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="p-4 bg-white border-t flex gap-2 items-center">
                                    <Input 
                                        value={newMessage} 
                                        onChange={(e) => setNewMessage(e.target.value)} 
                                        placeholder={`اكتب رسالة لـ ${selectedUser.name}...`} 
                                        className="flex-1"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <Button onClick={handleSend} disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700 px-6">
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="m-auto flex flex-col items-center text-gray-400">
                                <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg">اختر جهة اتصال لبدء المراسلة</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
