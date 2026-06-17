import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';

const Layout = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-accent/20 rounded-full mix-blend-screen filter blur-[150px] opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Sidebar Container */}
      <div className="relative z-10 hidden md:flex flex-col justify-center p-6 h-full">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 h-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default Layout;
