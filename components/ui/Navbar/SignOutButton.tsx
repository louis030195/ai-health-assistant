'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

import s from './Navbar.module.css';
import { Neurosity } from '@neurosity/sdk';
const neurosity = new Neurosity()
export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  return (
    <button
      className={s.link}
      onClick={async () => {
        await supabase.auth.signOut();
        await neurosity.logout();
        localStorage.removeItem('access_token');
        router.push('/signin');
      }}
    >
      Sign out
    </button>
  );
}
