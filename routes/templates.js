/*
 * GET navbar.
 */

exports.navbar = function(req, res){
  res.render('partials/navbar', { title: 'NavBar' });
};

/*
 * GET help.
 */

exports.help = function(req, res){
  res.render('partials/help', { title: 'Help' });
};


/*
 * GET todomap.
 */

exports.todomap = function(req, res){
  res.render('views/todomap/index', { title: 'ToDoMap' });
};