import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Trophy, Calendar, ExternalLink, Plus, X, Upload } from 'lucide-react';
import challengeImage1 from '../assets/zF1aSZz6eXNy.jpg';
import CreateChallenge from './CreateChallenge'; 

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [userType, setUserType] = useState(''); 
  
  const [submitModalOpen, setSubmitModalOpen] = useState(null); 
  const [submissionData, setSubmissionData] = useState({ url: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchChallenges();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await apiClient.get('/profile');
      setUserType(res.data.profile.user.user_type);
    } catch (err) { console.error(err); }
  };

  const fetchChallenges = async () => {
    try {
      const res = await apiClient.post('/challenges');
      setChallenges(res.data.challenges || []);
    } catch (err) {
       console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post(`/challenges/submit/${submitModalOpen}`, {
          submission_url: submissionData.url,
          description: submissionData.description
      });
      alert('تم تقديم الحل بنجاح!');
      setSubmitModalOpen(null);
      setSubmissionData({ url: '', description: '' });
      fetchChallenges(); 
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء التقديم.');
    } finally {
      setSubmitting(false);
    }
  };

  if (showCreate) {
    return <CreateChallenge onBack={() => setShowCreate(false)} onCreated={() => {
        setShowCreate(false);
        fetchChallenges();
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto relative">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التحديات والمسابقات</h1>
            <p className="text-gray-600">شارك في تحديات الشركات واربح جوائز قيمة</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {userType === 'investor' && (
                <Button onClick={() => setShowCreate(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 ml-2" /> إطلاق تحدي
                </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">جاري تحميل التحديات...</div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-20 text-gray-500">لا توجد تحديات متاحة حالياً.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 relative">
                   <img src={challengeImage1} alt={challenge.title} className="w-full h-full object-cover" />
                   <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                      <Trophy className="w-4 h-4" /> {challenge.budget} ج.م
                   </div>

                   <div className="absolute top-3 left-3 bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-bold shadow-sm">
                      {challenge.submissions_count || 0} مشارك
                   </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  <p className="text-sm text-gray-500 line-clamp-2">{challenge.description}</p>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-red-500" />
                           <span>انتهاء: {challenge.deadline}</span>
                        </div>
                        <div className={`font-bold ${challenge.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                           {challenge.status === 'active' ? 'مفتوح' : 'مغلق'}
                        </div>
                    </div>

                    <Button 
                        onClick={() => setSubmitModalOpen(challenge.id)} 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={challenge.status !== 'active'}
                    >
                      {challenge.status === 'active' ? 'شارك وقدّم حلك' : 'انتهى التحدي'}
                      <Upload className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {submitModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
              <button onClick={() => setSubmitModalOpen(null)} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700">
                 <Upload className="w-6 h-6" /> تقديم الحل
              </h2>
              
              <form onSubmit={handleSubmitSolution} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">رابط الحل (GitHub / Drive)</label>
                    <Input 
                       type="url" 
                       required 
                       placeholder="https://github.com/..." 
                       value={submissionData.url}
                       onChange={(e) => setSubmissionData({...submissionData, url: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">وصف مختصر للحل</label>
                    <textarea 
                       required 
                       rows="4" 
                       className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none"
                       placeholder="اشرح فكرة حلك والتقنيات المستخدمة..."
                       value={submissionData.description}
                       onChange={(e) => setSubmissionData({...submissionData, description: e.target.value})}
                    />
                 </div>
                 <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 mt-2" disabled={submitting}>
                    {submitting ? 'جاري الإرسال...' : 'تأكيد الإرسال'}
                 </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Challenges;