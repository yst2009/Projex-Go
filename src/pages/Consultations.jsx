import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, CalendarCheck } from 'lucide-react';

const Consultations = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await apiClient.get('/profile/search?type=professor'); 
        setExperts(res.data.users || []); 
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

 const handleBook = async (expertId) => {
  const topic = prompt("ما هو موضوع الاستشارة؟");
  if (!topic) return;
  
  try {
      await apiClient.post('/consultations/store', {
          professor_id: expertId, 
          field: topic 
      });
      alert("تم إرسال طلب الاستشارة بنجاح!");
  } catch (err) {
      alert("حدث خطأ أثناء الحجز");
  }
};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">الاستشارات الأكاديمية</h1>
        <p className="text-gray-600">احجز موعد مع نخبة من أساتذة الجامعات والخبراء</p>
      </div>

      {loading ? (
          <div className="text-center">جاري التحميل...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {experts.length > 0 ? experts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
                    {expert.name[0]}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{expert.name}</CardTitle>
                    <p className="text-blue-600 font-medium">أستاذ جامعي</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleBook(expert.id)} className="w-full mt-4">
                    <CalendarCheck className="ml-2 w-4 h-4" />
                    احجز استشارة
                </Button>
              </CardContent>
            </Card>
          )) : (
              <p className="text-center text-gray-500">لا يوجد خبراء متاحين حالياً</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Consultations;
