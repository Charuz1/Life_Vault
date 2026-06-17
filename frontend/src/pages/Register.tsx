import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import axios from 'axios';
import { Shield, ArrowRight, Lock, Mail, User as UserIcon, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      dispatch(setUser(response.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Mesh Gradients */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-secondary/40 rounded-full mix-blend-screen blur-[120px] animate-blob" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-primary/40 rounded-full mix-blend-screen blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-accent/30 rounded-full mix-blend-screen blur-[150px] animate-blob animation-delay-4000" />

      <div className="w-full max-w-md glass border border-white/10 rounded-3xl p-10 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary/20 p-4 rounded-2xl mb-6 border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-float">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Create Vault</h1>
          <p className="text-muted-foreground mt-3 text-center text-lg">Start securing your important documents</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive/50 text-white font-medium p-4 rounded-xl mb-6 text-center animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-white outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-white outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-white outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-4 group"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                Create Account
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-8 text-lg">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:text-white transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
