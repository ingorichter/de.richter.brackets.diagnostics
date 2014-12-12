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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window */
define(function (require, exports) {
    "use strict";

    var ExtensionManager    = brackets.getModule("extensibility/ExtensionManager"),
        _                   = brackets.getModule("thirdparty/lodash"),
        PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        prefs               = PreferencesManager.getExtensionPrefs("de.richter.brackets.diagnostics"),
        UAParser            = require("node_modules/ua-parser-js/src/ua-parser");

    var PREFS_KEY_UUID = "UUID";

    prefs.definePreference(PREFS_KEY_UUID, "string", "");

    // from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    // could be wrong, but probably random enough for me
    function _guid() {
        function r() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
        }

        return r() + r() + "-" + r() + "-" + r() + "-" +
               r() + "-" + r() + r() + r();
    }

    /**
     * Initialize the UUID prefs with a unique value, when it doesn't exist.
     */
    function SystemInfo() {
        if (!prefs.get(PREFS_KEY_UUID)) {
            prefs.set(PREFS_KEY_UUID, _guid());
        }
    }

    SystemInfo.prototype.generateReport = function (osInfo) {
        var info = {},
            uaresult = new UAParser().setUA(window.navigator.userAgent).getResult();

        // basic data
        info.version = 1;
        info.clientUUID = prefs.get(PREFS_KEY_UUID);

        // brackets
        info.appInfo = {};
        info.appInfo.version = brackets.metadata.version;
        info.appInfo.language = brackets.getLocale();
        info.appInfo.inBrowser = brackets.inBrowser;
        info.appInfo.appSupportDir = brackets.app.getApplicationSupportDirectory();
        info.appInfo.cefversion = uaresult.browser.version;
        info.appInfo.extensions = _.filter(ExtensionManager.extensions, function (extension) {
            return extension.installInfo && extension.installInfo.locationType === "user" && extension.installInfo.status === "enabled";
        });

        // machine info
        info.machineInfo = {};
        info.machineInfo.osname = uaresult.os.name;
        info.machineInfo.osversion = uaresult.os.version;

        info.machineInfo.screensize = {};
        info.machineInfo.screensize.height = window.screen.height;
        info.machineInfo.screensize.width = window.screen.width;
        info.machineInfo.screensize.pixelDepth = window.screen.pixelDepth;
        info.machineInfo.osInfo = osInfo;

        return info;
    };

    // Public API
    exports.SystemInfo = SystemInfo;
});
