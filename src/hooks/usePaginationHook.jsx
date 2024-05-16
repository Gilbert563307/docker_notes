import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * #How to use this hook.
 * 1. Import the usePaginationHook to your Table component.
 * 2. Give the hook a methodToCall, this methods will fetch data from the backend after one of the url/searchParams params changes.
 * 3. Why is this methodToCall being called? Thats because this hook als works with the ItemsPerPageFilter.
 * 4. The ItemsPerPageFilter saves data to the url,
 * 5. So this hook listens for when the searchParams/url changes and then calls the method called methodToCall();
 * 6 - This Hook is depended on the CustomSessionMemoryFilter Hook for rerenders
 * @param {Object} props
 * @param {Function} props.methodToCall
 * @returns {void}
 */
export default function usePaginationHook({ methodToCall }) {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   *  Called the method to call when using this hook
   */
  const getPaginatedItems = () => {
    methodToCall();
  };

  /**
   * If the url has any of the search params return a boolean
   * @returns {boolean}
   */
  const areThereSearchParams = () => {
    return searchParams.size > 0;
  };

  // Listen for when the searchParams change.
  useEffect(() => {
    const searchParamSet = areThereSearchParams();
    if (searchParamSet) {
      getPaginatedItems();
    }
  }, [searchParams]);

  return;
}



