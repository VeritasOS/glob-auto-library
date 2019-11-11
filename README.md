# Globalization Automation Library

[![Build Status](https://dev.azure.com/veritasg11n/glob-auto/_apis/build/status/VeritasOS.glob-auto-library?branchName=master)](https://dev.azure.com/veritasg11n/glob-auto/_build/latest?definitionId=1&branchName=master)
[![npm version](https://badge.fury.io/js/glob-auto-library.svg)](https://badge.fury.io/js/glob-auto-library)

## Overview

The Globalization Automation Library (GAL) is a JavaScript library that can be used with WebDriver based e2e test frameworks (like Protractor) to identify internationalization issues.

The library can be used to detect the following most common types of globalization issues on a web pages:

* Hard-coded Strings
* Corrupt Characters
* Truncated Characters
* Overlapping elements
* Incorrect Date/Time formats

## Demo

[![Watch the demo](https://f1.media.brightcove.com/8/4396107486001/4396107486001_6072569138001_6072572517001-vs.jpg?pubId=4396107486001&videoId=6072572517001)](https://bcove.video/2Q94o1y)

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
var screenshotPath = '~/screens';   // Path to screenshot folder
var screenName = 'MyScreen';        // Screenshot name
var language = 'ja-JP';             // Language of the test page
var checkXPath = '/html/body';      // Which element to test
var highlightElements = false;      // Add a border around issues
```

The ‘screenshotPath’ variable is the path to where any screenshots taken by GAL will be saved. If the directory does not exist, it will be created automatically during execution. A separate directory for each language is also automatically created.

The ‘screenName’ variable is the name of the screenshot. You should not use any file extension when providing the name. Screenshots are automatically saved as PNG files.

The ‘language’ variable is used to specify the language of the application being tested. It should be an IETF language tag, i.e. ([language]-[country]).

The ‘checkXPath’ variable is used to specify which parent element the GAL will test. GAL will also test the children of this parent element. This should be a valid XPath to the element being tested.

The ‘highlightElement’ variable is used to highlight any issues on the page. When set to true, GAL will create a coloured border around each element that has a globalization issue. This may interfere with other automation tests as it changes the DOM. This variable only changes if elements are highlighted during execution and does not change how GAL detects, or reports issues. A different colour border is used for each type of defect GAL detects:

* Hard-coded Strings: Red
* Date/Time Issues: Green
* Overlapping: Orange
* Corrupted Characters: Yellow
* Truncated Text: Blue

### Select the check you want to perform

```javascript
var checks = [];
checks.push(gal.GalFunctions.CorruptionCheck());
checks.push(gal.GalFunctions.DateTimeCheck());
checks.push(gal.OverlapCheck());
checks.push(gal.CorruptionCheck());
checks.push(gal.ClippedCheck());
```

You can select which type of GAL check you want to perform by adding it to a list. The above example shows all five GAL checks.

You can also assign optional arguments to each GAL check, such as specifying whitelisted strings (i.e. text you want GAL to ignore). Each check takes different arguments:

```javascript
var hardcodeWhitelist = [];
hardcodeWhitelist.push('Windows'); // Ignore strings that contain
hardcodeWhitelist.push('Mac');     // Windows and Mac

var checks = [];
checks.push(gal.HardcodeCheck(hardcodeWhitelist));
```

DateTimeCheck – Takes a list of date/time formats to check. GAL will return true if the format is detected. By default the formats “MM/DD/YY” and “MM/DD/YYYY” are used. These formats will be void when an argument is passed.

```javascript
var dateFormat = [];
dateFormat.push('D MMMM, YYYY'); // Detects: 15 February, 2019
dateFormat.push('D MM, YYYY');   // or 15 Feb, 2019

var checks = [];
checks.push(gal.DateTimeCheck(dateFormat));
```

CorruptionCheck – Takes a list of whitelisted characters as argument.

```javascript
var corruptionWhitelist = [];
corruptionWhitelist.push('»'); // Ignore this character

var checks = [];
checks.push(gal.CorruptionCheck(corruptionWhitelist));
```

ClippedCheck – Takes an element’s overflow value as argument. The overflow property specifies what happens if text overflows an element’s size. By default, GAL will ignore any element that has an overflow value of ‘visible’.

```javascript
var checks = [];
// Ignore any element that has an overflow property set to hidden
checks.push(gal.ClippedCheck('hidden'));
```

### Execute GAL

```javascript
        gal.runGal(
            screenshotPath,
            screenName,
            language,
            checkXPath,
            checks,
            highlightElements
        );
```

### Example (using Protractor)

```javascript
var gal = require('glob-auto-library').GalFunction;

var screenshotPath = '~/screens';
var screenName = 'MyScreen';
var language = 'ja-JP';
var checkXPath = '/html/body';
var highlightElements = false;

var hardcodeWhitelist = [];
hardcodeWhitelist.push('Windows');

var checks = [];
checks.push(gal.HardcodeCheck(hardcodeWhitelist));
checks.push(gal.DateTimeCheck());

describe('GAL example', function() {
   it('should navigate to angular page and execute GAL', function() {
      browser.get('https://www.veritas.com/ja/jp');

      gal.runGal(
            screenshotPath,
            screenName,
            language,
            checkXPath,
            checks,
            highlightElements
        );
   });
});
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
