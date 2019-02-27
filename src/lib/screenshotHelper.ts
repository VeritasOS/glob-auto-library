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
import { browser } from "protractor";
import { mkdirRecur } from "./pathHelper";


export function saveScreen(basePath: string, screenName: string, lang: string): void {
  let filename: string = path.join(basePath, lang, screenName + ".png");

  let dirPath: string = path.dirname(filename);

  browser.takeScreenshot().then(function (png: string): void {
    try {
      if (!fs.existsSync(dirPath)) {
        mkdirRecur(dirPath);
      }
      let stream: fs.WriteStream = fs.createWriteStream(filename);
      stream.write(new Buffer(png, "base64"));
      stream.end();
    } catch (e) {
      if (e.code !== "EEXIST") {
        throw e;
      }
    }
  }, function (error: string): void { console.error("Failed to take screenshot bacause of [" + error + "]!"); });
}
