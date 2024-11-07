import React, { useCallback, } from 'react'
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import "../../../assets/css/components/texteditor/QuilTextEditor.css";


const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

export default function QuilTextEditor({ content }) {
    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement('div');

        wrapper.append(editor);
        const quill = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS },
        });
        quill.root.innerHTML = content;

    }, [])
    return (
        <div className='conatiner' ref={wrapperRef}></div>
    )
}
