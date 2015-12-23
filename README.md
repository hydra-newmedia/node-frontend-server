# HTTP-Server

## Purpose

Deliver static files as single page application. Delivers `index.html` file as fallback.
If you call e.g. `mydomain.com/asdf` and there is no such file (`asdf`) the server will
deliver `index.html` but preserve the url so that the javascript intelligence in this file can handle it.

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

## Deployment

### Prerequisites

Run
```
npm install
npm install -g gulp
gulp
```

The resulting files from `gulp` will be located in `./dist` directory.
The node modules installed by `npm` will be located in `./node_modules`.

### Deploy

To deploy the application you will need to:
- grab the `dist` folder and put it to the desired environment
- run `cd container && npm install && cd ..`
- copy your static files to be delivered by the http-server to a directory called `public` like: `mkdir public && cp -rp /my/path/to/static/files/* ./public/`
- afterwards run the application by the following command

#### Run with docker

Requirement: docker installation available.

```
cd container
gulp docker:start -p=[port]
```

Where **[port]** is the port you want the application to listen.