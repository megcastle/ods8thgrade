'use client'

//
// IMPORTS
//
import { useState } from 'react'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'motion/react'
import { v1 as uuidv1 } from 'uuid'
import { ExclamationCircleIcon, CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/outline'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/dialog'

import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/popover'

import { saveData } from '@/lib/actions/saveData'

//
// YUP SCHEMA
//
const schema = yup.object().shape({
    firstName: yup.string().required('Please enter a first name.'),
    lastName: yup.string().required('Please enter a last name.'),
    team: yup.string().required('Please select a Team.'),
    babyPicture: yup.mixed().required('Please upload a picture.'),
    recentPicture: yup.mixed().required('Please upload a picture.'),
    message: yup.string().max(250, 'Message cannot exceed 250 characters.'),
    parentName: yup.string().required('Please enter a name.'),
    parentEmail: yup
        .string()
        .email('Please enter a valid email address.')
        .required('Please enter an email address.'),
    content: yup.bool().oneOf([true], 'Your response is required.'),
    consent: yup.bool().oneOf([true], 'Your response is required.'),
})

//
// EXPORT FUNCTION
//
export default function Form() {
    //
    // DEFINE STATE
    //
    const [preview, setPreview] = useState({ babyPicture: null, recentPicture: null })
    const [progress, setProgress] = useState({ babyPicture: 0, recentPicture: 0 })
    const [alert, setAlert] = useState('')
    const [open, setOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)

    //
    // RHF
    //
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors, touchedFields, isSubmitting },
        control,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            team: '',
            babyPicture: null,
            recentPicture: null,
            message: '',
            parentName: '',
            parentEmail: '',
            content: false,
            consent: false,
        },
    })

    //
    // HANDLE FILE CHANGE
    //
    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError(fieldName, { type: 'manual', message: 'Only image files are allowed.' })
                return
            }
            if (file.size > 10 * 1024 * 1024) {
                setError(fieldName, { type: 'manual', message: 'File size must be under 5MB.' })
                return
            }
            clearErrors(fieldName)

            setValue(fieldName, file)
            setPreview((prev) => ({
                ...prev,
                [fieldName]: URL.createObjectURL(file),
            }))
        }
    }

    //
    // UPLOAD FILES
    //
    const uploadFile = async (file, field, path) => {
        try {
            const { data } = await axios.post('/api/upload', {
                fileName: file.name,
                fileType: file.type,
                path,
            })
            const { url, filePath } = data

            await axios.put(url, file, {
                headers: { 'Content-Type': file.type },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    setProgress((prev) => ({ ...prev, [field]: percentCompleted }))
                },
            })

            return 'https://storage.googleapis.com/${process.env.GOOGLE_BUCKET_NAME}/${filePath}'
        } catch (error) {
            throw new Error(`Failed to upload ${field}`)
        }
    }

    //
    // ON SUBMIT FUNCTION
    //
    const onSubmit = async (data) => {
        let uuid = uuidv1()

        try {
            const lastName = data.lastName
                .trim()
                .replace(/[^A-Za-z0-9]/g, '')
                .toUpperCase()
                .slice(0, 4)
            const teamName = data.team
            const path = teamName + '/' + lastName + '-' + uuid.slice(0, 8)

            const babyPictureURL = await uploadFile(data.babyPicture[0], 'babyPicture', path)
            const recentPictureURL = await uploadFile(data.recentPicture[0], 'recentPicture', path)

            await saveData(data, uuid, babyPictureURL, recentPictureURL)

            setAlert('Upload successful!')
            reset()
            setPreview({ babyPicture: null, recentPicture: null })
        } catch (error) {
            setAlert('Upload failed: ' + error.message)
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col justify-start space-y-12">
                    {/* student info */}
                    <div className="mb-12 flex flex-col justify-start space-y-6 rounded-lg border border-slate-200 bg-slate-100 p-6">
                        <ol className="mb-6 w-full items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8">
                            <li className="flex items-center space-x-2.5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500">
                                    <h3 className="font-semibold text-white">1</h3>
                                </span>
                                <h3 className="leading-tight font-semibold">Student information</h3>
                            </li>
                        </ol>
                        {/* first name */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-base" htmlFor="firstName">
                                Preferred first name:
                            </label>
                            <div className="relative">
                                {touchedFields.firstName && errors.firstName && (
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                                        <ExclamationCircleIcon className="size-7 text-rose-600" />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    name="firstName"
                                    {...register('firstName')}
                                    className={clsx(
                                        'w-full rounded-lg border bg-white p-2 focus:outline',
                                        touchedFields.firstName && errors.firstName
                                            ? 'border-rose-500 focus:border-rose-500 focus:outline-rose-500'
                                            : 'border-slate-200 focus:border-cyan-500 focus:outline-cyan-500'
                                    )}
                                />
                            </div>
                            {touchedFields.firstName && errors.firstName && (
                                <p className="text-xs/6 text-rose-600">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        {/* last name */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-base" htmlFor="lastName">
                                Last name:
                            </label>
                            <div className="relative">
                                {touchedFields.lastName && errors.lastName && (
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                                        <ExclamationCircleIcon className="size-7 text-rose-600" />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    name="lastName"
                                    {...register('lastName')}
                                    className={clsx(
                                        'w-full rounded-lg border bg-white p-2 focus:outline',
                                        touchedFields.lastName && errors.lastName
                                            ? 'border-rose-500 focus:border-rose-500 focus:outline-rose-500'
                                            : 'border-slate-200 focus:border-cyan-500 focus:outline-cyan-500'
                                    )}
                                />
                            </div>
                            {touchedFields.lastName && errors.lastName && (
                                <p className="text-xs/6 text-rose-600">{errors.lastName.message}</p>
                            )}
                        </div>
                        {/* team */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-base" htmlFor="team">
                                8th Grade Team:
                            </label>

                            <div className="flex-1 items-center gap-4 rounded-lg lg:flex">
                                {['Herons', 'Kingfishers', 'Ospreys'].map((team) => (
                                    <label
                                        key={team}
                                        className="flex w-full items-center space-x-3 rounded-lg border border-slate-200 bg-white p-3 ring-1 ring-transparent hover:bg-slate-200 has-checked:bg-cyan-50 has-checked:text-slate-700 has-checked:ring-cyan-200"
                                    >
                                        <div className="flex items-center ps-3">
                                            <input
                                                type="radio"
                                                name="team"
                                                {...register('team')}
                                                value={team}
                                                className="box-content h-2.5 w-2.5 appearance-none rounded-full border-[5px] border-slate-200 bg-white bg-clip-padding text-cyan-600 ring-1 ring-gray-950/20 outline-none checked:border-cyan-500 checked:ring-slate-500 hover:border-white hover:ring-white hover:checked:border-cyan-500 hover:checked:ring-slate-500 focus:ring-2 focus:ring-cyan-500"
                                            />
                                            <span className="ms-2 w-full py-0 text-base lg:py-3">
                                                {team}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.team && (
                                <p className="text-xs/6 text-rose-600">{errors.team.message}</p>
                            )}
                        </div>
                    </div>

                    {/* photo 1 */}
                    <div className="mb-12 flex flex-col justify-start space-y-6 rounded-lg border border-slate-200 bg-slate-100 p-6">
                        <ol className="mb-6 w-full items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8">
                            <li className="flex items-center space-x-2.5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500">
                                    <h3 className="font-semibold text-white">2</h3>
                                </span>
                                <h3 className="leading-tight font-bold">Upload baby photo</h3>
                            </li>
                        </ol>

                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                            <div className="col-span-1 lg:col-span-4">
                                <div className="mt-2 flex flex-col space-y-2">
                                    <Controller
                                        control={control}
                                        name={'babyPicture'}
                                        render={({ field: { value, onChange, ...field } }) => {
                                            return (
                                                <input
                                                    {...field}
                                                    value={value?.fileName}
                                                    onChange={(event) =>
                                                        handleFileChange(event, 'babyPicture')
                                                    }
                                                    type="file"
                                                    id="babyPicture"
                                                    className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-700 transition duration-700 ease-in-out file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-2.5 file:py-1.5 file:text-base file:text-slate-700 file:shadow-xs file:ring-1 file:ring-slate-300 file:ring-inset hover:file:cursor-pointer hover:file:bg-slate-200 focus:outline-none"
                                                />
                                            )
                                        }}
                                    />
                                    <div className="ms-2 flex flex-row items-center justify-start space-x-1">
                                        <div className="flex text-xs/5 text-slate-600">
                                            PNG or JPG up to 10MB |
                                        </div>
                                        <div className="text-xs/5">
                                            <Popover>
                                                <PopoverTrigger>
                                                    Photograph content guidelines
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <PopoverClose />
                                                    <div className="flex flex-col space-y-3">
                                                        <h4 className="text-lg font-semibold">
                                                            Photograph content guidelines
                                                        </h4>
                                                        <p className="text-sm/6">
                                                            To protect the privacy and well-being of
                                                            all students, please follow these
                                                            guidelines when choosing a photograph to
                                                            upload:
                                                        </p>
                                                        <ol className="list-inside list-decimal space-y-3 text-sm/6">
                                                            <li>
                                                                Only your child or children should
                                                                be identifiable. Do not include
                                                                other children, unless they are in
                                                                the background and not easily
                                                                recognizable.
                                                            </li>
                                                            <li>
                                                                Children must be fully clothed. No
                                                                form of nudity (even in baby
                                                                photographs) is allowed.
                                                            </li>
                                                            <li>
                                                                Do not include any imagery or
                                                                language which may be considered
                                                                vulgar, suggestive, or offensive.
                                                            </li>
                                                            <li>
                                                                Please avoid the use of heavy flters
                                                                or digital effects that change how
                                                                your child looks.
                                                            </li>
                                                            <li>
                                                                Please do not upload a photograph
                                                                which may embarass your child when
                                                                viewed by all of their friends.
                                                            </li>
                                                        </ol>
                                                        <p className="text-sm/6">
                                                            Contact{' '}
                                                            <a
                                                                href="mailto:ods8thgrade@gmail.com"
                                                                className="text-xs/6 font-semibold text-sky-700 underline hover:text-slate-700"
                                                            >
                                                                ods8thgrade@gmail.com
                                                            </a>{' '}
                                                            if you have any questions about these
                                                            guidelines. Thank you.
                                                        </p>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                                {touchedFields.babyPicture && errors.babyPicture && (
                                    <p className="text-xs/6 text-rose-600">
                                        {errors.babyPicture.message}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-1 mt-3 lg:col-span-2 lg:mt-0">
                                {preview.babyPicture && (
                                    <div className="relative mt-2 text-center">
                                        <Image
                                            src={preview.babyPicture}
                                            alt="File preview"
                                            height={250}
                                            width={250}
                                            className="rounded-lg object-cover shadow-xs"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* photo 2 */}
                    <div className="mb-12 flex flex-col justify-start space-y-6 rounded-lg border border-slate-200 bg-slate-100 p-6">
                        <ol className="mb-6 w-full items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8">
                            <li className="flex items-center space-x-2.5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500">
                                    <h3 className="font-semibold text-white">3</h3>
                                </span>
                                <h3 className="leading-tight font-bold">Upload recent photo</h3>
                            </li>
                        </ol>

                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                            <div className="col-span-1 lg:col-span-4">
                                <div className="mt-2 flex flex-col space-y-2">
                                    <Controller
                                        control={control}
                                        name={'recentPicture'}
                                        render={({ field: { value, onChange, ...field } }) => {
                                            return (
                                                <input
                                                    {...field}
                                                    value={value?.fileName}
                                                    onChange={(event) =>
                                                        handleFileChange(event, 'recentPicture')
                                                    }
                                                    type="file"
                                                    id="recentPicture"
                                                    className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-700 transition duration-700 ease-in-out file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-2.5 file:py-1.5 file:text-base file:text-slate-700 file:shadow-xs file:ring-1 file:ring-slate-300 file:ring-inset hover:file:cursor-pointer hover:file:bg-slate-200 focus:outline-none"
                                                />
                                            )
                                        }}
                                    />
                                    <div className="ms-2 flex flex-row items-center justify-start space-x-1">
                                        <div className="flex text-xs/5 text-slate-600">
                                            PNG or JPG up to 10MB |
                                        </div>
                                        <div className="text-xs/5">
                                            <Popover>
                                                <PopoverTrigger>
                                                    Photograph content guidelines
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <PopoverClose />
                                                    <div className="flex flex-col space-y-3">
                                                        <h4 className="text-lg font-semibold">
                                                            Photograph content guidelines
                                                        </h4>
                                                        <p className="text-sm/6">
                                                            To protect the privacy and well-being of
                                                            all students, please follow these
                                                            guidelines when choosing a photograph to
                                                            upload:
                                                        </p>
                                                        <ol className="list-inside list-decimal space-y-3 text-sm/6">
                                                            <li>
                                                                Only your child or children should
                                                                be identifiable. Do not include
                                                                other children, unless they are in
                                                                the background and not easily
                                                                recognizable.
                                                            </li>
                                                            <li>
                                                                Children must be fully clothed. No
                                                                form of nudity (even in baby
                                                                photographs) is allowed.
                                                            </li>
                                                            <li>
                                                                Do not include any imagery or
                                                                language which may be considered
                                                                vulgar, suggestive, or offensive.
                                                            </li>
                                                            <li>
                                                                Please avoid the use of heavy flters
                                                                or digital effects that change how
                                                                your child looks.
                                                            </li>
                                                            <li>
                                                                Please do not upload a photograph
                                                                which may embarass your child when
                                                                viewed by all of their friends.
                                                            </li>
                                                        </ol>
                                                        <p className="text-sm/6">
                                                            Contact{' '}
                                                            <a
                                                                href="mailto:ods8thgrade@gmail.com"
                                                                className="text-xs/6 font-semibold text-sky-700 underline hover:text-slate-700"
                                                            >
                                                                ods8thgrade@gmail.com
                                                            </a>{' '}
                                                            if you have any questions about these
                                                            guidelines. Thank you.
                                                        </p>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                                {touchedFields.recentPicture && errors.recentPicture && (
                                    <p className="text-xs/6 text-rose-600">
                                        {errors.recentPicture.message}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-1 mt-3 lg:col-span-2 lg:mt-0">
                                {preview.recentPicture && (
                                    <div className="relative mt-2 text-center">
                                        <Image
                                            src={preview.recentPicture}
                                            alt="File preview"
                                            height={250}
                                            width={250}
                                            className="rounded-lg object-cover shadow-xs"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* message */}
                    <div className="mb-12 flex flex-col justify-start space-y-6 rounded-lg border border-slate-200 bg-slate-100 p-6">
                        <ol className="mb-6 w-full items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8">
                            <li className="flex items-center space-x-2.5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500">
                                    <h3 className="font-semibold text-white">4</h3>
                                </span>
                                <h3 className="leading-tight font-bold">Message</h3>
                            </li>
                        </ol>
                        <div className="flex flex-col space-y-1">
                            <label className="text-base" htmlFor="message">
                                Write a short message to your child.{' '}
                                <span className="italic">(optional)</span>
                            </label>
                            <div className="relative">
                                {touchedFields.message && errors.message && (
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                                        <ExclamationCircleIcon className="size-7 text-rose-600" />
                                    </div>
                                )}
                                <textarea
                                    name="message"
                                    {...register('message')}
                                    placeholder=""
                                    maxLength={250}
                                    className={clsx(
                                        'w-full rounded-lg border bg-white p-4 placeholder:text-sm placeholder:font-light placeholder:text-slate-500 placeholder:italic focus:outline',
                                        touchedFields.message && errors.message
                                            ? 'border-rose-500 focus:border-rose-500 focus:outline-rose-500'
                                            : 'border-slate-200 focus:border-cyan-500 focus:outline-cyan-500'
                                    )}
                                />
                                <p className="ms-2 text-xs/5 text-slate-600">
                                    250 characters (1-2 lines) maximum
                                </p>
                            </div>
                            {touchedFields.message && errors.message && (
                                <p className="text-xs/6 text-rose-600">{errors.message.message}</p>
                            )}
                        </div>
                    </div>

                    {/* parent info */}
                    <div className="mb-12 flex flex-col justify-start space-y-6 rounded-lg border border-slate-200 bg-slate-100 p-6">
                        <ol className="mb-6 w-full items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8">
                            <li className="flex items-center space-x-2.5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500">
                                    <h3 className="font-semibold text-white">5</h3>
                                </span>
                                <h3 className="leading-tight font-bold">Parent information</h3>
                            </li>
                        </ol>

                        {/* name */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-base" htmlFor="parentName">
                                Parent or guardian name:
                            </label>
                            <div className="relative">
                                {touchedFields.parentName && errors.parentName && (
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                                        <ExclamationCircleIcon className="size-7 text-rose-600" />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    name="parentName"
                                    {...register('parentName')}
                                    className={clsx(
                                        'w-full rounded-lg border bg-white p-2 focus:outline',
                                        touchedFields.parentName && errors.parentName
                                            ? 'border-rose-500 focus:border-rose-500 focus:outline-rose-500'
                                            : 'border-slate-200 focus:border-cyan-500 focus:outline-cyan-500'
                                    )}
                                />
                            </div>
                            {touchedFields.parentName && errors.parentName && (
                                <p className="text-xs/6 text-rose-600">
                                    {errors.parentName.message}
                                </p>
                            )}
                        </div>

                        {/* email */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-base" htmlFor="parentEmail">
                                Email address:
                            </label>
                            <div className="relative">
                                {touchedFields.parentEmail && errors.parentEmail && (
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                                        <ExclamationCircleIcon className="size-7 text-rose-600" />
                                    </div>
                                )}
                                <input
                                    type="email"
                                    name="parentEmail"
                                    {...register('parentEmail')}
                                    className={clsx(
                                        'w-full rounded-lg border bg-white p-2 focus:outline',
                                        touchedFields.parentEmail && errors.parentEmail
                                            ? 'border-rose-500 focus:border-rose-500 focus:outline-rose-500'
                                            : 'border-slate-200 focus:border-cyan-500 focus:outline-cyan-500'
                                    )}
                                />
                            </div>
                            {touchedFields.parentEmail && errors.parentEmail && (
                                <p className="text-xs/6 text-rose-600">
                                    {errors.parentEmail.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* submit */}
                    <div className="mb-12 flex flex-col justify-start space-y-6 rounded-lg border border-slate-200 bg-slate-100 p-6">
                        {/* content */}
                        <div className="flex gap-3">
                            <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                    <input
                                        type="checkbox"
                                        name="content"
                                        {...register('content')}
                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-slate-400 bg-white checked:border-cyan-500 checked:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 forced-colors:appearance-auto"
                                    />

                                    <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                    >
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                        />
                                        <path
                                            d="M3 7H11"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-base/6 text-pretty">
                                <label htmlFor="content">
                                    <span className='pe-1'>I have read and complied with the </span>
                                    <Popover>
                                        <PopoverTrigger>
                                            Photograph content guidelines.
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverClose />
                                            <div className="flex flex-col space-y-3">
                                                <h4 className="text-lg font-semibold">
                                                    Photograph content guidelines
                                                </h4>
                                                <p className="text-sm/6">
                                                    To protect the privacy and well-being of all
                                                    students, please follow these guidelines when
                                                    choosing a photograph to upload:
                                                </p>
                                                <ol className="list-inside list-decimal space-y-3 text-sm/6">
                                                    <li>
                                                        Only your child or children should be
                                                        identifiable. Do not include other children,
                                                        unless they are in the background and not
                                                        easily recognizable.
                                                    </li>
                                                    <li>
                                                        Children must be fully clothed. No form of
                                                        nudity (even in baby photographs) is
                                                        allowed.
                                                    </li>
                                                    <li>
                                                        Do not include any imagery or language which
                                                        may be considered vulgar, suggestive, or
                                                        offensive.
                                                    </li>
                                                    <li>
                                                        Please avoid the use of heavy flters or
                                                        digital effects that change how your child
                                                        looks.
                                                    </li>
                                                    <li>
                                                        Please do not upload a photograph which may
                                                        embarass your child when viewed by all of
                                                        their friends.
                                                    </li>
                                                </ol>
                                                <p className="text-sm/6">
                                                    Contact{' '}
                                                    <a
                                                        href="mailto:ods8thgrade@gmail.com"
                                                        className="text-xs/6 font-semibold text-sky-700 underline hover:text-slate-700"
                                                    >
                                                        ods8thgrade@gmail.com
                                                    </a>{' '}
                                                    if you have any questions about these
                                                    guidelines. Thank you.
                                                </p>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </label>
                                {errors.content && (
                                    <p className="text-xs/6 text-rose-600">
                                        {errors.content.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* consent */}
                        <div className="flex gap-3">
                            <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        {...register('consent')}
                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-slate-400 bg-white checked:border-cyan-500 checked:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 forced-colors:appearance-auto"
                                    />

                                    <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                    >
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                        />
                                        <path
                                            d="M3 7H11"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-base/6 text-pretty">
                                <label htmlFor="consent">
                                    I give permission to include my child's name and the two
                                    photographs uploaded through this form in the 8th Grade "Beyond
                                    the Sea" Dance slideshow presentation on June 7, 2025. This
                                    presentation may be viewed by students, volunteers, and staff
                                    present at the event.
                                </label>
                                {errors.consent && (
                                    <p className="text-xs/6 text-rose-600">
                                        {errors.consent.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-x-6">
                            {/* <button type="button" className="Button__Link text-lg text-slate-700">
                                Reset form&nbsp;
                                <svg
                                    className="HoverArrow"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    aria-hidden="true"
                                >
                                    <g fillRule="evenodd">
                                        <path className="HoverArrow__linePath" d="M0 5h7"></path>
                                        <path
                                            className="HoverArrow__tipPath"
                                            d="M1 1l4 4-4 4"
                                        ></path>
                                    </g>
                                </svg>
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="Button rounded-lg bg-gradient-to-b from-amber-400 via-orange-400 to-red-500 px-3 py-2 text-lg text-white shadow-xs transition hover:-translate-y-0.5 hover:bg-pink-600 focus:outline-2 focus:outline-offset-2 focus:outline-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 active:bg-pink-700"
                            >
                                {isSubmitting ? 'Uploading...' : 'Submit Form'}
                            </button> */}
                        </div>

                        <Dialog>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Please wait while your files upload...
                                    </DialogTitle>
                                    <DialogDescription>
                                        Please do not close this window while the form is
                                        processing.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mb-20 flex flex-col space-y-12 rounded-lg bg-white px-6 py-6">
                                    <div className="flex flex-row">
                                        <div>
                                            <PhotoIcon className="h-10 w-10 text-slate-400" />
                                        </div>
                                        <div className="flex grow flex-col space-y-0 px-3">
                                            <p className="text-sm text-slate-700">
                                                File 1 ... Uploading
                                            </p>
                                            <progress
                                                value="25"
                                                max="100"
                                                className="w-full [&::-moz-progress-bar]:bg-cyan-500 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-cyan-500 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
                                            ></progress>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="flex cursor-pointer items-start"
                                            >
                                                {' '}
                                                <CheckCircleIcon className="mt-3 h-7 w-7 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div>
                                            <PhotoIcon className="h-10 w-10 text-slate-400" />
                                        </div>
                                        <div className="flex grow flex-col space-y-0 px-3">
                                            <p className="text-sm text-slate-700">
                                                File 2 ... Uploading
                                            </p>
                                            <progress
                                                value="25"
                                                max="100"
                                                className="w-full [&::-moz-progress-bar]:bg-cyan-500 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-cyan-500 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
                                            ></progress>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="flex cursor-pointer items-start"
                                            >
                                                {' '}
                                                <CheckCircleIcon className="mt-3 h-7 w-7 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <AnimatePresence>
                            {isSubmitting && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="overflow-hidden rounded p-4"
                                >
                                    <div className="flex w-full flex-row items-center space-x-2 rounded-lg bg-white px-2 py-3">
                                        <PhotoIcon className="size-10 text-slate-400" />
                                        <div className="flex grow flex-col space-y-1">
                                            <span className="text-xs">File 1 ... Uploading</span>
                                            <progress
                                                value="25"
                                                max="100"
                                                className="w-full [&::-moz-progress-bar]:bg-cyan-500 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-cyan-500 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
                                            ></progress>
                                        </div>
                                        <button
                                            type="button"
                                            className="flex h-full w-7 cursor-pointer items-start"
                                        >
                                            {' '}
                                            <CheckCircleIcon className="size-7 text-slate-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </form>
        </div>
    )
}
