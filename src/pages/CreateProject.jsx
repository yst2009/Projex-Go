import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowRight, Save, Upload, Image as ImageIcon } from 'lucide-react';

const CreateProject = ({ onBack, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    stage: 'idea',
    budget_needed: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('stage', formData.stage);
      data.append('budget_needed', formData.budget_needed);
      
      if (imageFile) {
        data.append('image', imageFile); 
      }

      await apiClient.post('/projects/create', data);
      
      if (onProjectCreated) onProjectCreated();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء المشروع');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          إلغاء والعودة
        </Button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">إضافة مشروع جديد</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleImageChange}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               <div className="flex flex-col items-center justify-center gap-2">
                  {imageFile ? (
                    <>
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-32 object-cover rounded-lg mb-2" />
                      <span className="text-green-600 font-medium">تم اختيار الصورة: {imageFile.name}</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                      <span className="text-gray-600">اضغط لرفع صورة للمشروع</span>
                      <span className="text-xs text-gray-400">(اختياري - PNG, JPG)</span>
                    </>
                  )}
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المشروع</label>
              <Input name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف المشروع</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                  <option value="technology">تكنولوجيا</option>
                  <option value="agriculture">زراعة</option>
                  <option value="education">تعليم</option>
                  <option value="health">صحة</option>
                  <option value="energy">طاقة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مرحلة المشروع</label>
                <select name="stage" value={formData.stage} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                  <option value="idea">فكرة (Idea)</option>
                  <option value="prototype">نموذج مبدئي (Prototype)</option>
                  <option value="mvp">MVP</option>
                  <option value="launch">تم الإطلاق</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الميزانية المطلوبة</label>
              <Input type="number" name="budget_needed" value={formData.budget_needed} onChange={handleChange} />
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" disabled={loading}>
              {loading ? 'جاري الرفع...' : 'إنشاء المشروع'}
              <Save className="mr-2 w-5 h-5" />
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
