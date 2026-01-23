import React from "react";
import BS5Preloader from "../presentation/components/bs5/BS5Preloader";

/**
 * Custom hook for managing Bootstrap 5 preloader state.
 * @deprecated
 * @returns {Object} An object containing functions to show and close the preloader, along with the preloader component.
 * @property {Function} showLoader - Function to show the preloader.
 * @property {Function} closeLoader - Function to close the preloader.
 * @property {JSX.Element} PreloaderComponent - JSX element representing the preloader component.
 */
const useBS5PreloaderHook = () => {
  const [loader, setLoader] = React.useState(false);

  /**
   * Function to show the preloader.
   * @returns {void}
   */
  const showLoader = () => {
    setLoader(true);
  };

  /**
   * Function to close the preloader.
   * @returns {void}
   */
  const closeLoader = () => {
    setLoader(false);
  };

  /**
   * JSX element representing the preloader component.
   * @returns {JSX.Element}
   */
  const PreloaderComponent = loader === true && <BS5Preloader />;

  return { showLoader, closeLoader, PreloaderComponent };
};

export default useBS5PreloaderHook;
