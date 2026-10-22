import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}{text === 'positive' ? ' %' : ''}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        <div>No feedback given</div>
      </div>
    )
  }
  return (
    <table>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={props.total} />
      <StatisticLine text="average" value={props.average} />
      <StatisticLine text="positive" value={props.positive} />
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const voteGood = () => {
    const updatedGood = good + 1
    const updatedTotal = updatedGood + neutral + bad
    setGood(updatedGood)
    setTotal(updatedTotal)
    setAverage((updatedGood - bad) / updatedTotal)
    setPositive((updatedGood / updatedTotal) * 100)
  }

  const voteNeutral = () => {
    const updatedNeutral = neutral + 1
    const updatedTotal = good + updatedNeutral + bad
    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setAverage((good - bad) / updatedTotal)
    setPositive((good / updatedTotal) * 100)
  }

  const voteBad = () => {
    const updatedBad = bad + 1
    const updatedTotal = good + neutral + updatedBad
    setBad (updatedBad)
    setTotal(updatedTotal)
    setAverage((good - updatedBad) / updatedTotal)
    setPositive((good / updatedTotal) * 100)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={voteGood} text="good"/>
      <Button onClick={voteNeutral} text="neutral" />
      <Button onClick={voteBad} text="bad" />

      <h1>statistics</h1>
      <Statistics 
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App
