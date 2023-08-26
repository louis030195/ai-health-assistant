'use client'
import { FC, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Label } from '../../components/ui/label'
import { getURL } from '@/utils/helpers'
import posthog from 'posthog-js'
import { Icons } from '@/components/ui/icons'
import toast, { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { H } from '@highlight-run/next/client';

interface Props { }

const SignInForm: FC<Props> = () => {
    const supabase = createClientComponentClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const baseUrl = getURL().replace(/\/$/, '')

    const signIn = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            H.consumeError(error)
            return toast.error(error.message)
        }
        setIsLoading(false)
        toast.success('Signed in successfully')
        posthog.capture('sign in', {
            email: data.user?.email,
        })
        router.push('/dashboard')

    }

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: baseUrl + '/auth/callback',

                // redirectTo: `${getURL()}/auth/callback`
            }
        })

        posthog.capture('sign in')
        if (error) {
            H.consumeError(error)
            return toast.error(error.message)
        }
    }
    const signInWithTwitter = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: baseUrl + '/auth/callback',
                // redirectTo: `${getURL()}/auth/callback` 
            }
        })

        if (error) {
            H.consumeError(error)
            return toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col justify-between max-w-lg p-6 mx-auto w-80">
            {/* <div className="flex justify-center pb-12">
                <img src="/logo.png" alt="logo" className="mx-auto w-16 h-16" />
            </div> */}
            <Toaster />

            <div className="flex flex-col">

                {/* <form className="w-full"> */}

                <div className="flex flex-col space-y-2">

                    <div className="flex flex-col space-y-1">
                        <Label className="block font-medium text-gray-600">Email</Label>
                        <Input
                            type="email"
                            placeholder="Email"
                            className="border p-2 rounded w-full text-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label className="block font-medium text-gray-600">Password</Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            className="border p-2 rounded w-full text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                </div>

                <Button
                    type="submit"
                    className='w-full mt-4'
                    onClick={signIn}
                >
                    {
                        isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    }
                    Sign In
                </Button>

                {/* display a small text saying "its not possible to create a mail account anymore" */}
                <p className="text-gray-500 mt-4 text-sm text-center">
                    It is not possible to create a new account with email and password anymore.
                    Please use Google to sign up.
                </p>

                <div className="flex items-center justify-between">
                    <div className="border-b w-full" />
                    <div className="text-xs text-gray-500 px-2">or</div>
                    <div className="border-b w-full" />
                </div>

                {/* <a
                    href="/signup"
                    className="block text-center text-gray-500 hover:underline"
                >
                    Don't have an account? Sign up
                </a> */}

                {/* </form> */}

                <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button
                    className="text-black"
                    variant="outline"
                    disabled={isLoading} onClick={signInWithGoogle}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="h-4 w-4" />
                    )}{" "}
                </Button>

                {/* <Button
                    className="text-black"
                    variant="outline"
                    disabled={isLoading} onClick={signInWithTwitter}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.twitter className="mr-2 h-4 w-4" />
                    )}{" "}
                    Twitter
                </Button> */}
            </div>
        </div>
    )
}

export default SignInForm