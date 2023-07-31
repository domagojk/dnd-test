/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import { Draggable } from "./Draggable";
import { DndContext } from "@dnd-kit/core";

function App() {
  const editor = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();
  const [isDragging, setIsDragging] = useState(false);

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
            if (event.dataTransfer.effectAllowed !== "all") {
              // this is a hack - needs a better way to differantiate between D&D from outside and from within codemirror
              return;
            }
            const cursor = view.posAtCoords({
              x: event.clientX,
              y: event.clientY,
            });

            view.dispatch({
              changes: {
                from: cursor,
                insert: "DROPPED_IMAGE_HTML5_DRAGGABLE",
              },
            });
          },
        }),
      ],
    });
    const view = new EditorView({
      state,
      parent: editor.current,
    });
    viewRef.current = view;
    view.setState(state);

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <DndContext
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragEnd={(event) => {
        if (!isDragging) return;

        const cursor = viewRef.current.posAtCoords({
          x: event.activatorEvent.x,
          y: event.activatorEvent.y,
        });

        viewRef.current.dispatch({
          changes: { from: cursor, insert: "DROPPED_IMAGE_FROM_DNDKIT" },
        });
        setIsDragging(false);
      }}
    >
      <div style={{ display: "flex" }}>
        <div>
          <ul>
            <li draggable>main.tex</li>
            <li draggable>frog.jpg</li>
          </ul>
          <Draggable>with dnd-kit</Draggable>
        </div>

        <div
          onDragOver={(e) => {
            setIsDragging(false);
            e.preventDefault();
          }}
        >
          <div ref={editor}></div>
        </div>
      </div>
    </DndContext>
  );
}

export default App;
