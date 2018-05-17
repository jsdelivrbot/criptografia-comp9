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
                usuarioCriar['email'] = jwt.sign({ email: usuarioCriar.email}, secretKey);
                usuarioCriar['telefone'] = jwt.sign({ email: usuarioCriar.email}, secretKey);
                
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
                            element.email = jwt.decode(element.email);
                            element.telefone = jwt.decode(element.telefone);
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

    editarUsuarios: (body, callback) => {
        verificarIdUsuarioESenha(body.editor, function(verificarIdUsuarioResult) {   

            if (verificarIdUsuarioResult === true || body.editor.id === body.editar.id){

                let usuarioEditar = body.editar.usuario;

                if (usuarioEditar.email){
                    usuarioEditar['email'] = jwt.sign({ email: usuarioEditar.email}, secretKey);
                }
                if (usuarioEditar.telefone){
                    usuarioEditar['telefone'] = jwt.sign({ telefone: usuarioEditar.telefone}, secretKey);
                }

                body.editar.usuario = usuarioEditar;
                        
                usuarioDB.editarUsuarios(connectionFactory(), body.editar, function(exception, editarUsuariosResult) {  
                    if (editarUsuariosResult){
                        callback({ message : "Editado com sucesso." });  
                    }else{
                        callback({ message : "Falha ao editar o usuario." });  
                    }
                });

            }else{
                callback({ message : "Usuário não foi editado, verifique suas informações." });  
            }

        });
    },

    
    excluirUsuario: (body, callback) => {
        verificarIdUsuarioESenha(body.apagador, function(verificarIdUsuarioResult) {   

            if (verificarIdUsuarioResult === true){
    
                usuarioDB.excluirUsuario(connectionFactory(), body.apagar, function(exception, excluirUsuarioResult) {  
                    if (excluirUsuarioResult){
                        callback({ message : "Excluido com sucesso" });  
                    }else{
                        callback({ message : "Falha ao excluir o usuario." });  
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
