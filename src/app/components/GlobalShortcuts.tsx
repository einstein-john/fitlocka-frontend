import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchUi } from '@/app/context/SearchUiContext';

/** Cmd/Ctrl+Shift+M opens the hidden management panel (admin JWT still required). Cmd/Ctrl+K toggles catalog search. */
export default function GlobalShortcuts() {
  const navigate = useNavigate();
  const { toggleSearch } = useSearchUi();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        navigate('/__admin');
        return;
      }
      if (mod && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, toggleSearch]);

  return null;
}
