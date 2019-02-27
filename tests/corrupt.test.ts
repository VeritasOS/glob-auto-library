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

describe("hardcode detector", () => {
  it("corrupted 1", () => {
    let result: boolean = Detector.IsCorrupt("This text is corrupt�");
    expect(result).toBe(true);
  });

  it("corrupted 2", () => {
    let result: boolean = Detector.IsCorrupt("freeä½ å¯ä»¥å¾ˆå®¹æ˜“");
    expect(result).toBe(true);
  });

  it("some accepted European characters", () => {
    let result: boolean = Detector.IsCorrupt("äåäååçèéêëîïôùûü");
    expect(result).toBe(false);
  });

  it("not corrupted", () => {
    let result: boolean = Detector.IsCorrupt("This is not corrupted.");
    expect(result).toBe(false);
  });
});