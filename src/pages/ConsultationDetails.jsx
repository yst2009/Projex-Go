import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getConsultationDetails, acceptConsultation, scheduleConsultation } from '../services/consultationService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const ConsultationDetails = () => {
  const { id } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await getConsultationDetails(id);
      setConsultation(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptConsultation(id);
      alert('تم قبول الاستشارة');
      fetchDetails();
    } catch (err) {
      alert('حدث خطأ');
    }
  };

  const handleSchedule = async () => {
    const date = prompt("أدخل تاريخ ووقت الميتنج (مثال: 2026-03-20 14:00)");
    const link = prompt("أدخل رابط الميتنج (Zoom/Meet)");
    if(date && link) {
        try {
            await scheduleConsultation(id, date, link);
            alert('تم جدولة الميتنج');
            fetchDetails();
        } catch (err) {
            alert('حدث خطأ في الجدولة');
        }
    }
  }

  if (loading) return <div className="text-center py-10" dir="rtl">جاري التحميل...</div>;
  if (!consultation) return <div className="text-center py-10" dir="rtl">لم يتم العثور على الاستشارة</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">تفاصيل الاستشارة</CardTitle>
            <Badge className={consultation.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}>
              {consultation.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div><span className="font-bold">المجال / الموضوع:</span> {consultation.field}</div>
            <div><span className="font-bold">تاريخ الميتنج:</span> {consultation.scheduled_at || 'لم يحدد بعد'}</div>
            <div className="col-span-2">
              <span className="font-bold">رابط الميتنج: </span> 
              {consultation.meeting_link ? <a href={consultation.meeting_link} className="text-blue-600 underline" target="_blank" rel="noreferrer">انقر هنا للدخول</a> : 'لا يوجد رابط بعد'}
            </div>
            {consultation.professor_notes && (
              <div className="col-span-2 bg-gray-100 p-3 rounded">
                <span className="font-bold">ملاحظات الخبير:</span> {consultation.professor_notes}
              </div>
            )}
          </div>

          <div className="pt-6 flex gap-3 border-t mt-4">
             {consultation.status === 'pending' && (
                 <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700">قبول الاستشارة</Button>
             )}
             {consultation.status === 'approved' && (
                 <Button onClick={handleSchedule} className="bg-blue-600 hover:bg-blue-700">تحديد موعد ورابط الميتنج</Button>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationDetails;
