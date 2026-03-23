import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowRight, Save, Image as ImageIcon } from 'lucide-react';

const CreateProduct = ({ onBack, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: 'used',
    contact_info: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('condition', formData.condition);
      data.append('contact_info', formData.contact_info);
      if (imageFile) {
        data.append('image', imageFile);
      }

      await apiClient.post('/shop/products', data);
      alert('تم إضافة المنتج للمتجر بنجاح!');
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الإضافة');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> إلغاء
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">بيع قطعة غيار</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleImageChange}
                 classNam="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                      <span className="text-gray-600">اضغط لرفع صورة المنتج</span>
                    </>
                  )}
               </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">اسم المنتج</label>
            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="مثال: Arduino Uno" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">وصف المنتج</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">السعر (جنيه)</label>
                <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">الحالة</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full p-2 border rounded-md bg-white">
                   <option value="new">جديد (New)</option>
                   <option value="used">مستعمل (Used)</option>
                </select>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">رقم للتواصل (WhatsApp)</label>
            <Input name="contact_info" value={formData.contact_info} onChange={handleChange} required placeholder="01xxxxxxxxx" />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-4" disabled={loading}>
            {loading ? 'جاري النشر...' : 'عرض للبيع'}
            <Save className="mr-2 w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
