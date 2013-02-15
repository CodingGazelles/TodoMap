/*
 * GET navbar.
 */

exports.navbar = function(req, res){
  res.render('partials/navbar', { title: 'NavBar' });
};


/*
 * GET todomap.
 */

exports.todomap = function(req, res){
  res.render('views/todomap/index', { title: 'ToDoMap' });
};