import { useAuth } from '@/app/context/AuthContext';
import { listCategories, createCategory, deleteCategory } from '@/lib/api/categories';
import type { Category } from '@/lib/api/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminCategories() {
  const { token } = useAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');

  const load = async () => {
    if (!token) return;
    try {
      const c = await listCategories(token, { limit: 200 });
      setItems(c);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !name.trim()) return;
    try {
      await createCategory({ name: name.trim(), slug: slug.trim() || undefined, description: desc || null }, token);
      toast.success('Category created');
      setName('');
      setSlug('');
      setDesc('');
      await load();
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Failed'));
    }
  };

  const onDelete = async (id: number) => {
    if (!token || !confirm('Delete category?')) return;
    try {
      await deleteCategory(id, token);
      toast.success('Deleted');
      await load();
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Delete failed'));
    }
  };

  return (
    <div>
      <h1 className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>
        CATEGORIES
      </h1>
      <form onSubmit={onCreate} className="mb-10 flex flex-wrap gap-4 items-end border border-[var(--black)] p-6 bg-[var(--card-bg)]">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" required />
        </div>
        <div>
          <Label>Slug (optional)</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-none" />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-none" />
        </div>
        <Button type="submit" className="rounded-none bg-[var(--black)] text-[var(--white)]">
          Add
        </Button>
      </form>
      <ul className="border border-[var(--black)] divide-y divide-[var(--border)]">
        {items.map((c) => (
          <li key={c.id} className="flex justify-between items-center p-4 gap-4">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{c.slug}</div>
            </div>
            <button type="button" className="text-xs underline text-destructive bg-transparent border-none cursor-pointer" onClick={() => void onDelete(c.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
