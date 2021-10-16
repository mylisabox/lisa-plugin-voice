import {Plugin} from 'lisa-plugin';
import {createRequire} from 'module';
import config from './config/index.js';
import drivers from './drivers/index.js';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default class VoicePlugin extends Plugin {
  constructor(app) {
    super(app, {
      drivers: drivers,
      pkg: pkg,
      config: config,
    })
  }
}
