import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, Search, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 glass h-[calc(100vh-3rem)] rounded-3xl flex flex-col transition-all duration-500 overflow-hidden relative group shadow-2xl border-white/5">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="p-8 flex items-center gap-4 relative z-10">
        <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-shadow">
          <Shield className="w-6 h-6 text-primary animate-pulse-slow" />
        </div>
        <span className="font-bold text-xl tracking-tight text-glow text-white">
          LifeVault AI
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-3 relative z-10">
        <Link 
          to="/dashboard" 
          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/dashboard') ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
        >
          <LayoutDashboard className={`w-5 h-5 transition-transform duration-300 ${isActive('/dashboard') ? 'text-primary' : 'group-hover:scale-110'}`} />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link 
          to="/vault" 
          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/vault') ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
        >
          <FileText className={`w-5 h-5 transition-transform duration-300 ${isActive('/vault') ? 'text-primary' : 'group-hover:scale-110'}`} />
          <span className="font-medium">My Vault</span>
        </Link>
        <Link 
          to="/search" 
          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/search') ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
        >
          <Search className={`w-5 h-5 transition-transform duration-300 ${isActive('/search') ? 'text-primary' : 'group-hover:scale-110'}`} />
          <span className="font-medium">AI Search</span>
        </Link>
        <Link 
          to="/settings" 
          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/settings') ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
        >
          <Settings className={`w-5 h-5 transition-transform duration-300 ${isActive('/settings') ? 'text-primary' : 'group-hover:scale-110'}`} />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      <div className="p-4 relative z-10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
