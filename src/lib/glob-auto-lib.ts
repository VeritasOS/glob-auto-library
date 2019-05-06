/*
Copyright (c) 2019 Veritas Technologies LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { browser, by, element } from "protractor";
import { ICreateIssue, IssueSeverity, IssueStatus, IssueType } from "../arp/utils/garb-interface";
import { FilterIssues, GetIssueDetails } from "./issueHelper";
import { Detector } from "./detector";

export enum GalCheck { Hardcode = 1, DateTime = 2, Overlap = 3, Corruption = 4, Clipped = 5 }

function GetHighlightColor(check: GalCheck): string {
  switch (check) {
    case GalCheck.Hardcode:
      return "red";
    case GalCheck.DateTime:
      return "green";
    case GalCheck.Corruption:
      return "yellow";
    case GalCheck.Overlap:
      return "orange";
    case GalCheck.Clipped:
      return "blue";
  }
}

export async function checkerRun(selector: string, lang: string, checks: GalCheck[], highlight: boolean): Promise<ICreateIssue[]> {
  try {
    let issues: ICreateIssue[] = [];

    await element.all(by.xpath(selector + "//*[not(descendant::div)]")).each(async elem => {
      try {
        for (let check of checks) {
          let result: boolean = false;
          let type: IssueType;

          switch (check) {
            case GalCheck.Corruption:
              result = await checkCorruption(elem);
              type = IssueType.CharacterCorruption;
              break;
            case GalCheck.Hardcode:
              result = await checkHardcode(elem);
              type = IssueType.Hardcode;
              break;
            case GalCheck.DateTime:
              result = await checkUsDate(elem);
              type = IssueType.Linguistic;
              break;
            case GalCheck.Clipped:
              result = await checkClippedText(elem);
              type = IssueType.Overlapping;
              break;
            case GalCheck.Overlap:
              result = await checkOverlap(elem);
              type = IssueType.Overlapping;
              break;
          }

          if (result === true) {
            let issue: ICreateIssue = await GetIssueDetails(elem);
            issue.type = type;
            issue.status = IssueStatus.Active;
            issue.severity = IssueSeverity.Error;
            issues.push(issue);

            if (highlight) {
              highlightElement(elem, GetHighlightColor(check));
            }
          }
        }
      } catch (ex) {
        console.error(ex.message);
      }
    });

    console.log("Number of all issues: " + issues.length);

    let filtered: ICreateIssue[] = FilterIssues(issues);
    console.log("Number of filtered issues: " + filtered.length);

    return filtered;
  } catch (error) {
    console.log("There was an error running the Globalization Automation Library.");
    console.log("ERROR: " + error);
  }
}

async function getElementRect(element): Promise<any> {
  return browser.driver.executeScript(
    "return arguments[0].getBoundingClientRect();", element.getWebElement()
  ).then(function (rect) {
    return rect;
  });
}

async function checkOverlap(element): Promise<boolean> {
  let isOverlap: boolean = false;

  await browser.executeScript("return arguments[0].children;", element.getWebElement()).then(function (children) {
    let childrenLength = Object.keys(children).length;

    for (let i = 0; i < childrenLength; i++) {
      let parentRect = getElementRect(element);
      let childRect = browser.executeScript("return arguments[0].getBoundingClientRect();", children[i]);
      let nextIndex = i + 1;

      if (nextIndex < childrenLength) {
        let nextRect = browser.executeScript("return arguments[0].getBoundingClientRect();", children[nextIndex]);

        if (!checkElementRects(childRect, nextRect)) {
          isOverlap = true;
        }
      }

      if (!checkElementRects(parentRect, childRect)) {
        isOverlap = true;
      }
    }
  });

  return isOverlap;
}

async function checkElementRects(rect1, rect2) {
  // if one or more expressions in the parenthese are true, there's no overlapping.
  // if all are false, there must be an overlapping
  let overlap = !(rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom);

  return overlap;
}

async function checkClippedText(element): Promise<boolean> {
  let isBroken: boolean = false;

  await Promise.all([
    element.getText(),
    element.getAttribute("scrollWidth"),
    element.getAttribute("scrollHeight"),
    element.getSize(),
    element.getCssValue("overflow")
  ]).then(function (values) {
    let text = values[0];
    let scrollWidth = values[1];
    let scrollHeight = values[2];
    let elemSize = values[3];
    let overflow = values[4];

    if (text.length > 0) {
      let overflowType = Detector.IgnoreOverflowType;
      if (overflow !== overflowType) {
        if (elemSize.width < scrollWidth) {
          isBroken = true;
        }

        if (elemSize.height < scrollHeight) {
          isBroken = true;
        }
      }
    }
  });

  return isBroken;
}

async function checkHardcode(element): Promise<boolean> {
  let isBroken: boolean = false;
  try {
    await element.getText().then(function (text: string): void {
      isBroken = Detector.IsHardcode(text);
    });
  } catch (error) {
    console.error("There was an error checking for hardcoded strings.");
    console.error("ERROR: " + error.message);
  }
  return isBroken;
}

async function checkCorruption(element): Promise<boolean> {
  let isBroken: boolean = false;
  try {
    await element.getText().then(function (text) {
      isBroken = Detector.IsCorrupt(text);
    });
  } catch (error) {
    console.log("There was an error checking for corrupt characters.");
    console.log("ERROR: " + error.message);
  }
  return isBroken;
}

async function checkUsDate(element): Promise<boolean> {
  let isBroken: boolean = false;
  try {
    await element.getText().then(function (text) {
      isBroken = Detector.IsUsDate(text);
    });
  } catch (error) {
    console.error("There was an error checking for U.S. date formats.");
    console.error("ERROR: " + error.message);
  }
  return isBroken;
}

let highlightElement = function (ele, color = "red") {
  return browser.driver.executeScript(
    "arguments[0].setAttribute('style', arguments[1]);",
    ele.getWebElement(), "border: 1px solid " + color + ";").then(function (resp) {
      return ele;
    },
      function (err) {
        console.log("error is :" + err);
      });
};
