const connectionFactory = require('../config/connectionFactory');
const usuarioDB = require('../database/usuarioDB')();
const jwt = require('jsonwebtoken');
const secretKey = require('../../config/config').secretKey;
const bcrypt = require("bcrypt-nodejs");

const userController = {

    criarUsuario: (body, callback) => {
        verificarIdUsuarioESenha(body.criador, function(verificarIdUsuarioResult) {   

            if (verificarIdUsuarioResult === true){
                
                let usuarioCriar = body.criar;
                usuarioCriar['senha'] = bcrypt.hashSync(usuarioCriar.senha);

                var informacoes_usuario = jwt.sign(
                { 
                    email: usuarioCriar.email,
                    telefone: usuarioCriar.telefone
                }
                , secretKey);

                delete usuarioCriar['email'];
                delete usuarioCriar['telefone'];
                usuarioCriar['informacoes_usuario'] = informacoes_usuario;

                usuarioDB.criarUsuario(connectionFactory(), usuarioCriar, function(exception, criarUsuarioResult) {  
                    if (criarUsuarioResult){
                        callback({ message : "Criado com sucesso.", id: criarUsuarioResult.insertId });  
                    }else{
                        callback({ message : "Falha ao criar o usuario." });  
                    }
                });

            }else{
                callback({ message : "Usuário não foi criado, verifique suas informações." });  
            }

        });
    },

    listarUsuarios: (body, callback) => {
        verificarIdUsuarioESenha(body.buscador, function(verificarIdUsuarioResult) {   

            if (verificarIdUsuarioResult === true){
    
                usuarioDB.listarUsuarios(connectionFactory(), function(exception, listarUsuariosResult) {  
                    if (listarUsuariosResult){

                        let result = listarUsuariosResult.map(element => {
                            element.informacoes_usuario = jwt.decode(element.informacoes_usuario);
                            return element;
                        });  
                        callback({ usuarios: result });  
                    }else{
                        callback({ message : "Falha ao buscar o usuario." });  
                    }
                });

            }else{
                callback({ message : "Usuário não foi criado, verifique suas informações." });  
            }

        });
    },

    createPasswordUser: (body, callback) => {
        callback(bcrypt.hashSync(body.senha));  
    },
    
}

function verificarIdUsuarioESenha (usuario, callback) {
    usuarioDB.verificarIdUsuario(connectionFactory(), usuario, function(exception, verificarIdUsuarioResult) {   
        if(!exception) {
            if (verificarIdUsuarioResult && verificarIdUsuarioResult[0].tipo == 'Gerente'){
                try{
                    bcrypt.compare(usuario.senha, verificarIdUsuarioResult[0].senha, function(err, res) {       
                        if (res){
                            callback(true);
                        }else{
                            callback(false);
                        } 
                    });
                }catch (exception){
                    callback(false);
                }    

            }else{
                callback(false);  
            }
        }else {
            callback(false);
        }
    });
}

module.exports = userController;
