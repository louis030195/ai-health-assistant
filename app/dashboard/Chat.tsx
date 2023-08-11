'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import toast from 'react-hot-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/20/solid'

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        onError: err => {
            toast.error(err.message)
        }
    })


    return (
        <div className="flex flex-col w-full">
            <div className={`fixed top-1/4 left-5 flex flex-col w-1/4 h-1/2 p-4 overflow-y-auto bg-grey-50 shadow border-r border-gray-200 transition-all duration-300 rounded-lg`}>
                <ScrollArea>
                    {
                        messages.map(m => (
                            <div key={m.id} className="whitespace-pre-wrap text-black mb-4">
                                {m.role === 'user' ? 'User: ' : 'AI: '}
                                {m.content}
                            </div>
                        ))
                    }
                </ScrollArea>
            </div>

            <div className="flex">
                <form className="fixed top-1/4 left-5 w-1/4 mt-8 rounded shadow-xl text-black" onSubmit={handleSubmit}>
                    <Input
                        value={input}
                        placeholder="Say something..."
                        onChange={handleInputChange}
                    />
                </form>
            </div>
        </div>
    )
}
