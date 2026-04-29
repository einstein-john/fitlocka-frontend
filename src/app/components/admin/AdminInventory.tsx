import { useAuth } from '@/app/context/AuthContext';
import { getInventory, patchInventory } from '@/lib/api/inventory';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminInventory() {
  const { token } = useAuth();
  const [productId, setProductId] = useState('');
  const [stock, setStock] = useState('');
  const [current, setCurrent] = useState<number | null>(null);

  const fetchStock = async () => {
    if (!token) return;
    const pid = Number(productId);
    if (Number.isNaN(pid)) {
      toast.error('Invalid product ID');
      return;
    }
    try {
      const inv = await getInventory(pid, token);
      setCurrent(inv?.stock ?? 0);
      setStock(String(inv?.stock ?? 0));
    } catch {
      toast.error('Could not load inventory');
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const pid = Number(productId);
    const s = Number(stock);
    if (Number.isNaN(pid) || Number.isNaN(s) || s < 0) {
      toast.error('Invalid values');
      return;
    }
    try {
      await patchInventory(pid, s, token);
      toast.success('Stock updated');
      setCurrent(s);
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Update failed'));
    }
  };

  return (
    <div>
      <h1 className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>
        INVENTORY
      </h1>
      <form onSubmit={save} className="max-w-md space-y-4 border border-[var(--black)] p-6 bg-[var(--card-bg)]">
        <div>
          <Label>Product ID</Label>
          <Input value={productId} onChange={(e) => setProductId(e.target.value)} className="rounded-none" />
        </div>
        <Button type="button" variant="outline" className="rounded-none" onClick={() => void fetchStock()}>
          Load stock
        </Button>
        {current !== null ? (
          <p className="text-sm text-[var(--muted-foreground)]">Current: {current}</p>
        ) : null}
        <div>
          <Label>New stock level</Label>
          <Input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className="rounded-none" />
        </div>
        <Button type="submit" className="rounded-none bg-[var(--black)] text-[var(--white)]">
          Save stock
        </Button>
      </form>
    </div>
  );
}
