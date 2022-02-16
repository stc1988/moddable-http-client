import client from "client";

const http_get_json = "http://httpbin.org/json"
const http_get_html = "http://httpbin.org/html"
const http_get_header = "http://httpbin.org/headers"
const http_get_200 ="http://httpbin.org/status/200"
const http_get_400 ="http://httpbin.org/status/400"
const http_get_image_jpeg = "http://httpbin.org/image/jpeg"
const http_get_image_png = "http://httpbin.org/image/png"


client.get(http_get_json).then((response) => {
  trace(`${JSON.stringify(response.data)}\n`);
})
