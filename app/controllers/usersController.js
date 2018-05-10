const connectionFactory = require('../config/connectionFactory');
const userDatabase = require('../database/usersDatabase')();
const jwt = require('jsonwebtoken');
const secretKey = require('../../config/config').secretKey;
const bcrypt = require("bcrypt-nodejs");

const userNotFound = require('../../JSON/userNotFound');
const userNotHavePermission = require('../../JSON/userNotHavePermission');

const authUser = require('../database/helpers/usersAuthDatabase')();

const userController = {

    login: (body, callback) => {
        try {
            userDatabase.login(connectionFactory(), body, function(exception, loginDBResult) {
                if (exception) throw exception;
                if (!loginDBResult) {
                    callback(userNotFound);
                } else {
                    try{
                        bcrypt.compare(body.password, loginDBResult.password, function(err, res) {
                
                            if (res){
                                
                                loginDBResult.token = jwt.sign(loginDBResult, secretKey);
                                
                                userDatabase.updateToken(connectionFactory(), loginDBResult, function(exception, result) {   
                                    callback({ success: true, message: 'Autenticação válida', token: loginDBResult.token }); 
                                });  
    
                            }else{
                                callback(userNotFound);
                            }            
                        });
                    }catch (exception){
                        callback({  success: false, exception: exception.message });
                    }    
                }
            });
        } catch (error) {
            console.log(error)
        }
    },

    getUser: (body, callback) =>{
        try {
            authUser.authToken(body.token, connectionFactory(), function(resultAuthToken){      
                if(resultAuthToken.success){
                    userDatabase.getUser(connectionFactory(), resultAuthToken.result, function(exception, getUserDBResult) {   
                        if(!exception) {
                            if (getUserDBResult){
                                callback({ success: true, user: getUserDBResult });    
                            }else{
                                callback(userNotFound);  
                            }
                        }else {
                            callback({ success: false, mensagem: exception.message });
                        }
                    });
                }else{
                    callback(userNotHavePermission);
                }
            });
        } catch (error) {
            console.log(error)
        }
    },

    getAllUsers: (body, callback) =>{
        try {
            authUser.authToken(body.token, connectionFactory(), function(resultAuthToken){      
                if(resultAuthToken.success){
                    userDatabase.getAllUsers(connectionFactory(), resultAuthToken.result, function(exception, getAllUsersDBResult) {   
                        if(!exception) {
                            if (getAllUsersDBResult){
                                callback({ success: true, users: getAllUsersDBResult });    
                            }else{
                                callback(userNotFound);  
                            }
                        }else {
                            callback({ success: false, mensagem: exception.message });
                        }
                    });
                }else{
                    callback(userNotHavePermission);
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
    
}

module.exports = userController;