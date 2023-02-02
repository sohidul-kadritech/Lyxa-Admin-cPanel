function getCookiesAsObject() {
  var cookieArray = document.cookie.split(";");
  var cookies = {};

  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    var cookieParts = cookie.split("=");
    var cookieName = cookieParts[0].trim();
    var cookieValue = cookieParts[1].trim();
    cookies[cookieName] = cookieValue;
  }

  return cookies;
}

export default getCookiesAsObject;