// import favicon from 'serve-favicon';
import compression from 'compression';
import config from '../config';
import esteHeaders from '../lib/estemiddleware';
import express from 'express';
import intlMiddleware from '../lib/intlmiddleware';
import render from './render';
import userState from './userstate';

const app = express();

app.use(esteHeaders());
app.use(compression());

// app.use(favicon('assets/img/favicon.ico'))
app.use('/build', express.static('build'));
app.use('/assets', express.static('assets'));

// Intl
app.use('/node_modules/intl/dist', express.static('node_modules/intl/dist'));
app.use('/node_modules/intl/locale-data', express.static('node_modules/intl/locale-data'));

// Load translations, fallback to defaultLocale if no translation is available.
app.use(intlMiddleware({
  defaultLocale: config.defaultLocale
}));

// Load state extras for current user.
app.use(userState());

app.get('*', (req, res, next) => {
  render(req, res, req.userState, {intl: req.intl}).catch(next);
});

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
