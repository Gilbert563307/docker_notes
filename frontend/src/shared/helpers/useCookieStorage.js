/* eslint-disable no-undef */
export class UseCookieStorage {
  /**
   * @async
   * @param {Object} data
   * @param {string} data.name  A string with the name of the cookie.
   * @param {string} data.value A string with the value of the cookie.
   * @param {number} data.expires  A timestamp, given as Unix time in milliseconds, containing the expiration date of the cookie. Defaults to null.
   * @param {boolean} data.partitioned  A boolean value that defaults to false. If set to true, the set cookie will be a partitioned cookie
   * @param {string} data.domain A string containing the domain of the cookie. Defaults to null.
   * @param {string} data.path A string containing the path of the cookie. Defaults to /.
   * @param {"lax" | "strict" | "none"} data.sameSite One of the following SameSite values: "strict", "lax", or "none".
   */
  static async createCookie({ name, value, expires, partitioned, domain, path, sameSite }) {
    await cookieStore.set({
      name: name,
      value: value,
      expires: expires,
      partitioned: partitioned,
      domain: domain,
      path: path,
      sameSite: sameSite,
    });
  }

  /**
   * @async
   * @param {string} cookieName
   * @returns {Promise<CookieListItem | null>}
   */
  static async readCookie(cookieName) {
    if (!cookieName) {
      throw Error("Cookie name cannot be empty or null");
    }
    return await cookieStore.get(cookieName);
  }

  /**
   * @async
   * @param {string} cookieName
   * @returns {Promise<string | null | undefined>}
   */
  static async readCookieValue(cookieName) {
    if (!cookieName) {
      throw Error("Cookie name cannot be empty or null");
    }
    const cookie = await cookieStore.get(cookieName);
    if (cookie) {
      return cookie.value;
    }
    return null;
  }

  /**
   * Uses the old document cookie API
   * @returns {Array<string>}
   */
  static getCookiesByDocument() {
    const cookies = document.cookie;
    if (!cookies) {
      return [];
    }
    return cookies.split(";");
  }

  /**
   * Uses the old document cookie API
   * @param {string} cookieName 
   * @returns {string | null}
   */
  static readCookieByDocument(cookieName) {
    const cookies = UseCookieStorage.getCookiesByDocument();
    //if there no cookies set
    if (!cookies) {
      return null;
    }

    //loop through all cookies
    for (let index = 0; index < cookies.length; index++) {
      //create a cookie
      const cookie = cookies[index];
      //check if the given cookie name is found i the entire cookie
      const cookieFound = cookie.split(`${cookieName}=`);

      //return the cookie if found
      // lint-disable-next-line
      if (cookieFound.length === 2) {
        return cookieFound[1];
      }
    }
    return null;
  }

  /**
   *
   * @param {string} cookieName
   * @returns {Promise<void>}
   */
  static async deleteCookie(cookieName) {
    if (!cookieName) {
      throw Error("Cookie name cannot be empty or null");
    }
    return await cookieStore.delete(cookieName);
  }

  /**
   *
   * @returns {Promise<CookieList>}
   */
  static async getAllCookies() {
    return await cookieStore.getAll();
  }

  //docs https://developer.mozilla.org/en-US/docs/Web/API/CookieStore/set
  static CookieBuilder = class {
    #name;
    #value;
    #expires;
    #partitioned = true;
    #domain = null;
    #path = "/";
    #sameSite = "lax";

    /**
     *
     * @param {string} name  A string with the name of the cookie.
     */
    name(name) {
      this.#name = name;
      return this;
    }

    /**
     * A string with the value of the cookie.
     * @param {string} value
     */
    value(value) {
      this.#value = value;
      return this;
    }

    /**
     * A timestamp, given as Unix time in milliseconds, containing the expiration date of the cookie. Defaults to null.
     * @param {number} expires
     */
    expires(expires) {
      this.#expires = expires;
      return this;
    }

    /**
     * A boolean value that defaults to false. If set to true, the set cookie will be a partitioned cookie
     * @param {boolean} partitioned
     */
    partitioned(partitioned) {
      this.#partitioned = partitioned;
      return this;
    }

    /**
     * A string containing the domain of the cookie. Defaults to null.
     * @param {string} domain
     */
    domain(domain) {
      this.#domain = domain;
      return this;
    }

    /**
     * A string containing the path of the cookie. Defaults to /.
     * @param {string} path
     */
    path(path) {
      this.#path = path;
      return this;
    }

    /**
     *
     * @param {"lax" | "strict" | "none"} sameSite
     */
    sameSite(sameSite) {
      this.#sameSite = sameSite;
      return this;
    }

    /**
     *
     * @returns {{name: string, value: string, expires: number, partitioned: boolean, domain: string, path: string, sameSite: "lax" | "strict" | "none"}}
     */
    build() {
      if (!this.#name) {
        throw new Error("Cookie name cannot be empty");
      }

      if (!this.#value) {
        throw new Error("Cookie value cannot be empty");
      }

      const validSameSites = ["strict", "lax", "none"];
      if (!validSameSites.includes(this.#sameSite)) {
        throw new Error("Same site in invalid must be of type strict | lax | none");
      }

      return {
        name: this.#name,
        value: this.#value,
        expires: this.#expires,
        partitioned: this.#partitioned,
        domain: this.#domain,
        path: this.#path,
        sameSite: this.#sameSite,
      };
    }
  };
}
