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

import * as fs from "fs";
import * as path from "path";
import { ElementFinder } from "protractor";
import { ILocation, ISize } from "selenium-webdriver";
import { ICreateIssue, IssueSeverity, IssueStatus, IssueType } from "../arp/utils/garb-interface";
import { mkdirRecur } from "./pathHelper";

/*
Create/update issues file

interface CreateIssue {
	severity?: IssueSeverity;
	type?: IssueType;
	status?: IssueStatus;
	identifier?: string;
	text?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}

enum IssueType { Linguistic = 0, Hardcode = 1, Overlapping = 2, CharacterCorruption = 3 };
enum IssueStatus { Active = 0, Resolved = 1, FalsePositive = 2 }
enum IssueSeverity { Info = 0, Warning = 1, Error = 2 }

*/

export function log4ARP(basePath: string,
  screenName: string,
  lang: string,
  identifier: string,
  type: IssueType,
  text: string,
  append: boolean = true,
  severity?: IssueSeverity,
  x?: number,
  y?: number,
  width?: number,
  height?: number): boolean {

  if (typeof screenName === "undefined") { return false; }
  if (typeof identifier === "undefined") { return false; }
  if (typeof type === "undefined") { return false; }
  if (typeof text === "undefined") { return false; }
  if (typeof severity === "undefined") { severity = 2; }
  if (typeof x === "undefined") { x = 0; }
  if (typeof y === "undefined") { y = 0; }
  if (typeof width === "undefined") { width = 0; }
  if (typeof height === "undefined") { height = 0; }
  let status: IssueStatus = IssueStatus.Active;

  try {

    let fileName: string = screenName + ".json";
    let fullFilePath: string = path.join(basePath, lang, fileName);

    let dirPath: string = path.dirname(fullFilePath);

    if (!fs.existsSync(dirPath)) {
      mkdirRecur(dirPath);
    }
    let issue: ICreateIssue = {
      severity: severity,
      identifier: identifier,
      text: text,
      type: type,
      status: status,
      x: x,
      y: y,
      width: width,
      height: height
    };

    let issues: ICreateIssue[];
    if (append) {
      let fileBuffer: Buffer = fs.readFileSync(fullFilePath);
      issues = JSON.parse(fileBuffer.toString());
    } else {
      issues = new Array<ICreateIssue>();
    }

    issues.push(issue);

    let jsonData: string = JSON.stringify(issues);

    fs.writeFileSync(fullFilePath, jsonData, { flag: "w" });

    return true;
  } catch (err) {
    console.error(err.message);
  }
  return false;

}

export function saveIssues(basePath: string, screenName: string, lang: string, issues: ICreateIssue[]): boolean {

  let status: boolean = true;

  let append: boolean = false;

  for (let i of issues) {
    let substat: boolean = log4ARP(basePath,
      screenName,
      lang,
      i.identifier,
      i.type,
      i.text,
      append,
      i.severity,
      i.x,
      i.y,
      i.width,
      i.height);

    if (substat === false) {
      status = false;
    }
    append = true;
  }

  return status;
}

export async function GetIssueDetails(elem: ElementFinder): Promise<ICreateIssue> {
  let newIssue: ICreateIssue = {};

  newIssue.identifier = await elem.getId();

  let size: ISize = await elem.getSize();
  newIssue.width = Math.round(size.width);
  newIssue.height = Math.round(size.height);

  let location: ILocation = await elem.getLocation();
  newIssue.x = Math.round(location.x);
  newIssue.y = Math.round(location.y);

  newIssue.text = await elem.getText();

  return newIssue;
}

export function FilterIssues(issues: ICreateIssue[]): ICreateIssue[] {
  let filtered: ICreateIssue[] = [];
  let n: number = issues.length;
  let inside: boolean[] = [];

  for (let i: number = 0; i < n; i++) {
    inside[i] = false;
  }

  for (let i: number = 0; i < n; i++) {
    for (let j: number = 0; j < n; j++) {

      // is i inside j inside
      if (i !== j && issues[i].type === issues[j].type) {
        if (!inside[i]) {
          inside[i] = IsInside(issues[i].x,
            issues[i].y,
            issues[i].width,
            issues[i].height,
            issues[j].x,
            issues[j].y,
            issues[j].width,
            issues[j].height);

          if (inside[i]) {
            break;
          }
        }
        if (!inside[j]) {
          inside[j] = IsInside(issues[j].x,
            issues[j].y,
            issues[j].width,
            issues[j].height,
            issues[i].x,
            issues[i].y,
            issues[i].width,
            issues[i].height);

          if (inside[j]) {
            break;
          }
        }
      }
    }
  }

  for (let i: number = 0; i < n; i++) {
    if (!inside[i]) {
      filtered.push(issues[i]);
    }
  }

  return filtered;
}

function IsInside(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
  if (x1 >= x2 && y1 >= y2 && x1 + w1 <= x2 + w2 && y1 + h1 <= y2 + h2) {
    return true;
  }
  return false;
}