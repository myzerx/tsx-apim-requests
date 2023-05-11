import axios, { AxiosError } from "axios";

async function handler() {
  try {
    const { data: accessTokenData } = await axios.post(
      "url-gentoken",
      {
        client_id: "...",
        client_secret: "...",
        grant_type: "client_credentials",
      },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("Get AccessToken", accessTokenData.access_token);

    const { headers, data: csrfData } = await axios.get(
      "url-bspartner",
      {
        headers: {
          Authorization: `Bearer ${accessTokenData.access_token}`,
          APIKey: "...",
          "X-Csrf-Token": "fetch",
        },
        validateStatus: (status) =>
          (status >= 200 && status < 400) || status === 501,
      }
    );

    console.log("Get CSRFToken", headers["x-csrf-token"]);
    console.log(headers["set-cookie"]);

    const requestBody = {
      //insert your payload here, "ConfigId" ....
    };

    const { data } = await axios.post(
      "url-bspartner",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessTokenData.access_token}`,
          "X-Csrf-Token": headers["x-csrf-token"],
          APIKey: "...",
          Connection: "keep-alive",
          Accept: "application/xml",
          Cookie: headers['set-cookie'], 
          
        },
        validateStatus: (status) =>
          (status >= 200 && status <= 400) || status === 501,
      }
    );

    console.log(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("error: ", error.response?.status);
      console.log("error: ", error.response?.data);
    }
  }
}

handler();
