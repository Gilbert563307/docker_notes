import React, { useCallback, useEffect, useState, } from 'react'
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import "../../../assets/css/components/texteditor/QuilTextEditor.css";

// Register 'Poppins' font with Quill
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'Poppins'];
Quill.register(Font, true);


const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: ['sans-serif', 'serif', 'monospace', 'Poppins'] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],
    [{ 'size': [] }],
    [{ align: [] }],
    ["image", "blockquote", "code-block", 'link', 'video'],
    ["clean"],
];

/**
 * Rich text editor component using Quill, with custom font options, dynamic content updates, and a read-only option.
 *
 * @param {Object} props - The component props.
 * @param {string} props.content - Initial HTML content to load into the editor.
 * @param {Function} [props.saveText] - Callback function to save or handle editor content on change.
 * @param {boolean} [props.readOnly=false] - Whether the editor should be read-only.
 * @returns {JSX.Element} The Quill text editor component.
 */
export default function QuilTextEditor({ content = "", saveText = () => { }, readOnly = false }) {
    const [quill, setQuill] = useState(null);

    //detect changes of quil
    useEffect(() => {
        if (quill === null) return;
        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            saveText(quill.root.innerHTML);
        }

        quill.on('text-change', handler);
        return () => {
            quill.off('text-change', handler)
        }
    }, [quill]);


    /**
    * Effect to update the Quill editor content whenever the `content` prop changes.
    * Useful for loading new content into the editor.
    */
    useEffect(() => {
        if (quill && content !== quill.root.innerHTML) {
            quill.root.innerHTML = content;
        }
    }, [content, quill]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement('div');

        wrapper.append(editor);
        const quillEditor = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS },
            readOnly: readOnly,
        });
        quillEditor.root.innerHTML = content;
        setQuill(quillEditor);
    }, []);


    return (
        <article className='quil-text-editor'>
            <div className='conatiner' ref={wrapperRef}></div>
        </article >
    )
}
