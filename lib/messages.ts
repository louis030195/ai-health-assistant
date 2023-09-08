const quotes = [
    "✨ Small daily improvements add up to big results over time. Keep logging your health data with Mediar!",
  
    "💫 The journey of a thousand miles begins with a single step. Start optimizing your wellbeing today!",
  
    "🌼 Your health data is beautiful and unique. Mediar will help you understand your patterns better.",
  
    "💯 Progress requires patience. Stick with tracking your health, you've got this!",
  
    "🤝 Mediar is here to help you unlock your best self. We're in this together!",
  
    "🌻 Wellbeing takes work, but it's worth it. Keep striving for health!",
  
    "🙌 The body and mind achieve what they believe. Believe in yourself and your health goals!"
  ]

export const tagMessage = `Got it! I've recorded your tag. Keep sending me more tags it will help me understand you better.
I can also read your wearable data, make sure to install Mediar iOS app, I can give you better insights about your mind and body.
            
${quotes[Math.floor(Math.random() * quotes.length)]}`


export const imageTagMessage = (caption: string) => `I see in your image "${caption}". I've recorded that tag for you and associated this to your health data.
Feel free to send me more images and I'll try to understand them! Any feedback appreciated ❤️!
${quotes[Math.floor(Math.random() * quotes.length)]}`


export const feedbackMessage = `Thank you for your feedback! We appreciate your input and will use it to improve our service. Feel free to send us more feedback anytime!

${quotes[Math.floor(Math.random() * quotes.length)]}`

export const defaultUnclassifiedMessage = `I'm sorry it seems you didn't ask a question neither tag an event from your life. My sole purpose at the moment is to associate tags related to what is happening in your life to your health data from your wearables.
You can send me messages like "just ate an apple", or "just had a fight with my wife", or "im sad", or "so low energy tday..".
This way I will better understand how your body works, and give you better insights about it. I can also answer questions like "how can i be more productive?" or "how can i improve my sleep?".

${quotes[Math.floor(Math.random() * quotes.length)]}`

