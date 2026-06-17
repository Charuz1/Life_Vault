import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../features/store';
import { User as UserIcon, Bell, Shield, Key, Loader2, Save, Upload } from 'lucide-react';
import axios from 'axios';
import { updateUser } from '../features/auth/authSlice';

type Tab = 'profile' | 'security' | 'notifications' | 'api';

const Settings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate save
    setTimeout(() => {
      setIsLoading(false);
      dispatch(updateUser({ name }));
      alert('Settings saved successfully!');
    }, 800);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.put('http://localhost:5000/api/auth/avatar', formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch(updateUser({ avatarUrl: res.data.avatarUrl }));
    } catch (error) {
      console.error('Failed to upload avatar', error);
      alert('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <UserIcon className="w-5 h-5" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <Shield className="w-5 h-5" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all ${activeTab === 'api' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <Key className="w-5 h-5" /> API Keys
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === 'profile' && (
            <div className="glass-card rounded-3xl shadow-xl overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Public Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">This is how you appear on LifeVault AI.</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold overflow-hidden border-2 border-primary/20">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || 'U'
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarUpload} 
                        className="hidden" 
                        accept="image/*" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Change Avatar
                      </button>
                      <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 2MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed outline-none"
                      />
                      <p className="text-xs text-muted-foreground">To change your email address, please contact support.</p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card rounded-3xl shadow-xl overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your password and security options.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 rounded-lg transition-all">
                    Update Password
                  </button>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account.</p>
                  <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card rounded-3xl shadow-xl overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground mt-1">Choose what we notify you about.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div>
                    <h4 className="font-medium text-foreground">Document Expiry Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get an email when a document is about to expire.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div>
                    <h4 className="font-medium text-foreground">Security Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get notified about important security updates.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-foreground">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">Receive emails about new features and updates.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="glass-card rounded-3xl shadow-xl overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">API Keys</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage keys for accessing the LifeVault AI API.</p>
              </div>
              <div className="p-6">
                <div className="bg-secondary/50 border border-border rounded-lg p-4 flex justify-between items-center mb-6">
                  <div className="font-mono text-sm text-muted-foreground tracking-wider">
                    lv_live_8f7d6a5...
                  </div>
                  <button className="text-primary hover:underline text-sm font-medium">Revoke</button>
                </div>
                <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-dashed border-muted-foreground/30 flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" /> Generate New Key
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone is always visible at the bottom of Profile tab */}
          {activeTab === 'profile' && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-destructive">Danger Zone</h3>
              <p className="text-sm text-destructive/80 mt-1 mb-4">Permanently delete your account and all of your documents.</p>
              <button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Delete Account
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
