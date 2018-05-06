# CodePush

## Intro

React Native app is composed of JavaScript files, images, which are bundled together by the packager and distributed as part of a platform-specific binary (i.e. an .ipa or .apk file). Once the app is released, updating either the JavaScript code or image assets, requires you to recompile and redistribute the entire binary.

The CodePush plugin helps get product improvements in front of your end users instantly, with the aid of preserving your javascript and images synchronized with updates you launch to the CodePush server. This way, your app gets the benefits of an offline mobile experience, as well as the "web-like" agility of side-loading updates as soon as they are available.

## Setup

Want to check if your code is formatted consistently + pick up on any syntax errors:


## Usage

Only use CodePush through one of these terminal commands `yarn fathom` or `npm run fathom` with option `4`

## Writing and Running Tests

This project is set up to use [jest](https://facebook.github.io/jest/) for tests. You can configure whatever testing strategy you like, but jest works out of the box. Create test files in directories called `__tests__` or with the `.test` extension to have the files loaded by jest. See the [the template project](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/App.test.js) for an example test. The [jest documentation](https://facebook.github.io/jest/docs/en/getting-started.html) is also a wonderful resource, as is the [React Native testing tutorial](https://facebook.github.io/jest/docs/en/tutorial-react-native.html).

#### `npm test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

## Jest Snapshots

Run `npm test` to run a test and add `-- --watch` to run it in developer mode.

To run an individual Jest test:
* Run `jest path/to/test.js` if you have Jest installed globally
* Run `node_modules/.bin/jest path/to/test.js` to use the projects Jest installation

Tests should be placed in their related parents folder to keep consistency, i.e __components/\_\_tests\_\___ or __containers/\_\_tests\_\___

- (Snapshot testing) https://facebook.github.io/jest/docs/tutorial-react-native.html#snapshot-test
- (DOM testing WIP) https://facebook.github.io/jest/docs/tutorial-react.html#dom-testing