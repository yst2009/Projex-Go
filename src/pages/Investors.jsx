import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { proposeInvestment } from '../api/investmentService'; // تأكد إنك عاملها export
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, DollarSign, Briefcase, X } from 'lucide-react';

const Investors = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [formData, setFormData] = useState({
    project_id: '', // المفروض ده ييجي من قائمة مشاريع اليوزر، هنسيبه كـ input مؤقتاً أو Dropdown
    amount: '',
    equity_offered: ''
  });

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const res = await apiClient.post('/investors'); 
      setInvestors(res.data.investors);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const openModal = (investor) => {
    setSelectedInvestor(investor);
    setIsModalOpen(true);
  };

  const handlePropose = async (e) => {
    e.preventDefault();
    try {
      await proposeInvestment({
        investor_id: selectedInvestor.id,
        ...formData
      });
      alert('تم إرسال طلب التمويل بنجاح!');
      setIsModalOpen(false);
      setFormData({ project_id: '', amount: '', equity_offered: '' });
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إرسال الطلب');
    }
  };

  const filteredInvestors = investors.filter(investor => 
    investor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* الهيدر والبحث - نفس الكود بتاعك */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">المستثمرون</h1>
            <p className="text-gray-600">تواصل مع المستثمرين للحصول على تمويل لمشروعك</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="ابحث عن مستثمر..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
{/* قائمة المستثمرين */}
        {loading ? (
          <div className="text-center py-20">جاري تحميل القائمة...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestors.map((investor) => (
              <Card key={investor.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-xl">
                     {investor.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{investor.name}</CardTitle>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> مستثمر
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm h-12 overflow-hidden mb-4">
                     {investor.bio || 'مهتم بالاستثمار في المشاريع الناشئة والتكنولوجيا.'}
                  </p>
                  <Button onClick={() => openModal(investor)} className="w-full bg-green-600 hover:bg-green-700">
                    <DollarSign className="w-4 h-4 ml-2" /> عرض طلب تمويل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal طلب التمويل */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">طلب تمويل من {selectedInvestor?.name}</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-500 hover:text-red-500" /></button>
              </div>
              <form onSubmit={handlePropose} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">رقم المشروع (ID)</label>
                  <Input 
                    required 
                    type="number" 
                    value={formData.project_id} 
                    onChange={(e) => setFormData({...formData, project_id: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">المبلغ المطلوب (EGP)</label>
                  <Input 
                    required 
                    type="number" 
                    placeholder="مثال: 50000"
                    value={formData.amount} 
                    onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">النسبة المعروضة للمستثمر (%)</label>
                  <Input 
                    required 
                    type="number" 
                    placeholder="مثال: 15"
                    value={formData.equity_offered} 
                    onChange={(e) => setFormData({...formData, equity_offered: e.target.value})} 
                  />
                </div>
                <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  إرسال العرض
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Investors;
