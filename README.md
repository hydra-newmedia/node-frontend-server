# HTTP-Server

## Purpose

Deliver static files as single page application. Delivers `index.html` file as fallback.
If you call e.g. `mydomain.com/asdf` and there is no such file (`asdf`) the server will
deliver `index.html` but preserve the url so that the javascript intelligence in this file can handle it.
The files to be delivered are expexted in directory `public` (in case you already run `gulp` it's `dist/public`).

## Start Application

Use npm
```
NODE_ENV=[env] npm start -- non-blocking
```
or leave out the 'non-blocking' flag if you want the start script to block the console output.
In both cases exiting the shell you performed the `npm start` will NOT exit the application.
This is due to the fact that the start script `./bin/start.sh` which is called by `npm start`
uses PM2 (https://www.npmjs.com/package/pm2) to run the app.

The start script blocks by default
because AWS/EBS will otherwise perpetually try to restart `npm start`.

### NODE_ENV and MODE

By default the server will provide the file `./public/configs/config.(js|json|...)` on the URL `mydomain.com/configs/config.(js|json|...)` while hiding all other files of that directory.

If you set the `NODE_ENV` environment variable as shown in the `npm start` example above,
the server will additionaly provide configurations of file named following this pattern: [env].(json|js|...)
By default it will provide the environmental file
(eg. if you set `NODE_ENV` to `dev` the file which is delivered on `mydomain.com/configs/config.js`
will contain the contents of `./public/configs/dev.js`).
In non-default modes environmental configurations are merged with the default one
(e.g if you set `NODE_ENV` to `dev` the file which is delivered on `mydomain.com/configs/config.js`
will contain the contents of `./public/configs/dev.js` merged/appended to those of `./public/configs/config.js`)

You can also specify a different file extension by setting the environment variable `MODE=[mode]`
with the following supported values:
* `overwrite`: default, only the environmental `.js` file (e.g. `/public/configs/dev.js`) will be provided (unmodified).
Additionally you can specify an environmental variable `CFG_EXT` which is used instead of `.js`.
* `concat`: behaviour as described above (concatenating the default and environmental config file)
* `nodejs`: will look for `.js` files in the `./public/configs/` directory and merge their configurations.
The environmental file overwrites the default file in case of duplicate keys.
The resulting file is valid js with the global variable `envConfig` to be used e.g. in other js scripts.
Also `module.exports` holds the merged configuration object, so you can use it as a node module.
The config files (default and environmental) have to look like the following example:
```
var myVar = module.exports = {
    "myKey1": "myVal1",
    ...
}
// the result will look like this
var envConfig = {"myKey1":"myVal1", ... ,"myKey2":"myVal2", ...};
module.exports = envConfig;
```
* `json`: the files have to be valid json.
The script merges the configurations of the environmental file (`dev.json`) with those of the default file (`config.json`).
The environmental file overwrites the default file in case of duplicate keys.

## Deployment

### Prerequisites

Run
```
npm install
npm install -g gulp
gulp
```

The resulting files from `gulp` will be located in `./dist` directory.
The node modules installed by `npm` will be located in `./node_modules` and
the gulp task copied them to `./dist/container/node_modules`.

### Deploy

To deploy the application you will need to:
- grab the `dist` folder and put it to the desired environment
- copy your static files to be delivered by the http-server to a directory called `public` like: `mkdir public && cp -rp /my/path/to/static/files/* ./public/`
- afterwards run the application by the following command

#### Run with docker

Requirement: docker installation available.

```
cd container
gulp docker:start -p=[port] -n=[id] --NODE_ENV=[env]
```

Where **[port]** is the port you want the application to listen.
**[id]** is the container's identifying name to be identified and killed with (needed for redeploy).
**[env]** is the environment to which you are deploying.
The script will take the relating correct config file (see above 'NODE_ENV and MODE').
Example: `gulp docker:start -p=10002 -n=myApp-frontend --NODE_ENV=dev`