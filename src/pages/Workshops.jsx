import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { enrollInWorkshop } from '../api/workshopService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Calendar, MapPin, Clock, Users, Plus, X, Info } from 'lucide-react';
import workshopImage1 from '../assets/DkBdQP8Q1ghn.png';
import CreateWorkshop from './CreateWorkshop';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false); 
  const [userType, setUserType] = useState(''); 
  const [selectedWorkshop, setSelectedWorkshop] = useState(null); 

  useEffect(() => {
    fetchUserData();
    fetchWorkshops();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await apiClient.get('/profile');
      setUserType(res.data.profile.user.user_type);
    } catch (err) { console.error(err); }
  };

  const fetchWorkshops = async () => {
    try {
      const res = await apiClient.post('/workshops');
      setWorkshops(res.data.workshops || []);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (id) => {
    try {
      await enrollInWorkshop(id);
      alert('تم التسجيل في الورشة بنجاح!');
      setSelectedWorkshop(null); 
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
    }
  };

  if (showCreate) {
    return <CreateWorkshop onBack={() => setShowCreate(false)} onCreated={() => {
        setShowCreate(false);
        fetchWorkshops(); 
    }} />;
  }

  const filteredWorkshops = workshops.filter(workshop => 
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allowedTypes = ['professor', 'mentor', 'investor'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto relative">
 
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ورش العمل</h1>
            <p className="text-gray-600">طور مهاراتك من خلال ورش عمل عملية وتفاعلية</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            {allowedTypes.includes(userType) && (
                <Button onClick={() => setShowCreate(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 ml-2" /> إضافة ورشة
                </Button>
            )}

            <div className="relative flex-1 md:w-80">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="ابحث عن ورشة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">جاري تحميل الورش...</div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="text-center py-20 text-gray-500">لا توجد ورش متاحة حالياً.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="h-48 relative">
                   <img src={workshopImage1} alt={workshop.title} className="w-full h-full object-cover" />
                   <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
                      {workshop.price > 0 ? `${workshop.price} ج.م` : 'مجاني'}
                   </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{workshop.title}</CardTitle>
                  <p className="text-sm text-gray-500">{workshop.category}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /><span>{workshop.date || 'تاريخ غير محدد'}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /><span>{workshop.duration || 'المدة غير محددة'}</span></div>
                    
                    <div className="flex gap-2 mt-4">
 
                      <Button onClick={() => setSelectedWorkshop(workshop)} variant="outline" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50">
                        <Info className="w-4 h-4 ml-1" /> التفاصيل
                      </Button>
                      <Button onClick={() => handleEnroll(workshop.id)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        سجل الآن
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedWorkshop && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button onClick={() => setSelectedWorkshop(null)} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="h-48 w-full"><img src={workshopImage1} className="w-full h-full object-cover" alt="Workshop cover" /></div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedWorkshop.title}</h2>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">{selectedWorkshop.category}</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">{selectedWorkshop.price > 0 ? `${selectedWorkshop.price} ج.م` : 'مجاني'}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl text-sm">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500"/> {selectedWorkshop.date || 'غير محدد'}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500"/> {selectedWorkshop.time || 'غير محدد'} ({selectedWorkshop.duration})</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500"/> {selectedWorkshop.location || 'أونلاين'}</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500"/> السعة: {selectedWorkshop.capacity || 'مفتوح'} متدرب</div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">وصف الورشة</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedWorkshop.description || 'لا يوجد وصف متاح لهذه الورشة حالياً.'}</p>
                </div>

                <Button onClick={() => handleEnroll(selectedWorkshop.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  تأكيد التسجيل في الورشة
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Workshops;