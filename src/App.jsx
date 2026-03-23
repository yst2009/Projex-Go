import apiClient from "./api/apiClient";
import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import Mentors from './pages/Mentors';
import Investors from './pages/Investors';
import Workshops from './pages/Workshops';
import Challenges from './pages/Challenges';
import Shop from './pages/Shop';
import Dashboard from './pages/Dashboard';
import Consultations from './pages/Consultations';
import Chat from './pages/Chat';
import { LayoutDashboard, MessageSquare } from 'lucide-react'; 
import { 
  Search, Star, Users, BookOpen, DollarSign, UserCheck, 
  Calendar, Trophy, Menu, X, ArrowRight, ChevronDown, 
  Heart, MessageCircle, Share2, ShoppingCart, LogOut 
} from 'lucide-react';

import logo from './assets/projexgo_logo.png';
import projectImage1 from './assets/Hb8UCHoolmtt.jpg'; 
import professorImage1 from './assets/Myq8GCmS3lri.jpg';
import professorImage2 from './assets/mmIX1h60Y2ju.jpg';
import investorImage1 from './assets/pP2iFtGwUEtq.png';
import investorImage2 from './assets/rky23Gkb2ANg.png';
import mentorImage1 from './assets/8JbIS6T0fP9W.jpg';
import mentorImage2 from './assets/1Zd9v2QwdBu1.jpg';
import workshopImage1 from './assets/DkBdQP8Q1ghn.png';
import workshopImage2 from './assets/yKm0eot5RQ4x.jpg';
import challengeImage1 from './assets/zF1aSZz6eXNy.jpg';
import challengeImage2 from './assets/KnxtGgfbZY0z.jpg';
import newPartImage1 from './assets/new_part_1.jpg'; 
import newPartImage2 from './assets/new_part_2.jpg'; 
import usedPartImage1 from './assets/used_part_1.jpg'; 
import usedPartImage2 from './assets/used_part_2.jpg'; 

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPage, setAuthPage] = useState('login'); 

  const [projects, setProjects] = useState([]); 
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const [userAvatar, setUserAvatar] = useState(null);



  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
    
      apiClient.get("/projects")
        .then((res) => {
          console.log("Projects loaded:", res.data);
          if (res.data.projects) {
             setProjects(res.data.projects);
          } else {
             setProjects(Array.isArray(res.data) ? res.data : []);
          }
        })
        .catch((err) => {
          console.error("API Error (Projects):", err);
        });

      apiClient.get('/profile')
        .then(res => {
           const imgPath = res.data.profile.image;
           if (imgPath) {
              setUserAvatar(`http://127.0.0.1:8000${imgPath}`);
           }
        })
        .catch(err => {
           console.error("API Error (Profile Image):", err);
        });

    }
  }, [isLoggedIn]);


  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveSection('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    setIsLoggedIn(false);
    setActiveSection('home');
  };

    const navigation = [
    { id: 'home', label: 'الرئيسية', icon: null },
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard }, 
    { id: 'projects', label: 'المشاريع', icon: BookOpen },
    { id: 'professors', label: 'الاستشارات', icon: Users }, 
    { id: 'chat', label: 'الرسائل', icon: MessageSquare }, 
    { id: 'investors', label: 'المستثمرون', icon: DollarSign },
    { id: 'mentors', label: 'المنتورز', icon: UserCheck },
    { id: 'workshops', label: 'ورش العمل', icon: Calendar },
    { id: 'challenges', label: 'التحديات', icon: Trophy },
    { id: 'shop', label: 'المتجر الإلكتروني', icon: ShoppingCart },
    { id: 'profile', label: 'الملف الشخصي', icon: UserCheck }
  ];


  const professors = [
    { id: 1, name: 'د. أحمد السيد', title: 'أستاذ هندسة البرمجيات', university: 'جامعة القاهرة', specialization: 'الذكاء الاصطناعي، تطوير البرمجيات', rating: 4.9, image: professorImage1, consultations: 150 },
    { id: 2, name: 'د. فاطمة محمد', title: 'أستاذة إدارة الأعمال', university: 'الجامعة الأمريكية', specialization: 'ريادة الأعمال، التسويق الرقمي', rating: 4.7, image: professorImage2, consultations: 120 }
  ];

  const investors = [
    { id: 1, name: 'صندوق الابتكار المصري', type: 'صندوق استثمار', focus: 'التكنولوجيا المالية، الذكاء الاصطناعي', funding: '50,000 - 500,000 جنيه', image: investorImage1, projects: 25 },
    { id: 2, name: 'شركة النيل للاستثمار', type: 'شركة استثمار', focus: 'الطاقة المتجددة، التكنولوجيا الخضراء', funding: '100,000 - 1,000,000 جنيه', image: investorImage2, projects: 18 }
  ];

  const mentors = [
    { id: 1, name: 'محمد أحمد', title: 'مطور برمجيات أول', company: 'شركة تك إيجيبت', specialization: 'تطوير الويب، React.js', experience: '5 سنوات', image: mentorImage1, sessions: 80 },
    { id: 2, name: 'سارة محمود', title: 'مديرة منتجات', company: 'ستارت أب هب', specialization: 'إدارة المنتجات، UX/UI', experience: '7 سنوات', image: mentorImage2, sessions: 65 }
  ];

  const workshops = [
    { id: 1, title: 'ورشة تطوير المشاريع التقنية', date: '15 يناير 2025', time: '10:00 ص - 4:00 م', location: 'جامعة القاهرة', organizer: 'مركز الابتكار التقني', price: 'مجاني', image: workshopImage1, attendees: 45 },
    { id: 2, title: 'ورشة ريادة الأعمال للطلاب', date: '22 يناير 2025', time: '2:00 م - 6:00 م', location: 'الجامعة الأمريكية', organizer: 'مركز ريادة الأعمال', price: '200 جنيه', image: workshopImage2, attendees: 30 }
  ];

  const challenges = [
    { id: 1, title: 'تحدي الذكاء الاصطناعي في التعليم', company: 'شركة إديوتك', description: 'تطوير حلول ذكية لتحسين التعليم الرقمي', deadline: '30 يناير 2025', prize: '50,000 جنيه', image: challengeImage1, participants: 120 },
    { id: 2, title: 'تحدي الحلول البيئية المستدامة', company: 'مؤسسة البيئة الخضراء', description: 'ابتكار حلول للمشاكل البيئية المحلية', deadline: '15 فبراير 2025', prize: '75,000 جنيه', image: challengeImage2, participants: 85 }
  ];

  const newParts = [
    { id: 1, name: 'متحكم Arduino Uno R3 أصلي', description: 'أشهر متحكم دقيق للمبتدئين والمحترفين، مثالي للمشاريع الإلكترونية.', price: '850', image: newPartImage1, stock: 15 },
    { id: 2, name: 'مجموعة مستشعرات كاملة (37 قطعة)', description: 'مجموعة متكاملة تحتوي على 37 مستشعرًا مختلفًا لمشاريع إنترنت الأشياء.', price: '1200', image: newPartImage2, stock: 8 }
  ];

  const usedParts = [
    { id: 1, name: 'محرك سيرفو SG90 (مستعمل)', description: 'محرك سيرفو صغير الحجم تم استخدامه في مشروع سابق، يعمل بكفاءة.', price: '75', image: usedPartImage1, condition: 'جيد جدًا' },
    { id: 2, name: 'شاشة LCD 16x2 (مستعملة)', description: 'شاشة عرض نصوص بحالة ممتازة، مناسبة لعرض البيانات في المشاريع.', price: '100', image: usedPartImage2, condition: 'ممتاز' }
  ];

  const renderStars = (rating) => {
    const validRating = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(validRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderHome = () => (
    <div className="space-y-16">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-6 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            مرحباً بك في <span className="text-yellow-400">ProjexGo</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            المنصة الشاملة التي تربط الطلاب والخريجين بأساتذة الجامعات والمستثمرين والمنتورز
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg">
              ابدأ رحلتك الآن
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 text-lg">
              اكتشف المشاريع
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">لماذا ProjexGo؟</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نوفر بيئة متكاملة لتحويل أفكارك المبتكرة إلى مشاريع قابلة للتنفيذ والتمويل
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: BookOpen, title: 'عرض المشاريع', description: 'اعرض مشروعك واحصل على تقييمات وتعليقات من الخبراء' },
            { icon: Users, title: 'استشارات الأساتذة', description: 'احجز مواعيد مع أساتذة الجامعات للحصول على الإرشاد الأكاديمي' },
            { icon: DollarSign, title: 'فرص التمويل', description: 'تواصل مع المستثمرين والشركات للحصول على التمويل المناسب' },
            { icon: UserCheck, title: 'الإرشاد العملي', description: 'احصل على إرشاد عملي من منتورز متخصصين في مجالك' },
            { icon: Calendar, title: 'ورش العمل', description: 'شارك في ورش تدريبية متخصصة لتطوير مهاراتك' },
            { icon: Trophy, title: 'التحديات', description: 'شارك في تحديات الشركات واربح جوائز قيمة' }
          ].map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 rounded-3xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">إحصائيات المنصة</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'مشروع مبتكر' },
              { number: '200+', label: 'أستاذ جامعي' },
              { number: '50+', label: 'مستثمر' },
              { number: '1000+', label: 'طالب مستفيد' }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

     const renderProjects = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-4xl font-bold mb-2">المشاريع</h1>
          <p className="text-gray-600">اكتشف المشاريع المبتكرة من الطلاب والخريجين</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

          <Button 
            onClick={() => setShowCreateProject(true)} 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            + أضف مشروعك
          </Button>

          <div className="relative flex-1 md:w-80">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="ابحث في المشاريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          <Button variant="outline">
            تصفية
            <ChevronDown className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
           <p className="text-xl text-gray-500">لا توجد مشاريع متاحة حالياً.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <img 
  src={project.image ? `http://127.0.0.1:8000${project.image}` : projectImage1} 
  alt={project.title} 
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
/>

                <Badge className="absolute top-3 right-3 bg-blue-600">
                    {project.category || 'عام'}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{project.rating || 0}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <CardDescription className="text-sm">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{Array.isArray(project.team) ? project.team.join(', ') : (project.team || 'فريق العمل')}</span>
                  </div>
                  <div className="text-sm text-gray-600">{project.university || 'جامعة غير محددة'}</div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="p-2"><Heart className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="p-2"><MessageCircle className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="p-2"><Share2 className="w-4 h-4" /></Button>
                    </div>
                    <Button size="sm" onClick={() => setSelectedProjectId(project.id)}>
                        عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfessors = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">الأساتذة</h1>
        <p className="text-gray-600">تواصل مع أساتذة الجامعات والخبراء للحصول على الاستشارة</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {professors.map((professor) => (
          <Card key={professor.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img src={professor.image} alt={professor.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <CardTitle className="text-xl">{professor.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{professor.title}</p>
                  <p className="text-gray-600 text-sm">{professor.university}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{professor.rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">مجالات الخبرة:</h4>
                  <p className="text-gray-600 text-sm">{professor.specialization}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{professor.consultations} استشارة</span>
                  <Badge variant="secondary">متاح</Badge>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">احجز استشارة</Button>
                  <Button variant="outline">عرض الملف</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">المستثمرون</h1>
        <p className="text-gray-600">تواصل مع المستثمرين والشركات للحصول على التمويل</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {investors.map((investor) => (
          <Card key={investor.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img src={investor.image} alt={investor.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <CardTitle className="text-xl">{investor.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{investor.type}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">مجالات الاهتمام:</h4>
                  <p className="text-gray-600 text-sm">{investor.focus}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">نطاق التمويل:</h4>
                  <p className="text-green-600 font-medium">{investor.funding}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{investor.projects} مشروع ممول</span>
                  <Badge variant="secondary">يقبل طلبات</Badge>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">تقدم بطلب</Button>
                  <Button variant="outline">عرض الملف</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMentors = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">المنتورز</h1>
        <p className="text-gray-600">احصل على إرشاد عملي من خبراء في مجالك</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <CardTitle className="text-xl">{mentor.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{mentor.title}</p>
                  <p className="text-gray-600 text-sm">{mentor.company}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">التخصص:</h4>
                  <p className="text-gray-600 text-sm">{mentor.specialization}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>خبرة {mentor.experience}</span>
                  <span>{mentor.sessions} جلسة إرشاد</span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">احجز جلسة</Button>
                  <Button variant="outline">عرض الملف</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWorkshops = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">ورش العمل</h1>
        <p className="text-gray-600">شارك في ورش تدريبية متخصصة لتطوير مهاراتك</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img src={workshop.image} alt={workshop.title} className="w-full h-48 object-cover" />
              <Badge className="absolute top-3 right-3 bg-green-600">{workshop.price}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{workshop.title}</CardTitle>
              <p className="text-blue-600 font-medium">{workshop.organizer}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{workshop.date} - {workshop.time}</span>
                </div>
                <div className="text-sm text-gray-600">{workshop.location}</div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{workshop.attendees} مشارك</span>
                  <Badge variant="secondary">متاح</Badge>
                </div>
                <Button className="w-full">سجل الآن</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">التحديات</h1>
        <p className="text-gray-600">شارك في تحديات الشركات واربح جوائز قيمة</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img src={challenge.image} alt={challenge.title} className="w-full h-48 object-cover" />
              <Badge className="absolute top-3 right-3 bg-purple-600">{challenge.prize}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{challenge.title}</CardTitle>
              <p className="text-blue-600 font-medium">{challenge.company}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{challenge.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>الموعد النهائي: {challenge.deadline}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{challenge.participants} مشارك</span>
                  <Badge variant="secondary">مفتوح</Badge>
                </div>
                <Button className="w-full">شارك الآن</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOnlineShop = () => (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">المتجر الإلكتروني</h1>
        <p className="text-gray-600">تصفح وشراء قطع الغيار الجديدة والمستعملة لمشاريعك.</p>
      </div>

      <section>
        <h2 className="text-3xl font-bold mb-6 border-r-4 border-blue-600 pr-4">قطع غيار جديدة</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newParts.map((part) => (
            <Card key={part.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <img src={part.image} alt={part.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <Badge className="absolute top-3 right-3 bg-blue-600">{part.price} جنيه</Badge>
              </div>
              <CardHeader>
                <CardTitle>{part.name}</CardTitle>
                <CardDescription>{part.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>المخزون: {part.stock} قطعة</span>
                  <Badge variant="secondary">جديد</Badge>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="ml-2 h-4 w-4" />
                  أضف للسلة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 border-r-4 border-yellow-500 pr-4">قطع غيار مستعملة</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usedParts.map((part) => (
            <Card key={part.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <img src={part.image} alt={part.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <Badge className="absolute top-3 right-3 bg-yellow-500">{part.price} جنيه</Badge>
              </div>
              <CardHeader>
                <CardTitle>{part.name}</CardTitle>
                <CardDescription>{part.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>الحالة: {part.condition}</span>
                  <Badge variant="outline">مستعمل</Badge>
                </div>
                <Button className="w-full mt-4">
                  <ShoppingCart className="ml-2 h-4 w-4" />
                  أضف للسلة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

 const renderContent = () => {
 if (showCreateProject) {
      return (
        <CreateProject 
          onBack={() => setShowCreateProject(false)} 
          onProjectCreated={() => {
            setShowCreateProject(false);
            window.location.reload(); 
          }} 
        />
      );
    }

  if (selectedProjectId) {
     return <ProjectDetails id={selectedProjectId} onBack={() => setSelectedProjectId(null)} />;
  }

  switch (activeSection) {
      case 'home': return renderHome();
      case 'dashboard': return <Dashboard />; 
      case 'projects': return renderProjects();
      case 'professors': return <Consultations />; 
      case 'chat': return <Chat />;
      case 'investors': return <Investors />;
      case 'mentors': return <Mentors />;
      case 'workshops': return <Workshops />;
      case 'challenges': return <Challenges />;
      case 'shop': return <Shop />;
      case 'profile': return <Profile />;
      default: return renderHome();
    }
  };

  if (!isLoggedIn) {
    if (authPage === 'register') {
      return (
        <Register 
          onLoginSuccess={handleLoginSuccess} 
          onSwitchToLogin={() => setAuthPage('login')} 
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onSwitchToRegister={() => setAuthPage('register')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('home')}>
              <img src={logo} alt="ProjexGo" className="h-8 w-auto" />
              <span className="font-bold text-xl text-blue-900 hidden lg:block">ProjexGo</span>
            </div>

            <nav className="hidden md:flex items-center gap-1 mx-4 overflow-x-auto no-scrollbar">
              {navigation.map((item) => {
                if (item.id === 'profile') return null;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      activeSection === item.id 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
               <button 
                onClick={() => setActiveSection('profile')}
                className={`relative rounded-full border-2 transition-all overflow-hidden w-9 h-9 flex items-center justify-center
                  ${activeSection === 'profile' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-400'}
                `}
                title="الملف الشخصي"
              >
                {userAvatar ? (
                   <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <UserCheck className="w-5 h-5" />
                   </div>
                )}
              </button>

              <button 
                onClick={handleLogout} 
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="تسجيل خروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button className="p-2 text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {isMenuOpen && (
            <div className="md:hidden py-2 border-t bg-white px-4 pb-4 shadow-lg">
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-right w-full ${
                      activeSection === item.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.label}
                  </button>
                ))}
                <div className="border-t my-2"></div>
                <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 font-bold px-3 py-3 w-full hover:bg-red-50 rounded-lg">
                  <LogOut className="w-5 h-5" />
                  تسجيل خروج
                </button>
              </nav>
            </div>
          )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={logo} alt="ProjexGo" className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm">
                المنصة الشاملة التي تربط الطلاب والخريجين بأساتذة الجامعات والمستثمرين والمنتورز
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">الأقسام</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">المشاريع</a></li>
                <li><a href="#" className="hover:text-white">الأساتذة</a></li>
                <li><a href="#" className="hover:text-white">المستثمرون</a></li>
                <li><a href="#" className="hover:text-white">المنتورز</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">الخدمات</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">ورش العمل</a></li>
                <li><a href="#" className="hover:text-white">التحديات</a></li>
                <li><a href="#" className="hover:text-white">الاستشارات</a></li>
                <li><a href="#" className="hover:text-white">التمويل</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">تواصل معنا</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@projexgo.com</li>
                <li>+20 123 456 7890</li>
                <li>القاهرة، مصر</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 ProjexGo. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

