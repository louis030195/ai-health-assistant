import Link from 'next/link';
import { createServerSupabaseClient } from '@/app/supabase-server';

import Logo from '@/components/icons/Logo';
import SignOutButton from './SignOutButton';
import Image from 'next/image';
import s from './Navbar.module.css';
import GitHub from '@/components/icons/GitHub';
import Discord from '@/components/icons/Discord';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <nav className={s.root}>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">
              {/* <Logo /> */}
              <Image
                // center 
                className="mx-auto"
                src="/logo.png" alt="neurosity" width="64" height="64"
              />
            </Link>
            <nav className="hidden ml-6 space-x-2 lg:block">
              {session && (
                <Link href="/dashboard" className={s.link}>
                  Dashboard
                </Link>
              )}

              <Link href="/pricing" className={s.link}>
                Pricing
              </Link>

              {session && (
                <Link href="/account" className={s.link}>
                  Account
                </Link>
              )}
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            <Link href="https://discord.gg/pFKpxYpZEa" className={s.link}>
              <Discord />
            </Link>
            {session ? (
              <SignOutButton />
            ) : (
              <Link href="/signin" className={s.link}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
