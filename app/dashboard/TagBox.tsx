'use client'
import { Input } from '@/components/ui/Input';
import { Database } from '@/types_db';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// const tags = ['anxiety', 'happy', 'tag3', 'tag4']; // Replace with your tags

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
    // const [selectedTags, setSelectedTags] = useState([]);

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    // const handleTagClick = (tag) => {
    //     setSelectedTags((prevTags) => [...prevTags, tag]);
    // };

    const handleSubmit = async () => {
        // Process the selected tags and input here
        console.log("Input Value: ", inputValue);
        // console.log("Selected Tags: ", selectedTags);
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
        <div className={`${className} p-4 bg-white rounded shadow-md`}>
            <Toaster />
            <h1 className="text-black text-2xl font-bold mb-4">What you are up to?</h1>
            <p className="text-gray-500 mb-2 text-sm">
                It will be associated to your brain records and let our AI know you better</p>
            {/* <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`py-1 px-2 rounded bg-blue-500 text-white ${selectedTags.includes(tag) ? 'opacity-50' : ''}`}
                    >
                        {tag}
                    </button>
                ))}
            </div> */}
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                placeholder={
                    // random pick
                    randomPlaceholders[Math.floor(Math.random() * randomPlaceholders.length)]
                }
            />
            <button onClick={handleSubmit} className="w-full py-2 px-4 bg-indigo-600 text-white rounded">Confirm</button>
        </div>
    );
};

export default TagBox;
