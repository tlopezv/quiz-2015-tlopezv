var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
// El enrutador importa el controlador de sesiones
var sessionController = require('../controllers/session_controller');

// El enrutador importa el nuevo controlador para las estadisticas
var statisticsController = require('../controllers/statistics_controller');

// Página de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

console.log("Autoload de comandos con :quizId");
// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  //autoload :quizId
router.param('commentId', commentController.load);  //autoload :commentId

// Definición de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new',  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',     commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                                            sessionController.loginRequired, commentController.publish);

// nueva entrada en el interfaz REST de quizes asociada a la ruta GET /quizes/statistics
router.get('/quizes/statistics',          statisticsController.index, statisticsController.statistics);


router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Quiz', errors: [] });
});

module.exports = router;
