# Fathom

Fathom Android/iOS Mobile and Web app

---

## Intro

This is a joint [React Web app](https://reactjs.org/) and [React Native app](https://facebook.github.io/react-native/) sharing a single code base. It shares the 'business logic' (_i.e. actions, containers, reducers, constants, themes_) across the platforms, whilst allowing flexibility in View components to ensure your project looks and feels native in each platform.

## Docs

1. [Features](#features)
1. **Before you start**
   1. [Getting Started with React Native](/docs/react-native.md)
   1. [React Native Quick Tips](/docs/quick-tips.md)
   1. [Understanding the File Structure](#understanding-the-file-structure)
   1. [Opinions Guiding this Project](/docs/opinions.md)
1. **Using this project**
   1. [Getting Up and Running](#getting-started)
   1. [Renaming the App](/docs/renaming.md)
   1. [Interacting with a REST API](/docs/api.md)
   1. [Testing](/docs/testing.md)
   1. [CodePush](/docs/codepush.md)
   1. [Contributiing](/docs/contributing.md)

---

## Features

### A shared React and React Native structure
| Feature | Summary |
| --- | --- |
|| __Flux architecture__ |
| [Redux](https://redux.js.org/docs/introduction/) | A predictable state container - Helping you write applications that behave consistently and run in different environments |
|||
|||
|| __Routing and navigation__ |
| [React Native Router Flux](https://github.com/aksonov/react-native-router-flux) | Router for React Native based on new React Native Navigation API for native mobile <br><br>['How to' Guide &rarr;](/src/navigation/README.md) |
| [React Router](https://github.com/ReactTraining/react-router) | Router for React based on React Navigation aPI for web |
|||
|||
|| __Data Caching / Offline__ |
| [Redux Persist](https://github.com/rt2zz/redux-persist) | Persist store data using localStorage for web and AsyncStorage for native mobile |
|||
|||
|| __UI Toolkit/s__ |
| [React Native Elements](https://react-native-training.github.io/react-native-elements/) | Cross Platform React Native UI Toolkit |
| [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) | Easily use icons from a wide range of icon libraries, it's as simple as importing the icon font and then `<Icon name={'ios-alert-outline'} size={50} color={"#CCC"} />` |
| [Tcomb Form Validation](https://github.com/gcanti/tcomb-form-native) | An example on how to create forms with validation. |
| [Bootstrap 4](https://getbootstrap.com/) with [Reactstrap](https://reactstrap.github.io/) | Bootstrap based React style UI Componants |
|||
|||
|| __Style__ |
| [ESLint Linting](https://eslint.org/) | ESLint linting code style guide |
| [Boilerplate](#understanding-the-file-structure) | Directory/file structure useful for scaling apps |

---

## Getting Started

### 1. Setup

Ensure you've followed the [React Native - Get Started Guide](https://facebook.github.io/react-native/docs/getting-started.html) using the `Building Projects with Native Code` section for the platform/s of choice
  Manual steps for installing Android SDK, SDK Platform, Intel HAXM, and Android Virtual Device for emulating. (TODO: automate as part of the fathom script)

### 2. Project Control

Run `yarn fathom` or `npm run fathom` in the terminal from the root directory and select a desired option

#### 2.1 initialize project

1. Checks to ensure required environment dependencies are present and installs them if not
1. Installs all package.json dependencies for React and React Native
1. Manipulates the Android/iOS projects to successfully build with their project dependencies

#### 2.2 start package manager

Starts the React Native packager to develop on:
- [An emulator](/docs/quick-tips.md#running-in-an-emulator) for Android and/or iOS
- [A mobile device](/docs/quick-tips.md#running-on-device) for Android and/or iOS

#### 2.3 create release build for Android/iOS

1. __Android__ - Creates an Android deployable build using the current project code
    1. **Release** - Creates an Android deployable build for Production using the current project code
    1. **Staging** - Creates an Android deployable build for Staging using the current project code
1. __iOS__ - Creates an iOS deployable build using the current project code
    1. **Release** - Creates an iOS deployable build for Production using the current project code
    1. **Staging** - Creates an iOS deployable build for Staging using the current project code

#### 2.4 CodePush

1. __Release__ - Bundle and Release the current React Native project code to Staging (check [docs](/docs/codepush.md) to ensure changes in project will all be deployable through CodePush)
    1. **Android** - Bundle and Release the current Android encompassed React Native project code to Staging
    1. **iOS** - Bundle and Release the current iOS encompassed React Native project code to Staging
    1. **Both** - Bundle and Release the current Android and iOS React Native project code to Staging
1. __Promote__ - Promote a CodePush build from Staging to Production
    1. **Android** - Promote the Android CodePush build from Staging to Production
    1. **iOS** - Promote the iOS CodePush build from Staging to Production
    1. **Both** - Promote both the Android and iOS CodePush builds from Staging to Production

#### 2.5 start web server

1. __Dev__ - Via webpack, starts a localhost server on port 3000 or self customized port: [http://localhost:3000](http://localhost:3000). Save code and it auto refreshes
    1. If this fails rerun `yarn fathom` or `npm run fathom` and [initialize](#21-initialize-project) the project again
1. __Prod__ - Bundles React web app code and creates required files for production deployment in the `/public` folder

---

## Understanding the File Structure

- `/android` - The native Android stuff
- `/doc` - Extra linked docs
- `/ios` - The native iOS stuff
- `/keys` - App keys of iOS push notifications, iOS signing certificates, and Code Push deployment keys
- `/public` - Web app server runs from here
- `/screenshots` - Screenshots used on the Android and iOS store listings
- `/src` - Contains the source code for both React web & React Native mobile apps
  - `/actions` - Redux Actions - payloads of information that send data _from_ your application _to_ your store. [Read More &rarr;](https://redux.js.org/docs/basics/Actions.html)
  - `/assets` - Storage of app fonts and images
    - `/fonts` - Fathom branded font files (Libre Franklin)
    - `/images` - Image assets used throughout the mobile and web apps
  - `/constants` - Shared variables and configs (across platforms)
  - `/containers` - 'Smart-components' that connect business logic to presentation [Read More &rarr;](https://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components)
  - `/lib` - Utils, custom libraries, and functions that are shared across platforms
  - `/native` - React Native mobile app specific codebase
    - `/components` - 'Dumb-components' / presentational
    - `/constants` - Mobile app-wide variables and config
    - `/routes` - Routing structure for mobile app screens and flow
    - `/theme` - Theme specific styles and variables
  - `/reducers` - Redux Reducers - Mobile and Web app Redux Actions dispatch to reducers, which actually change the state [Read More &rarr;](https://redux.js.org/docs/basics/Reducers.html)
  - `/store` - Redux Store - hooks up the Mobile and Web app Redux stores and provides initial/template states [Read More &rarr;](https://redux.js.org/docs/basics/Store.html)
  - `/web` - React web app specific codebase
    - `/components` - 'Dumb-components' / presentational
    - `/routes` - Routing structure for web app screens and flow
    - `/styles` - All the SCSS
- `/webpack` - Contains the dev and production Web App configurations
