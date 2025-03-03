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

  const handleWheelYesterdayButton = function (event) {
    if (event.deltaY < 0) {
      incrementCount()
    } else if (event.deltaY > 0) {
      decrementCount()
    }
  }

  const handleSecondaryClickYesterdayButton = function (event) {
    event.preventDefault()
    setCount(1)
  }

  const handleWheelDateInput = function (event) {
    if (event.deltaY < 0) {
      setDate(date => Number(date) - 1)
      if (event.target.value === '' || event.target.value === '1') {
        setDate(31)
      }
    } else if (event.deltaY > 0) {
      setDate(date => Number(date) + 1)
      if (event.target.value === '' || event.target.value === '31') {
        setDate(1)
      }
    }
  }

  const handleWheelMonthInput = function (event) {
    if (event.deltaY < 0) {
      setMonth(month => Number(month) - 1 || event.target.value === '1')
      if (event.target.value === '') {
        setMonth(12)
      }
    } else if (event.deltaY > 0) {
      setMonth(month => Number(month) + 1 || event.target.value === '12')
      if (event.target.value === '') {
        setMonth(1)
      }
    }
  }

  const handleWheelYearInput = function (event) {
    if (event.deltaY < 0) {
      setYear(year => Number(year) - 1)
      if (event.target.value === '' || event.target.value === 2024) {
        setYear(2025)
      }
    } else if (event.deltaY > 0) {
      setYear(year => Number(year) + 1)
      if (event.target.value === '' || event.target.value === '2025') {
        setYear(2024)
      }
    }
  }

  const handleSecondaryClickGoButton = function (event) {
    event.preventDefault()
    setDate('')
    setMonth('')
    setYear('')
  }

  const readLogs = async function (event, history = false) {
    let queriedDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
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
            onWheel={event => handleWheelYesterdayButton(event)}
            onContextMenu={event => handleSecondaryClickYesterdayButton(event)}
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
              onWheel={event => handleWheelDateInput(event)}
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
              onWheel={event => handleWheelMonthInput(event)}
            />
            <label>MM</label>
          </div>
          <div className='date-item'>
            <input
              type='number'
              min={2024}
              max={2025}
              value={year}
              onChange={event => setYear(event.target.value)}
              onWheel={event => handleWheelYearInput(event)}
            />
            <label>YYYY</label>
          </div>
          <div className='date-item'>
            <button
              onClick={event => readLogs(event)}
              onContextMenu={event => handleSecondaryClickGoButton(event)}
            >
              GO
            </button>
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
