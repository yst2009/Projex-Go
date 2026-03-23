import React, { useState } from 'react';
import { createMentorship } from '../services/mentorshipService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const CreateMentorship = () => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    goals: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createMentorship(formData);
      alert('تم إنشاء برنامج التوجيه بنجاح!');
      console.log(res.data);
    } catch (error) {
      console.error('Error creating mentorship', error);
      alert('حدث خطأ أثناء الإنشاء');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">إنشاء برنامج توجيه جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">تاريخ البداية</label>
              <Input 
                type="date" 
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">تاريخ النهاية</label>
              <Input 
                type="date" 
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">أهداف البرنامج</label>
              <Input 
                type="text" 
                placeholder="أدخل الأهداف (مثال: تعلم React, بناء مشروع)" 
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">ملاحظات إضافية</label>
              <Input 
                type="text" 
                placeholder="أضف أي ملاحظات" 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              حفظ البرنامج
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMentorship;