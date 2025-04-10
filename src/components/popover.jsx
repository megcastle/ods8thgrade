"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { XMarkIcon } from '@heroicons/react/24/outline'

const Popover = PopoverPrimitive.Root
const PopoverAnchor = PopoverPrimitive.Anchor


export function PopoverTrigger({children}) {
    return (
        <PopoverPrimitive.Trigger
            data-slot='popover-trigger'
            className='PopoverTrigger font-semibold underline text-sky-700 hover:text-slate-700 m-0 p-0 cursor-pointer'
        >
            {children}
        </PopoverPrimitive.Trigger>
    )
}

export function PopoverClose({...props}) {
    return (
        <PopoverPrimitive.Close 
            data-slot='popover-close' 
            className='PopoverClose absolute top-4 right-4' 
            {...props}
        >
            <XMarkIcon className="w-5 h-5 text-slate-700" />
        </PopoverPrimitive.Close>
    )
}

export function PopoverContent({ ...props }) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                data-slot="popover-content"
                align="center"
                sideOffset="1"
                className="PopoverContent z-50 rounded-lg border border-sky-500 bg-white bg-popover p-6 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]"
                {...props}
            />
        </PopoverPrimitive.Portal>
    )
}

export { Popover, PopoverAnchor }
