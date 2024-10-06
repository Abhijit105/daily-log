import React, { useEffect, useState, useCallback } from 'react'
import Display from './components/Display'
import Forms from './components/Forms'

function App() {
  const [localTheme, setLocalTheme] = useState('')
  const [displayGlobalTheme, setDisplayGlobalTheme] = useState(false)
  const [globalTheme, setGlobalTheme] = useState('')

  const handleChangeTheme = function (selectedColor, selectedMode) {
    const selectedTheme = [selectedColor, selectedMode].join('-')
    localStorage.setItem('theme', JSON.stringify(selectedTheme))
    setLocalTheme(selectedTheme)
  }

  useEffect(() => {
    const selectedTheme =
      JSON.parse(localStorage.getItem('theme')) ?? 'gray-light'
    setLocalTheme(selectedTheme)
  }, [])

  useEffect(() => {
    setDisplayGlobalTheme(localTheme.split('-')[1] === 'auto')
    setGlobalTheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? `${localTheme.split('-')[0]}-dark`
        : `${localTheme.split('-')[0]}-light`
    )
  }, [localTheme])

  const autoThemeSwitcher = useCallback(function (event) {
    setGlobalTheme(
      globalTheme =>
        `${globalTheme.split('-')[0]}-${
          event.target.matches ? 'dark' : 'light'
        }`
    )
  }, [])

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', autoThemeSwitcher)
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark')
        .removeEventListener('change', autoThemeSwitcher)
    }
  }, [autoThemeSwitcher])

  return (
    <>
      <main
        className='main'
        data-theme={displayGlobalTheme ? globalTheme : localTheme}
      >
        <Forms
          localTheme={localTheme}
          onTheme={handleChangeTheme}
          mode={
            displayGlobalTheme
              ? globalTheme.split('-')[1]
              : localTheme.split('-')[1]
          }
        />
        <Display />
      </main>
    </>
  )
}

export default App
