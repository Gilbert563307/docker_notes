export class UseCookieStorage {
  /**
   * Create a cookie
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} [expiresInHours] - Number of hours until the cookie expires (optional)
   * @param {string} [path] - Path for the cookie (optional)
   * @param {string} [domain] - Domain for the cookie (optional)
   * Example usage:
   * Create a cookie that expires in 1 hour, with a specific path and domain
   * createCookie('yourCookieName', 'yourCookieValue', 3600000, '/yourpath', 'yourdomain.com');
   */

  static createCookie(name, value, expiresInHours, path, domain) {
    let cookieString = `${name}=${value}`;

    if (expiresInHours) {
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + expiresInHours);
      cookieString += `; expires=${expirationDate.toUTCString()}`;
    }

    if (path) {
      cookieString += `; path=${path}`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  }

  /**
   *
   * @returns {Array}
   */
  static getCookies() {
    const cookies = document.cookie;
    if (!cookies) {
      return [];
    }
    return cookies.split(";");
  }

  /**
   *
   * @param {string} cookieName
   * @returns {string | null}
   */
  static readCookie(cookieName) {
    const cookies = UseCookieStorage.getCookies();
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
   * @returns {void};
   */
  static deleteCookie(cookieName) {
    const pastDate = new Date(0);
    document.cookie = `${cookieName}=; expires=${pastDate.toUTCString()}; path=/;`;
  }
}
