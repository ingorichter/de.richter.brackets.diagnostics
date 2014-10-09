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
/*global define, brackets */

//require.config({
//    paths: {
//        'ua-parser-js/ua-parser': 'node_modules/ua-parser-js/src/ua-parser'
//    }
//});

define(function (require, exports, module) {
    'use strict';

    var CommandManager  = brackets.getModule('command/CommandManager'),
        Menus           = brackets.getModule('command/Menus'),
        Dialogs         = brackets.getModule('widgets/Dialogs'),
//        MainViewManager = brackets.getModule('view/MainViewManager'),
        _               = brackets.getModule('thirdparty/lodash'),
        Strings         = require('strings'),
        SystemInfo      = require('SystemInfo').SystemInfo;

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

    function formatReport(data, type) {
        var html = "";

        html += "Generated:" + new Date().toLocaleString();
        html += "</br>";

        html += "<h4>Client Information</h4>";
        html += "UUID:" + data.clientUUID;
        html += "</br>";

        html += "<h4>Machine Information</h4>";
        html += "OS Name:" + data.machineInfo.osname;
        html += "</br>";
        html += "OS Version:" + data.machineInfo.osversion;
        html += "</br>";
        html += "Screen heigth:" + data.machineInfo.screensize.height;
        html += "</br>";
        html += "Screen width:" + data.machineInfo.screensize.width;
        html += "</br>";
        html += "Pixel Depth:" + data.machineInfo.screensize.pixelDepth;

        html += "</br>";

        html += "<h4>Brackets Information</h4>";
        html += "Version:" + data.appInfo.version;
        html += "</br>";
        html += "Language:" + data.appInfo.language;
        html += "</br>";
        html += "InBrowser:" + data.appInfo.inBrowser;
        html += "</br>";
        html += "App Support Dir:" + data.appInfo.appSupportDir;
        html += "</br>";
        html += "CEF Version:" + data.appInfo.cefversion;

        if (data.appInfo.extensions.length > 0) {
            html += "</br>";

            html += "<h4>Extensions</h4>";
            html += "<ul>";
            _.each(data.appInfo.extensions, function (extension) {
                html += "<li>" + (extension.installInfo.metadata.title ? extension.installInfo.metadata.title : extension.installInfo.metadata.name) + "&mdash;" + extension.installInfo.metadata.version + "</li>";
            });
            html += "</ul>";
        }

        return html;
    }

    // Function to run when the menu item is clicked
    function generateReport() {
        var systemInfo = new SystemInfo();
        var htmlReport = formatReport(systemInfo.generateReport());
        showResult("Brackets Diagnostic Report", htmlReport);
    }

    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = 'de.richter.brackets.diagnostics.generateDiagnosticReport';   // package-style naming to avoid collisions
    CommandManager.register(Strings.MENU_ITEM_LABEL, MY_COMMAND_ID, generateReport);

    var menu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);
    menu.addMenuItem(MY_COMMAND_ID);
});
