'use client';

import { MobileNav } from '@/components/mobile-nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Suspense } from 'react';

export function Header() {
    const { scrollY } = useScroll();

    // Transform header background opacity based on scroll position
    const headerBgOpacity = useTransform(scrollY, [0, 50], [0.3, 0.8]);
    const headerBlur = useTransform(scrollY, [0, 50], [8, 16]);
    const headerBorderOpacity = useTransform(scrollY, [0, 50], [0.2, 0.3]);

    return (
        <>
            <motion.header
                className={cn(
                    'fixed top-0 right-0 left-0 z-50 flex items-center justify-between',
                    'border-b border-white/20 bg-black px-4 py-4 transition-all duration-300',
                    'sm:px-8',
                )}
                style={{
                    backgroundColor: `rgba(0, 0, 0, ${headerBgOpacity.get()})`,
                    backdropFilter: `blur(${headerBlur.get()}px)`,
                    borderBottomColor: `rgba(255, 255, 255, ${headerBorderOpacity.get()})`,
                }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                }}
            >
                <Link href="/" className="group flex items-center gap-2 transition-all">
                    <motion.div
                        className="text-xl font-bold"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        ChillFlow
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <motion.nav
                    className="hidden items-center gap-1 md:flex md:gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                >
                    <Suspense fallback={<AuthLoadingSkeleton />}>
                        <SignedOut>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <SignInButton mode="modal">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-2.5 text-sm transition-all hover:bg-white/10 sm:px-4"
                                    >
                                        Login
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white/20 bg-white/10 px-2.5 text-sm transition-all hover:bg-white/20 sm:px-4"
                                    >
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link href="/dashboard">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-3 text-sm transition-all hover:bg-white/10 sm:px-4"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox:
                                                'h-8 w-8 rounded-full ring-2 ring-white/20 hover:ring-white/40 transition-all',
                                        },
                                        variables: {
                                            fontFamily: 'var(--font-sans)',
                                        },
                                    }}
                                />
                            </div>
                        </SignedIn>
                    </Suspense>
                </motion.nav>

                {/* Mobile Navigation */}
                <div className="flex md:hidden">
                    <MobileNav />
                </div>
            </motion.header>
            <div className="h-[72px]" aria-hidden="true" />
        </>
    );
}

function AuthLoadingSkeleton() {
    return (
        <div className="flex items-center gap-2">
            <div className="h-8 w-16 animate-pulse rounded-md bg-white/10" />
            <div className="h-8 w-20 animate-pulse rounded-md bg-white/10" />
        </div>
    );
}
