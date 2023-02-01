import setCookie from "./setCookie";

function setCookiesAsObj(cookiesObject, exdays) {
  for (var cookieName in cookiesObject) {
    var cookieValue = cookiesObject[cookieName];
    setCookie(cookieName, cookieValue, exdays);
  }
}

export default setCookiesAsObj;
