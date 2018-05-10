function userDatabase() {
}

userDatabase.login = function(connectionFactory, body, callback) {
    connectionFactory(function(err, connection) {
        
        let sql = `SELECT user_id, password FROM users WHERE login= ?;`;
        let inserts = [body.login];

		connection.query(sql, inserts, function(err, result) {
	    	connection.release();

            if (!err && result.length != 0){
				let user = {
					user_id: result[0].user_id,
                    password: result[0].password,
					token: ''
                }
                callback(err, user);	
			}else {
				callback(err, false);
			}
        });
        
	});
}

userDatabase.updateToken = function(connectionFactory, user, callback) {
	connectionFactory(function(err, connection) {

        let sql = `UPDATE users SET token= ? WHERE user_id= ?;`;
        let inserts = [user.token, user.user_id];
        
	    connection.query(sql, inserts, function(err, result) {
			connection.release();
			callback(err, result);
        });
        
	});
}

userDatabase.getUser = function(connectionFactory, resultAuthToken, callback) {
	connectionFactory(function(err, connection) {

        let sql = `SELECT * FROM users WHERE user_id= ?;`;
		let inserts = [resultAuthToken.user_id];
        
	    connection.query(sql, inserts, function(err, result) {
			connection.release();
			
			if (!err && result.length != 0){			
				callback(err, result[0]);	
			}else {
				callback(err, false);
			}
			
        });
        
	});
}

userDatabase.getAllUsers = function(connectionFactory, resultAuthToken, callback) {
	connectionFactory(function(err, connection) {

        let sql = `SELECT * FROM users;`;
        
	    connection.query(sql, function(err, result) {
			connection.release();
			
			if (!err && result.length != 0){			
				callback(err, result);	
			}else {
				callback(err, false);
			}
			
        });
        
	});
}

module.exports = function(){
    return userDatabase;
};