# Gatsby App

## Steps to code

1. Create a new directory by using `mkdir frontend`
2. Naviagte to the newly created directory using `cd frontend`
3. use `npm init` to initilize an yarn project in the directory which creates a package.json file with the following content
   ```json
   {
     "name": "frontend",
     "version": "1.0.0",
     "main": "index.js",
     "author": "Hassan Ali Khan",
     "license": "MIT",
     "private": true
   }
   ```
4. Install gatsby, react and react dom using `yarn add gatsby react react-dom`. This will update packge.json and create node_modules.json along with yarn.lock
5. update package.json to add scripts

   ```json
   "scripts": {
    "develop": "gatsby develop",
    "build": "gatsby build",
    "clean": "gatsby clean"
   }
   ```

6. create gatsby-config.js

   ```js
   module.exports = {
     plugins: [],
   };
   ```

7. create "src/pages/index.tsx"

   ```js
   import React from "react";
   export default function Home() {
     return <div>Home Page</div>;
   }
   ```

8. create "src/pages/404.tsx"

   ```js
   import React from "react";
   export default function Error() {
     return <div>Error Page</div>;
   }
   ```

9. create "static/favicon.ico"

10. create ".gitignore"

    ```
    node_modules/
    .cache
    public/
    ```

11. To run the site use `gatsby develop`
12. Create "src/config.ts" to define congig parameters

    ```js
    const config = {
      domainUrl: "ENTER YOUR DOMAIN",
      clientId: "ENTER YOUR CLIENT ID",
      loginRedirectUri: "http://localhost:8000/dashboard",
      grant_type: "authorization_code",
      logoutUri: "http://localhost:8000",
      clientSecret: "ENTER YOUR CLIENT SECRET",
    };

    export default config;
    ```

13. Update "src.pages/index.tsx" to create login button

    ```js
    import React from "react";
    import config from "../config";

    export default function Home() {
      return (
        <div>
          <h1>Home</h1>
          <button
            onClick={() => {
              window.location.href = `${config.domainUrl}/login?client_id=${config.clientId}&response_type=code&scope=email+openid&redirect_uri=${config.loginRedirectUri}`;
            }}
          >
            Login
          </button>
        </div>
      );
    }
    ```

14. Create "src/pages/dashboard.tsx" to define redirect pageon login and get the search code and display in console

    ```js
    import React from "react";

    export default function dashboard({ location }) {
      const queryParam = location.search;

      const code = queryParam.substring(6);
      console.log("Location = ", location);
      console.log("Query Param = ", queryParam);
      console.log("Code = ", code);
      return (
        <div>
          <h1>You are logged in</h1>
        </div>
      );
    }
    ```

15. Update "src/pages/dashboard.tsx" to define a function to access tokens

    ```js
    function fetchTokens() {
      const authData = btoa(`${config.clientId}:${config.clientSecret}`);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authData}`,
        },
      };
      fetch(
        `${config.domainUrl}/oauth2/token?grant_type=${config.grant_type}&client_id=${config.clientId}&code=${code}&redirect_uri=${config.loginRedirectUri}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("*** Token Data =", data);
          sessionStorage.setItem("access_token", data.access_token);
          console.log("*** access_token = ", data.access_token);
          fetchUserDetails(data.access_token);
        });
    }
    ```

16. Update "src/pages/dashboard.tsx" to define a function to access user data

    ```js
    const [user, setUser] = useState < any > "noUser";
    function fetchUserDetails(accessToken: string) {
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      fetch(`${config.domainUrl}/oauth2/userInfo`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("User Data = ", data);

          if (!!data.username) {
            setUser(data);
          } else {
            setUser(null);
          }
        });
    }
    ```

17. Update "src/pages/dashboard.tsx" to run above functions on page load

    ```js
    useEffect(() => {
      const stored_token = sessionStorage.getItem("access_token");
      if (!!stored_token) {
        fetchUserDetails(stored_token);
        console.log("*** Stored Token = ", stored_token);
      } else {
        fetchTokens();
      }
    }, []);
    ```

18. Update "src/pages/dashboard.tsx" to define logout function

    ```jsconst logout = () => {
        window.location.href = `${config.domainUrl}/logout?client_id=${config.clientId}&logout_uri=${config.logoutUri}`;

        sessionStorage.removeItem("access_token");
      };
    ```

19. Update "src/pages/dashboard.tsx" to update page

    ```js
    <div>
      {user === "noUser" ? (
        <h2>Loading</h2>
      ) : !user ? (
        <h2>Error</h2>
      ) : (
        <div>
          <h2>You are logged in as: {user.username}</h2>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </div>
    ```

20. Run app using `gatsby develop`

## Reading Material

- [UserPool](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cognito.UserPool.html)
- [OAuth 2.0 authorization framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [Cognito user pool's implementation](https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/)
- [Setting up the hosted UI with the Amazon Cognito console](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-integration.html#cognito-user-pools-create-an-app-integration)
- [Amazon Cognito user pools Auth API reference](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html)
- [TOKEN endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html)
- [USERINFO endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html)
