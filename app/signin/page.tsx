import { getOnboarding, getSession } from '@/app/supabase-server';
import AuthUI from './AuthUI';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    const onBoarding = await getOnboarding(session.user.id);
    console.log('onBoarding', onBoarding);
    if (!onBoarding || onBoarding.length === 0) return redirect('/onboarding/intro');
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
        <AuthUI />
      </div>
    </div>
  );
}
