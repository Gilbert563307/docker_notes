/**
 * A custom React hook for storing and retrieving values in local storage.
 * @returns {Object} An object containing functions to store and read values from local storage.
 */
export default function useLocalStorageHook() {
  /**
   * Store a value in local storage associated with a specific key.
   * @param {string} key - The key under which to store the value in local storage.
   * @param {any} value - The value to store in local storage. Will be JSON-stringified.
   */
  const storeValue = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to store value for key "${key}"`);
    }
  };

  /**
   * Read a value from local storage associated with a specific key.
   * @param {string} key - The key from which to read the value in local storage.
   * @returns {any | null} The stored value retrieved from local storage, or null if not found or error occurred.
   */
  const readValue = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to read value for key "${key}"`);
      return null;
    }
  };

  return { storeValue, readValue };
}
