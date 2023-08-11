import { getOnboarding, getSession } from '@/app/supabase-server';
import AuthUI from './AuthUI';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import SignUpForm from '@/app/signup/SignUpForm';
import SignInForm from '@/app/signin/SignInForm';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    const hasOnboarded = await getOnboarding(session.user.id);
    console.log('hasOnboarded', hasOnboarded);
    if (!hasOnboarded) return redirect('/onboarding/intro');
    return redirect('/dashboard');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          {/* <Logo width="64px" height="64px" /> */}
          <Image
            // center 
            className="mx-auto"
            src="/logo.png" alt="neurosity" width="64" height="64"
          />
        </div>
        {/* <Login /> */}
        <AuthUI />
        {/* <SignInForm />  */}
      </div>
    </div>
  );
}


import Link from 'next/link'
import Messages from './messages'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Login() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action="/auth/sign-in"
        method="post"
      >
        <Label className="text-md text-gray-500" htmlFor="email">
          Email
        </Label>
        <Input
          className="rounded-md px-4 py-2 bg-inherit border mb-6 text-gray-500"
          name="email"
          placeholder="you@example.com"
          required
        />
        <Label className="text-md text-gray-500" htmlFor="password">
          Password
        </Label>
        <Input
          className="rounded-md px-4 py-2 bg-inherit border mb-6 text-gray-500"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button className="rounded px-4 py-2 text-white mb-2">
          Sign In
        </Button>
        <Button
          formAction="/auth/sign-up"
          className="border bg-indigo-600 border-gray-700 rounded px-4 py-2 mb-2"
        >
          Sign Up
        </Button>
        <Messages />
      </form>
    </div>
  )
}