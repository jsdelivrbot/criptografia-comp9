const jwt = require('jsonwebtoken');
const secretKey = require('../../../config/config').secretKey;

function authUser() {
}

authUser.authToken = function(token, ConnectionDB, callback) {
    
    try {
        const resultAuthToken = jwt.verify(token, secretKey);
        
        resultAuthToken.token = token;

        authUser.checkToken(ConnectionDB, resultAuthToken, function(exception, result) {  
            if (result[0].exist == 1){
                callback({ success: true, result: resultAuthToken });
                return;
            }else {
                callback({ success: false });
                return;
            }            
        });  

    } catch(exceptionToken) {
     
        callback({ success: false });
        return;
    }
}

authUser.checkToken = function(connectionFactory, resultAuthToken, callback) {
	connectionFactory(function(err, connection) {
        
        let queryToken = `SELECT COUNT(0) AS exist FROM users WHERE user_id= ? AND token= ?;`;
        let inserts = [resultAuthToken.user_id, resultAuthToken.token];

	    connection.query(queryToken, inserts, function(err, result) {
            connection.release();
			callback(err, result);
        });
        
	});
}

module.exports = function(){
    return authUser;
};