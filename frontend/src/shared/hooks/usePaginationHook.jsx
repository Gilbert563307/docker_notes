import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PAGE_CHANGED_EVENT } from "../features/simplePagination/presentation/components/SimplePagination";

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
  /**
   *
   * @param {CustomEvent} event
   */
  function handleEvent(event) {
    const pageNumber = event.detail?.page;
    if (!pageNumber) return;
    methodToCall();
  }

  // Listen for when the searchParams change.
  document.addEventListener(PAGE_CHANGED_EVENT, handleEvent);
  return;
}
