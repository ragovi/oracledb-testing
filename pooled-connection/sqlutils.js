var doSomething = (conn) => {
  return conn.execute(
    `SELECT department_id, department_name
    FROM departments
    WHERE manager_id < :id`,
    [110]  // bind value for :id
  )
  .then(function(result) {
    console.log('Results: ', result.rows);
    return conn.close();
  })
  .catch(function(err) {
    console.error(err);
    return conn.close();
  });

}

module.exports = {doSomething}
