import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// history.replaceState(null, '', window.location.pathname + window.location.search);
// history.scrollRestoration = 'manual';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
