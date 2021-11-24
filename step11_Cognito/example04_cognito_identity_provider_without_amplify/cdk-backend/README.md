# CDK Backend (userPool)

## Steps to code

1. Create a new directory by using `mkdir cdk-backend`
2. Naviagte to the newly created directory using `cd cdk-backend`
3. Create a cdk app using `cdk init app --language typescript`
4. Use `npm run watch` to auto build our app as we code
5. Install AWS cognito using `npm i @aws-cdk/aws-cognito`
6. Update "lib/cdk-backend-stack.ts" to import cognito in the app

   ```js
   import * as cognito from "@aws-cdk/aws-cognito";
   ```

7. Update "lib/cdk-backend-stack.ts" to define userPool

   ```js
   const userPool = new cognito.UserPool(this, "bc2020c59-step11-04", {
     userPoolName: "bc2020c59-step11-04",
     selfSignUpEnabled: true,
     userVerification: {
       emailSubject: "Verify your email for our awesome app!",
       emailBody:
         "Hello, Thanks for signing up to our awesome app! Your verification code is {####}",
       emailStyle: cognito.VerificationEmailStyle.CODE,
     },
     signInAliases: {
       username: true,
       email: true,
     },
     autoVerify: { email: true },
     signInCaseSensitive: false,
     standardAttributes: {
       fullname: {
         required: true,
         mutable: true,
       },
       email: {
         required: true,
         mutable: false,
       },
     },
     accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
   });
   ```

8. Update "lib/cdk-backend-stack.ts" to define client

   ```js
   const client = new cognito.UserPoolClient(this, "app-client", {
     userPool: userPool,
     generateSecret: true,
     oAuth: {
       flows: {
         authorizationCodeGrant: true,
       },
       scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
       callbackUrls: [`http://localhost:8000/dashboard`],
       logoutUrls: [`http://localhost:8000`],
     },
   });
   ```

9. Update "lib/cdk-backend-stack.ts" to define domain

   ```js
   const domain = userPool.addDomain("CognitoDomain", {
     cognitoDomain: {
       domainPrefix: "bc2020c58-step11-04",
     },
   });
   ```

10. Deploy the app using `cdk deploy`
11. Destroy the app using `cdk destroy`
