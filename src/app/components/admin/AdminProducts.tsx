import { useAuth } from '@/app/context/AuthContext';
import { listProducts, createProduct, deleteProduct } from '@/lib/api/products';
import { listCategories } from '@/lib/api/categories';
import type { Category, Product } from '@/lib/api/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { formatPrice } from '@/app/components/product/ProductTile';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getUserFacingErrorMessage } from '@/lib/api/userError';

export default function AdminProducts() {
  const { token } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('0');

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [p, c] = await Promise.all([listProducts(token, { limit: 100 }), listCategories(token, { limit: 200 })]);
      setItems(p.items);
      setCats(c);
      if (c.length && !categoryId) setCategoryId(String(c[0].id));
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const cid = Number(categoryId);
    const pr = Number(price);
    const st = Number(stock);
    if (!name.trim() || !sku.trim() || Number.isNaN(cid) || Number.isNaN(pr)) {
      toast.error('Fill required fields');
      return;
    }
    try {
      await createProduct(
        {
          categoryId: cid,
          name: name.trim(),
          sku: sku.trim(),
          price: pr,
          initialStock: Number.isFinite(st) ? st : 0,
        },
        token
      );
      toast.success('Product created');
      setName('');
      setSku('');
      setPrice('');
      setStock('0');
      await load();
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Create failed'));
    }
  };

  const onDelete = async (id: number) => {
    if (!token || !confirm('Delete this product?')) return;
    try {
      await deleteProduct(id, token);
      toast.success('Deleted');
      await load();
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Delete failed'));
    }
  };

  return (
    <div>
      <h1 className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>
        PRODUCTS
      </h1>

      <form onSubmit={onCreate} className="mb-12 grid grid-cols-1 md:grid-cols-6 gap-4 items-end border border-[var(--black)] p-6 bg-[var(--card-bg)]">
        <div className="md:col-span-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" required />
        </div>
        <div>
          <Label>SKU</Label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} className="rounded-none" required />
        </div>
        <div>
          <Label>Price</Label>
          <Input type="number" step="0.01" min="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-none" required />
        </div>
        <div>
          <Label>Category</Label>
          <select
            className="w-full h-9 border border-[var(--black)] bg-[var(--background)] px-2 rounded-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Initial stock</Label>
          <Input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className="rounded-none" />
        </div>
        <div className="md:col-span-6">
          <Button type="submit" className="rounded-none bg-[var(--black)] text-[var(--white)]">
            Create product
          </Button>
        </div>
      </form>

      {loading ? (
        <p style={{ fontFamily: "'Space Mono', monospace" }}>Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-[var(--black)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--cream)] border-b border-[var(--black)]">
                <th className="text-left p-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
                  ID
                </th>
                <th className="text-left p-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
                  Name
                </th>
                <th className="text-left p-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
                  SKU
                </th>
                <th className="text-left p-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
                  Price
                </th>
                <th className="text-left p-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)]">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{formatPrice(Number(p.price))}</td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <Link to={`/product/${p.id}`} className="underline text-xs" target="_blank" rel="noreferrer">
                      View
                    </Link>
                    <Link to={`/__admin/products/${p.id}`} className="underline text-xs">
                      Edit
                    </Link>
                    <button type="button" className="underline text-xs text-destructive bg-transparent border-none cursor-pointer" onClick={() => void onDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
