import { Toaster } from 'sonner';
import type { CSSProperties } from 'react';

const toasterStyle = {
  '--normal-bg': 'var(--card-bg)',
  '--normal-border': 'var(--black)',
  '--normal-text': 'var(--foreground)',
} as CSSProperties;

/**
 * Sonner instance styled via sonner-retro.css (cream card, sharp corners, Bebas titles).
 * Keep richColors so success/error icons still set data-type; CSS flattens fills to match the site.
 */
export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      theme="light"
      richColors
      closeButton
      expand={false}
      offset="72px"
      toastOptions={{
        classNames: {
          toast: 'fitlocka-sonner-toast',
        },
      }}
      style={toasterStyle}
    />
  );
}
