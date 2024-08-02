import { useState } from "react";
import { db } from "../libs/firebase";
import { deleteDoc, doc } from "firebase/firestore";

function DeleteModal({ onClose, log }) {
  const [message, setMessage] = useState("");

  const deleteData = async function (event, selectedId) {
    event.preventDefault();
    try {
      const docRef = doc(db, "daily-log-24", selectedId);
      await deleteDoc(docRef);
    } catch (err) {
      console.log(err.message);
      setMessage(err.message);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div className="modal delete-modal">
        <form className="form" onSubmit={(event) => deleteData(event, log.id)}>
          <p>Are you sure you want to delete?</p>
          <div className="form-item">
            <button className="form-button" type="submit">
              Delete
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

export default DeleteModal;
