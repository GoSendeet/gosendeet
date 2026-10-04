import { loadEnv } from 'vite';
import subscribe from '../api/subscribe.mjs';

// Dev and production-build previews run the same handler as the Vercel function.
function attachNewsletterApi(server) {
  const { KIT_API_KEY } = loadEnv(server.config.mode, server.config.envDir, 'KIT_');
  if (KIT_API_KEY) process.env.KIT_API_KEY = KIT_API_KEY;
  server.middlewares.use((req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/subscribe') return next();
    subscribe(req, res).catch(next);
  });
}

export function newsletterDevPlugin() {
  return {
    name: 'newsletter-api',
    configureServer: attachNewsletterApi,
    configurePreviewServer: attachNewsletterApi,
  };
}
