'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Clock, CheckCircle2, 
  Trash2, Mail, Phone, Tag, ExternalLink, Loader2, X 
} from 'lucide-react';
import { 
  getAllSubmissionsAction, 
  updateSubmissionStatusAction, 
  deleteSubmissionAction 
} from '@/lib/actions/forms';

type SubmissionStatus = 'all' | 'pending' | 'read' | 'responded' | 'archived';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  type: string;
  status: string;
  created_at: string;
  metadata?: any;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',  icon: Clock },
  read:       { label: 'Read',       color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',        icon: MessageSquare },
  responded:  { label: 'Responded',  color: 'text-green-400 bg-green-400/10 border-green-400/20',     icon: CheckCircle2 },
  archived:   { label: 'Archived',   color: 'text-white/40 bg-white/5 border-white/10',             icon: Tag },
};

const FILTER_TABS: { label: string; value: SubmissionStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Read', value: 'read' },
  { label: 'Responded', value: 'responded' },
  { label: 'Archived', value: 'archived' },
];

export default function FormRequestsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SubmissionStatus>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    const res = await getAllSubmissionsAction();
    if (res.success && res.data) {
      setSubmissions(res.data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    const res = await updateSubmissionStatusAction(id, status);
    if (res.success) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      if (viewingSubmission?.id === id) {
        setViewingSubmission(prev => prev ? { ...prev, status } : null);
      }
    }
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    setUpdatingId(id);
    const res = await deleteSubmissionAction(id);
    if (res.success) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (viewingSubmission?.id === id) setViewingSubmission(null);
    }
    setUpdatingId(null);
  };

  const filtered = submissions.filter(s => {
    const matchStatus = filter === 'all' || s.status === filter;
    const matchSearch = !search
      || s.name.toLowerCase().includes(search.toLowerCase())
      || s.email.toLowerCase().includes(search.toLowerCase())
      || s.message.toLowerCase().includes(search.toLowerCase())
      || s.type.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = Object.fromEntries(
    ['pending', 'read', 'responded', 'archived'].map(s => [
      s, submissions.filter(sub => sub.status === s).length
    ])
  );

  return (
    <div className="space-y-8">
      {/* Detail View Modal */}
      <AnimatePresence>
        {viewingSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setViewingSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-widest ${STATUS_CONFIG[viewingSubmission.status]?.color}`}>
                      {viewingSubmission.status}
                    </span>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      {viewingSubmission.type.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="font-display font-black text-3xl text-white uppercase">{viewingSubmission.name}</h2>
                  <p className="font-mono text-[10px] text-white/20 mt-1 uppercase">
                    Received on {new Date(viewingSubmission.created_at).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setViewingSubmission(null)} className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-[10px] text-white/20 tracking-widest uppercase mb-1.5 block">Email</label>
                    <a href={`mailto:${viewingSubmission.email}`} className="flex items-center gap-2 font-display font-bold text-white hover:text-[#E8161B] transition-colors group">
                      <Mail size={16} className="text-white/20 group-hover:text-[#E8161B]" />
                      {viewingSubmission.email}
                    </a>
                  </div>
                  {viewingSubmission.phone && (
                    <div>
                      <label className="font-mono text-[10px] text-white/20 tracking-widest uppercase mb-1.5 block">Phone</label>
                      <a href={`tel:${viewingSubmission.phone}`} className="flex items-center gap-2 font-display font-bold text-white hover:text-[#E8161B] transition-colors group">
                        <Phone size={16} className="text-white/20 group-hover:text-[#E8161B]" />
                        {viewingSubmission.phone}
                      </a>
                    </div>
                  )}
                  {viewingSubmission.service && (
                    <div>
                      <label className="font-mono text-[10px] text-white/20 tracking-widest uppercase mb-1.5 block">Service Interested In</label>
                      <p className="font-display font-bold text-white">{viewingSubmission.service}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {viewingSubmission.metadata && Object.keys(viewingSubmission.metadata).length > 0 && (
                    <div>
                      <label className="font-mono text-[10px] text-white/20 tracking-widest uppercase mb-1.5 block">Additional Data</label>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-2">
                        {Object.entries(viewingSubmission.metadata).map(([k, v]: [string, any]) => (
                          <div key={k} className="flex justify-between text-[11px]">
                            <span className="font-mono text-white/40 uppercase">{k}:</span>
                            <span className="font-display font-bold text-white">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <label className="font-mono text-[10px] text-white/20 tracking-widest uppercase mb-1.5 block">Message</label>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 font-body text-white/80 leading-relaxed whitespace-pre-wrap">
                  {viewingSubmission.message}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-white/10">
                <div className="flex gap-2">
                  {['pending', 'read', 'responded', 'archived'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(viewingSubmission.id, s)}
                      disabled={updatingId === viewingSubmission.id}
                      className={`px-4 py-2 rounded-xl font-mono text-[10px] tracking-widest uppercase transition-all ${
                        viewingSubmission.status === s
                          ? STATUS_CONFIG[s].color
                          : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(viewingSubmission.id)}
                  disabled={updatingId === viewingSubmission.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-mono text-[10px] tracking-widest uppercase"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-2 opacity-60">// Form Submissions</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none">Form Requests</h1>
          <p className="font-mono text-[10px] text-white/20 tracking-widest mt-2 uppercase">{submissions.length} total inquiries</p>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input
            type="text"
            placeholder="Search name, email, message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E8161B]/50 w-full md:w-72 transition-all"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-2 rounded-xl font-mono text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 ${
              filter === t.value
                ? 'bg-[#E8161B] text-white'
                : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
            }`}
          >
            {t.label}
            {t.value !== 'all' && counts[t.value] !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                filter === t.value ? 'bg-white/20 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {counts[t.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submissions Table/List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0A] border border-white/5 rounded-3xl text-center">
          <MessageSquare size={40} className="text-white/10 mb-4" />
          <p className="font-display font-bold text-white/30 uppercase tracking-widest">No Requests Found</p>
          <p className="font-mono text-[10px] text-white/15 tracking-widest mt-2 uppercase">
            {filter !== 'all' ? `No ${filter} requests` : 'Form submissions will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((submission, i) => {
            const sc = STATUS_CONFIG[submission.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = sc.icon;

            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group cursor-pointer"
                onClick={() => setViewingSubmission(submission)}
              >
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  {/* Left: Type + Name + Contact */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E8161B]/10 flex items-center justify-center flex-shrink-0">
                      <StatusIcon size={16} className="text-[#E8161B]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-display font-black text-sm text-white uppercase">
                          {submission.name}
                        </p>
                        <span className={`font-mono text-[8px] px-2 py-0.5 rounded-full border uppercase tracking-widest ${sc.color}`}>
                          {sc.label}
                        </span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 uppercase tracking-widest">
                          {submission.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="font-mono text-[9px] text-white/30 flex items-center gap-1">
                          <Mail size={10} /> {submission.email}
                        </p>
                        {submission.phone && (
                          <p className="font-mono text-[9px] text-white/30 flex items-center gap-1">
                            <Phone size={10} /> {submission.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Message snippet + Actions */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="hidden lg:block max-w-[300px]">
                      <p className="font-body text-[11px] text-white/40 line-clamp-1 italic">
                        &quot;{submission.message}&quot;
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-[9px] text-white/20 uppercase">Date</p>
                      <p className="font-display font-bold text-xs text-white/60">
                        {new Date(submission.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingSubmission(submission);
                        }}
                        className="p-2 bg-white/5 hover:bg-[#E8161B]/20 text-white/20 hover:text-[#E8161B] rounded-lg transition-all"
                        title="View Details"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(submission.id);
                        }}
                        className="p-2 bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
