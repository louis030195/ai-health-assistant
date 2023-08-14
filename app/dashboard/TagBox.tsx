'use client'
import { Input } from '@/components/ui/input';
import { Database } from '@/types_db';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const emotions = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Anxious', 'Excited', 'Bored', 'Neutral', 'Meditation', 'Just drank coffee', 'Drank tea'];

const randomPlaceholders = [
    "i am a bit down today...",
    "i am a bit anxious today...",
    "shouldn't have drank that much coffee...",
    "im exploding of energy",
    "so happy today",
]

interface Props {
    session: Session
    className?: string
}

const TagBox = ({ session, className }: Props) => {
    const supabase = createClientComponentClient<Database>()

    const [inputValue, setInputValue] = useState("");

    const handleEmotionClick = (emotion: string) => {
        setInputValue(`i feel ${emotion.toLowerCase()} today`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        const data = {
            text: inputValue,
            user_id: session.user.id,
        }
        const p = new Promise<void>(async (resolve, reject) => {
            const { error } = await supabase.from('tags').insert(data)
            if (error) return reject(error)
            resolve()
        })
        toast.promise(p, {
            loading: 'Saving...',
            success: 'Saved!',
            error: 'Could not save.',
        }).finally(() => setInputValue(""))
    };

    return (
        <div className={`${className} p-4 bg-white rounded shadow-md max-w-sm`}>
            <Toaster />
            <h1 className="text-black text-2xl font-bold mb-4">What are you up to?</h1>
            <p className="text-gray-500 mb-2 text-sm">
                It will be associated to your health records and let our AI know you better</p>
            <div className="flex flex-wrap overflow-x-auto gap-2 mb-4 whitespace-nowrap">
                {emotions.map((emotion) => (
                    <span
                        key={emotion}
                        onClick={() => handleEmotionClick(emotion)}
                        className="cursor-pointer inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                        {emotion}
                    </span>
                ))}
            </div>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                placeholder={
                    randomPlaceholders[Math.floor(Math.random() * randomPlaceholders.length)]
                }
            />
            <button onClick={handleSubmit}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded"
            >Confirm</button>
        </div>
    );
};

export default TagBox;
