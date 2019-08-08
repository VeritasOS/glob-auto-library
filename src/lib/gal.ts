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

import { ICreateIssue } from "../arp/utils/garb-interface";
import { checkerRun, GalCheck } from "./glob-auto-lib";
import { saveIssues } from "./issueHelper";
import { saveScreen } from "./screenshotHelper";
import { saveScreenSource } from "./screensourceHelper";
import { Detector } from "./detector";

export class GalFunctions {

  public static HardcodeCheck(hardcodeList?): GalCheck {
    Detector.HardcodeWhitelist = hardcodeList;
    return GalCheck.Hardcode;
  }
  public static DateTimeCheck(datetimeList?, dateFormat = ["M/D/YYYY"]): GalCheck {
    Detector.DateTimeWhitelist = datetimeList;
    Detector.DateFormat = dateFormat;
    return GalCheck.DateTime;
  }
  public static OverlapCheck(): GalCheck {
    return GalCheck.Overlap;
  }
  public static CorruptionCheck(corruptList?): GalCheck {
    Detector.CorruptWhitelist = corruptList;
    return GalCheck.Corruption;
  }
  public static ClippedCheck(overflow = "visible"): GalCheck {
    Detector.IgnoreOverflowType = overflow;
    return GalCheck.Clipped;
  }
  public static AllChecks(): GalCheck[] {
    let checks: GalCheck[];
    checks.push(GalCheck.Clipped, GalCheck.Corruption, GalCheck.DateTime, GalCheck.Hardcode, GalCheck.Overlap);
    return checks;
  }


  public static async saveScreen(path: string, screenName: string, lang: string): Promise<boolean> {
    saveScreen(path, screenName, lang);
    return true;
  }

  public static async saveScreenSource(path: string, screenName: string, lang: string): Promise<boolean> {
    saveScreenSource(path, screenName, lang);
    return true;
  }

  public static async runGal(path: string,
    screenName: string,
    lang: string,
    selector: string,
    checks: GalCheck[],
    highlight: boolean = false): Promise<number> {
    if (checks === null) {
      checks = this.AllChecks();
    }

    console.log("Running GAL in [" + lang + "] on [" + selector + "]...");

    let issues: ICreateIssue[] = await checkerRun(selector, lang, checks, highlight);

    console.log("Total number of issues: " + issues.length);
    saveIssues(path, screenName, lang, issues);

    return issues.length;
  }
}
