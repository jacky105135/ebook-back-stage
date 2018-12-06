var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = "";

  
  db.query('SELECT * FROM website.member ORDER BY username ASC', function(err, rows) {
      if (err) {
          console.log(err);
      }
      console.log(rows);
      var data = rows;

      // use index.ejs
      res.render('index', { title: 'Account Information', data: data});
  });
});

/*add page*/
router.get('/add', function(req, res, next){

    //use userAdd.ejs
    res.render('userAdd', { title: 'Add User'});
});

// add post
router.post('/userAdd', function(req, res, next) {

    var db = req.con;
    //var username = req.body.username;
    var qur = db.query('SELECT username FROM website.member WHERE username = ?', req.body.username, function(err, rows) {
        if (err) {
            console.log(err);
        }

        var count = rows.length;
        if (count > 0) {

            var msg = 'Username already exists.';
            res.render('userAdd', { title: 'Add User', msg: msg });

        } else {

            var sql = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            };

            //console.log(sql);
            var qur = db.query('INSERT INTO website.member SET ?', sql, function(err, rows) {
                if (err) {
                    console.log(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.redirect('/');
            });
        }
    });


});

router.get('/userEdit/:username', function(req, res, next) {

    //var username = req.params.username;
    var db = req.con;
    var data = "";
    

    db.query('SELECT * FROM website.member WHERE username = ?',req.params.username , function(err, rows) {
        if (err) {
            console.log(err);
        }
        //console.log(rows);
        var data = rows;
        res.render('userEdit', { title: 'Edit Account', data: data });
    });

});

router.post('/userEdit/:username', function(req, res, next) {

    var db = req.con;
    var username = req.body.username;

    var sql = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    var qur = db.query('UPDATE website.member SET ? WHERE username = ?', [sql, username], function(err, rows) {
        if (err) {
            console.log(err);
        }

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});

router.get('/userDelete/:username', function(req, res, next) {

    //var username = req.query.username;
    var db = req.con;

    var qur = db.query('DELETE FROM website.member WHERE username = ?', req.params.username, function(err, rows) {
        if (err) {
            console.log(err);
        }
        //console.log(req.params.username)
        res.redirect('/');
    });
});

module.exports = router;
