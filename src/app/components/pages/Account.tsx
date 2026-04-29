import { useAuth } from '@/app/context/AuthContext';
import SeoHead from '@/app/components/SeoHead';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getMe, updateUser } from '@/lib/api/users';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function Account() {
  const { token, user, refreshUser, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username);
    setEmail(user.email);
    setFirstName(user.firstName ?? '');
    setLastName(user.lastName ?? '');
  }, [user]);

  useEffect(() => {
    if (!token) return;
    void getMe(token).then((u) => {
      if (u) {
        setUsername(u.username);
        setEmail(u.email);
        setFirstName(u.firstName ?? '');
        setLastName(u.lastName ?? '');
      }
    });
  }, [token]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    setBusy(true);
    try {
      await updateUser(
        user.id,
        {
          username,
          email,
          firstName: firstName || null,
          lastName: lastName || null,
        },
        token
      );
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Update failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SeoHead title="My account — FITLOCKA" description="Manage your FITLOCKA profile and orders." canonicalPath="/account" noindex />
      <section className="min-h-screen px-[60px] py-16 max-w-xl">
        <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Profile
        </div>
        <h1 className="mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: '1' }}>
          MY ACCOUNT
        </h1>
        <div className="flex gap-6 mb-10" style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px' }}>
          <Link to="/account/orders" className="text-[var(--accent)] underline">
            Order history
          </Link>
          <Link to="/cart" className="underline">
            Cart
          </Link>
        </div>
        <form onSubmit={save} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-none border-[var(--black)]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none border-[var(--black)]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-none border-[var(--black)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-none border-[var(--black)]" />
            </div>
          </div>
          <Button type="submit" disabled={busy} className="rounded-none bg-[var(--black)] text-[var(--white)] hover:bg-[var(--accent)]">
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
        <button
          type="button"
          className="mt-10 text-sm underline text-[var(--muted-foreground)] bg-transparent border-none cursor-pointer"
          onClick={() => {
            logout();
            toast.message('Signed out');
          }}
        >
          Sign out
        </button>
      </section>
    </>
  );
}
