"use client";

import { useState } from "react";
import { send } from "@emailjs/browser";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/section/footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await send(
        "YOUR_SERVICE_ID", // replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // replace with your EmailJS template ID
        form,
        "YOUR_PUBLIC_KEY" // replace with your EmailJS public key
      );

      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Email sending error:", err);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white pb-20 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[150px]">
        <section className="max-w-3xl mx-auto px-6 py-32">
          <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
            Contact Us
          </h1>

          {submitted && (
            <p className="text-green-600 font-medium text-center mb-6">
              Your message has been sent!
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="bg-transparent text-black border border-gray-600 px-4 py-3 focus:outline-none focus:border-gray-400"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail *"
              value={form.email}
              onChange={handleChange}
              className="bg-transparent border text-black border-gray-600 px-4 py-3 focus:outline-none focus:border-gray-400"
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="bg-transparent border text-black border-gray-600 px-4 py-3 focus:outline-none focus:border-gray-400 md:col-span-2"
            />

            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              className="md:col-span-2 text-black bg-transparent border border-gray-600 px-4 py-3 resize-none focus:outline-none focus:border-gray-400"
              rows={6}
              required
            />

            <div className="md:col-span-2 flex justify-end pt-4">
              <button
                type="submit"
                className={`bg-[#b29b85] text-black px-6 py-2 text-sm tracking-wide transition ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#c7b39e]"
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
