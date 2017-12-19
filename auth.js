// loading the relevant modules
const express = require('express'),
    config = require('./config.json'),
    qs = require('querystring'),
    ssclient = require('smartsheet'),
    app = express();
// instantiating the Smartsheet client
const smartsheet = ssclient.createClient({
    // a blank token provides access to token endpoints
    accessToken: ''
});
// starting an express server
app.listen(3000, () => {
    console.log('Ports listening on 3000...');
});
// setting up home route containing basic page content
app.get('/', (req, res) => {
    res.send('<h1>Sample oAuth flow for Smartsheet</h1><a href="/auth">Login to Smartsheet</a>')
});
// route redirecting to our authorization page
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
});
// helper function to assemble authorization url
function authorizeURL(params) {
    const authURL = 'https://app.smartsheet.com/b/authorize';
    return `${authURL}?${qs.stringify(params)}`;
}
const authorizationUri = authorizeURL({
    response_type: 'code',
    client_id: config.APP_CLIENT_ID,
    scope: 'CREATE_SHEETS WRITE_SHEETS'
});
// callback service parses the authorization code and requests access token
app.get('/callback', (req, res) => {
    const authCode = req.query.code;
    const generated_hash = require('crypto')
        .createHash('sha256')
        .update(config.APP_SECRET + "|" + authCode)
        .digest('hex');
    const options = {
        queryParameters: {
            client_id: config.APP_CLIENT_ID,
            code: authCode,
            hash: generated_hash
        }
    };
    smartsheet.tokens.getAccessToken(options, (error, result) => {
        if (error) {
            console.error('Access Token Error:', error.message);
            return res.json('Authentication failed');
        }
        console.log('The resulting token: ', result);
        return res
            .status(200)
            .json(result);
    });
});