import { useState } from "react";
import ApiService from "../api"; 

const Register = ({ onLoginSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [userType, setUserType] = useState("student");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== passwordConfirmation) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      const res = await ApiService.auth.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        user_type: userType 
      });

      localStorage.setItem("ACCESS_TOKEN", res.data.token);
      console.log("Register success:", res.data);

      if (onLoginSuccess) {
        onLoginSuccess();
      }

    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء التسجيل"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleRegister} style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>إنشاء حساب جديد</h2>
        
        <input type="text" placeholder="الاسم بالكامل" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
        
        <select 
          value={userType} 
          onChange={(e) => setUserType(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: 'white' }}
        >
          <option value="student">طالب</option>
          <option value="professor">أستاذ جامعي</option>
          <option value="investor">مستثمر</option>
          <option value="mentor">مينتور (Mentor)</option>
        </select>

        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
        <input type="password" placeholder="تأكيد كلمة المرور" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
        
        <button type="submit" disabled={loading} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
          {loading ? "جاري التسجيل..." : "تسجيل حساب"}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          لديك حساب بالفعل؟ <span onClick={onSwitchToLogin} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}>سجل دخول</span>
        </p>

        {error && <p style={{ color: "red", textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
