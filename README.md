# Fathom

Fathom Android/iOS Mobile and Web app

---

## 👋 Intro

This is a joint [React Web app](https://reactjs.org/) and [React Native app](https://facebook.github.io/react-native/) sharing a single code base. It shares the 'business logic' (_i.e. actions, containers, reducers, constants, themes_) across the platforms, whilst allowing flexibility in View components to ensure your project looks and feels native in each platform.

## 📖 Docs

1. [Features](#features)
1. **Before you start**
   1. [Getting Started with React Native](/docs/react-native.md)
   1. [React Native Quick Tips](/docs/quick-tips.md)
   1. [Understanding the File Structure](#understanding-the-file-structure)
   1. [Opinions Guiding this Project](/docs/opinions.md)
1. **Using RNSK**
   1. [Getting Up and Running with RNSK](#getting-started)
   1. [Renaming the App](/docs/renaming.md)
   1. [Routing / Navigating](/src/navigation/README.md)
   1. [Interacting with a REST API](/docs/api.md)
   1. [Testing](/docs/testing.md)

---

## :sparkles: Features

| A shared React and React Native structure |
| Feature | Summary |
| --- | --- |
| __Flux architecture__ |
| [Redux](https://redux.js.org/docs/introduction/) | A predictable state container - Helping you write applications that behave consistently and run in different environments |
| __Routing and navigation__ |
| [React Native Router Flux](https://github.com/aksonov/react-native-router-flux) | Router for React Native based on new React Native Navigation API for native mobile <br><br>['How to' Guide &rarr;](/src/navigation/README.md)|
| [React Router](https://github.com/ReactTraining/react-router) | Router for React based on React Navigation aPI for web |
| __Data Caching / Offline__ |
| [Redux Persist](https://github.com/rt2zz/redux-persist) | Persist store data using localStorage for web and AsyncStorage for native mobile |
| __UI Toolkit/s__ |
| [React Native Elements](https://react-native-training.github.io/react-native-elements/) | Cross Platform React Native UI Toolkit |
| [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) | Easily use icons from a wide range of icon libraries, it's as simple as importing the icon font and then `<Icon name={'ios-alert-outline'} size={50} color={"#CCC"} />` |
| [Tcomb Form Validation](https://github.com/gcanti/tcomb-form-native) | An example on how to create forms with validation. |
| [Bootstrap 4](https://getbootstrap.com/) with [Reactstrap](https://reactstrap.github.io/) | Bootstrap based React style UI Componants |
| __Style__ |
| [ESLint Linting](https://eslint.org/) | ESLint linting code style guide |
| [Boilerplate](#understanding-the-file-structure) | Directory/file structure useful for scaling apps |

<!-- | Feature | Summary |
| --- | --- |
| [Redux](https://github.com/reactjs/react-redux) | A predictable state container - Helping you write applications that behave consistently and run in different environments. |
| [React Native Router Flux](https://github.com/aksonov/react-native-router-flux) | Router for React Native based on new React Native Navigation API. <br><br>['How to' Guide &rarr;](/src/navigation/README.md)|
| [API Example](/docs/api.md) | A basic example showing how you can interact with a RESTful API with user authentication (JWT). |
| [Sidebar / Hamburger Menu](https://github.com/react-native-community/react-native-side-menu) | ... |
| [React Native Elements](https://github.com/react-native-community/react-native-elements) | Cross Platform React Native UI Toolkit. |
| [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) | Easily use icons from a wide range of icon libraries, it's as simple as importing the icon font and then `<Icon name={'ios-alert-outline'} size={50} color={"#CCC"} />`. |
| [Tcomb Form Validation](https://github.com/gcanti/tcomb-form-native) | An example on how to create forms with validation. |
| Component Style Guide | A bunch of elements and components to get you started - styled headings, buttons, list rows, alerts etc. |
| Code Linting / Code Style Guide | I'm using ESLint linting. |
| Boilerplate | An example directory/file structure I've found useful for scaling apps <br><br>[Learn more &rarr;](#understanding-the-file-structure) | -->

---

## 🚀 Getting Started

1. Ensure you've followed the [React Native - Get Started Guide](https://facebook.github.io/react-native/docs/getting-started.html) for the platform/s of choice
1. Run `npm run fathom` from root directory
1. Start the app in [an emulator](/docs/quick-tips.md#running-in-an-emulator)

---

## Understanding the File Structure

- `/android` - The native Android stuff
- `/ios` - The native iOS stuff
- `/src` - Contains the full React Native App codebase
  - `/components` - 'Dumb-components' / presentational. [Read More &rarr;](/src/components/README.md)
  - `/constants` - App-wide variables and config
  - `/containers` - 'Smart-components' / the business logic. [Read More &rarr;](/src/containers/README.md)
  - `/images` - Self explanatory right?
  - `/lib` - Utils, custom libraries, functions
  - `/navigation`- Routes - wire up the router with any & all screens. [Read More &rarr;](/src/navigation/README.md)
  - `/redux` - Redux Reducers & Actions grouped by type. [Read More &rarr;](/src/redux/README.md)
  - `/theme` - Theme specific styles and variables
