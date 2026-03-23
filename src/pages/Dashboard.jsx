import React, { useState, useEffect } from 'react';
import { getUserStats, getSystemStats } from '../api/dashboardService'; 
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Briefcase, DollarSign, Activity, MessageSquare, Bell, Folder } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, systemRes] = await Promise.all([
          getUserStats(),
          getSystemStats()
        ]);

        setUserStats(userRes.data?.data);
        setSystemStats(systemRes.data?.data);
      } catch (err) {
        console.error("خطأ في جلب الإحصائيات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6" dir="rtl">
 
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-r-4 border-blue-600 pr-3">إحصائياتي</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="مشاريعي" 
            value={userStats?.total_projects || 0} 
            icon={<Folder className="h-5 w-5 text-blue-600" />} 
            subtext={`${userStats?.team_members || 0} عضو في الفرق`} 
          />
          <StatCard 
            title="الاستثمارات المقبولة" 
            value={userStats?.total_investments || 0} 
            icon={<DollarSign className="h-5 w-5 text-green-600" />} 
            subtext="صفقات ناجحة" 
          />
          <StatCard 
            title="الاستشارات المكتملة" 
            value={userStats?.total_consultations || 0} 
            icon={<Activity className="h-5 w-5 text-purple-600" />} 
          />
          <StatCard 
            title="الرسائل غير المقروءة" 
            value={(userStats?.total_messages_received || 0) - (userStats?.total_messages_read || 0)} 
            icon={<MessageSquare className="h-5 w-5 text-orange-600" />} 
            subtext={`من أصل ${userStats?.total_messages_received || 0} رسالة`} 
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-r-4 border-purple-600 pr-3">نظرة عامة على المنصة</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="إجمالي المستخدمين" 
            value={systemStats?.users?.total_users || 0} 
            icon={<Users className="h-5 w-5 text-blue-600" />} 
            subtext={`+${systemStats?.users?.new_this_week || 0} هذا الأسبوع`} 
          />
          <StatCard 
            title="المشاريع النشطة" 
            value={systemStats?.projects?.active_projects || 0} 
            icon={<Briefcase className="h-5 w-5 text-green-600" />} 
            subtext={`من ${systemStats?.projects?.total_projects || 0} مشروع`} 
          />
          <StatCard 
            title="إجمالي التحديات" 
            value={systemStats?.challenges?.total_challenges || 0} 
            icon={<Activity className="h-5 w-5 text-red-600" />} 
          />
          <StatCard 
            title="ورش العمل المتاحة" 
            value={systemStats?.workshops?.total_workshops || 0} 
            icon={<Bell className="h-5 w-5 text-yellow-600" />} 
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-bold mb-4">نصائح سريعة</h3>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li className="flex items-center gap-2">✅ أكمل ملفك الشخصي لزيادة فرص الاستثمار.</li>
          <li className="flex items-center gap-2">✅ شارك في التحديات لإبراز مهاراتك.</li>
          <li className="flex items-center gap-2">✅ تواصل مع المرشدين (Mentors) للحصول على إرشادات.</li>
        </ul>
      </div>

    </div>
  );
};

const StatCard = ({ title, value, icon, subtext }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </CardContent>
  </Card>
);

export default Dashboard;