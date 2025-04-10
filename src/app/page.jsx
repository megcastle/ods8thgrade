import Image from 'next/image'
import Form from '@/components/form'

export default function Home() {
    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-col justify-start space-y-6 px-3 pt-3 sm:pt-6 lg:px-0">
                    <div className="flex flex-col space-y-0">
                        <div className="group/row relative isolate flex justify-between pt-[calc(--spacing(2)+1px)] last:pb-[calc(--spacing(2)+1px)]">
                            <div className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2">
                                <div className="absolute inset-x-0 top-0 border-t border-white/10"></div>
                                <div className="absolute inset-x-0 top-2 border-t border-white/10"></div>
                                <div className="absolute inset-x-0 bottom-0 border-b border-white/10 group-last/row:block"></div>
                                <div className="absolute inset-x-0 bottom-2 border-b border-white/10 group-last/row:block"></div>
                            </div>
                            <div className="relative flex-1">
                                <h1 className="proxima absolute inset-x-0 top-0 left-0 my-0 pt-3 pb-5 text-center text-5xl font-black text-white/25 lg:text-left lg:text-7xl">
                                    Beyond the Sea
                                </h1>
                                <h1 className="proxima my-0 bg-gradient-to-t from-white/10 via-white/50 to-white bg-clip-text pt-3 pb-5 text-center text-5xl font-black text-transparent lg:text-left lg:text-7xl">
                                    Beyond the Sea
                                </h1>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="proxima mt-0 pt-0 text-center text-2xl font-thin text-amber-400 lg:text-left lg:text-4xl">
                                ODS 8TH Grade Dance Slideshow
                            </h2>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-7">
                        <div className="col-span-1 lg:col-span-3">
                            <div className="flex flex-col space-y-6">
                               
                            </div>
                        </div>
                        <div className="col-span-1 lg:col-span-4">
                        <div className="-m-2 grid grid-cols-1 rounded-2xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 w-full mx-auto ">
                            <div className="grid grid-cols-1 rounded-2xl p-2 shadow-md shadow-black/5">
                                <div className="rounded-xl bg-white/95 p-6 lg:p-12 pb-9 shadow-2xl ring-1 ring-black/5 backdrop-opacity-10">
                                  
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="">

                    </div>
                </div>
            </div>
        </>
    )
}
