
# Sample OAuth Flow for Node

Smartsheet uses [OAuth 2.0](https://oauth.net/2/) to authenticate and authorize users. If your app needs to interact with Smartsheet, then you'll need to create an OAuth Flow to [request an Access Token](https://smartsheet-platform.github.io/api-docs/#request-an-access-token). More detailed instructions for working with the API are available on [Smartsheet's official API documentation](https://smartsheet-platform.github.io/api-docs/#oauth-flow).

This sample demonstrates a lightweight implementation of the Smartsheet OAuth Flow using an express server. To configure this sample to work for with your own app there are three important changes to pay attention to:
- Register your application with Smartsheet and fill out all the fields. 
- Changing the `config.json` file to include the client id and client secret of your app.
- Double check the **Redirect URL** in app settings. Smartsheet will **only** send the authorization code to that URL. 

#### Step 1: Register a Developer Account
 - [Register a developer account](https://developers.smartsheet.com/register) with Smartsheet. This gives your Smartsheet account access to 'Developer Tools'.

#### Step 2: Register Your App with Smartsheet 

 1. On the top right corner of Smartsheet, select **Account** then **Developer Tools**. 
 2. Click **Create New App** and fill out the following information:
	- Name: the name users see to identify your app
	- Description: a brief description meant for the user
	- URL: the URL to launch your app, or landing page if not a web app
	- Contact: support information for the user
	- Redirect URL: sometimes called the callback URL. The URL within your app that will receive the OAuth 2.0 credentials.
 3. Click **Save** to create the app. Smartsheet will assign a ***client Id*** and a ***client secret***. You'll need both to create your OAuth Flow.
#### Step 3: Create the OAuth Flow
  
 1. Open the `config.json` file and replace the placeholder values with the ***client Id*** and ***client secret*** from your app. 
 ![enter image description here](https://lh3.googleusercontent.com/-lFnKZB8gymg/Wjmo6RiJbXI/AAAAAAAAAJQ/jYdXJElXnnUXckmeCI3CotdVQoRiBEEZwCLcBGAs/s0/Screen+Shot+2017-12-19+at+4.02.21+PM.png "config.json")
 2. Run `npm install` to download the modules
 3. Start the app with `node auth.js`
 4. Go to *localhost:3000* in your browser. Click through the OAuth Flow to make sure everything works.
	 - Click **Login to Smartsheet**. You should be redirected to this window:
	 ![enter image description here](https://lh3.googleusercontent.com/-A5IFP3Esa94/Wjmw5x5_MZI/AAAAAAAAAJs/vTXXwHhX3lIC3Ztu1zqKpTVmOyYWylzlgCLcBGAs/s0/Screen+Shot+2017-12-19+at+4.34.35+PM.png "SmartsheetAuthPermission")
	 - Click **Allow**. You should be sent to your redirect URL with your shiny new access token displayed on the page.
	 ![enter image description here](https://lh3.googleusercontent.com/Fi8d-Bd62BHhsOiBKdIvbAY2lzSFgDU7fIPOvv5FarUb_gzTo2lK21-y5HhSKYNxe3NI5e-11y76=s0 "ReturnedToken")
 5. Rejoice!

Congratulations! You now have a working OAuth Flow that successfully (read: hopefully) requests and retrieves an access token from Smartsheet. This access token can be used in your app to interact directly with the Smartsheet API. 

**Reminder**: as you make changes to the app be sure to update your *redirect url* in your app settings on Smartsheet.
	
