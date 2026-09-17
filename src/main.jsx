import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, Theme } from '@chakra-ui/react'
import theme from './theme.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <Theme appearance="dark" minH="100vh">
        <App />
      </Theme>
    </ChakraProvider>
  </StrictMode>,
)
