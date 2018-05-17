const usuarioControlador = require('../controllers/usuarioControlador');
const { check, validationResult } = require('express-validator/check');

module.exports = (app) => {

    app.post('/criarUsuario', [
      ], (req, res) => {
        try {
            validationResult(req).throw();  
            let data = req.body;
            usuarioControlador.criarUsuario(data, function(data) {
                res.json(data);
            });
        } catch (err) {
            res.status(422).json({ errors: err.mapped() });
        }  

    });

    app.post('/listarUsuarios', [
    ], (req, res) => {
      try {
          validationResult(req).throw();  
          let data = req.body;
          usuarioControlador.listarUsuarios(data, function(data) {
              res.json(data);
          });
      } catch (err) {
          res.status(422).json({ errors: err.mapped() });
      }  

    });
    
    app.post('/createPasswordUser', [
    ], (req, res) => {
      try {
          validationResult(req).throw();  
          let data = req.body;
          usuarioControlador.createPasswordUser(data, function(data) {
              res.json(data);
          });
      } catch (err) {
          res.status(422).json({ errors: err.mapped() });
      }  

  });


}