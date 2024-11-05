const { loadRemote, init } = require('@module-federation/runtime');
import {performReload, revalidate} from '@module-federation/node/utils';

console.log('hello from host app1');

let instance;

async function initAndLoad() {
  // console.log('clearing global.global.__FEDERATION__.__INSTANCES__', global.__FEDERATION__.__INSTANCES__?.[0]);
  // Clear entries from __GLOBAL_LOADING_REMOTE_ENTRY__
  // if (global.__GLOBAL_LOADING_REMOTE_ENTRY__) {
  //   for (const key in global.__GLOBAL_LOADING_REMOTE_ENTRY__) {
  //     console.log('deleting key', key);
  //     if (global.__GLOBAL_LOADING_REMOTE_ENTRY__.hasOwnProperty(key)) {
  //       delete global.__GLOBAL_LOADING_REMOTE_ENTRY__[key];
  //     }
  //   }
  // }

  // if (instance) {
  //   console.log('clearing module cache');
  //   instance.moduleCache.clear();
  // }

  await performReload(true)

  instance = init({
    name: 'app1',
    remotes: [
      {
        name: 'app2',
        entry: 'http://localhost:3002/remoteEntry.js',
      },
    ],
  });

  loadRemote('app2/sample').then(sample => {
    console.log('loaded sample', sample);
  });

  // console.log('NOW global.__GLOBAL_LOADING_REMOTE_ENTRY__', global.__GLOBAL_LOADING_REMOTE_ENTRY__?.[0]);
}

initAndLoad();

setInterval(async () => {
  console.log('host(): checking for updates');

  // NOTE: this is called the first time an update is detected on the remote and never again
  // NOTE: had to patch hot-reload.js to get this to not throw an error
  // we automatically reset require cache, so the reload callback is only if you need to do something else
  const shouldReload = await revalidate();

  // do something extra after revalidation
  if (shouldReload) {
    // reload the server
    console.log('host(): should reload');
    initAndLoad();
  } else {
    console.log('host(): should not reload');
  }
}, 3000);

// Handle hot module replacement
if (module.hot) {
  // NOTE: this never triggers
  module.hot.accept(async () => {
    console.log('host(): Plugin has been reloaded');
    await loadPlugin();  // Dynamically reload the plugin
  });

  // Hook into the HMR events to log additional details
  // NOTE: I only get the 'idle' & 'check' statuses
  module.hot.addStatusHandler((status) => {
    console.log(`host(): [HMR Status] ${status}`);
  });
}

setTimeout(() => {}, 1000000);
