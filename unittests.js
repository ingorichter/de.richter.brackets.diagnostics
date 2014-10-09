/*
 * Copyright (c) 2014 Ingo Richter.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, describe, it, expect, beforeEach, afterEach, runs, brackets, waitsForDone */

define(function (require, exports, module) {
    'use strict';

    var SpecRunnerUtils = brackets.getModule('spec/SpecRunnerUtils'),
        FileUtils       = brackets.getModule('file/FileUtils');

    describe('JSHint', function () {
        var testFolder = FileUtils.getNativeModuleDirectoryPath(module) + '/unittest-files/',
            testWindow,
            $,
            brackets,
            DocumentManager;

        beforeEach(function () {
            runs(function () {
                SpecRunnerUtils.createTestWindowAndRun(this, function (w) {
                    testWindow = w;
                    // Load module instances from brackets.test
                    $ = testWindow.$;
                    brackets = testWindow.brackets;
                    DocumentManager = testWindow.brackets.test.DocumentManager;
                });
            });

            runs(function () {
                SpecRunnerUtils.loadProjectInTestWindow(testFolder);
            });
        });

        afterEach(function () {
            testWindow      = null;
            $               = null;
            brackets        = null;
            DocumentManager = null;
            SpecRunnerUtils.closeTestWindow();
        });

        it('should open a json file', function () {
            waitsForDone(SpecRunnerUtils.openProjectFiles(['test.json']), 'open test file');

            runs(function () {
                var jsonFile = DocumentManager.getCurrentDocument();

                expect(jsonFile.isDirty).toBe(false);
                expect(jsonFile.isUntitled()).toBe(false);
            });
        });
    });
});

