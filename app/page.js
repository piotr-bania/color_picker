import { Box, ChakraProvider } from '@chakra-ui/react'
import Color_Picker from './components/Color_Picker'

export default function Home() {
    return (
        <ChakraProvider>
            <Box
                w='100vw'
                h='100vh'
                p={10}
                bg='#2C2C2C'
            >
                <Color_Picker />
            </Box>
        </ChakraProvider>
    )
}
