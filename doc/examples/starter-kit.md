# Getting Started with GAL

## Overview
This is a tutorial to help you get started with the Globalization Automation Library (GAL). In this document, you will learn how to use the GAL to automatically detect internationalization issues.

## Prerequisites
You will need to install some kind of WebDriver based framework to be able to run automated tests. In this tutorial, we will be using the Protractor framework. 

### To install Protractor (using Node Package Manager)
```bash
npm install -g protractor
```

Any other dependencies to run Protractor (e.g. Node.js, Java, etc.), or any IDE's to edit the code are outside the scope of this document and should already be installed.

### Install the Globalization Automation Library (GAL)
```bash
npm i glob-auto-library -D
```

By default, the starter kit uses the Google Chrome browser. If Chrome is not already installed on your computer, please download and install it from:
https://www.google.com/chrome/


## Downloading the GAL Starter Kit
Downloaded the GAL starter Kit from:
https://github.com/sullia/gal-starter-kit

Once the starter kit is downloaded, navigate to the directory where you installed it using the Terminal or Command Prompt. Ensure you have all the necessary dependencies by typing:
```bash
npm install
```

## Executing the GAL Starter Kit
The starter kit can be executed by running the following command:
```bash
protractor config.js
```

### Changing the start url
By default, the starter kit will open Chrome and navigae to http://localhost:4200/. To change the start url, open the example-test.js file in your IDE. On line 5, change the url.
```javascript
// Change to any url
var url = 'http://localhost:4200/';
```

### Using the Globalization Test Web
The Globalization Test Web is an Angular 7 application that can be used to test the GAL. It contains many common types of globalization defects such as truncation, corrupt characters, hardcoded strings and U.S. date formats.

You will need to install Angular to run this application. To install the Angular CLI globally using Node.js, use the following command:
```bash
npm install -g @angular/cli 
```

The Globalization Test Web can be downloaded from here:
https://github.com/sullia/glob-test-web

To run the Globalization Test Web, navigate to the directory where you installed it using the Terminal or Command Prompt and run the command:
```bash
ng serve --open
```

This will launch your browser and open http://localhost:4200/ running the Globalization Test Web.

### Changing Language on the GAL Starter Kit
By default, the starter kit will run in English (en-US). To change language, open the config.js file. The language can be changed on line 1. This should be an IETF language tag, i.e. ([language]-[country]).
```javascript
// Change language
var language = 'en-US';
```

If you are using the Globalization Test Web, the application has been localized to 3 languages:
* en-US (the default option)
* zh-CN (Simplified Chinese)
* ja-JP (Japanese)

### Changing the location of GAL files
GAL generates two different kinds of files: Screenshots (PNG) and information of any issues (JSON). By default, the starter kit will save these files in a directory called "screenshots" in the root of the starter kit. To change this location, open the config.js file. The path can be changed on line 5
```javascript
params: {
    // Change screenshotPath
    screenshotPath: './screenshots/',
    lang: language
},
```
