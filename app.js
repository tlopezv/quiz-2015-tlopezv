var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
// Se importa el paquete express-session instalado con npm
var session = require('express-session');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// cookieParser: añadir semilla 'Quiz 2015' para cifrar cookie
app.use(cookieParser('Quiz 2015'));
// Instalar MW session
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  //if (session)  console.log('session: '+JSON.stringify(session));
  // pasa el control al siguiente middleware.
  next();
});

// añadir un middleware de auto-logout
app.use(function(req, res, next) {

  if (req.session.user && req.session.user.timeStamp){

    // El middleware debe comprobar en cada transacción con una sesión activa
    // si la han transcurrido más de 2 minutos desde la transacción anterior
    // en dicha sesión, en cuyo caso destruirá la sesión.
    if(new Date().getTime() - req.session.user.timeStamp > 120000){
      console.log('\n **** Redirección a Logout ***** \n');
      delete req.session.user;
      req.session.logout = 'Se ha producido un Logout por exceso de tiempo de sesion inactiva \n Vuelva a hacer LOGIN';
      console.log('\n Errors: ' + JSON.stringify(req.session.errors));
      res.redirect(req.session.redir.toString());
    } else {
      next();
    }
  } else {
    console.log('No había registro de tiempo de la session:');
    console.log('\n\treq.session: '+JSON.stringify(req.session.user));
    if(req.session.user) {
      // que guarde en cada transacción la hora del reloj del sistema en una
      // variable de la sesión a la que está asociada.
      req.session.user.timeStamp = new Date().getTime();
      console.log('req.session.timeStamp: '+req.session.user.timeStamp);
      if(req.session.logout){
        delete req.session.logout;
      }
    }

    next();
  }

});


app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
