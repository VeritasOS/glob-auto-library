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

import { FilterIssues } from "../src/lib/issueHelper";
import { ICreateIssue } from "../src/arp/utils/garb-interface";


let duplicate_same_type = `[
{"severity":2,"identifier":"1","text":"User 'root' is logged out","type":1,"status":0,"x":1288,"y":646,"width":188,"height":23},
{"severity":2,"identifier":"2","text":"User 'root' is logged out","type":1,"status":0,"x":1288,"y":646,"width":188,"height":23},
{"severity":2,"identifier":"3","text":"User 'root' is logged out","type":1,"status":0,"x":1288,"y":646,"width":188,"height":23}
]`;

let different_type_same_position = `[
{"severity":2,"identifier":"1","text":"User 'root' is logged out","type":1,"status":0,"x":1288,"y":646,"width":188,"height":23},
{"severity":2,"identifier":"2","text":"User 'root' is logged out","type":2,"status":0,"x":1288,"y":646,"width":188,"height":23},
{"severity":2,"identifier":"3","text":"User 'root' is logged out","type":3,"status":0,"x":1288,"y":646,"width":188,"height":23}
]`;

let nested =`[
{"severity":2,"identifier":"medium","text":"User 'root' is logged out","type":1,"status":0,"x":1287,"y":645,"width":186,"height":21},
{"severity":2,"identifier":"small","text":"User 'root' is logged out","type":1,"status":0,"x":1288,"y":646,"width":185,"height":20},
{"severity":2,"identifier":"large","text":"User 'root' is logged out","type":1,"status":0,"x":1286,"y":644,"width":187,"height":22}
]`;

let one_inside_other_two =`[
{"severity":2,"identifier":"outside_1","text":"User 'root' is logged out","type":1,"status":0,"x":1193,"y":540,"width":360,"height":134},
{"severity":2,"identifier":"outside_2","text":"User 'root' is logged out","type":1,"status":0,"x":1298,"y":494,"width":334,"height":147},
{"severity":2,"identifier":"inside","text":"User 'root' is logged out","type":1,"status":0,"x":1338,"y":564,"width":180,"height":63}
]`;

let two_inside_one =`[
{"severity":2,"identifier":"inside_1","text":"User 'root' is logged out","type":1,"status":0,"x":1338,"y":564,"width":180,"height":63},
{"severity":2,"identifier":"outside","text":"User 'root' is logged out","type":1,"status":0,"x":1193,"y":540,"width":360,"height":134},
{"severity":2,"identifier":"inside_2","text":"User 'root' is logged out","type":1,"status":0,"x":1217,"y":567,"width":103,"height":65}
]`;



describe("issue filter", () => {

  it("Three Duplicated same type issues", () => {
    let issues: ICreateIssue[];
	issues = JSON.parse(duplicate_same_type);
    let filtered: ICreateIssue[] = FilterIssues(issues)
	expect(filtered.length).toBe(1);
  });

  it("Three different type issues on same position", () => {
    let issues: ICreateIssue[];
	issues = JSON.parse(different_type_same_position);
    let filtered: ICreateIssue[] = FilterIssues(issues)
	expect(filtered.length).toBe(3);
  });

  it("Three same type issues with nested position", () => {
    let issues: ICreateIssue[];
	issues = JSON.parse(nested);
    let filtered: ICreateIssue[] = FilterIssues(issues)
	expect(filtered.length).toBe(1);
  });

  it("One issue inside both two other issues", () => {
    let issues: ICreateIssue[];
	issues = JSON.parse(one_inside_other_two);
    let filtered: ICreateIssue[] = FilterIssues(issues)
	expect(filtered.length).toBe(2);
  });

  it("Two issues inside one issue", () => {
    let issues: ICreateIssue[];
	issues = JSON.parse(two_inside_one);
    let filtered: ICreateIssue[] = FilterIssues(issues)
	expect(filtered.length).toBe(1);
  });


});
