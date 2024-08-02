import { useState } from "react";
import { db } from "../libs/firebase";
import { doc, updateDoc } from "firebase/firestore";

function UpdateModal({ onClose, log }) {
  const [title, setTitle] = useState(log.title);
  const [description, setDescription] = useState(log.description);
  const [message, setMessage] = useState("");

  const updateData = async function (event, selectedId) {
    event.preventDefault();
    try {
      const docRef = doc(db, "daily-log-24", selectedId);
      await updateDoc(docRef, {
        title,
        description,
      });
    } catch (err) {
      console.log(err.message);
      setMessage(err.message);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div className="modal update-modal">
        <form className="form" onSubmit={(event) => updateData(event, log.id)}>
          <div className="form-item">
            <label className="form-item-label">Title: </label>
            <input
              id="title"
              className="form-item-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="form-item">
            <label className="form-item-label">Description: </label>
            <textarea
              id="description"
              className="form-item-textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="form-item">
            <button className="form-button" type="submit">
              Update
            </button>
            <button className="form-button" onClick={onClose}>
              Cancel
            </button>
          </div>
          {!!message && <p className="message">{message}</p>}
        </form>
      </div>
      <div className="overlay" onClick={onClose}></div>
    </>
  );
}

export default UpdateModal;
