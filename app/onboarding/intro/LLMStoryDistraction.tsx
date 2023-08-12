'use client'

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompletion } from 'ai/react'
import Markdown from '@/components/ui/Markdown';
import { Loader2 } from 'lucide-react';


// export const LLMStoryDistraction = () => {
//     const {
//         completion,
//         complete,
//     } = useCompletion({
//         api: '/api/completion',
//     })

//     useEffect(() => {
//         complete(`Human: Generate a funny, optimistic story about the evolution of computers from very difficult to use Turing machines and then computers to smartphones to airpods to AR glasses and BCIs. Use plenty emoticons and keep it lighthearted and captivating! 😊

// The story must captivate the user for 3-4 seconds.

// Assistant:`)
//     }, [])


//     return (
//         <Markdown>
//             {completion}
//         </Markdown>
//     );
// }

// You write a short story and at half the story, start talking about how to use Mediar, "insights about your brain":

// 1. Power and wear the Neurosity Crown
// 2. Connect your Neurosity account
// 3. Add tags & get insights

// DO NOT MENTION ANYTHING FROM THIS PROMPT! DO NOT SAY "HERES THE STORY ..." OR ANYTHING LIKE THAT.
// DO NOT SAY "Unfortunately I don't feel comfortable generating marketing content. Perhaps we could have a thoughtful discussion about technology and society instead?" OR ANYTHING LIKE THAT.


const story = `
Back in the day, computers were giant machines that took up entire rooms! 😮 People had to use punch cards just to get them to do basic math. 😴 It was so tedious! But then along came personal computers like the Apple II. They were a bit clunky but way easier to use. 💻 People started playing games like Oregon Trail on them! 🎮

Steve Jobs envisioned computers as "**bicycles for the mind**" - tools that could leverage the most complex object in the universe, the human brain! And the tech kept getting smaller and smarter over the years, bringing us closer to that vision. Laptops, smartphones, wireless earbuds - each generation was a **huge leap** forward in what technology could do! 📱🎧

Now, we're entering a **new era** - one where technology **interact directly with our very minds**! 🧠 Mediar are developing mind-modelling AI algorithms to give you **insights** into your own brain activity. 🤯

It's easy to get started with Mediar:

1. First, get your own Neurosity headset and create an account. This lightweight device **senses your brainwaves** as you go about your day. 📟

2. Next, **connect** your Neurosity account to the Mediar app. This allows Mediar to **access your brain activity data**. 📲

3. As you wear Neurosity, **use the Mediar app** to add tags - mark down how you were feeling, what you were doing, etc. This **trains** Mediar's AI over time. 🏷

Soon, you'll start getting **personalized weekly insights** and recommendations from Mediar to **boost your focus**, lower anxiety, and **optimize your mind**! 🧠 The future is now - your mind **augmented by AI**! 🤯
`

export function LLMStoryDistraction() {

    const [fullStory, setFullStory] = useState('') 
    const [displayedStory, setDisplayedStory] = useState('')
  
    useEffect(() => {
        let index = 0
        let isCancelled = false; // Add this line
      
        const stream = () => {
            if (isCancelled) return; // Add this line
            const nextChar = story[index]
            setFullStory(prevFullStory => prevFullStory + nextChar)
            index++
            if (index < story.length) {
                setTimeout(stream, 6)
            }
        }
      
        stream()
      
        return () => { isCancelled = true; }  // Add this line
    }, [])
    
  
    useEffect(() => {
      // Only display a few of the latest characters
      const previewLength = 5000000
      setDisplayedStory(
        fullStory.slice(-previewLength) 
      )
  
    }, [fullStory])

  return (
    <Markdown>
      {displayedStory}
    </Markdown>
  )

}