import React from 'react';
import '@mdxeditor/editor/style.css';

import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    BlockTypeSelect,
    CodeToggle,
    ListsToggle,
    markdownShortcutPlugin,
    InsertTable,
    tablePlugin,
} from '@mdxeditor/editor';

export default function TaskMDXEditor({ id, description, setDescription, dispatch }) {
   

    return (
        <div id={id}>
            <MDXEditor
                className="mdx_editor_create"
                markdown={description}
                onChange={(value) => setDescription(value)}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    tablePlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <UndoRedo />
                                <BlockTypeSelect />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <ListsToggle />
                                <InsertTable/>
                            </>
                        ),
                    }),
                ]}
            />
        </div>
    );
}
