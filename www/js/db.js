document.addEventListener("deviceready", onDeviceReady, false);
var db = window.sqlitePlugin.openDatabase({ name: 'gimnasiodb.db',location: 'default',androidDatabaseProvider: 'system'});