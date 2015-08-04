var models = require('../models/models.js');

var numQuestions, numComments, averageCommentsPerQuestions, numQuestionsWithOutCom, numQuestionsWithCom, errors;

// GET /quizes/statistics
exports.index = function(req, res, next) {

  numQuestions = 0;
  numComments = 0;
  averageCommentsPerQuestions = 0;
  numQuestionsWithOutCom = 0;
  numQuestionsWithCom = 0;
  errors = [];

  // Consulta para devolver todas los Quizes
  models.Quiz.findAll().then(function(quizes) {
    console.log('\n\nquizes: '+JSON.stringify(quizes)+'\n');

    // El número de preguntas
    numQuestions = quizes.length;
    console.log('\n\tnumQuestions = '+numQuestions);

    if(quizes.length === 0) {
      errors[errors.length] = new Error('No se encuentran Quizes');
    }

  }).catch(function(error) { next(error);});

  // Consulta para devolver todos los Comments
  models.Comment.findAll().then(function(comments) {
    console.log('\n\ncomments: '+JSON.stringify(comments)+'\n');

    // El número de comentarios totales
    numComments = comments.length;
    console.log('\n\tnumComments = '+numComments);
    // El número medio de comentarios por pregunta
    averageCommentsPerQuestions = numComments/numQuestions;

    var questionsIdWithComment = [];

    for(var i=0; i < comments.length; i++){
      if (questionsIdWithComment.indexOf(comments[i].QuizId === -1)){
        questionsIdWithComment.push(comments[i].QuizId);
      }
    }

    // El número de preguntas con comentarios
    numQuestionsWithCom = questionsIdWithComment.length;
    console.log('\n\tnumQuestionsWithCom = '+numQuestionsWithCom);

    // El número de preguntas sin comentarios
    numQuestionsWithOutCom = numQuestions - numQuestionsWithCom;
    console.log('\n\tnumQuestionsWithOutCom = '+numQuestionsWithOutCom);

    if(comments.length === 0){
      errors[errors.length] = new Error('No se encuentran Comments');
    }

    next();
}).catch(function(error) { next(error);});

};

exports.statistics = function(req, res) {

  console.log('\n\nVariables: \n'+
          'numQuestions: '+numQuestions+',numComments: '+numComments+
          ',averageCommentsPerQuestions: '+averageCommentsPerQuestions+
          ',numQuestionsWithOutCom: '+numQuestionsWithOutCom+',numQuestionsWithCom: '+numQuestionsWithCom+'\n');

  res.render('quizes/statistics', {numQuestions: numQuestions,
                                   numComments: numComments,
                                   averageCommentsPerQuestions: averageCommentsPerQuestions,
                                   numQuestionsWithOutCom: numQuestionsWithOutCom,
                                   numQuestionsWithCom: numQuestionsWithCom,
                                   errors: errors});
};
