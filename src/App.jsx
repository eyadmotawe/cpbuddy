import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import CodeEditor from './components/CodeEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box >
        <CodeEditor>
          
        </CodeEditor>
    </Box>
  )
}

export default App
