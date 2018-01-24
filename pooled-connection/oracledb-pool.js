console.log('Starting oracledb-pool');

var oracledb = require('oracledb');
var poolMap = {};

var createPool = (poolName, config, callback) => {
  console.log('Creating new pool');
  oracledb.createPool(
    config,
    (err, p) => {
      if (err) callback(err);

      poolMap[poolName] = p;
      callback();
    }
  );
}


var getPool = (poolName) => {
    return poolMap[poolName];
}

module.exports = {
  createPool,
  getPool,
  poolMap
}
