import { useAuth } from '@/app/context/AuthContext';
import { getProduct, updateProduct, attachProductImage, removeProductImage } from '@/lib/api/products';
import { listCategories } from '@/lib/api/categories';
import type { Category, Product } from '@/lib/api/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function AdminProductEdit() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [imgUrl, setImgUrl] = useState('');
  const [imgAlt, setImgAlt] = useState('');

  useEffect(() => {
    if (!token || !id) return;
    const pid = Number(id);
    if (Number.isNaN(pid)) return;
    let cancelled = false;
    (async () => {
      try {
        const [p, c] = await Promise.all([getProduct(pid, token), listCategories(token)]);
        if (cancelled) return;
        setCats(c);
        if (p) {
          setProduct(p);
          setName(p.name);
          setSku(p.sku);
          setPrice(String(p.price));
          setCategoryId(String(p.categoryId));
          setDescription(p.description ?? '');
          setStatus((p.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE');
        }
      } catch {
        toast.error('Failed to load product');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;
    const pid = Number(id);
    try {
      await updateProduct(
        pid,
        {
          name: name.trim(),
          sku: sku.trim(),
          price: Number(price),
          categoryId: Number(categoryId),
          description: description || null,
          status,
        },
        token
      );
      toast.success('Saved');
      const p = await getProduct(pid, token);
      setProduct(p ?? null);
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Save failed'));
    }
  };

  const addImg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id || !imgUrl.trim()) return;
    const pid = Number(id);
    try {
      await attachProductImage(pid, { url: imgUrl.trim(), altText: imgAlt || null, isPrimary: !(product?.images?.length) }, token);
      toast.success('Image linked');
      setImgUrl('');
      setImgAlt('');
      setProduct((await getProduct(pid, token)) ?? null);
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, 'Image failed'));
    }
  };

  const rmImg = async (productImageId: number) => {
    if (!token || !id) return;
    const pid = Number(id);
    try {
      await removeProductImage(pid, productImageId, token);
      setProduct((await getProduct(pid, token)) ?? null);
    } catch {
      toast.error('Could not remove image');
    }
  };

  if (!product && id) {
    return (
      <div>
        <Link to="/__admin/products" className="underline text-sm mb-6 inline-block">
          ← Products
        </Link>
        <p style={{ fontFamily: "'Space Mono', monospace" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/__admin/products" className="underline text-sm mb-6 inline-block">
        ← Products
      </Link>
      <h1 className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px' }}>
        EDIT PRODUCT
      </h1>
      <form onSubmit={save} className="max-w-xl space-y-4 mb-12 border border-[var(--black)] p-6 bg-[var(--card-bg)]">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" />
        </div>
        <div>
          <Label>SKU</Label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} className="rounded-none" />
        </div>
        <div>
          <Label>Price</Label>
          <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-none" />
        </div>
        <div>
          <Label>Category</Label>
          <select className="w-full h-9 border border-[var(--black)] bg-[var(--background)] px-2 rounded-none" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-none" />
        </div>
        <div>
          <Label>Status</Label>
          <select className="w-full h-9 border border-[var(--black)] bg-[var(--background)] px-2 rounded-none" value={status} onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <Button type="submit" className="rounded-none bg-[var(--black)] text-[var(--white)]">
          Save changes
        </Button>
      </form>

      <div className="max-w-xl mb-8">
        <h2 className="mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px' }}>
          Images
        </h2>
        <ul className="space-y-2 mb-6">
          {(product?.images ?? []).map((im) => (
            <li key={im.id} className="flex items-center justify-between gap-4 border border-[var(--border)] p-2">
              <span className="truncate text-xs">{im.url}</span>
              <button type="button" className="text-xs underline shrink-0" onClick={() => void rmImg(im.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addImg} className="flex flex-col gap-2">
          <Label>Add image URL</Label>
          <Input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://..." className="rounded-none" />
          <Input value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} placeholder="Alt text" className="rounded-none" />
          <Button type="submit" variant="outline" className="rounded-none w-fit">
            Attach image
          </Button>
        </form>
      </div>

      <Button type="button" variant="ghost" className="rounded-none" onClick={() => navigate('/__admin/products')}>
        Done
      </Button>
    </div>
  );
}
