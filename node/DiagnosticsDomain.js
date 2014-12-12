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
/*global */

(function () {
    "use strict";

    var EventEmitter  = require("events").EventEmitter,
        os            = require('os'),
        log4js        = require("log4js");

    var DOMAIN = "diagnostics";

    // setup logger
    log4js.loadAppender("file");
    log4js.addAppender(log4js.appenders.file("/tmp/DiagnosticsDomain.log"), "logfile");
    var log = log4js.getLogger("logfile");

    log.debug("Started parent.");

    /**
     * Retrieves information about the operating system.
     * @param {function(?string)} cb Callback for when the data collection is finished.
     *     Parameter is an error string, or null if no error.
     */
    function _cmdGetOSInfo(cb) {
        log.debug("Retrieve information about operating system");

        var osInfo = {
            'os': {
                platform: os.platform(),
                arch: os.arch(),
                type: os.type(),
                hostname: os.hostname(),
                totalmem: os.totalmem(),
                freemem: os.freemem(),
                cpus: os.cpus()
            }
        };

        log.debug(JSON.stringify(osInfo));
        cb(null, osInfo);
    }

    /**
     * Initializes the domain with its commands.
     * @param {DomainManager} domainmanager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain(DOMAIN)) {
            domainManager.registerDomain(DOMAIN, {major: 0, minor: 1});
        }

        domainManager.registerCommand(
            DOMAIN,
            "getOSInfo",
            _cmdGetOSInfo,
            true,
            "Returns an object with details about the operating system.",
            [],
            [{
                name: "osinfo",
                type: "{}",
                description: "Information about the operating system."
            }]
        );
    }

    // This is the entry point
    exports.init = init;

    // For local unit testing
    exports._cmdGetOSInfo = _cmdGetOSInfo;
}());
