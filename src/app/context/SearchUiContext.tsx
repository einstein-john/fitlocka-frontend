import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import RetroSearchOverlay from '@/app/components/RetroSearchOverlay';

type SearchUiValue = {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
};

const SearchUiContext = createContext<SearchUiValue | null>(null);

export function SearchUiProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);
  const toggleSearch = useCallback(() => setOpen((o) => !o), []);

  const value = useMemo(
    () => ({ open, openSearch, closeSearch, toggleSearch }),
    [open, openSearch, closeSearch, toggleSearch],
  );

  return (
    <SearchUiContext.Provider value={value}>
      {children}
      <RetroSearchOverlay />
    </SearchUiContext.Provider>
  );
}

export function useSearchUi(): SearchUiValue {
  const ctx = useContext(SearchUiContext);
  if (!ctx) {
    throw new Error('useSearchUi must be used within SearchUiProvider');
  }
  return ctx;
}
