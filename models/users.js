'use strict'
const pg = require('pg-promise')({
});
const config = {
host:       process.env.DB_HOST,
port:       process.env.DB_PORT,
database:   process.env.DB_NAME,
user:       process.env.DB_USER,
password:   process.env.DB_PASS,
};

const _db = pg(config);

module.exports = {
  getUsers(req,res,next) {
    _db.any(`SELECT * FROM users;`)
       .then( users => {
        res.rows = users;
        next()
       })
       .catch( error => {
        console.error('Error', error)
       })
  },
  addUser(req,res,next) {
    console.log('=====', req.body)
    _db.any(
      `INSERT INTO
      users (first_name, email, password, created)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      returning *;`, [req.body.first_name, req.body.email, req.body.password]
    )
    .then(user => {
      console.log('Added user successfully');
      res.rows = user;
      next()
    })
    .catch(error =>{
      console.error('Error in ADDING user', error)
    })
  },

  /* PUT /users/:id*/
  updateUser(req,res,next) {
    const uID = Number.parseInt(req.params.users_id)
    _db.one(
      `UPDATE users
      SET first_name = $1,
      email = $2,
      password = $3
      WHERE user_id = $4
      returning * ;`, [req.body.first_name, req.body.email, req.body.password, uID]
    )
    .then(user => {
      console.log('Update user successfully');
      res.rows = user;
      next()
    })
    .catch(error =>{
      console.error('Error in Updating user', error)
    })
  },

  deleteUser(req,res,next) {
    const uID = Number.parseInt(req.params.users_id)
    _db.none(
      `DELETE FROM users
      WHERE user_id = $1;`, [uID]
    )
    .then(() => {
      console.log('Deleted user successfully');
      next()
    })
    .catch(error =>{
      console.error('Error in DELETE user', error)
    })
  }
}


