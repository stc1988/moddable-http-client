import { Request } from "http";
import { createDictionary, isStringResponse } from "util";

class Client {
  async get(url, config) {
    const _config = {
      ...config,
      method: "GET",
      body: false,
    };
    return this.request(url, _config);
  }
  async delete(url, config) {
    const _config = {
      ...config,
      method: "DELETE",
      body: false,
    };
    return this.request(url, _config);
  }

  request(url, config) {
    const dictionary = createDictionary(url, config);

    return new Promise((resolve, reject) => {
      let request = new Request(dictionary);
      let response = {
        status: 0,
        headers: {},
        data: undefined,
        dictionary,
      };

      request.callback = (message, val1, val2) => {
        trace(`${message}: ${val1}: ${val2}\n`);
        if (Request.status === message) {
          response.status = Number(val1);
        } else if (Request.header === message) {
          response.headers[val1] = val2;
          if (!request.response && val1 === "content-type" && isStringResponse(val2)) request.response = String;
        } else if (Request.responseComplete === message) {
          response.data = response.headers["content-type"] === "application/json" ? JSON.parse(val1) : val1;

          const status = response.status.toString();
          if (status.startsWith("2")) {
            resolve(response);
          } else {
            reject(response);
          }
        }
      };
    });
  }
}

export default new Client();
