function userDatabase() {
}

userDatabase.criarUsuario = function(connectionFactory, usuario, callback) {
    connectionFactory(function(err, connection) {

		let sql = `INSERT INTO usuario SET ? `;
		let inserts = usuario;
      
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

userDatabase.verificarIdUsuario = function(connectionFactory, usuario, callback) {
    connectionFactory(function(err, connection) {

		let sql = `SELECT * FROM usuario 
			INNER JOIN tipo_usuario ON tipo_usuario.id=usuario.tipo
		WHERE usuario.id= ?
		`;
		let inserts = [usuario.id]
      
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