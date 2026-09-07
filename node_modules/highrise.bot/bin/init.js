#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COLORS = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

const TEMPLATE_DIR = path.join(__dirname, '../templates');
const TARGET_DIR = process.cwd();

const FILES_TO_COPY = [
  { src: 'bot.js', dest: 'index.js' },
  { src: '.env.example', dest: '.env' },
];

function log(color, prefix, message) {
  console.log(`${COLORS[color]}${prefix}${COLORS.reset} ${message}`);
}

function copyTemplateFiles() {
  FILES_TO_COPY.forEach(({ src, dest }) => {
    const sourcePath = path.join(TEMPLATE_DIR, src);
    const destPath = path.join(TARGET_DIR, dest);

    if (fs.existsSync(destPath)) {
      log('yellow', '  ! skipping', `${dest} (already exists)`);
      return;
    }

    try {
      fs.copyFileSync(sourcePath, destPath);
      log('green', '  + created', dest);
    } catch (err) {
      log('red', '  - error', `copying ${dest}: ${err.message}`);
    }
  });
}

function updatePackageJson() {
  const pkgPath = path.join(TARGET_DIR, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    log('yellow', '  ! warning', "No package.json found. Run 'npm init' first.");
    return { hasDotenv: false };
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.scripts = pkg.scripts || {};

    if (!pkg.scripts.start) {
      pkg.scripts.start = 'node index.js';
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      log('green', '  + updated', 'package.json scripts');
    }

    const hasDotenv = !!(pkg.dependencies?.dotenv || pkg.devDependencies?.dotenv);
    return { hasDotenv };
  } catch (err) {
    log('red', '  ! error', 'reading package.json');
    return { hasDotenv: false };
  }
}

function printNextSteps(hasDotenv) {
  console.log(`\n${COLORS.green}--- Setup Complete ---${COLORS.reset}`);

  if (hasDotenv) {
    console.log(`${COLORS.cyan}1.${COLORS.reset} Dependency 'dotenv' already found.`);
  } else {
    console.log(`${COLORS.cyan}1.${COLORS.reset} Run: ${COLORS.yellow}npm install dotenv${COLORS.reset}`);
  }

  console.log(`${COLORS.cyan}2.${COLORS.reset} Add your credentials to the ${COLORS.yellow}.env${COLORS.reset} file`);
  console.log(`${COLORS.cyan}3.${COLORS.reset} Start your bot with: ${COLORS.yellow}npm start${COLORS.reset}\n`);
}

function main() {
  log('cyan', '[highrise.bot]', 'Initializing project...');
  copyTemplateFiles();
  const { hasDotenv } = updatePackageJson();
  printNextSteps(hasDotenv);
}

main();