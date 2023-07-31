'use client'
import { FC, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '../../components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Label } from '../../components/ui/label'
import { getURL } from '@/utils/helpers'
import posthog from 'posthog-js'
import { Icons } from '@/components/ui/icons'

interface Props { }

const SignInForm: FC<Props> = () => {
    const supabase = createClientComponentClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            return toast({
                title: 'Error',
                description: error.message,
                // status: 'error',
                duration: 5000,
                // isClosable: true,
            })
        }
        toast({
            title: 'Success',
            description: 'Signed in successfully',
            // status: 'success',
            duration: 5000,
            // isClosable: true,
        })
        posthog.capture('sign in', {
            email: data.user?.email,
        })
        router.push('/dashboard')

    }

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${getURL()}/dashboard` }
        })

        if (error) {
            return toast({
                title: 'Error',
                description: error.message,
                // status: 'error',
                duration: 5000,
                // isClosable: true,
            })
        }
    }


    return (
        <div className="flex flex-col justify-between max-w-lg p-6 mx-auto w-80">
            {/* <div className="flex justify-center pb-12">
                <img src="/logo.png" alt="logo" className="mx-auto w-16 h-16" />
            </div> */}

            <div className="flex flex-col">

                <form className="w-full">

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
                        Sign In
                    </Button>

                    <div className="flex items-center justify-between">
                        <div className="border-b w-full" />
                        <div className="text-xs text-gray-500 px-2">or</div>
                        <div className="border-b w-full" />
                    </div>

                    <a
                        href="/signup"
                        className="block text-center text-gray-500 hover:underline"
                    >
                        Don't have an account? Sign up
                    </a>

                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button variant="outline" type="button" disabled={isLoading} onClick={signInWithGoogle}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}{" "}
                    Google
                </Button>
            </div>
        </div>
    )
}

export default SignInForm