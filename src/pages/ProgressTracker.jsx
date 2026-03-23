import React, { useState, useEffect } from 'react';
import { showProgress } from '../services/mentorshipService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ProgressTracker = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await showProgress();
      setProgressData(res.data.details);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20" dir="rtl">جاري تحميل التحديثات...</div>;
  if (!progressData) return <div className="text-center py-20 text-gray-500" dir="rtl">لا توجد بيانات تقدم حالية.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">متابعة تقدم التوجيه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="text-sm text-gray-500">اسم المنتور</p>
              <p className="font-semibold text-lg">{progressData.mentor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">اسم المشروع</p>
              <p className="font-semibold text-lg">{progressData.project_title}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-blue-700">نسبة الإنجاز</span>
              <span className="text-sm font-medium text-blue-700">{progressData.progress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: progressData.progress }}></div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <p>تاريخ البداية: {progressData.start}</p>
            <p>تاريخ النهاية: {progressData.end}</p>
            <p>الحالة: <span className="font-bold text-gray-800">{progressData.status}</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
