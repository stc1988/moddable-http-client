import SecureSocket from "securesocket";

function parseURL(url) {
  const match = url.match(
    /^((?<protocol>http[s]?):)?(\/\/((?<username>\w+)?(:(?<password>\w+))?@)?(?<host>[^\/\?:]+)(:(?<port>\d+))?)?(\/?(?<path>[^\/\?#][^\?#]*)?)?(\?(?<params>[^#]+))?(#(\w*))?/u
  );
  return { ...match.groups };
}

function buildPath(url, config) {
  let path = "/";
  if (url.path) {
    path += url.path;
  }
  if (url.params) {
    path += "?" + url.params;
  } else if (config.params) {
    path +=
      "?" +
      Object.entries(config.params)
        .map((e) => `${e[0]}=${e[1]}`)
        .join("&");
  }
  return path;
}

function buildDictionary(url, config) {
  const _url = parseURL(url);
  const _config = { ...config };

  let dictionary = {
    host: _url.host,
    path: buildPath(_url, _config),
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

export { buildDictionary, isStringResponse };
