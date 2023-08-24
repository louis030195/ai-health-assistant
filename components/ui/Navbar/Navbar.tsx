import Link from 'next/link';
import { createServerSupabaseClient } from '@/app/supabase-server';
import Logo from '@/components/icons/Logo';
import SignOutButton from './SignOutButton';
import Image from 'next/image';
import s from './Navbar.module.css';
import GitHub from '@/components/icons/GitHub';
import Discord from '@/components/icons/Discord';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

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
              <Image src="/logo.png" alt="mediar" width="50" height="50" />
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
            {/* Mobile view */}
            <div className="lg:hidden">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger><Menu className="mr-2 h-4 w-4 text-black" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel> Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/dashboard" className={s.link}>
                        <LayoutDashboard className="mr-2 h-4 w-4 text-black" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/account" className={s.link}>
                        <User className="mr-2 h-4 w-4 text-black" /> Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/pricing" className={s.link}>
                        <CreditCard className="mr-2 h-4 w-4 text-black" /> Pricing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4 text-black" /><SignOutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/signin" className={s.link}>
                  Sign in
                </Link>
              )}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:flex lg:gap-4">
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
      </div>
    </nav>
  );
}
