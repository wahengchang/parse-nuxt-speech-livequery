import Parse from 'parse'
const HOST_URL = process.env.HOST_URL || 'localhost'
const PORT_LIVE_QUERY = process.env.PORT_LIVE_QUERY || 2337

export const init = () => {
    Parse.initialize(process.env.APP_ID);
    Parse.serverURL = '/parse'
    Parse.liveQueryServerURL = `ws://${HOST_URL}:${PORT_LIVE_QUERY}/`;

    Parse.LiveQuery.on('open', () => {
        console.log('socket connection established');
    });
    Parse.LiveQuery.on('close', () => {
        console.log('socket connection closed');
    });
    Parse.LiveQuery.on('error', (error) => {
        console.log(error);
    });
    console.log('[INFO] initated parse.com')
}

export const requiredLogout = () => {
    console.log(' -=-=-=- requiredLogout')
    const user = Parse.User.current();

    if(user) {
        alert(`Hi ${user.get('username')}, this page required logout`)
        window.location.replace("/chatrooms");
    }
}

export default {
    init,
    requiredLogout
}