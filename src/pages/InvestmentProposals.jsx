import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const InvestmentProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // هفترض إنك مخزن نوع اليوزر في الـ LocalStorage أو الـ Context
  const userType = localStorage.getItem('user_type'); // 'investor' أو 'user'

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      // الـ Endpoint ده هنضيفه في الباك إند حالاً
      const res = await apiClient.get('/investments/my-proposals');
      setProposals(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await apiClient.post(/investments/${action}/${id});
      alert(تم ${action === 'accept' ? 'قبول' : 'رفض'} العرض);
      fetchProposals(); // تحديث القائمة
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  if (loading) return <div className="text-center py-20 text-xl" dir="rtl">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">عروض الاستثمار</h1>
        
        {proposals.length === 0 ? (
          <div className="text-center text-gray-500 py-10">لا توجد عروض استثمار حالياً.</div>
        ) : (
          <div className="space-y-4">
            {proposals.map(proposal => (
              <Card key={proposal.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">مشروع رقم: {proposal.project_id}</h3>
                    <p className="text-gray-600">المبلغ: <span className="font-bold text-green-600">{proposal.amount} EGP</span></p>
                    <p className="text-gray-600">النسبة: {proposal.equity_offered}%</p>
                    <p className="text-sm mt-2">
                      الحالة: 
                      <span className={`mr-2 px-2 py-1 rounded text-white text-xs ${
                        proposal.status === 'accepted' ? 'bg-green-500' : 
                        proposal.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>
                        {proposal.status}
                      </span>
                    </p>
                  </div>

                  {/* زراير القبول والرفض تظهر للمستثمر فقط لو الحالة لسة proposed */}
                  {userType === 'investor' && proposal.status === 'proposed' && (
                    <div className="flex gap-2">
                      <Button onClick={() => handleAction(proposal.id, 'accept')} className="bg-green-600 hover:bg-green-700">
                        قبول
                      </Button>
                      <Button onClick={() => handleAction(proposal.id, 'reject')} variant="destructive">
                        رفض
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentProposals;