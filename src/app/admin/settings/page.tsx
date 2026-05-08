'use client';

import { useState } from 'react';
import { Save, Settings2, Store, CreditCard, Mail, Globe, AlertCircle, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'notifications'>('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock settings state
  const [settings, setSettings] = useState({
    storeName: 'WearUp India',
    contactEmail: 'support@wearup.in',
    supportPhone: '+91 98765 43210',
    currency: 'INR',
    taxRate: '18',
    freeShippingThreshold: '499',
    upiId: 'wearup@upi',
    enableCod: true,
    orderNotifications: true,
    promoEmails: false
  });

  const update = (k: keyof typeof settings, v: any) => setSettings(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setLoading(true);
    // In a real app, save to Supabase or global config here
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#E8161B] transition-all text-sm font-body";
  const labelClass = "font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2 block";

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-60">// System Configuration</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Settings</h1>
          <p className="font-mono text-[10px] text-white/20 tracking-widest mt-2 uppercase">Manage your store preferences</p>
        </div>
        <div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-[#E8161B] hover:bg-[#B81015] text-white px-6 py-3 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-50"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : saved ? (
              <><CheckCircle2 size={16} /> Saved</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2 flex-shrink-0">
          {[
            { id: 'general', icon: Store, label: 'General & Store' },
            { id: 'payment', icon: CreditCard, label: 'Payment & Taxes' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-[#E8161B]/10 text-[#E8161B] border border-[#E8161B]/20'
                  : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
              <h2 className="font-display font-black text-xl text-white flex items-center gap-2 mb-6">
                <Store size={20} className="text-[#E8161B]" /> Store Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Store Name</label>
                  <input className={inputClass} value={settings.storeName} onChange={e => update('storeName', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Contact Email</label>
                  <input type="email" className={inputClass} value={settings.contactEmail} onChange={e => update('contactEmail', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Support Phone</label>
                  <input type="tel" className={inputClass} value={settings.supportPhone} onChange={e => update('supportPhone', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
                <h2 className="font-display font-black text-xl text-white flex items-center gap-2 mb-6">
                  <CreditCard size={20} className="text-[#E8161B]" /> Checkout & Taxes
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Free Shipping Threshold (INR)</label>
                    <input type="number" className={inputClass} value={settings.freeShippingThreshold} onChange={e => update('freeShippingThreshold', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Store UPI ID</label>
                    <input className={inputClass} value={settings.upiId} onChange={e => update('upiId', e.target.value)} />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableCod ? 'bg-[#E8161B]' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableCod ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="font-display font-bold text-sm text-white group-hover:text-[#E8161B] transition-colors">Enable Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
              <h2 className="font-display font-black text-xl text-white flex items-center gap-2 mb-6">
                <Bell size={20} className="text-[#E8161B]" /> Notification Preferences
              </h2>
              
              <div className="space-y-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.orderNotifications ? 'bg-[#E8161B]' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.orderNotifications ? 'left-7' : 'left-1'}`} />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-white block group-hover:text-[#E8161B] transition-colors">Admin Order Alerts</span>
                    <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">Receive emails when a new order is placed</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.promoEmails ? 'bg-[#E8161B]' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.promoEmails ? 'left-7' : 'left-1'}`} />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-white block group-hover:text-[#E8161B] transition-colors">Daily Summary</span>
                    <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">Receive a daily digest of store performance</span>
                  </div>
                </label>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
                <AlertCircle size={18} className="text-blue-400 shrink-0" />
                <p className="font-body text-sm text-blue-200">
                  Customer notifications (Order Confirmation, Shipping Updates) are handled automatically by the system and cannot be disabled.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Temporary import for CheckCircle2
import { CheckCircle2 } from 'lucide-react';
