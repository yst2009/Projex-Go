import { useState } from "react";
import ApiService from "../api";

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await ApiService.auth.login({
        email,
        password,
      });

      localStorage.setItem("ACCESS_TOKEN", res.data.token);
      if (onLoginSuccess) {
        onLoginSuccess();
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "البيانات غير صحيحة"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>تسجيل الدخول</h2>
        
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
        
        <button type="submit" disabled={loading} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          ليس لديك حساب؟ <span onClick={onSwitchToRegister} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}>أنشئ حساب جديد</span>
        </p>
        
        {error && <p style={{ color: "red", textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
