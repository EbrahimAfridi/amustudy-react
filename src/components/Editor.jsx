import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'header',
      data: {
        text: '',
        level: 1,
      },
    },
    {
      type: 'paragraph',
      data: {
        text: ''
      }
    },
  ],
};

const EDITOR_HOLDER_ID = 'editorjs';

const Editor = ({editorRef}) => {
  const editorInstance = useRef(null);
  const [editorData, setEditorData] = useState(DEFAULT_INITIAL_DATA);

  useEffect(() => {
    if (!editorInstance.current) {
      initEditor();
    }
    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: 'editor',
      logLevel: 'ERROR',
      data: editorData,
      onReady: () => {
        editorInstance.current = editor;
        editorRef.current = editor; 
      },
      onChange: async () => {
        const content = await editor.save();
        setEditorData(content);
        // Implement saving logic here if needed
        console.log('Editor content updated:', content);
      },
      autofocus: true,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter A Header',
            levels: [1, 2, 3],
            defaultLevel: 1,
          },
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        // image: {
        //   class: ImageTool,
        //   config: {
        //     endpoints: {
        //       byFile: '/uploadFile', // Your file upload endpoint
        //       byUrl: '/fetchUrl',    // Your URL fetch endpoint
        //     },
        //   },
        // },
        embed: Embed,
        table: Table,
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote author',
          },
        },
      },
    });
  };

  return <div id="editor" style={{ paddingBottom: '20px', width: '100%' }} />;
};

export default Editor;
