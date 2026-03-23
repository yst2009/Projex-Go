import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User, Mail, Briefcase, Link as LinkIcon, Edit2, Save, X, Camera } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null); 

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/profile');
      setProfile(res.data.profile);
      setFormData({
        name: res.data.profile.user.name,
        skills: res.data.profile.skills || '',
        bio_detailed: res.data.profile.bio_detailed || '',
        portfolio_link: res.data.profile.portfolio_link || '',
        linkedin_url: res.data.profile.linkedin_url || ''
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('skills', formData.skills);
      data.append('bio_detailed', formData.bio_detailed);
      data.append('portfolio_link', formData.portfolio_link);
      data.append('linkedin_url', formData.linkedin_url);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await apiClient.post('/profile/update', data);
      
      setProfile(res.data.profile);
      setIsEditing(false);
      setImageFile(null); 
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('حدث خطأ أثناء التحديث');
    }
  };

  if (loading) return <div className="text-center py-20">جاري تحميل الملف الشخصي...</div>;

  const displayImage = previewImage 
    ? previewImage 
    : (profile?.image ? `http://127.0.0.1:8000${profile.image}` : null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 relative"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">

              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md flex items-center justify-center overflow-hidden">
                   {displayImage ? (
                     <img src={displayImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
                        {profile?.user?.name?.charAt(0).toUpperCase()}
                     </div>
                   )}
                </div>

                {isEditing && (
                  <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md">
                    <Camera className="w-4 h-4" />
                    <input 
                      id="profile-image-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </label>
                )}
              </div>

              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4" /> تعديل الملف
                </Button>
              ) : (
                <div className="flex gap-2">
                   <Button onClick={() => { setIsEditing(false); setPreviewImage(null); }} variant="ghost" className="text-red-600">
                     <X className="w-4 h-4" /> إلغاء
                   </Button>
                   <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                     <Save className="w-4 h-4 mr-2" /> حفظ
                   </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">الاسم بالكامل</label>
                  {isEditing ? (
                    <Input name="name" value={formData.name} onChange={handleChange} />
                  ) : (
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      {profile?.user?.name}
                    </h2>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">البريد الإلكتروني</label>
                  <div className="flex items-center gap-2 text-lg text-gray-700">
                    <Mail className="w-5 h-5 text-gray-400" />
                    {profile?.user?.email}
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    المهارات والنبذة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">المهارات</label>
                    {isEditing ? (
                      <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Laravel, Python..." />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile?.skills ? (
                          profile.skills.split(',').map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">لا توجد مهارات مسجلة</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">نبذة عني</label>
                    {isEditing ? (
                      <textarea 
                        name="bio_detailed" 
                        value={formData.bio_detailed} 
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        rows="3"
                        placeholder="اكتب نبذة مختصرة عنك..."
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {profile?.bio_detailed || 'لا توجد نبذة مسجلة'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LinkIcon className="w-5 h-5 text-green-600" />
                    روابط التواصل
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                   <div>
                      <label className="text-sm font-medium mb-1 block">Portfolio / GitHub</label>
                      {isEditing ? (
                        <Input name="portfolio_link" value={formData.portfolio_link} onChange={handleChange} />
                      ) : (
                        <a href={profile?.portfolio_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">
                          {profile?.portfolio_link || '-'}
                        </a>
                      )}
                   </div>
                   <div>
                      <label className="text-sm font-medium mb-1 block">LinkedIn</label>
                      {isEditing ? (
                        <Input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                      ) : (
                        <a href={profile?.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">
                          {profile?.linkedin_url || '-'}
                        </a>
                      )}
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
