import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

// Global Fetch Interceptor to attach JWT token
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const isApiRequest = typeof resource === 'string' && (resource.startsWith('/') || resource.includes('/api/'));
  if (isApiRequest) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config = config || {};
          config.headers = config.headers || {};
          if (config.headers instanceof Headers) {
            config.headers.set('Authorization', `Bearer ${user.token}`);
          } else if (Array.isArray(config.headers)) {
            config.headers.push(['Authorization', `Bearer ${user.token}`]);
          } else {
            config.headers['Authorization'] = `Bearer ${user.token}`;
          }
        }
      } catch (e) {
        console.error('Error parsing user from localStorage for auth token', e);
      }
    }
  }
  return originalFetch(resource, config);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)

