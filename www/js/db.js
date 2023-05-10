document.addEventListener("deviceready", () => {
    const db = window.sqlitePlugin.openDatabase({ name: 'gimnasiodb.db',location: 'default',androidDatabaseProvider: 'system'});
}, false);
