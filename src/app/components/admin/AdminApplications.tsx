import * as appsApi from '@/lib/api/applications';
import type { Application } from '@/lib/api/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminApplications() {
  const [items, setItems] = useState<Application[]>([]);
  const [name, setName] = useState('');
  const [renameId, setRenameId] = useState<number | null>(null);
  const [rename, setRename] = useState('');

  const load = async () => {
    try {
      const list = await appsApi.listApplications();
      setItems(list ?? []);
    } catch {
      toast.error('Could not load applications');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await appsApi.createApplication(name.trim());
      toast.success('Application created (check response for API key if shown)');
      setName('');
      await load();
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Failed'));
    }
  };

  const onRename = async (id: number) => {
    if (!rename.trim()) return;
    try {
      await appsApi.updateApplication(id, rename.trim());
      toast.success('Updated');
      setRenameId(null);
      setRename('');
      await load();
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Failed'));
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Delete application?')) return;
    try {
      await appsApi.deleteApplication(id);
      toast.success('Deleted');
      await load();
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Failed'));
    }
  };

  return (
    <div>
      <h1 className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>
        APPLICATIONS
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-xl">
        Application records hold API keys for connecting frontends. Creating a new app may require an existing key with permission—use your deployment seed key in{' '}
        <code className="text-xs">VITE_API_KEY</code>.
      </p>
      <form onSubmit={onCreate} className="mb-10 flex flex-wrap gap-4 items-end border border-[var(--black)] p-6 bg-[var(--card-bg)]">
        <div className="flex-1 min-w-[200px]">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" required />
        </div>
        <Button type="submit" className="rounded-none bg-[var(--black)] text-[var(--white)]">
          Create
        </Button>
      </form>
      <ul className="border border-[var(--black)] divide-y divide-[var(--border)]">
        {items.map((a) => (
          <li key={a.id} className="p-4 space-y-2">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-[var(--muted-foreground)]">ID {a.id}</div>
                {a.apiKey ? (
                  <div className="text-xs mt-2 break-all font-mono bg-[var(--cream)] p-2 border border-[var(--border)]">Key: {a.apiKey}</div>
                ) : null}
              </div>
              <div className="flex gap-2 items-start">
                {renameId === a.id ? (
                  <div className="flex gap-2">
                    <Input value={rename} onChange={(e) => setRename(e.target.value)} className="rounded-none w-40" />
                    <Button type="button" size="sm" className="rounded-none" onClick={() => void onRename(a.id)}>
                      Save
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setRenameId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button type="button" variant="outline" size="sm" className="rounded-none" onClick={() => { setRenameId(a.id); setRename(a.name); }}>
                      Rename
                    </Button>
                    <Button type="button" variant="destructive" size="sm" className="rounded-none" onClick={() => void onDelete(a.id)}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
