import AuthButton from '@/app/components/AuthButton'
import BackButton from '@/app/components/backButton'
import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'

// https://tiptap.dev/docs/examples/basics/default-text-editor

const extensions = [TextStyleKit, StarterKit]

function MenuBar({ editor }: { editor: Editor | null }) {

    const [serverError, setServerError] = useState<string | null>(null); // Errors from backend
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [note, setNote] = useState<any>(null);

    if (!editor) return null;
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                isBold: ctx.editor.isActive('bold'),
                canBold: ctx.editor.can().chain().toggleBold().run(),
                isItalic: ctx.editor.isActive('italic'),
                canItalic: ctx.editor.can().chain().toggleItalic().run(),
                isStrike: ctx.editor.isActive('strike'),
                canStrike: ctx.editor.can().chain().toggleStrike().run(),
                isCode: ctx.editor.isActive('code'),
                canCode: ctx.editor.can().chain().toggleCode().run(),
                canClearMarks: ctx.editor.can().chain().unsetAllMarks().run(),
                isParagraph: ctx.editor.isActive('paragraph'),
                isHeading1: ctx.editor.isActive('heading', { level: 1 }),
                isHeading2: ctx.editor.isActive('heading', { level: 2 }),
                isHeading3: ctx.editor.isActive('heading', { level: 3 }),
                isHeading4: ctx.editor.isActive('heading', { level: 4 }),
                isHeading5: ctx.editor.isActive('heading', { level: 5 }),
                isHeading6: ctx.editor.isActive('heading', { level: 6 }),
                isBulletList: ctx.editor.isActive('bulletList'),
                isOrderedList: ctx.editor.isActive('orderedList'),
                isCodeBlock: ctx.editor.isActive('codeBlock'),
                isBlockquote: ctx.editor.isActive('blockquote'),
                canUndo: ctx.editor.can().chain().undo().run(),
                canRedo: ctx.editor.can().chain().redo().run(),
            }
        },
    })

    // Save changes button
    async function handleClickSave() {
        try {
            setServerError(null);
            setSuccessMessage(null);
            const html = editor?.getHTML() || "";
            const res = await fetch("/api/editor", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: note?._id, title: note?.title || "Untitled", content: html })
            });
            const data = await res.json();
            if (data.error) {
                setServerError(data.error);
                return;
            }
            setNote(data);
            setSuccessMessage("Note saved!");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
        } catch (e) {
            console.error(e);
            setServerError("Error saving note");
        }
    }

    // Get note for logged user
    async function loadNote() {
        const res = await fetch("/api/editor");
        const data = await res.json();
        if (data.error) {
            setServerError(data.error);
            return;
        }
        setNote(data);
        editor!.commands.setContent(data.content);
    }

    // Load note only once
    useEffect(() => {
        loadNote();
    }, []);

    // Export the current editor content as an HTML file and trigger a download
    const exportHTML = () => {
        const html = editor.getHTML();
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "note.html";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="control-group">
            <div className="button-group">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editorState.canBold}
                    className={editorState.isBold ? 'is-active' : ''}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editorState.canItalic}
                    className={editorState.isItalic ? 'is-active' : ''}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editorState.canStrike}
                    className={editorState.isStrike ? 'is-active' : ''}
                >
                    Strike
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editorState.canCode}
                    className={editorState.isCode ? 'is-active' : ''}
                >
                    Code
                </button>
                <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>
                <button onClick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editorState.isParagraph ? 'is-active' : ''}
                >
                    Paragraph
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editorState.isHeading1 ? 'is-active' : ''}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editorState.isHeading2 ? 'is-active' : ''}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editorState.isHeading3 ? 'is-active' : ''}
                >
                    H3
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={editorState.isHeading4 ? 'is-active' : ''}
                >
                    H4
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={editorState.isHeading5 ? 'is-active' : ''}
                >
                    H5
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={editorState.isHeading6 ? 'is-active' : ''}
                >
                    H6
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editorState.isBulletList ? 'is-active' : ''}
                >
                    Bullet list
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editorState.isOrderedList ? 'is-active' : ''}
                >
                    Ordered list
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editorState.isCodeBlock ? 'is-active' : ''}
                >
                    Code block
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editorState.isBlockquote ? 'is-active' : ''}
                >
                    Blockquote
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>Horizontal rule</button>
                <button onClick={() => editor.chain().focus().setHardBreak().run()}>Hard break</button>
                <button onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
                    Undo
                </button>
                <button onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
                    Redo
                </button>
            </div>
            <div className='flex gap-3'>
                <button className='bg-green-200 hover:cursor-pointer p-2 mt-2 border border-gray-300 rounded-lg'
                    onClick={handleClickSave}>
                    Save changes to DB
                </button>
                <button
                    className="bg-blue-500 hover:cursor-pointer p-2 mt-2 border text-white  border-gray-300 rounded-lg"
                    onClick={exportHTML}>
                    Export to HTML
                </button>
                {successMessage && (
                    <div className="flex justify-center items-center mt-2">
                        <p className="text-green-600 p-2">{successMessage}</p>
                    </div>
                )}
                {serverError && (
                    <div className="flex justify-center items-center mt-2">
                        <p className="text-red-500 mt-2 p-2">{serverError}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function EditorWrapper() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content: "<p>Loading...</p>"
    });

    if (!mounted || !editor) return null;

    return (
        <div>
            <BackButton />
            <AuthButton />
            <h1 className="text-2xl mb-4 text-center font-bold">Text Editor</h1>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="tiptap" />
        </div>
    );
}