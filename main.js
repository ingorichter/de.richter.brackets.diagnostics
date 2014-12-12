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
/*global define, brackets, Mustache, $ */

//require.config({
//    paths: {
//        "ua-parser-js/ua-parser": 'node_modules/ua-parser-js/src/ua-parser'
//    }
//});

define(function (require, exports, module) {
    "use strict";

    var AppInit           = brackets.getModule("utils/AppInit"),
        ExtensionUtils    = brackets.getModule("utils/ExtensionUtils"),
        CommandManager    = brackets.getModule("command/CommandManager"),
        NodeConnection    = brackets.getModule("utils/NodeConnection"),
        Menus             = brackets.getModule("command/Menus"),
        Dialogs           = brackets.getModule("widgets/Dialogs"),
//        MainViewManager = brackets.getModule("view/MainViewManager"),
        Strings           = require("strings"),
        SystemInfo        = require("SystemInfo").SystemInfo,
        ReportTemplate    = require("text!htmlContent/report-content.html");

    var nodeConnection;

    /** Shows a large message in a dialog with a scrolling panel. Based on SLOC extension by Peter Flynn. */
    function showResult(title, message) {
        var html = "<div style='-webkit-user-select:text; cursor: auto; padding:10px; max-height:250px; overflow:auto'>";
        html += message;
        html += "</div>";

        Dialogs.showModalDialog(Dialogs.DIALOG_ID_ERROR, title, html);
//            .done(function () { MainViewManager.focusActivePane(); });

        // Resize the dialog to be a lot bigger than usual
        var dlgWid = $("body").outerWidth()  * 0.50;
        var dlgHt  = $("body").outerHeight() * 0.50;
        $(".modal.instance").width(dlgWid);
        $(".modal.instance .modal-body").width("auto");
        $(".modal.instance .modal-header").width("auto");
        $(".modal.instance .modal-body").css("max-height", (dlgHt - 100) + "px");
        $(".modal.instance .dialog-message > div").css("max-height", (dlgHt - 150) + "px");
    }

    function formatReport(data) {
        var templateData = data;
        templateData.dateGenerated = new Date().toLocaleString();
        templateData.appInfo.extensionName = function () {
            return this.installInfo.metadata.title ? this.installInfo.metadata.title : this.installInfo.metadata.name;
        };

        var formatMemory = function(val) {
             return (val / 1024 / 1024 / 1024) + " GB";
        };

        templateData.formatFreeMemory = function () {
            return formatMemory(this.machineInfo.osInfo.os.freemem);
        };

        templateData.formatTotalMemory = function () {
            return formatMemory(this.machineInfo.osInfo.os.totalmem);
        };

        templateData.cpuModel = function () {
            return this.machineInfo.osInfo.os.cpus[0].model;
        };

        return Mustache.render(ReportTemplate, templateData);
    }

    // Function to run when the menu item is clicked
    function generateReport() {
        nodeConnection.domains.diagnostics.getOSInfo().done(function (osInfo) {
            var systemInfo = new SystemInfo();
            var htmlReport = formatReport(systemInfo.generateReport(osInfo));
            showResult(Strings.REPORT_DIALOG_TITLE, htmlReport);
        });
    }

    function _setup() {
        // First, register a command - a UI-less object associating an id to a handler
        var MY_COMMAND_ID = "de.richter.brackets.diagnostics.generateDiagnosticReport";   // package-style naming to avoid collisions
        CommandManager.register(Strings.MENU_ITEM_LABEL, MY_COMMAND_ID, generateReport);

        var menu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);
        menu.addMenuItem(MY_COMMAND_ID);

        AppInit.appReady(function () {
            nodeConnection = new NodeConnection();

            nodeConnection.connect(true).then(function () {
                nodeConnection.loadDomains(
                    [ExtensionUtils.getModulePath(module, "node/DiagnosticsDomain")],
                    true).then(function () {
                        //nodePromise.resolve();
                    });
            });
        });
    }

    _setup();
});
