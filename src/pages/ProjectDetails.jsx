import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ArrowRight, Calendar, Users, DollarSign, Target, Activity, Mail, UserPlus, Trash2, Shield, X, Loader2 } from 'lucide-react';
import projectImage1 from '../assets/Hb8UCHoolmtt.jpg';

const ProjectDetails = ({ id, onBack }) => {
  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('info');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [isInviting, setIsInviting] = useState(false); 
  const [inviteMessage, setInviteMessage] = useState({ type: '', text: '' }); 

  const fetchProjectDetails = async () => {
    try {
      const res = await apiClient.get(`/projects/${id}`);
      setProject(res.data.project || res.data);
      setTeamMembers(res.data.teamMembers || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError('تعذر تحميل تفاصيل المشروع');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjectDetails();
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteMessage({ type: '', text: '' });

    try {
      await apiClient.post('/projects/invite', {
        project_id: id,
        email: inviteEmail,
        role: inviteRole
      });
      setInviteMessage({ type: 'success', text: 'تم إرسال الدعوة بنجاح! 🎉' });
      setInviteEmail('');
      fetchProjectDetails();
      setTimeout(() => setIsInviteModalOpen(false), 2000); 
    } catch (error) {
      setInviteMessage({ type: 'error', text: error.response?.data?.message || 'حدث خطأ أثناء إرسال الدعوة.' });
    } finally {
      setIsInviting(false);
    }
  };

    const handleRequestToJoin = async () => {
    try {
      await apiClient.post('/projects/request-join', {
        project_id: id,
        role: 'Member' 
      });
      alert('تم إرسال طلب الانضمام بنجاح! في انتظار موافقة صاحب المشروع.');
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب.');
    }
  };


  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('هل أنت متأكد من إزالة هذا العضو من الفريق؟')) return;

    const previousMembers = [...teamMembers];
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));

    try {
      await apiClient.post('/projects/DeleteMemeber', { id: memberId });
    } catch (error) {
      alert(error.response?.data?.message || 'لا تملك صلاحية حذف هذا العضو.');
      setTeamMembers(previousMembers); 
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!project) return <div className="text-center py-20">المشروع غير موجود</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center gap-2 hover:bg-gray-200 transition-colors">
          <ArrowRight className="w-4 h-4" /> العودة للقائمة
        </Button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
          {/* في بداية الـ return قبل صورة المشروع */}
<div className="flex justify-between items-center mb-6">
    <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 hover:bg-gray-200 transition-colors">
        <ArrowRight className="w-4 h-4" /> العودة للقائمة
    </Button>
    
    {/* ضيفي زرار طلب الانضمام */}
    <Button onClick={handleRequestToJoin} className="bg-green-600 hover:bg-green-700 flex gap-2 shadow-md">
        <UserPlus className="w-4 h-4" /> طلب انضمام للمشروع
    </Button>
</div>

          {/* صورة المشروع */}
          <div className="h-64 md:h-96 w-full relative group">
             <img 
               src={project.image ? `http://127.0.0.1:8000${project.image}` : projectImage1} 
               alt={project.title} 
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 right-8 text-white">
                <Badge className="bg-blue-600 text-sm py-1 px-3 mb-3 shadow-md">{project.category}</Badge>
                <h1 className="text-3xl md:text-5xl font-bold">{project.title}</h1>
            </div>
          </div>

          {/* التبويبات (Tabs) */}
          <div className="flex border-b px-8 bg-white sticky top-0 z-10">
            <button 
              onClick={() => setActiveTab('info')}
              className={`py-4 px-6 font-semibold transition-all duration-300 border-b-4 ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              تفاصيل المشروع
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`py-4 px-6 font-semibold flex items-center gap-2 transition-all duration-300 border-b-4 ${activeTab === 'team' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              فريق العمل <Badge className={`${activeTab === 'team' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{teamMembers.length}</Badge>
            </button>
          </div>

          <div className="p-8">
            {/* محتوى تبويب التفاصيل */}
            {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">{project.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* كروت الإحصائيات - كما هي في الكود القديم */}
                        <Card className="bg-blue-50 border-none hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-900">المرحلة الحالية</CardTitle>
                                <Activity className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent><div className="text-xl font-bold text-blue-700">{project.stage}</div></CardContent>
                        </Card>
                        <Card className="bg-green-50 border-none hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-900">الميزانية المطلوبة</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent><div className="text-xl font-bold text-green-700">{Number(project.budget_needed).toLocaleString()} ج.م</div></CardContent>
                        </Card>
                        <Card className="bg-purple-50 border-none hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-900">نسبة الإنجاز</CardTitle>
                                <Target className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent><div className="text-xl font-bold text-purple-700">{project.progress_percentage || 0}%</div></CardContent>
                        </Card>
                        <Card className="bg-orange-50 border-none hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-orange-900">تاريخ البدء</CardTitle>
                                <Calendar className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent><div className="text-xl font-bold text-orange-700">{project.created_at ? project.created_at.split('T')[0] : 'غير محدد'}</div></CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* محتوى تبويب الفريق */}
            {activeTab === 'team' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-blue-600" /> أعضاء الفريق</h2>
                        <Button onClick={() => setIsInviteModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 flex gap-2">
                            <UserPlus className="w-4 h-4" /> دعوة عضو
                        </Button>
                    </div>

                    {teamMembers.length === 0 ? (
                        <div className="bg-gray-50 p-12 rounded-xl border-2 border-dashed border-gray-300 text-center">
                            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><Users className="w-8 h-8" /></div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">الفريق فارغ حالياً</h3>
                            <p className="text-gray-500 mb-6">قم بدعوة زملائك للانضمام إلى مشروعك والبدء في العمل.</p>
                            <Button onClick={() => setIsInviteModalOpen(true)} variant="outline">إرسال أول دعوة</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamMembers.map((member) => (
                                <Card key={member.id} className="hover:shadow-md transition-all border-gray-100">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex justify-center items-center overflow-hidden border">
                                                {member.image ? <img src={`http://127.0.0.1:8000${member.image}`} alt={member.Name} className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-blue-600">{member.Name.charAt(0)}</span>}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{member.Name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Mail className="w-3 h-3" /> {member.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="flex gap-1 items-center bg-gray-50"><Shield className="w-3 h-3" /> {member.role}</Badge>
                                                <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}>
                                                    {member.status === 'active' ? 'نشط' : 'قيد الانتظار'}
                                                </Badge>
                                            </div>
                                            {/* زرار الحذف - يظهر فقط لو مش الليدر (حسب اللوجيك بتاعك) */}
                                            {member.role !== 'Leader' && (
                                                <button onClick={() => handleDeleteMember(member.id)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 p-1 transition-colors">
                                                    <Trash2 className="w-4 h-4" /> إزالة
                                                </button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* المودال التفاعلي الخاص بدعوة الأعضاء */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-600"/> دعوة عضو جديد</h3>
                <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleInvite} className="p-6 space-y-4">
                {inviteMessage.text && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${inviteMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {inviteMessage.text}
                    </div>
                )}
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">البريد الإلكتروني للعضو</label>
                    <div className="relative">
                        <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <Input 
                            type="email" 
                            required 
                            placeholder="user@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="pr-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">الدور في المشروع</label>
                    <select 
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                        <option value="Member">عضو (Member)</option>
                        <option value="Developer">مطور (Developer)</option>
                        <option value="Designer">مصمم (Designer)</option>
                        <option value="Marketing">تسويق (Marketing)</option>
                    </select>
                </div>

                <div className="pt-4 flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)} className="flex-1">إلغاء</Button>
                    <Button type="submit" disabled={isInviting || !inviteEmail} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        {isInviting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> جاري الإرسال...</> : 'إرسال الدعوة'}
                    </Button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

