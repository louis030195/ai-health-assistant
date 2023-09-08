'use client'

import React, { useEffect, useState } from 'react';
import Markdown from '@/components/ui/Markdown';


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


const story = `Have you ever wished for a personal assistant who really **gets** you? 💭 Someone who looks out for your health 24/7? An advisor who sends you **personalized insights** to help you sleep better 😴, eat healthier ✅, exercise smarter 💪, and boost your mental wellbeing 🧠?

Well the future is now! AI like Mediar can **interact directly with your body and mind**. 🤯 It reads your health data and learns your habits over time. Then it provides **tailored recommendations** to help you **upgrade** your whole lifestyle. 🆙 

This is a **new era** where technology **leverages** our brains instead of vice versa. Steve Jobs envisioned computers as "**bicycles for the mind**" after all! The tech has evolved from giant machines 😮 to smartphones to wearables **seamlessly integrated** into our lives. 📱

Mediar will be your own **personal 24/7 health advisor** to chat with anytime. Let's look forward to a future where AI truly **understands** us! 🤖🤝🧑`


export function LLMStoryDistraction({className}: {className?: string}) {

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
    <Markdown className={"" + className}>
      {displayedStory}
    </Markdown>
  )

}