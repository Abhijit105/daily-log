import { MouseEventHandler, useState } from 'react'
import Form from './Form'
import { db } from '../libs/firebase'
import { COLORS } from '../config/config'
import ColorContainer from './ColorContainer'

interface FormsProps {
  localTheme: string
  onTheme: (selectedColor: string, selectedMode: string) => void
  mode: string
}

interface LogsData {
  title: string
  description: string
}

function Forms({ localTheme, onTheme, mode }: FormsProps) {
  const [logsData, setLogsData] = useState<LogsData[]>([
    {
      title: '',
      description: '',
    },
  ])

  const addLogData: MouseEventHandler<HTMLButtonElement> = function (event) {
    event.preventDefault()
    setLogsData(logsData => [
      ...logsData,
      {
        title: '',
        description: '',
      },
    ])
  }

  const removeLogData: MouseEventHandler<HTMLButtonElement> = function (event) {
    event.preventDefault()
    setLogsData(logsData =>
      logsData.filter((_, i, arr) => i !== arr.length - 1)
    )
  }

  const changeColorHandler: MouseEventHandler<HTMLButtonElement> = function (
    event
  ) {
    onTheme(
      (event.target as HTMLButtonElement).dataset.color ?? '',
      localTheme.split('-')[1]
    )
  }

  const changeModeHandler: MouseEventHandler<HTMLButtonElement> = function (
    event
  ) {
    onTheme(
      localTheme.split('-')[0],
      (event.target as HTMLButtonElement).dataset.mode ?? ''
    )
  }

  return (
    <div className='forms'>
      <nav className='nav nav-buttons'>
        <button data-mode='light' onClick={changeModeHandler}>
          Light
        </button>
        <button data-mode='dark' onClick={changeModeHandler}>
          Dark
        </button>
        <button data-mode='auto' onClick={changeModeHandler}>
          Auto
        </button>
        {COLORS.map((color, i) => (
          <ColorContainer
            key={i}
            onColorHandler={changeColorHandler}
            color={color}
            mode={mode}
          />
        ))}
        {true && <button>{localTheme.toLocaleUpperCase()}</button>}
      </nav>
      {logsData.map((_, i) => (
        <Form
          i={i}
          db={db}
          logsData={logsData}
          setLogsData={setLogsData}
          addLogData={addLogData}
          removeLogData={removeLogData}
          key={i}
        />
      ))}
    </div>
  )
}

export default Forms
