const {ParseServer} = require('parse-server');
const HOST_URL = process.env.HOST_URL || 'localhost'
const port = process.env.PORT || 3000

const init = (app) => {
    const PORT_LIVE_QUERY = process.env.PORT_LIVE_QUERY || 2337
    const httpServer = require('http').createServer(app);
    httpServer.listen(PORT_LIVE_QUERY);

    ParseServer.createLiveQueryServer(httpServer, {
        serverURL: `http://${HOST_URL}:${port}/parse`, // Don't forget to change to https if needed
        "appId": process.env.APP_ID,
        "masterKey": process.env.MASTER_KEY,
    });
}

module.exports = {init}