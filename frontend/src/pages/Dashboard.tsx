import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { FileText, Clock, ShieldCheck, Search, UploadCloud, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/documents', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setDocuments(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) fetchDocs();
  }, [user]);

  const expiringSoonCount = documents.filter((doc: any) => {
    if (!doc.expiryDate) return false;
    const expiry = new Date(doc.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30; // Expiring within 30 days
  }).length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            Welcome, {user?.name?.split(' ')[0]} 
            <span className="animate-float inline-block">👋</span>
          </h1>
          <p className="text-muted-foreground text-lg">Your digital vault is secure and ready.</p>
        </div>
        <Link 
          to="/vault"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
        >
          <UploadCloud className="w-5 h-5" />
          Upload Document
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-semibold text-muted-foreground tracking-wide uppercase text-sm">Total Documents</h3>
            <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-5xl font-bold text-white relative z-10">{documents.length}</p>
        </div>
        
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-semibold text-muted-foreground tracking-wide uppercase text-sm">Expiring Soon</h3>
            <div className="bg-orange-500/20 p-3 rounded-2xl border border-orange-500/30">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-5xl font-bold text-white relative z-10">{expiringSoonCount}</p>
        </div>

        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-semibold text-muted-foreground tracking-wide uppercase text-sm">Secure Score</h3>
            <div className="bg-green-500/20 p-3 rounded-2xl border border-green-500/30">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-5xl font-bold text-white relative z-10">100%</p>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Recent Documents</h2>
          <Link to="/vault" className="text-primary font-semibold hover:text-white transition-colors flex items-center gap-1 group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
            <Search className="w-16 h-16 text-muted-foreground mb-6 opacity-40 animate-pulse-slow" />
            <h3 className="text-xl font-bold text-white mb-2">No documents yet</h3>
            <p className="text-muted-foreground max-w-sm">Upload your first document to start building your highly secure digital vault.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.slice(0, 5).map((doc: any, index: number) => (
              <div 
                key={doc._id} 
                className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] transition-all cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-5">
                  <div className="bg-primary/20 p-3 rounded-xl border border-primary/30 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{doc.title}</h4>
                    <span className="text-xs font-semibold tracking-wider uppercase text-primary mt-1 inline-block bg-primary/10 px-2 py-0.5 rounded-md">
                      {doc.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground font-medium">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
