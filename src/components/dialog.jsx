'use client'

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import {
    XMarkIcon
} from '@heroicons/react/24/outline'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close


export function DialogOverlay({
    ...props
}) {
    return (
        <DialogPrimitive.Overlay
            data-slot='dialog-overlay' 
            className='DialogOverlay fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' 
            {...props}
        />
    )
}

export function DialogContent({
    children,
    ...props
}) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot='dialog-content' 
                className='DialogContent fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'
                {...props}>
                    {children}
                    <DialogPrimitive.Close className="DialogClose absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <XMarkIcon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
        </DialogPortal>
    )
}

export function DialogHeader({
    ...props
}) {
    return (
        <div 
        data-slot='dialog-header' 
        className='DialogHeader flex flex-col space-y-1.5 text-center sm:text-left' 
        {...props}
        />
    )
}

export function DialogFooter({
    ...props
}) {
    return (
        <div 
        data-slot='dialog-footer' 
        className='DialogFooter flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2' 
        {...props}
        />
    )
}

export function DialogTitle({
    ...props
}) {
    return (
        <DialogPrimitive.Title
            data-slot='dialog-title' 
            className='DialogTitle text-lg font-semibold leading-none tracking-tight' 
            {...props}
        />
    )
}

export function DialogDescription({
    ...props
}) {
    return (
        <DialogPrimitive.Description
            data-slot='dialog-description' 
            className='DialogDescription text-sm text-muted-foreground' 
            {...props}
        />
    )
}
  
  export {
    Dialog,
    DialogPortal,
    DialogTrigger,
    DialogClose,
  }

