import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Check, X, BellRing, Loader2 } from 'lucide-react';

const InvitationsList = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const res = await apiClient.get('/projects/invitations');
            setInvitations(res.data.invitations || []);
        } catch (error) {
            console.error("Error fetching invitations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (projectId, action) => {
        setProcessingId(projectId);
        try {
            await apiClient.post(`/projects/${action}`, { project_id: projectId });
            
            setInvitations(invitations.filter(inv => inv.project_id !== projectId));
            alert(action === 'accept' ? 'تم الانضمام للفريق بنجاح! 🎉' : 'تم رفض الدعوة.');
        } catch (error) {
            alert('حدث خطأ، يرجى المحاولة مرة أخرى.');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">جاري تحميل الدعوات...</div>;
    if (invitations.length === 0) return null; 

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
                <BellRing className="w-5 h-5 text-yellow-500" /> دعوات الانضمام المعلقة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invitations.map((inv) => (
                    <Card key={inv.id} className="border-yellow-200 bg-yellow-50/50 shadow-sm">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">لقد تمت دعوتك للانضمام إلى مشروع:</p>
                                <h3 className="font-bold text-lg text-gray-900">{inv.project?.title || 'مشروع غير معروف'}</h3>
                                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-md mt-2 inline-block">
                                    دورك: {inv.role}
                                </span>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button 
                                    onClick={() => handleAction(inv.project_id, 'accept')}
                                    disabled={processingId === inv.project_id}
                                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                                >
                                    {processingId === inv.project_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                                    قبول
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleAction(inv.project_id, 'reject')}
                                    disabled={processingId === inv.project_id}
                                    className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    {processingId === inv.project_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                                    رفض
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default InvitationsList;
