## Custom Features Utilized

1. [React-Native Components](#react-native-components)
1. [Custom Components](#custom-components)
1. [Misc Components](#misc-components)
1. [Installed But Not Used Components](#installed-but-not-used-components)

---

## React-Native Components

Installed React-Native libraries that we're utilizing

| Feature | Summary | Location |
| --- | --- | --- |
| [Action Button](https://github.com/mastermoo/react-native-action-button) | Customizable multi-action-button component for React-Native. | Helps with scroll to bottom of page:<br/>1. Post Session Survey<br/>2. Readiness Survey |
| [App Intro Slider](https://github.com/Jacse/react-native-app-intro-slider) | Easy-to-use yet very configurable app introduction slider/swiper | Tutorials |
| [BLE Manager](https://github.com/innoveit/react-native-ble-manager) | React-Native BLE communication module. | Pair with sensor and sync data |
| [Accordion](https://github.com/oblador/react-native-collapsible) | Animated collapsible component for React-Native, good for accordions, toggles etc | 1. Athlete Compliance Modal<br/>2. User Account (Account Information & About You sections) |
| [Date Picker](https://github.com/xgfe/react-native-datepicker) | React-Native datePicker component for both Android and IOS, using DatePickerAndroid, TimePickerAndroid and DatePickerIOS | On-boarding User Account About (Date of Birth) |
| [Dropdown Alert](https://github.com/testshallpass/react-native-dropdownalert) | A simple alert to notify users about new chat messages, something went wrong or everything is ok. | When we lose internet connection |
| [Easy Toast](https://github.com/crazycodeboy/react-native-easy-toast) | A React-Native module to show toast like android, it works on iOS and Android. | Toast message to user (mainly internal) |
| [Easter Egg](https://github.com/FuYaoDe/react-native-egg) | Implementation simple gestures detection achieve trigger easter egg, You can also use it as a gesture switch. | (INTERNAL) Toggle environment |
| [Elements](https://react-native-training.github.io/react-native-elements) | USED MAINLY IN CUSTOM SECTION. Customizing [RN Elements](https://react-native-training.github.io/react-native-elements/docs/0.19.1/overview.html) | Button, Card, Checkbox, FormInput, FormLabel, Icon, List, ListItem, Text |
| [Linear Gradient](https://github.com/react-native-community/react-native-linear-gradient) | A <LinearGradient> component for React-Native | 1. Coach<br/>2. Readiness Survey Welcome page<br/>3. Splash Screen |
| [Lottie](https://github.com/react-native-community/lottie-react-native) | Lottie is a mobile library for Android and iOS that parses Adobe After Effects animations exported as JSON with bodymovin and renders them natively on mobile! | 1. MyPlan - SessionsCompletionModal & ExerciseCompletionModal |
| [Modal](https://github.com/maxs15/react-native-modalbox) | A React-Native component, easy, fully customizable, implementing the 'swipe down to close' feature. | 1. Login<br/>2. Coaches Dashboard<br/>3. Bluetooth Connect<br/>4. MyPlan<br/>5. Exercises<br/>6. On-boarding<br/>7. Join A Team |
| [Push Notification](https://github.com/zo0r/react-native-push-notification) | React-Native Local and Remote Notifications | Throughout app |
| [React-Native](https://facebook.github.io/react-native/docs/components-and-apis) | Access to all React-Native's components and APIs. | Throughout App |
| [Scrollable Tab View](https://github.com/ptomasroos/react-native-scrollable-tab-view) | Tabbed navigation that you can swipe between, each tab can have its own ScrollView and maintain its own scroll position between swipes. Pleasantly animated. Customizable tab bar. | 1. Coaches Dashboard<br/>2. MyPlan |
| [Sliding Up Panel](https://github.com/octopitus/rn-sliding-up-panel) | Draggable sliding up panel implemented in React-Native. | 1. Post Session Survey<br/>2. Readiness Survey |
| [Snap Carousel](https://github.com/archriss/react-native-snap-carousel) | Swiper component for React-Native featuring previews, multiple layouts, parallax images, performant handling of huge numbers of items, and RTL support. Compatible with Android & iOS. | Exercises Page |
| [Splash Screen](https://github.com/crazycodeboy/react-native-splash-screen) | A splash screen for React-Native, hide when application loaded ,it works on iOS and Android. | Start Page |
| [Vector Icons](https://github.com/oblador/react-native-vector-icons) | Customizable Icons for React-Native with support for NavBar/TabBar/ToolbarAndroid, image source and full styling. | Installed so we can access ALL icons from [director](https://oblador.github.io/react-native-vector-icons/) |
| [Video](https://github.com/react-native-community/react-native-video) | A <Video> component for React-Native | 1. Single Exercises<br/>2. Tutorials |

---

## Custom Components

Custom build components to help us with any dynamic functionality that the libraries might not have our full desire

| Feature | Summary | Location |
| --- | --- | --- |
| Animated Progress Bar | Hacked from [Progress Bar - Animated](https://github.com/rafaelmotta/react-native-progress-bar-animated) - Simple, customizable and animated progress bar for React-Native. | Used for our sensor syncing progress bar |
| Calendar Strip | Hacked from [Calendar Strip](https://github.com/BugiDev/react-native-calendar-strip). | Currently not being used, was created for the ability to see previous days plans |
| Coach | Previous setup as a "coach" blurb that pops up when there is something to update the user on. | Currently not being used |
| Custom Progress Circle | Was previously setup for a circle that fills up with progress tracking text. | Currently not being used |
| Elements | Customizing [RN Elements](https://react-native-training.github.io/react-native-elements/docs/0.19.1/overview.html) | Button, Card, Checkbox, FormInput, FormLabel, Icon, List, ListItem, Text |
| Fathom Picker | Hacked from [Picker Select](https://github.com/lawnstarter/react-native-picker-select) - A Picker component for React-Native which emulates the native <select> interfaces for iOS and Android | 1. Coaches Dashboard (Sort By)<br/>2. Coaches Dashboard Tab Bar (Select Teams)<br/>3. Readiness Survey (Select the number of trainings)<br/>4. User On-Boarding (a. Injury Statues, b. Heights, c. Gender) |
| Fathom Slider | Hacked from [Elements Slider](https://react-native-training.github.io/react-native-elements/docs/0.19.1/slider.html) - A pure JavaScript component for React-Native. It is a drop-in replacement for Slider. | Currently not being used, was setup for our vertical RPE picker |
| Pages | Hacked from [Pages](https://github.com/n4kz/react-native-pages) - Easy to use page view component for React-Native. | 1. Bluetooth Connection<br/>2. Post Session Survey<br/>3. Readiness Survey |
| Tooltip | Hacked from [Walkthrough Tooltip](https://github.com/jasongaare/react-native-walkthrough-tooltip) - React-Native Walkthrough Tooltip is a fullscreen modal that highlights whichever element it wraps. When not visible, the wrapped element is displayed normally. | __Open's our first time experience tooltip on:__<br/>1. Areas Of Soreness<br/>2. SVG Image (Body Part)<br/>3. Sore Body Part |
| Wheel Scroll Picker | Custom Wheel Scroll component | Sport Schedule Builder (duration) |

---

## Installed But Not Used Components

Components installed once for usage but not currently being used

| Feature | Summary |
| --- | --- |
| [Modal Dropdown](https://github.com/sohobloo/react-native-modal-dropdown) | A React-Native dropdown/picker/selector component for both Android & iOS. |
| [Progress](https://github.com/oblador/react-native-progress) | Progress indicators and spinners for React-Native using ReactART. |
| [Remote SVG](https://github.com/seekshiva/react-native-remote-svg) | Image component that supports SVG filetype in [React-Native](https://facebook.github.io/react-native/). |
| [Sectioned Multi Select](https://github.com/renrizzolo/react-native-sectioned-multi-select) | A multi (or single) select component with support for sub categories, search, chips. It's intended for long-ish lists, as it opens in a Modal (I might make this optional in the future).<br/><br/>This is based on [RN Multiple Select](https://github.com/toystars/react-native-multiple-select). The problems I had were that I needed it to be in a modal, because of nested ScrollViews not working on Android, and I needed to display categories with sub-categories. |

---

## Misc Components

Other Libraries used to aide development

| Feature | Summary | Location |
| --- | --- | --- |
| [Fabric](https://github.com/corymsmith/react-native-fabric) | A React-Native library for Fabric, Crashlytics and Answers. | 1. Logs when a user logs in<br/>2. Logs when an API is successful or failed |
| [Forms](https://github.com/gcanti/tcomb-form-native) | Forms library for React-Native | Help with some form validation |
| [Google Analytics Bridge](https://github.com/idehub/react-native-google-analytics-bridge) | Google Analytics Bridge is built to provide an easy interface to the native Google Analytics libraries on both iOS and Android. | __Athlete & Coach:__ <br/>1. setUser<br/>2. setAppVersion<br/>3. setAppName<br/>4. trackScreenView |
| [UUID](https://github.com/Danakt/uuid-by-string) | Generates the RFC-4122 Name-Based UUID | Help with getting some device specific information |

---
