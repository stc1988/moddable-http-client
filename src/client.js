import { Request } from "http";
import { buildDictionary, isStringResponse } from "util";

class Client {
  async get(url, config) {
    return this.#requestNoData("GET", url, config);
  }
  async delete(url, config) {
    return this.#requestNoData("DELETE", url, config);
  }
  async head(url, config) {
    return this.#requestNoData("HEAD", url, config);
  }
  async options(url, config) {
    return this.#requestNoData("OPTIONS", url, config);
  }
  async post(url, data, config) {
    return this.#requestWithData("POST", url, data, config);
  }
  async put(url, data, config) {
    return this.#requestWithData("PUT", url, data, config);
  }
  async patch(url, data, config) {
    return this.#requestWithData("PATCH", url, data, config);
  }

  async #requestNoData(method, url, config) {
    const _config = {
      ...config,
      method: method,
      body: false,
    };
    return this.request(url, _config);
  }

  async #requestWithData(method, url, data, config) {
    const _config = {
      ...config,
      method: method,
      body: data,
    };
    return this.request(url, _config);
  }

  request(url, config) {
    const dictionary = buildDictionary(url, config);
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
