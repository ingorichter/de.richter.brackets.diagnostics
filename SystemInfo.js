/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window */
define(function (require, exports, module) {
    'use strict';

    var ExtensionManager = brackets.getModule('extensibility/ExtensionManager'),
        UAParser         = require('node_modules/ua-parser-js/src/ua-parser'),
        _                = brackets.getModule('thirdparty/lodash');

    function SystemInfo() {
    }

    SystemInfo.prototype.generateReport = function () {
        var info = {},
            uaresult = new UAParser().setUA(window.navigator.userAgent).getResult();

        // basic data
        info.version = 1;
        info.clientId = 'this-should-be-something-unique';

        // brackets
        info.appInfo = {};
        info.appInfo.version = brackets.metadata.version;
        info.appInfo.language = brackets.getLocale();
        info.appInfo.inBrowser = brackets.inBrowser;
        info.appInfo.appSupportDir = brackets.app.getApplicationSupportDirectory();
        info.appInfo.cefversion = uaresult.browser.version;
        info.appInfo.extensions = _.filter(ExtensionManager.extensions, function (extension) {
            return extension.installInfo.locationType === 'user' && extension.installInfo.status === 'enabled';
        });

        // machine info
        info.machineInfo = {};
        info.machineInfo.osname = uaresult.os.name;
        info.machineInfo.osversion = uaresult.os.version;

        info.machineInfo.screensize = {};
        info.machineInfo.screensize.height = window.screen.height;
        info.machineInfo.screensize.width = window.screen.width;
        info.machineInfo.screensize.pixelDepth = window.screen.pixelDepth;

        return info;
    };

    // Public API
    exports.SystemInfo = SystemInfo;
});
