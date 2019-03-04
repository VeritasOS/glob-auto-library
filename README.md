# Globalization Automation Library

## Overview

The Globalization Automation Library (GAL) is a JavaScript library that can be used with WebDriver based e2e test frameworks (like Protractor) to identify internationalization issues.

The library can be used to detect the following most common types of globalization issues on a web pages:

* Hard-coded Strings
* Corrupt Characters
* Truncated Characters
* Overlapping elements

## Usage with Protractor

### Add the package to our project

```bash
npm i glob-auto-library -D
```

### Import GAL in your spec file

```bash
var gal = require('glob-auto-library');
```

### Configure parameters related to the page you're testing

```javascript
var screenshotPath = '~/screens';
var screenName = 'MyScreen';
var language = 'ja-JP';
var checkXPath = '/html/body';
var highlightElements = false;
```

### Select the check you want to perform

```javascript
var checks = [];
checks.push(gal.GalFunctions.CorruptionCheck());
checks.push(gal.GalFunctions.DateTimeCheck());`
```

### Execute GAL

```javascript
        gal.GalFunctions.runGal(
            screenshotPath,
            screenName,
            language,
            checkXPath,
            checks,
            highlightElements
        );
```

### Results

GAL will save the screenshot (PNG) and test results (JSON) in the specified folder (screenshotPath/screenName).

The detected issues will be reported in following format:

```json
[{
	"severity": 2,
	"identifier": "0.46393041515483757-4",
	"text": "US date format 3/1/2018",
	"type": 2,
	"status": 0,
	"x": 418,
	"y": 20,
	"width": 500,
	"height": 80
},
{
	"severity": 2,
	"identifier": "0.46393041515483757-7",
	"text": "Hardcoded string",
	"type": 1,
	"status": 0,
	"x": 468,
	"y": 110,
	"width": 400,
	"height": 32
}]
```