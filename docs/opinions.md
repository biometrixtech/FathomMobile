## Create wrapper components

In `/src/native/components/custom/` there are various UI elements - some of them don't do much more than call the default React Native component and pass in a style.

I do this:

- so that we can pass in default props - eg. default styles or perhaps a default activeOpacity
- if an API changes, or perhaps we want to switch out a library, we can do it in one place - not throughout the entire codebase

## Code Style Guide

Using JS/React Style Guide with ESLint linting

## React Native Directory Aliases

Import files absolutely like so:

```
import Error from '/native/components/general/Error'
```

Because it's:

- less confusing to write - no more trying to figure out how deeply you're nested when importing files
- simpler to read
- when you move a file, it's easier to find/replace - the imports are always the same
