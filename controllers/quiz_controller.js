var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  console.log("Autoload - factoriza el código si la ruta incluye :quizId");
  console.log("quizId :"+quizId);
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
    if (quiz) {
      req.quiz = quiz;
      console.log("quiz: "+JSON.stringify(quiz));
      next();
    } else { next(new Error('No existe quizId=' + quizId)); }
  }).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  //console.log("req.query.search = "+req.query.search);
  req.query.search = req.query.search || "";
  var search = req.query.search;
  if (search.length !== 0){
    search = '%'+search.replace(' ','%').trim()+'%';
  } else {
    search = '%';
  }
  //console.log("search = "+search);

  models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
    res.render('quizes/index', { quizes: quizes, errors: []});
  }).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  // Cogemos el valor de la <option selected> del <select name="tema"> que se mandó en el <form>
  // Y se lo asignamos a la propiedad tema del objeto quiz, correspondiente con el modelo
  quiz.tema = req.body.tema;

  quiz.validate().then(function(err){
    if (err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    } else {
      // guarda en DB los campos tema, pregunta y respuesta de quiz
      quiz.save({fields: ["tema", "pregunta", "respuesta"]}).then(function(){
        res.redirect('/quizes');
      })  // Redirección HTTP (URL relativo) lista de preguntas
    }
  });

};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  console.log("req.body.tema = "+req.body.tema);
  // Cogemos el valor de la <option selected> del <select name="tema"> que se mandó en el <form>
  req.quiz.tema = req.body.tema;
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz.validate().then( function(err) {
    if (err) {
      res.render('quizes/edit', {quiz: req.quiz, errors: erro.errors});
    } else {
      req.quiz    // save: guarda campos tema, pregunta y respuesta en DB
      .save( {fields: ["tema", "pregunta", "respuesta"]})
      .then( function(){ res.redirect('/quizes');});
    }
  })
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
