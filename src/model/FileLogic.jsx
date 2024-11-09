import React from 'react'
import { ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import { asBlob } from 'html-docx-js-typescript'

export default function FileLogic() {

    function generateRandomFileName() {
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 7);
        return `${timestamp}-${randomPart}`;
    }

    async function convertHtmlToDocx(html) {
        try {
            asBlob(html).then((data) => {
                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
                const url = URL.createObjectURL(blob);

                const filename = generateRandomFileName();

                // Create a temporary link to download the DOCX file
                const link = document.createElement("a");
                link.href = url;
                link.download = `${filename}.docx`;
                document.body.appendChild(link);

                // Trigger the download and clean up
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

            });
        } catch (error) {
            console.log(`[convertHtmlToDocx] #${error.message}`);
            return {
                downloaded: false,
                message: error.message,
                type: ALERT_TYPES.DANGER,
            };
        }
    }

    return {  convertHtmlToDocx }
}