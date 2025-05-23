import { StrictMode, Suspense } from 'react';
import type { FC } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Fallback UI shown while i18n and other async resources load.
 */
const Loading: FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    Loading...
  </div>
);

// Get the root DOM node and create a React root
const container = document.getElementById('root')!;
const root = createRoot(container);

// Render the application inside React.StrictMode and Suspense
root.render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </StrictMode>
);
