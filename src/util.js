import SecureSocket from "securesocket";

function parseURL(url) {
  const split = url.split("://");
  let protocol = "https";
  let host, path, _url;

  if (split.length > 1) {
    protocol = split[0];
    _url = split[1];
  } else {
    _url = url;
  }

  let index = _url.indexOf("/");
  host = index === -1 ? _url : _url.substring(0, index);
  path = index === -1 ? "/" : _url.substring(index);

  return { protocol, host, path };
}

function createDictionary(url, config) {
  const _url = parseURL(url);
  const _config = { ...config };

  let dictionary = {
    host: _url.host,
    path: _url.path,
    method: _config.method ?? "GET",
    response: _config.response,
    port: _config.port ?? _url.protocol === "http" ? 80 : 443,
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
