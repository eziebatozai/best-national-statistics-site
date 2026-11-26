// Nusantara Stats build & hand-in entrypoint (Node 22+, standard library only).
// Copies the static app/ and screenshots/ directories into MAKEFUN_OUTPUT_DIR (or /output)
// and generates dossier.json via the vendored makefun-frontend library.

import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const DOSSIER_MAX_GATE_BYTES = 1572864;

const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function skipDotfiles(sourcePath: string): boolean {
  return !basename(sourcePath).startsWith('.');
}

function resolvePaths() {
  const repoDir = dirname(fileURLToPath(import.meta.url));
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  return {
    appSrc: join(repoDir, 'app'),
    indexSrc: join(repoDir, 'app', 'index.html'),
    shotsSrc: join(repoDir, 'screenshots'),
    outputDir,
    appDest: join(outputDir, 'app'),
    shotsDest: join(outputDir, 'screenshots'),
    dossierDest: join(outputDir, 'dossier.json'),
  };
}

function stageSubmission() {
  const paths = resolvePaths();
  if (!existsSync(paths.appSrc) || !statSync(paths.appSrc).isDirectory()) {
    throw new Error(`Missing static site directory: ${paths.appSrc}`);
  }
  if (!existsSync(paths.indexSrc) || !statSync(paths.indexSrc).isFile()) {
    throw new Error(`Missing site entry page: ${paths.indexSrc}`);
  }

  mkdirSync(paths.outputDir, { recursive: true });
  rmSync(paths.appDest, { recursive: true, force: true });
  cpSync(paths.appSrc, paths.appDest, { recursive: true, filter: skipDotfiles });

  rmSync(paths.shotsDest, { recursive: true, force: true });
  mkdirSync(paths.shotsDest, { recursive: true });
  if (existsSync(paths.shotsSrc) && statSync(paths.shotsSrc).isDirectory()) {
    cpSync(paths.shotsSrc, paths.shotsDest, { recursive: true, filter: skipDotfiles });
  }

  const dossierPayload = buildDossier(paths.outputDir, DOSSIER_LIMITS);
  if (dossierPayload.byteLength > DOSSIER_MAX_GATE_BYTES) {
    throw new Error(`Generated dossier exceeds ${DOSSIER_MAX_GATE_BYTES} bytes (${dossierPayload.byteLength})`);
  }
  writeFileSync(paths.dossierDest, dossierPayload);
}

stageSubmission();
