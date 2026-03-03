import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const UserSettings = () => {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: تنفيذ منطق تحديث البيانات (API)
    setMessage("تم حفظ التغييرات بنجاح (تجريبي)");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">إعدادات الحساب</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">الاسم الكامل</label>
          <input type="text" className="input w-full" value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">البريد الإلكتروني</label>
          <input type="email" className="input w-full" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">كلمة المرور الجديدة</label>
          <input type="password" className="input w-full" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary w-full">حفظ التغييرات</button>
        {message && <div className="text-green-600 text-center mt-2">{message}</div>}
      </form>
    </div>
  );
};

export default UserSettings;
