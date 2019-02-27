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

import { format } from "util";

export class Detector {
  public static HardcodeWhitelist = [];
  public static CorruptWhitelist = [];
  public static DateTimeWhitelist = [];
  public static IgnoreOverflowType = "visible";
  public static DateFormat = [];

  public static ProcessHardcodeList(text) {
    if (this.HardcodeWhitelist !== undefined) {
      let whitelist = this.HardcodeWhitelist;

      for (let index = 0; index < whitelist.length; index++) {
        let temp = [];
        if (typeof whitelist[index] === "string") {
          temp[index] = new RegExp(whitelist[index], "g");
        } else {
          temp[index] = whitelist[index];
        }
        text = text.replace(temp[index], "");
      }
    }
    return text;
  }

  public static ProcessCorruptList(text) {
    if (this.CorruptWhitelist !== undefined) {
      let whitelist = this.CorruptWhitelist;

      for (let index = 0; index < whitelist.length; index++) {
        let temp = [];
        if (typeof whitelist[index] === "string") {
          temp[index] = new RegExp(whitelist[index], "g");
        } else {
          temp[index] = whitelist[index];
        }
        text = text.replace(temp[index], "");
      }
    }
    return text;
  }

  public static ProcessDateTimeList(text) {
    if (this.DateTimeWhitelist !== undefined) {
      let whitelist = this.DateTimeWhitelist;

      for (let index = 0; index < whitelist.length; index++) {
        let temp = [];
        if (typeof whitelist[index] === "string") {
          temp[index] = new RegExp(whitelist[index], "g");
        } else {
          temp[index] = whitelist[index];
        }
        text = text.replace(temp[index], "");
      }
    }
    return text;
  }

  public static IsHardcode(text: string): boolean {
    let isBroken: boolean = false;
    try {
      if (text.length > 0) {
        let processedText: string = this.ProcessHardcodeList(text);
        let detectString: string = processedText;
        let regSpace: RegExp = /\s+/;
        let array: string[] = detectString.trim().split(regSpace);
        detectString = array.join("");
        detectString = this.removePunctuationAndDigit(detectString);
        let regWord: RegExp = /^[a-zA-Z]+$/;

        if (regWord.test(detectString)) {
          if (processedText !== undefined && processedText !== "") {
            console.log("Hardcoded string found: " + processedText);
            isBroken = true;
          }
        }
      }
    } catch (error) {
      console.error("There was an error checking for hardcoded strings.");
      console.error("ERROR: " + error.message);
    }
    return isBroken;
  }

  public static IsCorrupt(text: string): boolean {
    let isBroken: boolean = false;
    let acceptedChars = RegExp(/^[\u0000-\u00ff\u3000-\u9fbf\s\u200E|\（|\）]+$/);
    try {
      if (text.length > 0) {
        let justChars = this.removePunctuationAndDigit(text);
        let processedText = this.ProcessCorruptList(justChars);
        let check = acceptedChars.test(processedText.toString());
        if (!check) {
          console.log("Corrupt character found: " + text);
          isBroken = true;
        }
      }
    } catch (error) {
      console.error("There was an error checking for corrupt characters.");
      console.error("ERROR: " + error.message);
    }
    return isBroken;
  }

  public static IsUsDate(text: string): boolean {
    let isBroken: boolean = false;
    let moment = require("moment");
    try {
      if (text.length > 0) {
        if (this.DateFormat.length === 0) {
          this.DateFormat.push("MM/DD/YYYY", "MM/DD/YY");
        }
        let processedText = this.ProcessDateTimeList(text);
        let date = Date.parse(processedText);
        if (isNaN(processedText) && !isNaN(date)) {
          if (moment(processedText, this.DateFormat).isValid()) {
            console.log("The date: " + processedText + " is set to en-US format!");
            isBroken = true;
          }
        }
      }
    } catch (error) {
      console.error("There was an error checking for U.S. date formats.");
      console.error("ERROR: " + error.message);
    }
    return isBroken;
  }

  static removePunctuationAndDigit(str: string): string {
    let regPunctuation: RegExp = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|<|\.|>|\/|\?]/g;
    let regDigit: RegExp = /[0-9]*/g;

    if (regPunctuation.test(str)) {
      str = str.replace(regPunctuation, "");
    }

    if (regDigit.test(str)) {
      str = str.replace(regDigit, "");
    }
    return str;
  }

}
