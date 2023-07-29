'use client'
import { FC, useState } from 'react'
import { Button } from './button'
import { Input } from './Input'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from './use-toast'
import { useRouter } from 'next/navigation'
import { Label } from './label'

interface Props { }

const SignUpForm: FC<Props> = () => {
    const supabase = createClientComponentClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { toast } = useToast()
    const router = useRouter()

    const signUp = async () => {
        const { data, error } = await supabase.auth.signUp({
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
        const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error2) {
            return toast({
                title: 'Error',
                description: error2.message,
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
        router.push('/dashboard')

    }

    return (
        <div className="flex flex-col justify-between max-w-lg p-6 mx-auto w-80">
            {/* <div className="flex justify-center pb-12">
                <img src="/logo.png" alt="logo" className="mx-auto w-16 h-16" />
            </div> */}

            <div className="flex flex-col">

                <form className="w-full">

                    <div className="flex flex-col space-y-2">

                        <div>
                            <Label className="block font-medium text-gray-600">Email</Label>
                            <Input
                                type="email"
                                placeholder="Email"
                                className="border p-2 rounded w-full text-black"
                            />
                        </div>

                        <div>
                            <Label className="block font-medium text-gray-600">Password</Label>
                            <Input
                                type="password"
                                placeholder="Password"
                                className="border p-2 rounded w-full text-black"
                            />
                        </div>

                    </div>

                    <Button
                        type="submit"
                        className='w-full mt-4'
                        onClick={signUp}
                    >
                        Sign Up
                    </Button>

                    <div className="flex items-center justify-between">
                        <div className="border-b w-full" />
                        <div className="text-xs text-gray-500 px-2">or</div>
                        <div className="border-b w-full" />
                    </div>

                    <a
                        href="#signin"
                        className="block text-center text-blue-500 hover:underline"
                    >
                        Already have an account? Sign in
                    </a>

                </form>

                {/* <p className="text-sm text-gray-500">
                    Check email for confirmation
                </p> */}

                {/* <p className="text-sm text-red-500">
                    Can only request every 30 seconds
                </p> */}

            </div>
        </div>
    )
}

export default SignUpForm