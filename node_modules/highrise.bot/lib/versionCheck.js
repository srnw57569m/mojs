const Logger = require('../src/Tools/Logger');

const log = new Logger("npm")

async function checkSdkVersion() {
  const { name, version } = require('../package.json')
  const { version: latest } = await fetch(`https://registry.npmjs.org/${name}/latest`).then(r => r.json());

  if (version === latest) {
    log.info(`${name} v${version} is up to date.\n`);
  } else {
    log.warn(`${name} v${version} is outdated. Latest is v${latest}. Run: npm install ${name}@latest\n`);
  }
}

module.exports = checkSdkVersion