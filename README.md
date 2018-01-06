
# Sample OAuth Flow for Node
Accessing Smartsheet through the API requires an access token to be included in the Authorization header of each request. For standalone applications that can run with your personal credentials, you can [generate an access token](https://smartsheet-platform.github.io/api-docs/#authentication-and-access-tokens) in the Smartsheet UI. However, if your application needs to let users login with their own account, then you must implement the full [Oauth flow](https://smartsheet-platform.github.io/api-docs/#oauth-flow).

This sample demonstrates a lightweight implementation of the Smartsheet OAuth flow using an express server. To configure this sample to work for with your own app there are three important changes to pay attention to:
- Register your application with Smartsheet and fill out all the fields. 
- Changing the `config.json` file to include the client id and client secret of your app.
- Double check the **Redirect URL** in app settings. Smartsheet will **only** send the authorization code to that URL. This example uses localhost:3000/callback but your app will have its' own **Redirect URL**. 

#### Step 1: Register a Developer Account
 - [Register a developer account](https://developers.smartsheet.com/register) with Smartsheet. This gives your Smartsheet account access to 'Developer Tools'.

#### Step 2: Register Your App with Smartsheet 

 1. On the top right corner of Smartsheet, select **Account** then **Developer Tools**. 
 2. Click **Create New App** and fill out the following information:
	- Name: the name users see to identify your app
	- Description: a brief description meant for the user
	- URL: the URL to launch your app, or landing page if not a web app
	- Contact: support information for the user
	- Redirect URL*: sometimes called the callback URL. The URL within your app that will receive the OAuth 2.0 credentials.
 3. Click **Save** to create the app. Smartsheet will assign a ***client Id*** and a ***client secret***. You'll need both to create your OAuth flow.

*The redirect URL will contain sensitive information and **must** be an address that the developer has control over. In this sample we are using localhost:300/callback, but your application will have its' own redirect URL. 
#### Step 3: Create the OAuth Flow
  
 1. Open the `config.json` file and replace the placeholder values with the ***client Id*** and ***client secret*** from your app. You also need to specify the desired [**access scopes**](https://smartsheet-platform.github.io/api-docs/#access-scopes).
![enter image description here](https://lh3.googleusercontent.com/k19W1c6jhXYRkPn4iL_JblATAquspKxeYj4oga2XzP9XNoBRX80CVyM3k2e3GCgTiT5y8qeXemyC=s0 "configJSON.png")
 2. Run `npm install` to download the modules
 3. Start the app with `node auth.js`
 4. Go to *localhost:3000* in your browser. Click through the OAuth flow to make sure everything works.
	 - Click **Login to Smartsheet**. You should be redirected to this window:
	 ![enter image description here](https://lh3.googleusercontent.com/-A5IFP3Esa94/Wjmw5x5_MZI/AAAAAAAAAJs/vTXXwHhX3lIC3Ztu1zqKpTVmOyYWylzlgCLcBGAs/s0/Screen+Shot+2017-12-19+at+4.34.35+PM.png "SmartsheetAuthPermission")
	 - Click **Allow**. You should be sent to your redirect URL with your shiny new access token displayed on the page.
	 ![enter image description here](https://lh3.googleusercontent.com/Fi8d-Bd62BHhsOiBKdIvbAY2lzSFgDU7fIPOvv5FarUb_gzTo2lK21-y5HhSKYNxe3NI5e-11y76=s0 "ReturnedToken")

Congratulations! You now have a working OAuth flow that successfully (read: hopefully) requests and retrieves an access token from Smartsheet. This access token can be used in your app to interact directly with the Smartsheet API. 

#### Refreshing the Access Token
You'll need to periodically refresh the Access Token as it expires 7 days after being issued. However, rather than going through the full OAuth Flow again, a better option is to use the Refresh Token. Once you've gone through an OAuth Flow a file is saved named `token_priv.json`. You can force an *expired* Access Token by manually changing the token expiration date in this file. Specifically, you need to change EXPIRES_IN to a date time that is earlier than the *current* date time.

**Important**: This sample app runs on localhost, but implementing OAuth on a production application will have some major differences. The key things to pay attention to:
- The tokens **must** be handled in a more secure way. They should be stored in a database. The use of a JSON file is **only** for this sample.
- The *Redirect URL* must be set to a secure URL on the production server that the developer has control over so the authorization code is safe and can be easily captured.
- Make sure the App Description is polished on Smartsheet. Any customers going following the OAuth Flow will see the app description.
