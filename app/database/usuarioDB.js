function userDatabase() {
}

userDatabase.criarUsuario = function(connectionFactory, body, callback) {
    connectionFactory(function(err, connection) {
      
		connection.query(sql, inserts, function(err, result) {
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