#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const usage = `Usage: node audit-media.mjs <manifest.json> [--out <report.json>] [--ffprobe <executable>]

Read-only local media audit. Requires ffprobe on PATH or --ffprobe.
Manifest: {"assets":[{"id":"hero","kind":"video","file":"media/hero.mp4",
"poster":"media/hero.webp","expectedAudio":false,"maxBytes":12000000}]}
Paths are relative to the manifest directory. kind: image | video.
expectedAudio and maxBytes are optional. Video posters are required by this audit.
No network access, uploads, generation, or media modification.
Exit 0: metadata checks pass. Exit 1: asset problems. Exit 2: invalid input/tool.
Does not prove visual quality, motion, audible speech, rights, or device playback.`;

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 2;
}
function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function probe(file, binary) {
  return JSON.parse(execFileSync(binary, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], {
    encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']
  }));
}
function requireFile(file) {
  if (!fs.statSync(file).isFile()) throw new Error(`Not a regular file: ${file}`);
}
function run() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) { console.log(usage); return; }
  if (!args.length || args[0].startsWith('--')) throw new Error(usage);
  const manifestPath = path.resolve(args[0]);
  let out = null;
  let binary = 'ffprobe';
  const flags = new Set();
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i], value = args[i + 1];
    if (!['--out', '--ffprobe'].includes(flag) || !value || value.startsWith('--') || flags.has(flag)) throw new Error(`Invalid option: ${flag}\n${usage}`);
    flags.add(flag);
    if (flag === '--out') out = path.resolve(value); else binary = value;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!isRecord(manifest) || !Array.isArray(manifest.assets) || !manifest.assets.length) throw new Error('Manifest must contain a nonempty assets array.');
  const ids = new Set();
  for (const a of manifest.assets) {
    if (!isRecord(a) || typeof a.id !== 'string' || !a.id.trim() || ids.has(a.id)) throw new Error('Asset IDs must be nonempty and unique.');
    ids.add(a.id);
    if (!['image', 'video'].includes(a.kind) || typeof a.file !== 'string' || !a.file.trim()) throw new Error(`Invalid kind/file for ${a.id}.`);
    if (a.poster !== undefined && (typeof a.poster !== 'string' || !a.poster.trim())) throw new Error(`Invalid poster for ${a.id}.`);
    if (a.expectedAudio !== undefined && typeof a.expectedAudio !== 'boolean') throw new Error(`expectedAudio must be boolean for ${a.id}.`);
    if (a.maxBytes !== undefined && (!Number.isSafeInteger(a.maxBytes) || a.maxBytes <= 0)) throw new Error(`maxBytes must be a positive integer for ${a.id}.`);
  }
  const directory = path.dirname(manifestPath);
  const localFiles = manifest.assets.flatMap(a => [a.file, ...(a.poster ? [a.poster] : [])]).map(f => path.resolve(directory, f));
  const resolvedOut = out && fs.existsSync(out) ? fs.realpathSync(out) : out;
  const inputPaths = [manifestPath, ...localFiles].map(f => fs.existsSync(f) ? fs.realpathSync(f) : f);
  if (resolvedOut && inputPaths.includes(resolvedOut)) throw new Error('Report path must not overwrite the manifest or a media asset.');
  try { execFileSync(binary, ['-version'], {stdio: 'ignore', timeout: 10000}); }
  catch { throw new Error('ffprobe is unavailable. Install it in your environment or pass --ffprobe.'); }
  const assets = manifest.assets.map(a => {
    const file = path.resolve(directory, a.file);
    const result = {id: a.id, kind: a.kind, file, issues: []};
    try {
      requireFile(file);
      const data = probe(file, binary);
      const visual = data.streams?.find(s => s.codec_type === 'video');
      result.bytes = fs.statSync(file).size;
      result.codec = visual?.codec_name ?? null;
      result.width = visual?.width ?? null;
      result.height = visual?.height ?? null;
      result.hasAudio = Boolean(data.streams?.some(s => s.codec_type === 'audio'));
      const duration = Number(data.format?.duration ?? visual?.duration);
      result.durationSeconds = Number.isFinite(duration) ? duration : null;
      if (!visual || !result.width || !result.height) result.issues.push('No visual stream dimensions.');
      if (a.kind === 'video' && !(result.durationSeconds > 0)) result.issues.push('Video duration is missing or zero.');
      if (a.expectedAudio !== undefined && a.expectedAudio !== result.hasAudio) result.issues.push(`Expected audio=${a.expectedAudio}; found=${result.hasAudio}.`);
      if (a.maxBytes !== undefined && result.bytes > a.maxBytes) result.issues.push(`Size ${result.bytes} exceeds configured ${a.maxBytes} bytes.`);
    } catch (error) {
      result.issues.push(`Asset probe failed: ${error.code ?? error.message}`);
    }
    if (a.kind === 'video' && !a.poster) result.issues.push('Video poster is not declared.');
    if (a.poster) {
      const poster = path.resolve(directory, a.poster);
      try {
        requireFile(poster);
        const data = probe(poster, binary);
        const visual = data.streams?.find(s => s.codec_type === 'video');
        if (!visual?.width || !visual?.height) throw new Error('No visual dimensions.');
        result.poster = {file: poster, width: visual.width, height: visual.height};
      } catch (error) { result.issues.push(`Poster probe failed: ${error.code ?? error.message}`); }
    }
    return result;
  });
  const report = {
    checkedAt: new Date().toISOString(), manifest: manifestPath,
    status: assets.some(a => a.issues.length) ? 'FAIL' : 'PASS', assets,
    limits: 'Metadata checks only; visual motion, audible content, rights and device playback require separate verification.'
  };
  if (out) fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.status === 'FAIL') process.exitCode = 1;
}
try { run(); } catch (error) { fail(error.message); }
