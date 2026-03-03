import React, { useState } from "react";

const WriterRequest = () => {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: تنفيذ منطق إرسال الطلب إلى الأدمن (مثلاً API أو قاعدة البيانات)
    setSent(true);
    setMessage("تم إرسال طلبك بنجاح! سيتم التواصل معك قريبًا.");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">طلب تحويل الحساب إلى كاتب</h2>
      <p className="mb-4 text-muted-foreground">يمكنك طلب تحويل حسابك إلى كاتب ليتمكن الأدمن من مراجعة طلبك.</p>
      {sent ? (
        <div className="text-green-600 text-center">{message}</div>
      ) : (
        <form onSubmit={handleRequest} className="space-y-4">
          <button type="submit" className="btn btn-primary w-full">إرسال الطلب</button>
        </form>
      )}
    </div>
  );
};

export default WriterRequest;
