# App Maker Developers Site
Based on Angular, NgRx and Angular Material Starter by [@tomastrajan](https://twitter.com/tomastrajan)

[![license](https://img.shields.io/github/license/tomastrajan/angular-ngrx-material-starter.svg)](https://github.com/tomastrajan/angular-ngrx-material-starter/blob/master/LICENSE) [![All Contributors](https://img.shields.io/badge/all_contributors-12-orange.svg?style=flat-square)](#contributors) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Build Status](https://travis-ci.org/tomastrajan/angular-ngrx-material-starter.svg?branch=master)](https://travis-ci.org/tomastrajan/angular-ngrx-material-starter) [![Twitter Follow](https://img.shields.io/twitter/follow/tomastrajan.svg?style=social&label=Follow)](https://twitter.com/tomastrajan)


## Getting started
```bash
git clone https://github.com/tomastrajan/angular-ngrx-material-starter.git new-project
cd new-project
npm install
npm start
```

## Useful Commands
  * `npm start` - starts a dev server and opens browser with running app
  * `npm run test` - runs lint and tests
  * `npm run watch` - runs tests in watch mode
  * `npm run prod` - runs full prod build and serves prod bundle
  * `npm run prettier` - runs prettier to format whole code base (`.ts` and `.scss`) 
  * `npm run analyze` - runs full prod build and `webpack-bundle-analyzer` to visualize how much code is shipped (dependencies & application) 

## Features

* custom themes support (3 themes included)
* lazy-loading of feature modules
* lazy reducers
* localStorage ui state persistence
* `@ngrx/effects` for API requests
* fully responsive design
* angular-material and custom components in `SharedModule`
 
## Stack

* Angular
* ngrx (or try [ngx-model](https://github.com/tomastrajan/ngx-model) if you prefer less boilerplate)
* Angular Material
* Bootstrap 4 (only reset, utils and grids)
