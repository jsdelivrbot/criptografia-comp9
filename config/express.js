let load = require('express-load'),
    expressValidator = require('express-validator'),
    cors = require('cors'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

module.exports = function() {
    
    app.use(cors());    
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    app.use(expressValidator());

    load('routes',{cwd: 'app'})
        .into(app);
        
    return app;
}