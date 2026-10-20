import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { I18nProvider } from './context/I18nContext.tsx';
import './index.css';
import './premium.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallbackTitle="HAVAH • Protección Serena">
    <I18nProvider>
      <App />
    </I18nProvider>
  </ErrorBoundary>
);
