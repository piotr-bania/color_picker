'use client'

import { Box, Button, Circle, CloseButton, Divider, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { hslToRgb } from './HSL_to_RGB'
import { rgbToHsl } from './RGB_to_HSL'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'

const defaultColors = [
    '#ff0000', '#fd3101', '#fb6003', '#f98e05',
    '#f7bb07', '#f5e609', '#d6f30b', '#aaf10d',
    '#7fef0f', '#56ed11', '#2eeb13', '#15e923',
    '#17e74b', '#19e572', '#1be398', '#1de1bc',
    '#1fdfdf', '#21badd', '#2396db', '#2574d9',
    '#2753d7', '#2934d5', '#402bd3', '#602dd1',
    '#7f2fcf', '#9c31cd', '#b833cb', '#c935bf',
    '#c737a3', '#c53988', '#c33b6e', '#c13d56',
    '#c737a3', '#c53988'
]

const Color_Picker = ({ onColorSelect }) => {

    const [selectedColor, setSelectedColor] = useState('#c13d56')
    const [colors, setColors] = useState(defaultColors)

    const addCurrentColorToPalette = () => {
        // Check if the color already exists in the palette
        if (!colors.includes(selectedColor)) {
            setColors((prevColors) => [...prevColors, selectedColor])
        }
    }

    const [circlePosition, setCirclePosition] = useState({ x: 0, y: 160 })
    const [dragging, setDragging] = useState(false)
    const gradientBoxRef = useRef(null)
    const [hue, setHue] = useState(0)

    const handleMouseDown = (e) => {
        setDragging(true)
        updateCirclePosition(e)
    }

    const handleMouseMove = (e) => {
        if (dragging) {
            updateCirclePosition(e)
        }
    }

    const updateCirclePosition = (e) => {
        const rect = gradientBoxRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Update circle position
        setCirclePosition({ x, y })

        // Calculate color based on position
        const saturation = (x / rect.width) * 100
        const lightness = 100 - (y / rect.height) * 100
        setSelectedColor(`hsl(0, ${saturation}%, ${lightness}%)`)
    }

    const handleHueChange = (value) => {
        setHue(value)
        const [r, g, b] = hslToRgb(value / 360, 1, 1)
        setSelectedColor(`rgb(${r}, ${g}, ${b})`)
    }

    return (
        <Box
            bg='#222'
            w='240px'
            borderRadius={2}
            border='1px solid #FFFFFF20'
            color='white'
            fontWeight={600}
        >
            <Flex
                p={2}
                pl={4}
                flexDir={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                Mixer
                <CloseIcon
                    boxSize={8}
                    borderRadius={6}
                    cursor='pointer'
                    p={3}
                    _hover={{ color: '#FFFFFF', bg: '#FFFFFF10' }}
                    _active={{ color: '#846EFF', bg: 'transparent' }}
                    transition="all 0.3s"
                    transitionDuration="300ms"
                />
            </Flex>

            <Box
                h={'160'}
                position='relative'
                bg={`linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`}
                onMouseDown={(e) => handleMouseDown(e)}
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseUp={() => setDragging(false)}
                onMouseLeave={() => setDragging(false)}
                ref={gradientBoxRef}
            >
                <Circle
                    size={3}
                    // bg={selectedColor}
                    border='2px solid #FFFFFF'
                    position="absolute"
                    left={`${circlePosition.x}px`}
                    top={`${circlePosition.y}px`}
                />
            </Box>

            <Flex
                p={4}
                flexDir={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                color='#FFFFFF90'
                fontWeight={400}
            >
                Color range
                <Flex alignItems={'center'}>
                    <Slider 
                        aria-label="Hue slider" 
                        min={0} 
                        max={360} 
                        step={1} 
                        value={hue} 
                        onChange={handleHueChange}
                        width='100px'
                        colorScheme='transparent'
                        size={'sm'}
                    >
                        <SliderTrack
                            bg='linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red)'
                        >

                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </Flex>
            </Flex>

            <Divider orientation='horizontal' />

            {/* Default Color Choices */}
            <Flex
                px={4}
                pt={2}
                fontWeight={600}
                d='flex'
                flexDir={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                Color palette
                <AddIcon
                    boxSize={3}
                    color={'#FFFFFF80'}
                    cursor='pointer'
                    _hover={{ color: '#FFFFFF' }}
                    _active={{ color: '#846EFF' }}
                    transition="all 0.3s"
                    transitionDuration="300ms"
                    onClick={addCurrentColorToPalette} // Add current color to palette
                />
            </Flex>
            <Flex
                p={4}
                d='flex'
                gap={1}
                flexDir={'row'}
                flexWrap={'wrap'}
                justifyContent={'flex-start'}
                width={'100%'}
            >
                {/* Changed from defaultColors to colors */}
                {colors.map((color, index) => {
                    const [r, g, b] = color.slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16))
                    const [h, s, l] = rgbToHsl(r, g, b)
                    
                    return (
                        <Circle
                            key={index}
                            size='19px'
                            bgColor={color}
                            border={'1px solid #222'}
                            boxShadow={'0px 0px 0px 1px #FFFFFF20'}
                            _hover={{ boxShadow: '0px 0px 0px 2px #FFFFFF80' }}
                            _active={{ boxShadow: '0px 0px 0px 2px #846EFF' }}
                            transition="all 0.3s"
                            transitionDuration="300ms"
                            cursor='pointer'
                            onClick={() => {
                                // Use hue from slider and saturation/lightness from color
                                setSelectedColor(`hsl(${hue}, ${s}%, ${l}%)`)
                                // Update circle position
                                setCirclePosition({ 
                                    x: s / 100 * gradientBoxRef.current.getBoundingClientRect().width, 
                                    y: (1 - l / 100) * gradientBoxRef.current.getBoundingClientRect().height 
                                })
                            }}
                        />
                    )
                })}

            </Flex>
        </Box>
    )
}

export default Color_Picker