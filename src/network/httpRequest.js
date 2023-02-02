import axios from "axios";
import getCookiesAsObject from "../helpers/cookies/getCookiesAsObject";
import { API_URL } from "./Api";

export default function requestApi() {
  let accessToken = null;

  if (document.cookie.length > 0) {
    const { access_token } = getCookiesAsObject();
    accessToken = access_token || null;
  }
  
  const request = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "json",
    socketPath: null,
  });
  request.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("error ==>", error);
    }
  );
  return request;
}
