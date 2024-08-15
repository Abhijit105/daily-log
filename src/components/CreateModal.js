function CreateModal({
  onClose,
  submitData,
  logsData,
  i,
  changeTitle,
  clearTitle,
  changeDescription,
  clearDescription,
  initData,
  startTimeStamp,
  cancel,
  addLogData,
  removeLogData,
  message,
}) {
  return (
    <>
      <div className="modal create-modal">
        <div className="headline">
          <h2>Hello daily-log</h2>
          <button onClick={onClose}>X</button>
        </div>
        <form className="form" onSubmit={submitData}>
          <div className="form-item">
            <label className="form-item-label">Title: </label>
            <input
              id={`title-${i}`}
              className="form-item-input"
              value={logsData[i].title}
              onChange={(event) => changeTitle(event)}
            />
            <button className="form-item-button" onClick={clearTitle}>
              Clear
            </button>
          </div>
          <div className="form-item">
            <label className="form-item-label">Description: </label>
            <textarea
              id={`description-${i}`}
              className="form-item-textarea"
              value={logsData[i].description}
              onChange={(event) => changeDescription(event)}
            />
            <button
              className="form-item-button"
              onClick={(event) => clearDescription(event)}
            >
              Clear
            </button>
          </div>
          <div className="form-item">
            <button
              className="form-button"
              onClick={initData}
              disabled={startTimeStamp !== null}
            >
              Init
            </button>
            <button
              className="form-button"
              type="submit"
              disabled={startTimeStamp === null || logsData[i].title === ""}
            >
              Done
            </button>
            <button
              className="form-button"
              disabled={startTimeStamp === null}
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
          <div className="add-remove-buttons">
            <button onClick={(event) => addLogData(event)}>+</button>
            <button
              onClick={(event) => removeLogData(event)}
              disabled={logsData.length === 1}
            >
              -
            </button>
          </div>
          {!!startTimeStamp && <div className="loader"></div>}
          {!!message && <p className="message">{message}</p>}
        </form>
      </div>
      <div className="overlay" onClick={onClose}></div>
    </>
  );
}

export default CreateModal;
