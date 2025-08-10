// EditorTipTap.jsx

// EditorTipTap.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

const MenuBar = ({ editor, toggleHtmlView, showHtml }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL del enlace');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="menu-bar mb-2">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        <b>Negrita</b>
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        <i>Cursiva</i>
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        Lista
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        Viñeta
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        Título 1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        Título 2
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <u>Subrayado</u>
      </button>

      <button onClick={() => editor.chain().focus().setColor('#f00').run()}>Rojo</button>
      <button onClick={() => editor.chain().focus().setColor('#4179bd').run()}>Azul</button>
      <button onClick={() => editor.chain().focus().setColor('#000').run()}>Negro</button>

      <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        Izquierda
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        Centro
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        Derecha
      </button>

      <button onClick={addLink}>Agregar enlace</button>
      <button onClick={removeLink}>Quitar enlace</button>

      {/* Botón para alternar modo HTML */}
      <button onClick={toggleHtmlView}>
        {showHtml ? 'Volver al Editor Visual' : 'Ver/Editar HTML'}
      </button>
    </div>
  );
};

const EditorTiptap = ({ initialContent = '', onEditorReady }) => {
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2] }),
      Paragraph,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
    ],
    content: initialContent,
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  const toggleHtmlView = () => {
    if (!editor) return;

    if (!showHtml) {
      setHtmlContent(editor.getHTML());
    } else {
      editor.commands.setContent(htmlContent);
    }

    setShowHtml(!showHtml);
  };

  return (
    <div>
      <MenuBar editor={editor} toggleHtmlView={toggleHtmlView} showHtml={showHtml} />
      {showHtml ? (
        <textarea
          className="form-control"
          rows="15"
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};

export default EditorTiptap;