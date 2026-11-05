#!/usr/bin/env node
// Lab 6 — installs tools/hooks/pre-commit into .git/hooks/pre-commit (no extension, executable).
// The versioned copy in tools/hooks is the source of truth; .git/hooks is not tracked by git.
import { chmodSync, copyFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

// Always the classic .git/hooks (not core.hooksPath): Husky keeps its own stubs in .husky/_
// and runs the same gate through .husky/pre-commit.
const gitDir = execSync('git rev-parse --git-common-dir').toString().trim();
const hooksDir = join(gitDir, 'hooks');
mkdirSync(hooksDir, { recursive: true });
const target = join(hooksDir, 'pre-commit');
copyFileSync('tools/hooks/pre-commit', target);
chmodSync(target, 0o755); // same as: chmod +x .git/hooks/pre-commit (no-op on NTFS)
console.log(`pre-commit hook installed -> ${target}`);
