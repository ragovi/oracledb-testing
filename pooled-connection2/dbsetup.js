console.log('Starting dbsetup');
const oracledb = require('oracledb');
const dbconfig = require('./dbconfig');
const oraPoolUtils = require('./oracledb-pool');

const poolConfig = {
    user:             dbconfig.user,
    password:         dbconfig.password,
    connectString:    dbconfig.connectString,
    poolMax:          50,
    poolMin:          5,
    poolIncrement:    5,
    poolTimeout:      4
};

var init = () => {
  return new Promise((resolve, reject) => {
    oraPoolUtils.createPool('myPool', poolConfig, (err) => {
      if (err) {
        reject(err);
      }
      console.log('Connection Pool created');
      resolve();
    });

  })
};



var getConnection = () => {
  return new Promise((resolve, reject) => {
    var pool = oraPoolUtils.getPool('myPool');

    var connection = pool.getConnection(function(err, connection) {
      // UNABLE TO GET CONNECTION - CALLBACK WITH ERROR
      if (err) {
        console.log("ERROR: Cannot get a connection: ", err);
        reject(err);
      }

      // If pool is defined - show connectionsOpen and connectionsInUse
      if (typeof pool !== "undefined") {
        console.log("INFO: Connections open: " + pool.connectionsOpen);
        console.log("INFO: Connections in use: " + pool.connectionsInUse);
      }

      // Else everything looks good
      // Obtain the Oracle Session ID, then return the connection
      doExecute(connection, "SELECT SYS_CONTEXT('userenv', 'sid') AS session_id FROM DUAL", {}, function(err, result) {

        // Something went wrong, releae the connection and return the error
        if (err) {
          console.log("ERROR: Unable to determine Oracle SESSION ID for this transaction: ", err);
          releaseConnection(connection);
          reject(err);
        }

        // Log the connection ID (we do this to ensure the conncetions are being pooled correctly)
        console.log("INFO: Pooled Connection retrieved from the database, SESSION ID: ", result.rows[0]['SESSION_ID']);

        // Return the connection for use in model
        resolve(connection);
      });
    });
  });
}

var doExecute = function(connection, sql, params, callback) {

  connection.execute(sql, params, { autoCommit: false, outFormat: oracledb.OBJECT, maxRows:1000 }, function(err, result) {

    // Something went wrong - handle the data and release the connection
    if (err) {
      console.log("ERROR: Unable to execute the SQL: ", err);
      //releaseConnection(connection);
      return callback(err);
    }

    // Return the result to the request initiator
    // console.log("INFO: Result from Database: ", result)
    return callback(err, result);

  });
}

module.exports = {init, getConnection};
