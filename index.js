let app = require('./config/express')();
let http = require('http').Server(app);

let url = process.env.PORT || 5000

http.listen(url, function(){
    console.log("Executando na porta: " + url);
});