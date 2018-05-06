# Contributing

Any feedback or tips to improve slack me

For changes for new features/bugfixes submit an issue or a fix via a pull request.

Please ensure you're following the below rules before submitting a PR:

## Naming Conventions

Please follow [Airbnb's Name Conventions](https://github.com/airbnb/javascript#naming-conventions) as a style guide partially modified by my ESLint standards.

## File Structure & Naming Conventions

- __Structure__
  - Follow the existing file structure
- __Files__
  - Should be `lowercase`, with words separated by hyphens (`-`) eg. `logo-cropped.jpg`
  - With the exception of Containers and Components, which should be `PascalCase` - eg. `CircularProgress.js`
- __Directories__
  - Folder names should be `lowercase,` with words separated by a hyphen (`-`) - eg. `/components/case-studies`
- Folders and files can be named singlular or plural - do what sounds right
- If there's more than a few files in a directory that are related, group them within their own directory
  - eg. if I have 2 components: `/components/GroupCaptureSession.js` and `/components/TeamCaptureSession.js`, I may choose to create a new directory within components called `capture-session` and put the 2 files within (removing `CaptureSession`). The result would be: `/components/capture-session/Group.js` and `/components/capture-session/Team.js`

## Linting

Please ensure you're code is passing the built in linter.

## Tests

(Future )Please include tests with your code and ensure your code is passing the existing tests.