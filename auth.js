const express = require('express'),
    config = require('./config_priv.json'),
    qs = require('querystring'),
    ssclient = require('smartsheet'),
    app = express(),
    fs = require('fs');

// instantiating the Smartsheet client
const smartsheet = ssclient.createClient({
    // a blank token provides access to Smartsheet token endpoints
    accessToken: ''
});

// starting an express server
app.listen(3000, () => {
    console.log('Ports listening on 3000...');
});

// setting up home route containing basic page content
app.get('/', (req, res) => {
    res.send('<h1>Sample oAuth flow for Smartsheet</h1><a href="/auth">Login to Smartsheet</a></br><a href="/refresh">Refresh Token</a>')
});

// route redirecting to authorization page
app.get('/auth', (req, res) => {
    console.log('Your authorization url: ', authorizationUri);
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
    scope: config.ACCESS_SCOPE
});

// callback service parses the authorization code, requests access token, and saves it 
app.get('/callback', (req, res) => {
    console.log(req.query);
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
    smartsheet.tokens.getAccessToken(options, processToken)
        .then((token) => {
            return res
                .status(200)
                .json(token);
        });
});

// Sample for REFERENCE ONLY. A production app should not be structured this way. 
app.get('/refresh', (req, res) => {
    fs.access('token_priv.json', (err) => {
        // redirect to normal oauth flow if no existing token
        if (err && err.code === 'ENOENT') {
            console.log(err);
            res.redirect(authorizationUri);
        }
        console.log('...Refreshing Expired Token...')
        const old_token = require('./token_priv.json');
        // if current date is past expiration date...
        if (Date.now() > old_token.EXPIRES_IN) {
            const generated_hash = require('crypto')
                .createHash('sha256')
                .update(config.APP_SECRET + "|" + old_token.REFRESH_TOKEN)
                .digest('hex');
            const options = {
                queryParameters: {
                    client_id: config.APP_CLIENT_ID,
                    refresh_token: old_token.REFRESH_TOKEN,
                    hash: generated_hash
                }
            };
            smartsheet.tokens.refreshAccessToken(options, processToken)
                .then((token) => {
                    return res
                        .status(200)
                        .json(token);
                });
        } else {
            // token still valid. If attempting to force token refresh, change expires_in in priv_token.json
            console.log('token still valid')
            return res
                .send('<h1>No refresh. Access token still valid</h1>');
        }
    })
})


function processToken(error, token) {
    if (error) {
        console.error('Access Token Error:', error.message);
        return error;
    }
    console.log('The resulting token: ', token);
    // IMPORTANT: token saved to local JSON as EXAMPLE ONLY. 
    // You should save access_token, refresh_token, and expires_in to database for use in application.
    let returned_token = {
        "ACCESS_TOKEN": token.access_token,
        "EXPIRES_IN": (Date.now() + (token.expires_in * 1000)),
        "REFRESH_TOKEN": token.refresh_token
    }
    fs.writeFileSync('token_priv.json', JSON.stringify(returned_token));

    return token;
}
