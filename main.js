/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets */

//require.config({
//    paths: {
//        'ua-parser-js/ua-parser': 'node_modules/ua-parser-js/src/ua-parser'
//    }
//});

define(function (require, exports, module) {
    'use strict';

    var CommandManager = brackets.getModule('command/CommandManager'),
        Menus          = brackets.getModule('command/Menus'),
        Strings        = require('strings'),
        SystemInfo     = require('SystemInfo').SystemInfo;

    // Function to run when the menu item is clicked
    function generateReport() {
        var systemInfo = new SystemInfo();
        console.log(systemInfo.generateReport());
    }

    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = 'de.richter.brackets.sysinfo.generateReport';   // package-style naming to avoid collisions
    CommandManager.register(Strings.MENU_ITEM_LABEL, MY_COMMAND_ID, generateReport);

    var menu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);
    menu.addMenuItem(MY_COMMAND_ID);
});
