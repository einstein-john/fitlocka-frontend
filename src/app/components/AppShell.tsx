import { Outlet } from 'react-router';
import GlobalShortcuts from '@/app/components/GlobalShortcuts';
import { SearchUiProvider } from '@/app/context/SearchUiContext';

export default function AppShell() {
  return (
    <SearchUiProvider>
      <GlobalShortcuts />
      <Outlet />
    </SearchUiProvider>
  );
}
