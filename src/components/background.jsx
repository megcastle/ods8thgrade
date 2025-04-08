'use client'

import { useEffect } from 'react'
import { Gradient } from '@/styles/gradient'

export default function Background() {
    useEffect(() => {
        // Initialize the gradient after the component mounts
        const gradient = new Gradient()
        gradient.initGradient('#gradient-canvas')
    }, [])

    return (
                <div className="Gradient isLoaded z-0">
                    <canvas
                        id="gradient-canvas"
                        style={{
                            '--gradient-color-0': '##e0f2fe',
                            '--gradient-color-1': '#0284c7',
                            '--gradient-color-2': '#06b6d4',
                            '--gradient-color-3': '#0c4a6e',
                        }}
                        data-js-controller="Gradient"
                        data-js-darken-top=""
                        data-transition-in=""
                        className="Gradient__canvas isLoaded"
                    />
                    {/* <div className="absolute inset-y-0 right-0 bottom-[30rem] w-full origin-bottom-left -skew-y-12 bg-white"></div> */}
                    {/* <div className="absolute inset-x-0 h-[30rem] left-0 bottom-0 w-full origin-bottom-left skew-y-12 bg-white"></div> */}
                </div>
    )
}