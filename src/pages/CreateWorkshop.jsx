import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowRight, Save } from 'lucide-react';

const CreateWorkshop = ({ onBack, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    date: '',
    time: '',
    location: '',
    duration: '',
    price: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/workshops/store', formData);
      alert('تم إنشاء الورشة بنجاح!');
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الإنشاء');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> إلغاء
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">إضافة ورشة عمل جديدة</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان الورشة</label>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">وصف الورشة</label>
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleChange} 
              rows="3"
              className="w-full p-2 border rounded-md"
              placeholder="اكتب وصفاً مختصراً للورشة..."
              required
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md">
                   <option value="technology">تكنولوجيا</option>
                   <option value="business">ريادة أعمال</option>
                   <option value="design">تصميم</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">السعر (0 للمجاني)</label>
                <Input type="number" name="price" value={formData.price} onChange={handleChange} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">التاريخ</label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">الوقت</label>
                <Input type="time" name="time" value={formData.time} onChange={handleChange} required />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">المدة (ساعات)</label>
                <Input name="duration" value={formData.duration} onChange={handleChange} placeholder="مثال: 3 ساعات" />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">العدد الأقصى</label>
                <Input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">المكان (أو رابط Zoom)</label>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-4" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'نشر الورشة'}
            <Save className="mr-2 w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkshop;
