var db = window.sqlitePlugin.openDatabase({
    name: 'my.db',
    location: 'default',
    androidDatabaseProvider: 'system'
  });