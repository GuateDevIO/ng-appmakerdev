const packageJson = require('../../package.json');

export const environment = {
  appName: 'App Maker Developers',
  envName: 'TEST',
  production: false,
  test: true,
  i18nPrefix: '',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript']
  },
  firebaseConfig: {
    apiKey: 'AIzaSyDhSRYCtnQCfWF1NBuQGDv8Kk2QOUb0jSA',
    authDomain: 'guatedev-platform.firebaseapp.com',
    databaseURL: 'https://guatedev-platform.firebaseio.com',
    projectId: 'guatedev-platform',
    storageBucket: 'guatedev-platform.appspot.com',
    messagingSenderId: '1072313633743'
  }
};
