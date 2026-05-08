'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Check, Loader2 } from 'lucide-react';
import { submitFormAction } from '@/lib/actions/forms';

const services = ['Bike Wrapping', 'Detail Wash', 'Custom Decals', 'Product Query', 'Bulk Order', 'Other'];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await submitFormAction({
      ...form,
      type: 'contact'
    });

    setLoading(false);
    if (res.success) {
      setSent(true);
    } else {
      setError(res.error || 'Something went wrong. Please try again.');
    }
  };

  const inputClass = "w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white placeholder-[#444] px-4 py-3 font-body text-sm focus:outline-none focus:border-[#E8161B] transition-colors";
  const labelClass = "font-mono text-[10px] text-[#555] tracking-widest uppercase mb-1.5 block";

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#1a1a1a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] text-[#E8161B] tracking-[0.3em] uppercase mb-3">// Get In Touch</p>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-white leading-none">
            LET&apos;S TALK<br /><span className="text-[#E8161B]">BIKES.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-black text-xl text-white mb-6 red-line">REACH US</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Call / WhatsApp', value: '+91 62963 96462', href: 'tel:+916296396462' },
                  { icon: Mail, label: 'Email', value: 'hello@wearup.in', href: 'mailto:hello@wearup.in' },
                  { icon: MapPin, label: 'Workshop', value: 'Medical More, Shibmandir\nOpp. Mukta Nursing Home\nSiliguri, WB 734011', href: 'https://maps.google.com/?q=Wearup+India+Siliguri' },
                  { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9 AM – 7 PM\nSunday: 10 AM – 4 PM', href: '#' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#E8161B]/10 border border-[#E8161B]/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-[#E8161B]" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-[#555] tracking-widest uppercase mb-0.5">{label}</p>
                      <a href={href} className="font-body text-[#999] text-sm hover:text-white transition-colors whitespace-pre-line">
                        {value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative h-52 bg-[#111] border border-[#1a1a1a] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(232,22,27,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,22,27,0.05) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />
              <div className="relative z-10 text-center">
                <MapPin size={32} className="text-[#E8161B] mx-auto mb-2" />
                <p className="font-mono text-[11px] text-[#555] tracking-widest">SILIGURI, WEST BENGAL</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-green-500" />
                </div>
                <h2 className="font-display font-black text-3xl text-white mb-3">MESSAGE SENT!</h2>
                <p className="font-body text-[#666] text-sm">We&apos;ll get back to you within 2 hours on WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display font-black text-2xl text-white">SEND A MESSAGE</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Your Name</label>
                    <input required className={inputClass} placeholder="Rahul Sharma" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" required className={inputClass} placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>

                <div>
                  <label className={labelClass}>Service Interested In</label>
                  <select className={inputClass} value={form.service} onChange={e => update('service', e.target.value)}>
                    <option value="">Select a service</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    required
                    className={`${inputClass} resize-none`}
                    rows={5}
                    placeholder="Tell us about your bike and what you have in mind..."
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                  />
                </div>

                  {error && (
                    <p className="text-wu-red font-mono text-[10px] uppercase tracking-widest">{error}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-3 bg-[#E8161B] text-white font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#B81015] transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>Sending... <Loader2 size={16} className="animate-spin" /></>
                      ) : (
                        <>Send Message</>
                      )}
                    </button>
                  <a
                    href="https://wa.me/916296396462"
                    className="flex items-center gap-3 border border-[#2a2a2a] text-[#888] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 hover:text-white hover:border-[#444] transition-colors"
                  >
                    WhatsApp Instead
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
