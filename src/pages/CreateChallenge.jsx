import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowRight, Save, Trophy } from 'lucide-react';

const CreateChallenge = ({ onBack, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
    requirements: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/challenges/store', formData);
      alert('تم إطلاق التحدي بنجاح!');
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
        
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
           <Trophy className="w-6 h-6 text-yellow-500" />
           إطلاق تحدي جديد
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان التحدي</label>
            <Input name="title" value={formData.title} onChange={handleChange} required placeholder="مثال: تحدي الروبوتات الذكية" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">وصف التحدي</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">الموعد النهائي</label>
                <Input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">قيمة الجائزة (جنيه)</label>
                <Input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">المتطلبات والشروط</label>
            <textarea 
              name="requirements" 
              value={formData.requirements} 
              onChange={handleChange} 
              rows="3"
              className="w-full p-2 border rounded-md"
              placeholder="مثال: استخدام لغة بايثون، تسليم الكود على GitHub..."
              required
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 mt-4" disabled={loading}>
            {loading ? 'جاري النشر...' : 'نشر التحدي'}
            <Save className="mr-2 w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateChallenge;
