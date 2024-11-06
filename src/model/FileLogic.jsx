import React from 'react'
import { ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import { jsPDF } from "jspdf";

export default function FileLogic() {


    /**
    * @param {string} filename - The desired name of the file, without the file extension.
    * @param {string} content - The HTML content to include in the `.docx` document body.
    * @returns {Object} Result object containing:
    *  
    **/
    function downloadFileContent(filename, content) {
        try {
            const doc = new jsPDF();
            doc.text(content, 10, 10); // Add content with basic formatting
        
            const blob = doc.output('blob');
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);   
        
            // Return success status
            return {
                downloaded: true,
                message: "",
                type: ALERT_TYPES.SUCCESS,
            };
        } catch (error) {
            // Log and return error details
            console.log(`[downloadFileContent] #${error.message}`);
            return {
                downloaded: false,
                message: error.message,
                type: ALERT_TYPES.DANGER,
            };
        }
    }

    return { downloadFileContent }
}
