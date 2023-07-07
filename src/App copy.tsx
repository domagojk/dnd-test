import { useEffect, useRef } from "react";
import "./App.css";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";

function App() {
  const editor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor.current) {
      return;
    }

    const state = EditorState.create({
      doc: `\\documentclass{article}
\\usepackage{graphicx} % Required for inserting images

\\title{blank} \n\n\n\n\n\n\n\n\n\n
`,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.domEventHandlers({
          drop: (event) => {
            const cursor = view.posAtCoords({
              x: event.clientX,
              y: event.clientY,
            });

            view.dispatch({
              changes: { from: cursor, insert: "DROPPED_IMAGE" },
            });
          },
        }),
      ],
    });
    const view = new EditorView({
      state,
      parent: editor.current,
    });
    view.setState(state);

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <ul>
          <li draggable>main.tex</li>
          <li draggable>frog.jpg</li>
        </ul>
      </div>

      <div onDragOver={(e) => e.preventDefault()}>
        <div ref={editor}></div>
      </div>
    </div>
  );
}

export default App;
