let aws     = require('aws-sdk');
let request = require('request');

// standard config obj
let config = {
  awsRegion:           'AWS Region Your Pool Is In',
  cognitoAppClientId:  'App Client ID',
  cognitoUserPoolId:   'User Pool ID',
  cognitoUserUsername: 'Actual username of a user in the pool',
  cognitoUserPassword: 'password of the user in the pool',
  apiGatewayUrl:       'leave empty if you dont yet have a working AWS API Gateway URL to use',
}

// structured params for the adminInitiateAuth method
let params = {
  AuthFlow:   'ADMIN_NO_SRP_AUTH',
  ClientId:   config.cognitoAppClientId,
  UserPoolId: config.cognitoUserPoolId,
  AuthParameters: {
    USERNAME: config.cognitoUserUsername,
    PASSWORD: config.cognitoUserPassword
  }
};

let cognitoSP = new aws.CognitoIdentityServiceProvider(
  {region: config.awsRegion}
);

// Get an Id Token (JWT) for the user
cognitoSP.adminInitiateAuth(params, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
    console.log('AUTH SUCCESS');

    if (config.apiGatewayUrl == '') {
      process.exit();
    }

    // use the token to call APIG protected by a Cognito Authorizer
    var options = {
      url:      config.apiGatewayUrl,
      method:   'GET',
      postDate: {mimeType: 'application/json'},
      headers: {
        'Authorization': data.AuthenticationResult.IdToken
      }
    };

    function apigCallback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);
        console.log('API REST SUCCESS');
      }
      else {
        console.log(error);
      }
    }

    request(options, apigCallback);
  }
});
