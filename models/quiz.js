// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
            { tema: {   // Campo tema, que puede contener uno de los siguientes valores: 'otro','humanidades','ocio','ciencia','tecnologia'
                type: DataTypes.ENUM,
                values: ['otro','humanidades','ocio','ciencia','tecnologia']
              },
              pregunta: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "-> Falta Pregunta"}}
              },
              respuesta: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "-> Falta Respuesta"}}
              }
            });
}
