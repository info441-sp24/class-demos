import sqlite3 from 'sqlite3'
import express from 'express';
var router = express.Router();


let db = new sqlite3.Database(':memory:', (err) => {
  if(err)
  {
      return console.error(err.message)
  }
  console.log("Connected to the in-memory sqlite database")
})

db.serialize(() => {
  db
      .run('CREATE TABLE people(first_name text, last_name text)')
      .run(`INSERT INTO people(first_name, last_name)
            VALUES ("Kyle", "Thayer"),
                   ("Kyle", "Chandler"),
                   ("Miranda", "Ma"),
                   ("Jared", "Lim")
      
      `)
  
      .run('CREATE TABLE secret_table(message text)')
      .run(`INSERT INTO secret_table(message)
            VALUES ('The password for Kyle is: pa55w0rd'),
                   ('The treasure is hidden on the 5th floor.')
       
      `)
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  let nameSearch = req.query.nameSearch
  nameSearch = nameSearch ? nameSearch : ""

  // TO fix the sql injection vulnerability, do this instead:
  // db.all(`SELECT * FROM people WHERE first_name = ?`, nameSearch,
  db.all(`SELECT * FROM people WHERE first_name = "${nameSearch}"`,
    (err, allRows) => {
      if(err){
        console.log("db error: " + err)
        res.send("db error" + err)
        return
      }
      if(!allRows){
        return ""
      }
      let matchingPeople = allRows.map(
        row => `${row.first_name} ${row.last_name}`
      ).join("\n")
      
      res.send(matchingPeople)
    }
  )

});

export default router;
