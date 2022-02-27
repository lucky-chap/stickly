import React, { useCallback, useEffect } from "react";
import { useAppDispatch } from "../store";
import { updateNoteById, deleteNoteById } from "../store/notes";
import "../less/sticky-card.less";

interface Props {
  note: Note;
}

const StickyCard: React.FC<Props> = (props) => {
  const { note } = props;
  const dispatch = useAppDispatch();

  useEffect(() => {
    // do nth
  }, []);

  const handleStickyCardDoubleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleStickyCardMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    const shiftX = event.clientX - left;
    const shiftY = event.clientY - top;

    const handleMouseMove = (event: MouseEvent) => {
      dispatch(
        updateNoteById({
          id: note.id,
          note: {
            ...note,
            position: {
              x: event.pageX - shiftX,
              y: event.pageY - shiftY,
            },
            updatedTs: Date.now(),
          },
        })
      );
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", handleMouseMove);
      },
      {
        once: true,
      }
    );
  }, []);

  const handleEditorMouseDown = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleEditorContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(
        updateNoteById({
          id: note.id,
          note: {
            ...note,
            content: event.target.value,
            updatedTs: Date.now(),
          },
        })
      );
    },
    [note]
  );

  const handleDeleteBtnClick = useCallback(() => {
    dispatch(deleteNoteById(note.id));
  }, [note]);

  return (
    <div
      className="sticky-card-wrapper"
      style={{ top: note.position.y, left: note.position.x }}
      onMouseDown={handleStickyCardMouseDown}
      onDoubleClick={handleStickyCardDoubleClick}
    >
      <div className="tool-bar-container">
        <span className="btn" onClick={handleDeleteBtnClick}>
          Delete
        </span>
      </div>
      <textarea
        style={{ width: note.bounding.width, height: note.bounding.height }}
        className="editor"
        placeholder="..."
        defaultValue={note.content}
        onMouseDown={handleEditorMouseDown}
        onChange={handleEditorContentChange}
      ></textarea>
    </div>
  );
};

export default StickyCard;
