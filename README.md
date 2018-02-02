## PURPOSE
This repo shows an example of how to login with a trusted server side codebase to a Cognito User Pool ([Admin Authentication Flow](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html?icmpid=docs_cognito_console#amazon-cognito-user-pools-admin-authentication-flow)). You can then use the returned JWT Id Token to access API Gateway that is protected by a Cognito Authorizer.

## RUN WITH EXISTING APP CLIENT AND USER
This step will work if you have an existing Cognito User account and working password, if not, you will need to follow the rest of the steps in this Readme.
1. Clone this repo
1. `npm install`
1. Edit the `config` object in `index.js`
1. `npm start`

## SETUP AN APP CLIENT AND USER
### Initialize a User Account
1. Create a Cognito App Client (no client secret, enable ADMIN_NO_SRP_AUTH)
1. Make everything writeable in your Cognito App Client for the time being
1. Make sure your Cognito App Client Settings has "Authorization Code Grant" enabled for OAuth 2.0 (we will later remove that)
1. Make sure your Cognito App Client Settings also has the "profile" OAuth scope enabled and "Cognito User Pool" for Enabled Identity Providers.
1. Create a user in your Cognito user pool
2. Login as that user using the URL format below and set it's password

An alternative is to use the AWS SDK or CLI methods for the Cognito `AdminInitiateAuth` and `AdminRespondToAuthChallenge`.

#### Login URL
When using this you will recieve a password change confirmation email.  Make sure your user has a valid and confirmed email before starting this.

`https://[cognito domain url]/login?response_type=code&client_id=[cognito app client id]&redirect_uri=[cognito app client redirect url]`


### Install, Edit  and run
1. Clone this repo
1. Do an `npm install` (assumes you have NodeJS installed)
1. Using the user you just created, set its username and password in `index.js`
1. Edit the rest of the `config` object in `index.js` to work for your User Pool
1. Save and then `npm start`

### Cleanup
This is important, we really want to lock down the app client that your Cognito service account will be using on the backend.

1. Edit your App Client, remove all Readable Attributes and remove all Scopes
1. Edit your App Client Settings, remove all Allowed OAuth Flows
1. After doing this, go back to your code and `npm start` again, everything should still work
1. Now, open up your App Client as need to more scopes if needed

