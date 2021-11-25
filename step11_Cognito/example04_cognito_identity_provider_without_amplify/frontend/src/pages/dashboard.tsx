import React, { useEffect, useState } from "react";
import config from "../config";

export default function dashboard({ location }) {
  const queryParam = location.search;

  const code = queryParam.substring(6);
  console.log("*** Location = ", location);
  console.log("*** Query Param = ", queryParam);
  console.log("*** Code = ", code);

  const [user, setUser] = useState<any>("noUser");

  useEffect(() => {
    const stored_token = sessionStorage.getItem("access_token");
    if (!!stored_token) {
      fetchUserDetails(stored_token);
      console.log("*** Stored Token = ", stored_token);
    } else {
      fetchTokens();
    }
  }, []);

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

  const logout = () => {
    window.location.href = `${config.domainUrl}/logout?client_id=${config.clientId}&logout_uri=${config.logoutUri}`;

    sessionStorage.removeItem("access_token");
  };
  return (
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
  );
}
