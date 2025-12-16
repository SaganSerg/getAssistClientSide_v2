exports.deleteConnection = (db, connectionId) =>
  db.run('DELETE FROM connectons WHERE connection_id = ?', [connectionId], (err) => !err);
