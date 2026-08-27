import { useEffect, useState } from 'react';
import type { Category } from '@/lib/api/types';

const mono = { fontFamily: "'Space Mono', monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

export type SortKey = 'newest' | 'price_asc' | 'price_desc';

export type FilterState = {
  categoryId: string; // '' = all
  sort: SortKey;
};

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'price_asc', label: 'Price ↑' },
  { key: 'price_desc', label: 'Price ↓' },
];

/** Mobile bottom-sheet for sort + filter. Design ref: canvas 1e.
 *  Controlled: pass current state, receive the applied state via onApply. */
export default function FilterSheet({
  open,
  onClose,
  categories,
  value,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  value: FilterState;
  onApply: (next: FilterState) => void;
}) {
  const [draft, setDraft] = useState<FilterState>(value);

  // Depend on the fields, not the object identity — the parent passes a fresh
  // literal every render, which would otherwise discard un-applied edits.
  useEffect(() => {
    if (open) setDraft({ categoryId: value.categoryId, sort: value.sort });
  }, [open, value.categoryId, value.sort]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const chip = (active: boolean) =>
    `cursor-pointer px-3.5 py-2 text-[9px] uppercase tracking-[0.1em] ${
      active ? 'bg-[var(--black)] text-[var(--white)] border border-[var(--black)]' : 'bg-transparent text-[var(--black)] border border-[var(--black)]'
    }`;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col justify-end lg:hidden">
      <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0 bg-black/45 border-none cursor-pointer" />
      <div className="relative bg-[var(--white)] border-t-[1.5px] border-[var(--black)] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b-[1.5px] border-[var(--black)] sticky top-0 bg-[var(--white)]">
          <span style={{ ...bebas, fontSize: '26px' }}>SORT &amp; FILTER</span>
          <button type="button" onClick={onClose} aria-label="Close" className="bg-transparent border-none p-2 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 20 20" stroke="var(--black)" strokeWidth="1.6">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 border-b border-[var(--border)] flex flex-col gap-3">
          <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Sort by
          </span>
          <div className="flex flex-wrap gap-2" style={mono}>
            {SORTS.map((s) => (
              <button key={s.key} type="button" className={chip(draft.sort === s.key)} style={mono} onClick={() => setDraft((d) => ({ ...d, sort: s.key }))}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-5 flex flex-col gap-3">
          <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Collection
          </span>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={chip(draft.categoryId === '')} style={mono} onClick={() => setDraft((d) => ({ ...d, categoryId: '' }))}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} type="button" className={chip(draft.categoryId === String(c.id))} style={mono} onClick={() => setDraft((d) => ({ ...d, categoryId: String(c.id) }))}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-2.5 px-5 py-4 border-t-[1.5px] border-[var(--black)]">
          <button type="button" className="border-[1.5px] border-[var(--black)] bg-transparent py-3.5 cursor-pointer text-[10px] uppercase tracking-[0.12em]" style={mono} onClick={() => setDraft({ categoryId: '', sort: 'newest' })}>
            Clear
          </button>
          <button
            type="button"
            className="bg-[var(--accent)] text-[var(--white)] border-none py-3.5 cursor-pointer text-[10px] uppercase tracking-[0.12em]"
            style={mono}
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
        <div className="h-[max(env(safe-area-inset-bottom),12px)]" />
      </div>
    </div>
  );
}
