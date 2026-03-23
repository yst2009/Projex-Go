import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, UserCheck, Briefcase } from 'lucide-react';
import mentorImage1 from '../assets/8JbIS6T0fP9W.jpg';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await apiClient.get('/mentors/list');
      setMentors(res.data.mentors);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.skills.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ابحث عن منتور</h1>
            <p className="text-gray-600">تواصل مع خبراء في مجالك لتطوير مهاراتك</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="ابحث بالاسم أو المهارة..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">جاري تحميل القائمة...</div>
        ) : filteredMentors.length === 0 ? (
          <div className="text-center py-20 text-gray-500">لا يوجد منتورز متاحين حالياً.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <img 
                    src={mentorImage1} 
                    alt={mentor.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" 
                  />
                  <div>
                    <CardTitle className="text-lg font-bold">{mentor.name}</CardTitle>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {mentor.bio ? mentor.bio.substring(0, 30) + '...' : 'منتور'}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills ? (
                        mentor.skills.split(',').map((skill, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">لا توجد مهارات مسجلة</span>
                      )}
                    </div>
                    
                    <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                      <UserCheck className="w-4 h-4 ml-2" />
                      طلب إرشاد
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;
