import SecureSocket from "securesocket";

function parseURL(url) {
  const match = url.match(
    /^((?<protocol>http[s]?):)?(\/\/((?<username>\w+)?(:(?<password>\w+))?@)?(?<host>[^\/\?:]+)(:(?<port>\d+))?)?(\/?(?<path>[^\/\?#][^\?#]*)?)?(\?([^#]+))?(#(\w*))?/u
  );
  return { ...match.groups };
}

function createDictionary(url, config) {
  const _url = parseURL(url);
  const _config = { ...config };

  let dictionary = {
    host: _url.host,
    path: "/" + _url.path,
    method: _config.method ?? "GET",
    response: _config.response,
    port: _config.port ?? _url.protocol === "http" ? 80 : 443,
    headers: Object.entries(_config.headers).flat(),
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
