const articleRoute = require('express').Router();
const articleController = require('../../controller/article');
// const {checkIsAuth} = require("../../config/jwtConfig");

module.exports = (app) => {
  // oui il n'y en a pas, on va le créer juste après le create

  // articleRoute.get('/articles', articleController.getAll); 
  // articleRoute.get('/article/:id', articleController.getById);

  articleRoute.post('/article',  articleController.create);
  articleRoute.put('/article/:id',  articleController.update);
  articleRoute.delete('/article/:id', articleController.delete);
  app.use('/api/v1', articleRoute);
};
