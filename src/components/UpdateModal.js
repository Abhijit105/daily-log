import { useState, useCallback, useEffect } from 'react'
import firebase from '../libs/firebase'

function UpdateModal({ onClose, log, displayUpdateModal }) {
  const [title, setTitle] = useState(log.title)
  const [description, setDescription] = useState(log.description)
  const [message, setMessage] = useState('')

  const updateData = async function (event, selectedId) {
    event.preventDefault()
    try {
      const updatedDocFields = {
        title,
        description,
      }
      await firebase.updateDocument(selectedId, updatedDocFields)
    } catch (err) {
      console.log(err.message)
      setMessage(err.message)
    } finally {
      onClose()
    }
  }

  const escapeCloser = useCallback(
    function (event) {
      if (event.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!displayUpdateModal) return
    document.addEventListener('keydown', escapeCloser)
    return () => document.removeEventListener('keydown', escapeCloser)
  }, [escapeCloser, displayUpdateModal])

  return (
    <>
      <div className='modal update-modal'>
        <form className='form' onSubmit={event => updateData(event, log.id)}>
          <div className='form-item'>
            <label className='form-item-label'>Title: </label>
            <input
              id='title'
              className='form-item-input'
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </div>
          <div className='form-item'>
            <label className='form-item-label'>Description: </label>
            <textarea
              id='description'
              className='form-item-textarea'
              value={description}
              onChange={event => setDescription(event.target.value)}
            />
          </div>
          <div className='form-item'>
            <button className='form-button' type='submit'>
              Update
            </button>
            <button className='form-button' onClick={onClose}>
              Cancel
            </button>
          </div>
          {!!message && <p className='message'>{message}</p>}
        </form>
      </div>
      <div className='overlay update-modal-overlay' onClick={onClose}></div>
    </>
  )
}

export default UpdateModal
