var db = require('./dbsetup');
var sqlUtils = require('./sqlutils');

 db.init().then(() => {

   for (i = 0; i < 1000; i++) {

        aPromise = db.getConnection()
        .then(function(conn) {
          sqlUtils.doSomething(conn);
        }).catch(function(err) {
          console.error(err);
        });



  }



 }).catch((err) => {
   console.log(err);
 })
