import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import './App.css'

type NumberType = {
  value: number
  x: number
  y: number
}

enum STATUS_ENUM {
  win = 'win',
  lose = 'lose'
}

function App() {
  const [inputNumber, setInputNumber] = useState('')
  const [isStart, setIsStart] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [time, setTime] = useState(0.0)
  const [numbers, setNumbers] = useState<NumberType[]>([])
  const [clickedOrder, setClickedOrder] = useState<number[]>([])
  const [status, setStatus] = useState<STATUS_ENUM | undefined>()

  const handleChangeInputPoint = (e: ChangeEvent<HTMLInputElement>) => {
    const points = Number(e.target.value)
    setShowMessage(false)

    if (Number.isNaN(points)) return
    setInputNumber(e.target.value)
  }

  const handleSubmit = () => {
    if (isStart && !inputNumber) {
      setIsStart(false)
      setInputNumber('')
    } else {
      if (!inputNumber) {
        setShowMessage(true)
        return
      }

      setStatus(undefined)
      setIsStart(true)
    }

    generateNumbers()
    setStatus(undefined)
    setClickedOrder([])
    setTime(0)
  }

  const generateNumbers = () => {
    const arr: NumberType[] = []

    if (isStart && !inputNumber) {
      setNumbers([])
    } else {
      for (let i = 1; i <= +inputNumber; i++) {
        arr.push({
          value: i,
          x: Math.random() * 90,
          y: Math.random() * 90
        })
      }
      setNumbers(arr)
    }
  }

  const handleClick = ({
    number,
    event
  }: {
    number: number
    event: React.MouseEvent
  }) => {
    if (status === STATUS_ENUM.lose) return

    if (clickedOrder.length + 1 === number) {
      setClickedOrder([...clickedOrder, number])
      setNumbers(numbers.filter((n) => n.value !== number))

      if (clickedOrder.length + 1 === +inputNumber) {
        setClickedOrder([])
        setStatus(STATUS_ENUM.win)
        setIsStart(false)
      }
    } else {
      setStatus(STATUS_ENUM.lose)
      setIsStart(false)
      event.preventDefault()
    }
  }

  const renderTitle = useMemo(
    () => (status: STATUS_ENUM) =>
      ({
        [STATUS_ENUM.lose]: <h2 className="title-lose">GAME OVER</h2>,
        [STATUS_ENUM.win]: <h2 className="title-win">ALL CLEARED</h2>
      }[status]),
    []
  )

  useEffect(() => {
    if (isStart) {
      const interval = setInterval(() => setTime(time + 0.1), 100)
      return () => clearInterval(interval)
    }
  }, [isStart, time])

  return (
    <div className="App">
      {status ? renderTitle(status) : <h2>LEST'S PLAY</h2>}

      <div className="form">
        <div className="form-item">
          <label className="label" htmlFor="points">
            Points:
          </label>
          <input
            type="text"
            value={inputNumber}
            onChange={handleChangeInputPoint}
          />
          {showMessage && <p className="error-message">Points is required</p>}
        </div>

        <div className="form-item">
          <span className="label">Time: </span>
          <span>{time.toFixed(1)}s</span>
        </div>

        <div className="button-wrapper">
          <button onClick={handleSubmit}>{isStart ? 'Restart' : 'Play'}</button>
        </div>
      </div>

      <div className="game-area">
        {numbers.map((number) => (
          <div
            key={number.value}
            className="point"
            style={{
              left: `${number.x}%`,
              top: `${number.y}%`
            }}
            onClick={(e) => handleClick({ event: e, number: number.value })}
          >
            {number.value}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
