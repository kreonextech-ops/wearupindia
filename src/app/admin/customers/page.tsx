'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ExternalLink,
  Shield,
  User as UserIcon
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setCustomers(data || []);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, [supabase]);

  const filteredCustomers = customers.filter(customer => 
    customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone_number?.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8161B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2">// Intelligence Retrieval</p>
            <h1 className="font-display font-black text-5xl text-white tracking-tight uppercase">Rider Database</h1>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#E8161B] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Riders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-body text-sm focus:outline-none focus:border-[#E8161B] w-full md:w-80 transition-all backdrop-blur-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={customer.id} 
                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/[0.07] transition-all group overflow-hidden relative"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8161B]/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[#E8161B]/10 transition-all duration-700" />

                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                  {/* Basic Info */}
                  <div className="flex items-start gap-6 lg:border-r border-white/5 lg:pr-8 lg:w-1/3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E8161B] to-[#ff4d4d] flex items-center justify-center text-white font-display font-black text-2xl shrink-0 shadow-lg shadow-[#E8161B]/20">
                      {customer.full_name?.[0] || customer.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">{customer.full_name || 'Anonymous Rider'}</h3>
                        {customer.role === 'admin' && (
                          <span className="bg-[#E8161B]/20 text-[#E8161B] px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">Admin</span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-[#555] uppercase break-all flex items-center gap-2">
                        <Mail size={10} /> {customer.email}
                      </p>
                      <p className="font-mono text-[10px] text-[#555] uppercase flex items-center gap-2">
                        <Phone size={10} /> {customer.phone_number || 'No Phone Linked'}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-[#444] font-mono text-[9px] uppercase tracking-widest">
                        <Calendar size={10} /> Joined {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Destination Info */}
                  <div className="lg:w-2/3 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-3">
                      <h4 className="font-display font-bold text-[10px] text-[#444] uppercase tracking-[0.2em] flex items-center gap-2">
                        <MapPin size={12} className="text-[#E8161B]" /> Primary Destination
                      </h4>
                      {customer.shipping_address && Object.keys(customer.shipping_address).length > 0 ? (
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                          <p className="text-white font-body text-sm leading-relaxed">
                            {customer.shipping_address.street}<br/>
                            {customer.shipping_address.city}, {customer.shipping_address.state} {customer.shipping_address.zip}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white/5 rounded-2xl p-4 border border-dashed border-white/10">
                          <p className="text-[#333] font-mono text-[10px] uppercase tracking-widest italic">No destination set</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-end lg:items-center">
                      <button className="bg-white/5 hover:bg-[#E8161B] text-white border border-white/10 hover:border-[#E8161B] p-4 rounded-2xl transition-all group/btn">
                        <ExternalLink size={20} className="text-[#444] group-hover/btn:text-white group-hover/btn:scale-110 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
              <Users size={48} className="text-[#222] mb-6" />
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-widest mb-2">Database Clean</h3>
              <p className="font-body text-sm text-[#444] max-w-sm">No riders matching your query were found in the intelligence logs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
