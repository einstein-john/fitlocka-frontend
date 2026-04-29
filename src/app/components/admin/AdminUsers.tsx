import { useAuth } from '@/app/context/AuthContext';
import { getUser, updateUser } from '@/lib/api/users';
import type { AuthUser } from '@/lib/api/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { token } = useAuth();
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const load = async () => {
    if (!token) return;
    const id = Number(userId);
    if (Number.isNaN(id)) {
      toast.error('Invalid user ID');
      return;
    }
    try {
      const u = await getUser(id, token);
      if (!u) {
        toast.error('User not found');
        setUser(null);
        return;
      }
      setUser(u);
      setEmail(u.email);
      setUsername(u.username);
      setIsAdmin(!!u.isAdmin);
      setEnabled(u.enabled !== false);
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Forbidden or not found'));
      setUser(null);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    try {
      const u = await updateUser(
        user.id,
        {
          email,
          username,
          isAdmin,
          enabled,
        },
        token
      );
      setUser(u ?? user);
      toast.success('User updated');
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Update failed'));
    }
  };

  return (
    <div>
      <h1 className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>
        USERS
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-xl">
        Load a user by numeric ID. Updates require admin permission on the API.
      </p>
      <div className="flex gap-4 mb-8">
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" className="rounded-none max-w-xs" />
        <Button type="button" variant="outline" className="rounded-none" onClick={() => void load()}>
          Load
        </Button>
      </div>
      {user ? (
        <form onSubmit={save} className="max-w-md space-y-4 border border-[var(--black)] p-6 bg-[var(--card-bg)]">
          <div>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-none" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none" />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            Admin
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            Enabled
          </label>
          <Button type="submit" className="rounded-none bg-[var(--black)] text-[var(--white)]">
            Save user
          </Button>
        </form>
      ) : null}
    </div>
  );
}
