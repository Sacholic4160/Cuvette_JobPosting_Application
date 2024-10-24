import { useState } from 'react'
import Signup from './Pages/Signup.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Signup/>
    </>
  )
}

export default App
