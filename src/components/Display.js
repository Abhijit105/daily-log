import React, { useState } from 'react'
import DisplayLog from './DisplayLog'
import ReadModal from './ReadModal'
import firebase from '../libs/firebase'

function Display() {
  const [date, setDate] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [count, setCount] = useState(1)
  const [displayedLogs, setDisplayedLogs] = useState([])
  const [errorDisplayedLogs, setErrorDisplayedLogs] = useState('')
  const [isLoadingDisplayedLogs, setIsLoadingDisplayedLogs] = useState(false)
  const [displayReadModal, setDisplayReadModal] = useState(false)

  let queriedDate = new Date(
    year || new Date().getFullYear(),
    month ? month - 1 : new Date().getMonth(),
    date || new Date().getDate()
  )

  const openReadModal = function () {
    setDisplayReadModal(true)
  }

  const closeReadModal = function () {
    setDisplayReadModal(false)
  }

  const incrementCount = function () {
    setCount(count => count + 1)
  }

  const decrementCount = function () {
    if (count === 1) {
      return
    }
    setCount(count => count - 1)
  }

  const handleWheel = function (event) {
    if (event.deltaY < 0) {
      incrementCount()
    } else if (event.deltaY > 0) {
      decrementCount()
    }
  }

  const readLogs = async function (event, history = false) {
    if (history) {
      queriedDate = new Date(
        queriedDate.getTime() - count * 24 * 60 * 60 * 1000
      )
      if (queriedDate.getDay() === 0) {
        queriedDate.setTime(queriedDate.getTime() - 2 * 24 * 60 * 60 * 1000)
      } else if (queriedDate.getDay() === 6) {
        queriedDate.setTime(queriedDate.getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    } else {
      queriedDate = new Date(
        year || new Date().getFullYear(),
        month ? month - 1 : new Date().getMonth(),
        date || new Date().getDate()
      )
    }
    const plusOne = new Date(queriedDate.getTime() + 24 * 60 * 60 * 1000)
    try {
      event.target.classList.add('btn-loading')
      setIsLoadingDisplayedLogs(true)
      setErrorDisplayedLogs('')
      const logsList = await firebase.getDocuments('and', [
        {
          field: 'startTimeStamp',
          condition: '>=',
          value: queriedDate,
        },
        {
          field: 'startTimeStamp',
          condition: '<',
          value: plusOne,
        },
      ])
      setDisplayedLogs(logsList.toReversed())
    } catch (err) {
      console.log('Error reading document:' + err)
      setErrorDisplayedLogs(err.message)
    } finally {
      setIsLoadingDisplayedLogs(false)
      event.target.classList.remove('btn-loading')
    }
  }

  console.log(displayedLogs)

  return (
    <>
      <div className='display'>
        <nav className='nav nav-auth'>
          <button
            onClick={openReadModal}
            disabled={displayedLogs?.length === 0}
          ></button>
          <button onClick={firebase.signInWithGoogle}>Google</button>
          <button onClick={firebase.signOutWithGoogle}>Sign Out</button>
        </nav>
        <div className='date-area'>
          <button
            onClick={event => readLogs(event, true)}
            onWheel={handleWheel}
            data-btn='history'
          >
            {count !== 1 ? `${count} days before` : 'Yesterday...'}
          </button>
          <button onClick={incrementCount}>&uarr;</button>
          <button onClick={decrementCount} disabled={count === 1}>
            &darr;
          </button>

          <div className='date-item'>
            <input
              type='number'
              min={1}
              max={31}
              value={date}
              onChange={event => setDate(event.target.value)}
            />
            <label>DD</label>
          </div>
          <div className='date-item'>
            <input
              type='number'
              min={1}
              max={12}
              value={month}
              onChange={event => setMonth(event.target.value)}
            />
            <label>MM</label>
          </div>
          <div className='date-item'>
            <input
              type='number'
              min={2000}
              max={3000}
              value={year}
              onChange={event => setYear(event.target.value)}
            />
            <label>YY</label>
          </div>
          <div className='date-item'>
            <button onClick={event => readLogs(event)}>GO</button>
          </div>
        </div>
        {!errorDisplayedLogs ? (
          isLoadingDisplayedLogs ? (
            <div className='spinner-container'>
              <div className='lds-circle'>
                <div></div>
              </div>
            </div>
          ) : !!displayedLogs && displayedLogs.length !== 0 ? (
            <div className='displayed-logs'>
              {displayedLogs
                .sort(
                  (a, b) =>
                    a.startTimeStamp.toDate().getTime() -
                    b.startTimeStamp.toDate().getTime()
                )
                .map((log, i) => (
                  <DisplayLog
                    i={i}
                    log={log}
                    setDisplayedLogs={setDisplayedLogs}
                    key={i}
                  />
                ))}
            </div>
          ) : (
            <p className='message'>Nothing to display</p>
          )
        ) : (
          <p className='message'>{errorDisplayedLogs}</p>
        )}
      </div>
      {displayReadModal && (
        <ReadModal
          displayedLogs={displayedLogs}
          onClose={closeReadModal}
          setDisplayedLogs={setDisplayedLogs}
          displayReadModal={displayReadModal}
        />
      )}
    </>
  )
}

export default Display
