var oracledb = require('oracledb');

oracledb.getConnection(
  {
    user          : "hr",
    password      : "welcome",
    connectString : "localhost:49161/XE"
  })
  .then(function(conn) {
    return conn.execute(
      `SELECT department_id, department_name
       FROM departments
       WHERE manager_id < :id`,
      [110]  // bind value for :id
    )
      .then(function(result) {
        console.log(result.rows);
        return conn.close();
      })
      .catch(function(err) {
        console.error(err);
        return conn.close();
      });
  })
  .catch(function(err) {
    console.error(err);
  });
