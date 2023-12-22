import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback"/>
      <Button handleClick={() => setGood(good + 1)} text="good"/>
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button handleClick={() => setBad(bad + 1)} text="bad"/>
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

const Header = ({ text }) => {
  return (
    <>
      <h1>{text}</h1>
    </>
  )
}
 
const Button = ({ handleClick, text }) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}

const Statistics = ({ good, bad, neutral }) => {
  const all = good + bad + neutral

  const average = all !== 0 ? (good - bad) / all : 0;
  const positive = all !== 0 ? good / all : 0;
 
  return (
    <>
      <Header text="statistics" />
      {all > 0 && (
        <>
          <StatisticsLine text="good" value={good}/>
          <StatisticsLine text="neutral" value={neutral}/>
          <StatisticsLine text="bad" value={bad}/>
          <StatisticsLine text="all" value={all}/>
          <StatisticsLine text="average" value={average}/>
          <StatisticsLine text="positive" value={positive}/>  
        </>
      )}
      {all <= 0 && <div>No feedback given</div>}
    </>
  );
}

const StatisticsLine = ({ text, value }) => {
  return (
    <>
      <div>{text} {value}</div>
    </>
  )
}


export default App