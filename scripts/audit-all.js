import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';

const routes = [
  '/',
  '/tablas',
  '/lapiceros',
  '/palabras',
  '/numeros',
  '/operaciones',
  '/agrupacion',
  '/operaciones/suma',
  '/operaciones/resta',
  '/operaciones/multiplicaciones',
  '/operaciones/divisiones',
  '/operaciones/multiplicaciones/tablas',
  '/operaciones/multiplicaciones/recortados',
  '/operaciones/multiplicaciones/celosia',
  '/operaciones/multiplicaciones/clasico'
];

// Lee la URL base de los argumentos de consola o usa la de preview por defecto
const baseUrlInput = process.argv[2] || 'http://localhost:4173';
// Quita la barra final si existe
const baseUrl = baseUrlInput.endsWith('/') ? baseUrlInput.slice(0, -1) : baseUrlInput;

const reportsDir = path.join(process.cwd(), 'reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

console.log(`====================================================`);
console.log(`  INICIANDO AUDITORÍA MULTIPÁGINA DE LIGHTHOUSE`);
console.log(`  URL Base: ${baseUrl}`);
console.log(`  Destino: ${reportsDir}`);
console.log(`====================================================\n`);

routes.forEach((route, index) => {
  const url = `${baseUrl}${route}`;
  const filename = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
  const reportPath = path.join(reportsDir, `report-${filename}.html`);

  console.log(`[${index + 1}/${routes.length}] Auditando: ${url}`);
  console.log(`Guardando reporte en: ${reportPath}`);

  try {
    // Ejecuta Lighthouse en modo headless, forzando incognito y sin extensiones
    execSync(
      `npx lighthouse ${url} --output html --output-path "${reportPath}" --chrome-flags="--headless --disable-extensions --incognito" --quiet`,
      { stdio: 'inherit' }
    );
    console.log(`✓ Completado exitosamente.\n`);
  } catch (error) {
    console.error(`✗ Error al auditar la ruta: ${route}`);
    console.error(error.message);
    console.log('');
  }
});

console.log(`====================================================`);
console.log(`  AUDITORÍA FINALIZADA`);
console.log(`  Todos los reportes están guardados en la carpeta /reports`);
console.log(`====================================================`);
