/**
 * Sends an async ajax request and passes response
 * to the @param {function} callback.
 */
var ajax = (function() {
  var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
  return function(obj, callback) {
    var xhr = new XHR(),
        paramArr = [],
        prop,
        body;

    for (prop in obj) paramArr.push(encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]));
    body = paramArr.join("&");

    xhr.open("POST", "/", true);

    if (xhr.setRequestHeader) xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    if (xhr instanceof XMLHttpRequest)
      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          callback(new Error("Error! Please try again later."));
          return;
        }
        callback(null, xhr.responseText);
      };
    else if (xhr instanceof XDomainRequest) {
      xhr.onerror = function() {
        callback(new Error("Error! Please try again later."));
        return;
      };
      xhr.onload = function() {
        callback(null, xhr.responseText);
      };
    }
    xhr.send(body);
  };
})();

/**
 * Checks if the input string looks like a URL
 */
function checkUrl(s) {
  try {
    decodeURIComponent(s);
  } catch (e) {
    return false;
  }
  if (s.match(/^[a-z]+[\w\.]*:[\/]+.+$/i)) return true;
  return false;
}

/**
 * Toggles class value of @param elem. Removes
 * the class if exists and add it otherwise.
 */
function toggleClass(elem, classTitle) {
  var classList = elem.className.split(/\s+/),
      firstIndex = classList.indexOf(classTitle);

  if (!~firstIndex) {
    classList.push(classTitle);
  } else {
    classList = classList.filter(function(e) { return e != classTitle; });
  }
  elem.className = classList.join(" ");
}
