import React from 'react';
import { useMainControllerContext } from '../presentation/controller/MainController';

/**
 * Custom hook to set the page title using the MainController context.
 * 
 * @param {Object} param - The parameter object.
 * @param {string} param.title - The title to set for the page.
 * @returns {null} Returns null as it doesn't render anything.
 */
export default function useSetPageTitleHook({ title }) {
    const { setTitle } = useMainControllerContext();

    React.useEffect(() => {
        setTitle(title);
    }, [title, setTitle]);

    return null;
}
