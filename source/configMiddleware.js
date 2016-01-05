var path = require('path');
var fs = require('fs');
var jsonfile = require('jsonfile');
var _ = require('lodash');
var ondeath = require('death')({uncaughtException: true});

var cfgFileExt = '.js';
var mode = process.env.MODE;
switch (mode) {
    case 'nodejs':
    case 'js':
        cfgFileExt = '.js';
        break;
    case 'json':
        cfgFileExt = '.json';
        break;
    case 'overwrite':
    case 'concat':
    default:
        cfgFileExt = process.env.CFG_EXT || '.js';
        if (cfgFileExt.substr(0, 1) !== '.') {
            cfgFileExt = '.' + cfgFileExt;
        }
        break;
}

var cfgDir = path.join(__dirname, '/../public/configs');
var defaultCfgFile = cfgDir + '/config' + cfgFileExt;
var randomCfgFile = cfgDir + '/' + require('crypto').randomBytes(24).toString('hex') + cfgFileExt;

var nodeEnv = process.env.NODE_ENV;
var envCfgFile = cfgDir + '/' + nodeEnv + cfgFileExt;
if (nodeEnv && fs.statSync(envCfgFile).isFile()) {
    switch (mode) {
        case 'json':
            var defaultCfg = jsonfile.readFileSync(defaultCfgFile);
            var envCfg = jsonfile.readFileSync(envCfgFile);
            var config = _.extend(defaultCfg, envCfg);
            jsonfile.writeFileSync(randomCfgFile, config);
            break;
        case 'nodejs':
            var defaultCfg = require(defaultCfgFile);
            var envCfg = require(envCfgFile);
            var config = _.extend(defaultCfg, envCfg);
            fs.writeFileSync(randomCfgFile, 'var envConfig = ' + JSON.stringify(config) + ';\nmodule.exports = envConfig;');
            break;
        case 'concat':
            var defaultCfg = fs.readFileSync(defaultCfgFile);
            fs.writeFile(randomCfgFile, defaultCfg, function () {
                var envCfg = fs.readFileSync(envCfgFile);
                fs.appendFileSync(randomCfgFile, '\n' + envCfg);
            });
            break;
        case 'overwrite':
        default:
            var envCfg = fs.readFileSync(envCfgFile);
            fs.writeFileSync(randomCfgFile, envCfg);
            break;
    }
} else {
    var config = fs.readFileSync(defaultCfgFile);
    fs.writeFileSync(randomCfgFile, config);
}

ondeath(function () {
    fs.unlinkSync(randomCfgFile);
    process.exit();
});

var configMiddleware = function (req, res, next) {
    if (req.originalUrl === "/configs/config.json" || req.originalUrl === "/configs/config.js") {
        return res.sendFile(randomCfgFile);
    } else {
        return res.status(403).end('403 Forbidden');
    }
};

module.exports = configMiddleware;