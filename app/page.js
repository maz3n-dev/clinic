'use client'
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, MessageCircle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    supabase = null;
  }
}

const SAMPLE_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Amina El-Sayed',
    specialty: 'General Practitioner',
    photo: 'https://shahalam.avisena.com.my/wp-content/uploads/2023/01/dr-norwazilah-featured.jpg',
  },
  {
    id: '2',
    name: 'Dr. Karim Hassan',
    specialty: 'Dentistry',
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRznNrESBrBVS862UJcnvaotidvOk-9yu2q9vQHyyxAT9rp_cq1J6hCXCA2p0WB4-5ylyM&usqp=CAU',
  },
  {
    id: '3',
    name: 'Dr. Sara Mahmoud',
    specialty: 'Pediatrics',
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIppkeWu4A63k7_JWmzn2mcPeQAjki3w_8zw&s',
  },
  {
    id: '4',
    name: 'Dr. Youssef Ali',
    specialty: 'Dermatology',
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk94S6QF9_R-vYLMCXP9qrLpN9qrcQRxBIyw&s',
  },
  {
    id: '5',
    name: 'Dr. Layla Nasser',
    specialty: 'Cardiology',
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvIVQv4jeitdB1Tv2jGI7-UIQEvAn3Ffw3Xg4LVld6Qpy6xNG5wxCmni8p5qqmV6cfIaM&usqp=CAU',
  },
  {
    id: '6',
    name: 'Dr. Hossam Fahmy',
    specialty: 'Orthopedics',
    photo: 'https://souadkafafihospital.com/wp-content/uploads/2024/04/tamer-farouk.jpeg',
  },
  {
    id: '7',
    name: 'Dr. Mariam Tarek',
    specialty: 'Ophthalmology',
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7PaTrKMlhjnEPJbbr9MFTdDZnf-V8enQEA&s',
  },
];

export default function Page() {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ client_name: '', client_phone: '', date: '', time_slot: '', notes: '' });
  const [status, setStatus] = useState('');
  const [lastBooking, setLastBooking] = useState(null);
  const [whatsappStatus, setWhatsappStatus] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    async function load() {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('doctors').select('*').order('name');
          if (!error && data) setDoctors(data);
          else setDoctors(SAMPLE_DOCTORS);
        } catch (e) {
          setDoctors(SAMPLE_DOCTORS);
        }
      } else {
        setDoctors(SAMPLE_DOCTORS);
      }
    }
    load();
  }, []);

  function buildWhatsAppLink(booking) {
    const text = `Hello, I have booked an appointment with ${booking.doctor_name} on ${booking.date} at ${booking.time_slot}. My name is ${booking.client_name}.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  async function submitBooking(e) {
    e.preventDefault();
    setStatus('Sending...');
    await new Promise((r) => setTimeout(r, 800));
    setStatus('Booked successfully ✅');
    setLastBooking({ doctor_name: selected?.name, ...form });
    setForm({ client_name: '', client_phone: '', date: '', time_slot: '', notes: '' });
    setSelected(null);
  }

  function simulateWhatsApp() {
    setWhatsappStatus('📨 Sending to WhatsApp...');
    setTimeout(() => {
      setWhatsappStatus('✅ Message delivered to WhatsApp successfully!');
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white text-gray-800">
      {/* 🌿 NAVBAR */}
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
              HL
            </div>
            <span className="font-semibold text-emerald-700 text-lg">Healthy Life Clinic</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
          >
            Book Appointment
          </button>
        </div>
      </nav>

      {/* 🏥 HEADER HERO SECTION */}
      <header className="relative text-center py-16 bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580281657521-63a2a1f64d32?auto=format&fit=crop&w=1400&q=80')] opacity-15 bg-cover bg-center" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">Welcome to Healthy Life Clinic</h1>
          <p className="mt-3 text-white/90 text-lg">
            Compassionate care, modern facilities, and trusted professionals — all in one place.
          </p>
        </div>
      </header>

      {/* 👩‍⚕️ DOCTOR CARDS */}
      <section className="max-w-5xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctors.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 overflow-hidden text-center"
          >
            <div className="flex justify-center pt-6">
              <img
                src={d.photo}
                alt={d.name}
                className="w-20 h-20 object-contain transition-transform duration-300 hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-emerald-700 text-lg">{d.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{d.specialty}</p>
              <button
                onClick={() => {
                  setSelected(d);
                  setStatus('');
                  setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
                }}
                className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 🗓️ BOOKING FORM */}
      {selected && (
        <section ref={formRef} className="max-w-md mx-auto bg-white shadow-2xl rounded-3xl p-6 mt-10 animate-fadeIn">
          <h2 className="text-2xl font-bold text-emerald-600 mb-4 text-center">
            Book with {selected.name}
          </h2>
          <form onSubmit={submitBooking} className="grid gap-3">
            <input
              required
              className="input"
              placeholder="Your name"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            />
            <input
              required
              className="input"
              placeholder="Phone number"
              value={form.client_phone}
              onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
            />
            <input
              required
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <select
              required
              className="input"
              value={form.time_slot}
              onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
            >
              <option value="">Choose a time slot</option>
              <option>09:00</option>
              <option>09:30</option>
              <option>10:00</option>
              <option>11:00</option>
              <option>14:00</option>
              <option>15:00</option>
              <option>16:00</option>
            </select>
            <textarea
              className="input"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full border rounded-lg py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
            <p className="text-sm text-gray-500">{status}</p>
          </form>
        </section>
      )}

      {/* ✅ SUCCESS PANEL */}
      {lastBooking && (
        <section className="max-w-md mx-auto bg-gradient-to-br from-emerald-50 to-white rounded-3xl shadow-xl mt-10 p-6 text-center border border-emerald-100 animate-fadeIn">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-emerald-700 mb-2">Appointment Confirmed!</h3>
          <p className="text-gray-700 mb-3">
            {lastBooking.client_name}, your booking with <strong>{lastBooking.doctor_name}</strong> on{' '}
            <strong>{lastBooking.date}</strong> at <strong>{lastBooking.time_slot}</strong> is confirmed.
          </p>

          {/* WhatsApp simulation */}
          <div className="space-y-3">
            <button
              onClick={simulateWhatsApp}
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <MessageCircle className="w-4 h-4" /> Send via WhatsApp
            </button>
            {whatsappStatus && (
              <p className="text-sm text-emerald-700 animate-fadeIn">{whatsappStatus}</p>
            )}
          </div>

          <div>
            <button
              onClick={() => {
                setLastBooking(null);
                setWhatsappStatus('');
              }}
              className="block mx-auto mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </section>
      )}

      {/* 🦶 FOOTER */}
      <footer className="mt-16 text-center py-6 bg-white/70 text-sm text-gray-500">
        © 2025 Healthy Life Clinic · 15 El-Tahrir St, Cairo · All Rights Reserved
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </main>
  );
}
