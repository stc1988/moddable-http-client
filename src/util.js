import SecureSocket from "securesocket";

function parseURL(url) {
  const match = url.match(
    /^((?<protocol>http[s]?):)?(\/\/((?<username>\w+)?(:(?<password>\w+))?@)?(?<host>[^\/\?:]+)(:(?<port>\d+))?)?(\/?(?<path>[^\/\?#][^\?#]*)?)?(\?(?<params>[^#]+))?(#(\w*))?/u
  );
  return { ...match.groups };
}

function createDictionary(url, config) {
  const _url = parseURL(url);
  const _config = { ...config };

  let path = "/";
  if (_url.path) {
    path += _url.path;
  }
  if (_url.params) {
    path += "?" + _url.params;
  } else if (_config.params) {
    path +=
      "?" +
      Object.entries(_config.params)
        .map((e) => `${e[0]}=${e[1]}`)
        .join("&");
  }

  let dictionary = {
    host: _url.host,
    path: path,
    method: _config.method ?? "GET",
    response: _config.response,
    port: _config.port ?? _url.protocol === "http" ? 80 : 443,
    headers: _config.headers != undefined ? Object.entries(_config.headers).flat() : [],
    body: _config.body === false ? false : JSON.stringify(_config.body),
  };

  if (_url.protocol === "https") {
    dictionary.Socket = SecureSocket;
    dictionary.secure = { protocolVersion: 0x303 };
  }

  return dictionary;
}

const stringContentTypes = Object.freeze(["application/json", "text/html", "text/xml"]);
function isStringResponse(contentTyoe) {
  return stringContentTypes.includes(contentTyoe);
}

export { createDictionary, isStringResponse };
