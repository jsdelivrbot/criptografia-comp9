const connectionFactory = require('../config/connectionFactory');
const usuarioDB = require('../database/usuarioDB')();
const jwt = require('jsonwebtoken');
const secretKey = require('../../config/config').secretKey;
const bcrypt = require("bcrypt-nodejs");

const userController = {


    criarUsuario: (body, callback) =>{
        
    }
    
}

module.exports = userController;