import { useAuth } from '@/app/context/AuthContext';
import SeoHead from '@/app/components/SeoHead';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const outcome = await register({
        username,
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      if (outcome === 'session') {
        toast.success('Welcome to FITLOCKA');
        navigate('/account', { replace: true });
      } else {
        toast.success('Check your email to confirm your account, then sign in.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      const msg = getUserFacingErrorMessage(err, 'Registration failed');
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SeoHead title="Create account — FITLOCKA" description="Join FITLOCKA for retro jerseys and member checkout." canonicalPath="/register" />
      <section className="min-h-screen px-[60px] py-20 max-w-md mx-auto">
        <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Join
        </div>
        <h1 className="mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', letterSpacing: '0.02em', lineHeight: '1' }}>
          REGISTER
        </h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2} className="rounded-none border-[var(--black)]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-none border-[var(--black)]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="rounded-none border-[var(--black)]" />
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
          <Button type="submit" disabled={busy} className="w-full rounded-none bg-[var(--black)] text-[var(--white)] hover:bg-[var(--accent)]">
            {busy ? 'Creating…' : 'Create account'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          After signing up, check your inbox to confirm your email before you can sign in.
        </p>
        <p className="mt-8 text-sm text-[var(--muted-foreground)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--accent)] underline">
            Sign in
          </Link>
        </p>
      </section>
    </>
  );
}
