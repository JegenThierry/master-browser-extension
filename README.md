# Browser Extension

This repository contains the code for a browser extension that tracks visited websites and enables the creation of annotations. The extension consists of two main components:

- **Popup Interface**: This is implemented using Vue.js (Version 3).
- **Injected Script**: This is a TypeScript project bundled into JavaScript files using Webpack.

# Prerequisites

To get started, you need to have a current version of Node.js installed on your system. You can download it from the official website:

> [Node.js Official Website](https://nodejs.org/en)

# Building the Extension

Different initial steps need to be taken before, a build for either Firefox or Chromium based browsers can be generated.

## For Firefox

To build a Firefox version of the extension, rename the `manifestFirefox.json` file to `manifest.json`.

## For Chromium

To build a Chrome version of the extension, rename the `manifestChrome.json` file to `manifest.json`.

## Running the Buildscript

After following the steps for either Firefox or Chrome, you can build the project by:

- Opening a PowerShell terminal.
- Navigating to the root directory of the project.
- Running the command: `./buildScript.ps1`

The built project will be placed in a `./build` folder and will contain the minified JavaScript files and the HTML/CSS/JS for the popup window.
