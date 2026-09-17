import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  globalCss: {
    'html, body': {
      colorScheme: 'dark',
      bg: 'bg',
      color: 'fg',
    },
  },
})

const theme = createSystem(defaultConfig, config)

export default theme