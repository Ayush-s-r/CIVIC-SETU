import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // example POST — replace with your backend endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Network error");

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input required name="name" value={form.name} onChange={handleChange}
          className="w-full border rounded px-3 py-2" placeholder="Your name" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input required name="email" type="email" value={form.email} onChange={handleChange}
          className="w-full border rounded px-3 py-2" placeholder="you@example.com" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea required name="message" value={form.message} onChange={handleChange}
          className="w-full border rounded px-3 py-2" rows="5" placeholder="Your message" />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Send
        </button>
        {status === "sending" && <span className="text-sm text-gray-600">Sending...</span>}
        {status === "sent" && <span className="text-sm text-green-600">Sent! We'll reply soon.</span>}
        {status === "error" && <span className="text-sm text-red-600">Error sending. Try again.</span>}
      </div>
    </form>
  );
}
