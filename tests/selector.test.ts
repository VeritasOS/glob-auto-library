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

import { Detector } from "../src/lib/detector";
import { DOMParser as dom } from 'xmldom';

var xpath = require('xpath');

const xml = `<div><table><tr><td><span>It's English text</span></td></tr></table></div>`;
const test_doc =  new dom().parseFromString(xml);
const xpath_orig = "//*[not(descendant::div)]";
const xpath_mod = "//*[normalize-space(text())]";

describe("xpath selector test", () => {

  function runSelectorTest(selector: string, doc: any, expected: number){
    console.log(`\nxpath selector: "${selector}"`);
    let nodes = xpath.select(selector, doc);
    let count = 0;
    for (let node of nodes){
      let str = xpath.select('string()',node)
      let result: boolean = Detector.IsHardcode(str);
      expect(result).toBe(true);
      count ++;
    }
    expect(count).toBe(expected);
    console.log(`${count} hard code string issues found\n`)!
  };

  it(`${xpath_orig} selector should detect 5 hard code issues`, () => {
    runSelectorTest(xpath_orig, test_doc, 5);
  });

  it(`${xpath_mod} selector should detect only 1 hard code issues`, () => {
    runSelectorTest(xpath_mod, test_doc, 1);
  });

});
