'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setEmail(session.user.email || '');
        setFirstName(session.user.user_metadata?.first_name || '');
        setLastName(session.user.user_metadata?.last_name || '');
        setPhoneNumber(session.user.user_metadata?.phone_number || '');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaveLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        }
      });
      
      if (error) throw error;
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Update sessionStorage as well so navigation shows correct name
      try {
         const { data: { session } } = await supabase.auth.getSession();
         if (session) {
            sessionStorage.setItem('userSession', JSON.stringify(session));
         }
      } catch (e) {
         // Ignore
      }

    } catch (err: unknown) {
      const error = err as Error;
      setMessage(`Error: ${error.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const ProfileRightPanel = () => {
    return (
      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="bg-surface-2 border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-3">Account Security</h3>
          <p className="text-sm text-text-secondary mb-4">
            If you need to change your password, you can sign out and use the "Forgot Password" link on the login page.
          </p>
          <button 
             onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/signin';
             }}
             className="w-full bg-surface-1 border border-border text-text-primary py-2 rounded-lg text-sm font-semibold hover:bg-surface-3 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={!loading ? <ProfileRightPanel /> : null}>
        <div className="w-full flex-1 max-w-3xl mx-auto">
          {loading ? (
             <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
             </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-10 pt-4 md:pt-8">
                <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-3">Profile Settings</h1>
                <p className="text-text-secondary text-lg">Manage your account information and preferences.</p>
              </div>

              {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('Error') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                  {message}
                </div>
              )}

              <div className="bg-surface-1 border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-border-subtle">
                     <div>
                        <h2 className="text-xl font-medium text-text-primary">Personal Information</h2>
                        <p className="text-sm text-text-secondary mt-1">Update your basic profile details.</p>
                     </div>
                     {!isEditing && (
                        <button 
                          onClick={() => setIsEditing(true)} 
                          className="px-4 py-2 bg-surface-2 text-text-primary rounded-lg text-sm font-medium border border-border hover:bg-surface-3 transition-colors"
                        >
                           Edit
                        </button>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        disabled={true}
                        className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-text-primary opacity-50 cursor-not-allowed"
                      />
                      <p className="text-[11px] text-text-tertiary mt-1">Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-surface-2 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      />
                    </div>
                  </div>

                  {isEditing && (
                     <div className="flex justify-end gap-3 pt-6 border-t border-border-subtle">
                        <button 
                          onClick={() => {
                             setIsEditing(false);
                             setMessage('');
                          }} 
                          className="px-5 py-2.5 bg-surface-2 text-text-primary rounded-xl text-sm font-medium hover:bg-surface-3 transition-colors"
                        >
                           Cancel
                        </button>
                        <button 
                          onClick={handleSave} 
                          disabled={saveLoading}
                          className="px-5 py-2.5 bg-text-primary text-background rounded-xl text-sm font-medium hover:bg-brand-light transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                        >
                           {saveLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
}
