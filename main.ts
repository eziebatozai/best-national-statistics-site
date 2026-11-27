// Nusantara Stats (Round 2 — Archipelagic Statistical Observatory) hand-in entrypoint.
// Node 22+, standard library only. Copies static app/ and screenshots/ into MAKEFUN_OUTPUT_DIR
// (or /output) and builds deterministic dossier.json via vendor/makefun-frontend.ts.

import { cpSync, existsSync, mkdirSync, openSync, closeSync, readSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const DOSSIER_GATE_MAX_BYTES = 1572864;
const INDEX_HTML_MAX_BYTES = 1048576;
const SHOT_MIN_COUNT = 3;
const SHOT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}\.(?:jpg|jpeg|png)$/i;

const COMPETITION_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function excludeHiddenEntries(sourcePath: string): boolean {
  return !basename(sourcePath).startsWith('.');
}

function getLayoutPaths() {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  return {
    rootDir,
    outDir,
    appSource: join(rootDir, 'app'),
    indexFile: join(rootDir, 'app', 'index.html'),
    shotsSource: join(rootDir, 'screenshots'),
    appTarget: join(outDir, 'app'),
    shotsTarget: join(outDir, 'screenshots'),
    dossierTarget: join(outDir, 'dossier.json'),
  };
}

function hasValidImageHeader(filePath: string): boolean {
  const header = Buffer.alloc(8);
  const fd = openSync(filePath, 'r');
  try {
    const read = readSync(fd, header, 0, 8, 0);
    if (read < 4) return false;
    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    return isJpeg || isPng;
  } finally {
    closeSync(fd);
  }
}

function assertValidSourceTree(appSource: string, indexFile: string, shotsSource: string) {
  if (!existsSync(appSource) || !statSync(appSource).isDirectory()) {
    throw new Error(`Required static directory not found: ${appSource}`);
  }
  if (!existsSync(indexFile) || !statSync(indexFile).isFile()) {
    throw new Error(`Required entry HTML not found: ${indexFile}`);
  }
  const indexSize = statSync(indexFile).size;
  if (indexSize > INDEX_HTML_MAX_BYTES) {
    throw new Error(`Entry HTML exceeds ${INDEX_HTML_MAX_BYTES} bytes (${indexSize})`);
  }
  if (!existsSync(shotsSource) || !statSync(shotsSource).isDirectory()) {
    throw new Error(`Required screenshots directory not found: ${shotsSource}`);
  }

  const visibleShots = readdirSync(shotsSource)
    .filter((name) => !name.startsWith('.'))
    .sort();
  if (visibleShots.length < SHOT_MIN_COUNT || visibleShots.length > COMPETITION_CAPS.screenshots.max) {
    throw new Error(`Expected ${SHOT_MIN_COUNT}..${COMPETITION_CAPS.screenshots.max} screenshots, found ${visibleShots.length}`);
  }

  for (const name of visibleShots) {
    if (!SHOT_PATTERN.test(name)) {
      throw new Error(`Invalid screenshot filename: ${name}`);
    }
    const shotPath = join(shotsSource, name);
    const shotStat = statSync(shotPath);
    if (!shotStat.isFile()) {
      throw new Error(`Screenshot entry is not a regular file: ${name}`);
    }
    if (shotStat.size > COMPETITION_CAPS.screenshots.max_bytes) {
      throw new Error(`Screenshot ${name} exceeds ${COMPETITION_CAPS.screenshots.max_bytes} bytes (${shotStat.size})`);
    }
    if (!hasValidImageHeader(shotPath)) {
      throw new Error(`Screenshot ${name} does not start with a valid PNG or JPEG signature`);
    }
  }
}

function copyCleanDirectory(src: string, dest: string) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true, filter: excludeHiddenEntries });
}

function runHandIn() {
  const paths = getLayoutPaths();
  assertValidSourceTree(paths.appSource, paths.indexFile, paths.shotsSource);

  mkdirSync(paths.outDir, { recursive: true });
  copyCleanDirectory(paths.appSource, paths.appTarget);
  copyCleanDirectory(paths.shotsSource, paths.shotsTarget);

  const dossierBytes = buildDossier(paths.outDir, COMPETITION_CAPS);
  if (dossierBytes.byteLength > DOSSIER_GATE_MAX_BYTES) {
    throw new Error(`Dossier size ${dossierBytes.byteLength} exceeds gate cap ${DOSSIER_GATE_MAX_BYTES}`);
  }
  writeFileSync(paths.dossierTarget, dossierBytes);
}

runHandIn();
