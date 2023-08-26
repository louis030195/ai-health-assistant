'use client'
import { useEffect, useState } from "react"

const defaultSteps = [
    { id: '1. Intro', name: 'Intro', href: '/onboarding/intro', status: 'current' },
    { id: '2. 🧠 Setup Neurosity', name: 'Neurosity', href: '/onboarding/neurosity', status: 'upcoming' },
    { id: '3. ❤️😴 Setup Ouraring', name: 'Ouraring', href: '/onboarding/oura', status: 'upcoming' },
    { id: '3. 📲 Setup Telegram', name: 'Telegram', href: '/onboarding/telegram', status: 'upcoming' },
    { id: '4. 👉 Finish', name: 'Finish', href: '/dashboard', status: 'upcoming' },
]

export default function Example({ className, onEnd }: { className?: string, onEnd?: () => void }) {
    const [steps, setSteps] = useState(defaultSteps)
    // when the path change, update the steps
    useEffect(() => {
        const currentPath = window.location.pathname;
        const updatedSteps = steps.map((step, i) => {
            if (step.href === currentPath) {
                return { ...step, status: 'current' };
                // inferior in the list index
            } else if (i < steps.findIndex(step => step.href === currentPath)) {
                return { ...step, status: 'complete' };
            } else {
                return { ...step, status: 'upcoming' };
            }
        });
        setSteps(updatedSteps);

    }, [window.location.pathname]);
    return (
        // opacity 80
        <nav aria-label="Progress" className={"w-3/4 mx-auto bg-white rounded-lg shadow-md p-6  flex-col space-y-5 opacity-95 " + className}>
            <div className="border-b-2 border-gray-200 mb-5"></div>

            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, i) => (
                    <li key={step.name} className="md:flex-1">
                        {step.status === 'complete' ? (
                            <a
                                href={step.href}
                                onClick={() => i === steps.length - 1 && onEnd && onEnd()}
                                className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                            >
                                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">{step.id}</span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </a>
                        ) : step.status === 'current' ? (
                            <a
                                href={step.href}
                                onClick={() => i === steps.length - 1 && onEnd && onEnd()}
                                className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                                aria-current="step"
                            >
                                <span className="text-sm font-medium text-indigo-600">{step.id}</span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </a>
                        ) : (
                            <a
                                href={step.href}
                                onClick={() => i === steps.length - 1 && onEnd && onEnd()}
                                className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                            >
                                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{step.id}</span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </a>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
