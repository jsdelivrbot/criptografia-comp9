var mysql = require('mysql');
var pool = null;

function _criaPool() {
    
    if (!process.env.NODE_ENV) {
        pool =  mysql.createPool({
            connectionLimit: 100,
            host: 'localhost',
            user: 'root',
            password: 'root', //root
            database: 'heroku_d0adbf2c8ee0f5a', //databese dev
            multipleStatements: true,
            dateStrings: true
        });
    }

    if (process.env.NODE_ENV == 'production') {

        var urlDeConexao = process.env.CLEARDB_DATABASE_URL;
        var grupos = urlDeConexao.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?reconnect=true/);
        pool =  mysql.createPool({
            connectionLimit: 10, // Limite do ClearDB
            host: grupos[3],
            user: grupos[1],
            password: grupos[2],
            database: grupos[4],
            multipleStatements: true,
            dateStrings: true
        });
    }

    pool.on('enqueue', function () {
        console.error('Waiting for available connection slot');
    });
}

_criaPool();

var connectMySQL = function(callback) {

    return pool.getConnection(function (err, connection) {
        if(err) {
            //return callback(err);
            console.log('Error getting mysql_pool connection: ' + err);
            pool.end(function onEnd(error) {
                if(error) {
                    console.log('Erro ao terminar o pool: ' + error);
                }
                _criaPool();
            });
            return;
        }
        return callback(null, connection);
    });

};

module.exports = function() {
    return connectMySQL;
};