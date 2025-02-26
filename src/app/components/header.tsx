'use client';

import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Suspense } from 'react';

export function Header() {
    return (
        <>
            <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-white/20 bg-black/30 bg-[length:30vh_30vh] px-4 py-4 bg-blend-overlay backdrop-blur-md sm:px-8">
                <div className="text-xl font-bold">ChillFlow</div>
                <nav className="flex max-h-2 items-center space-x-2 sm:space-x-4">
                    <Suspense fallback={<AuthLoadingSkeleton />}>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="ghost" className="px-3 sm:px-4">
                                    Login
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button variant="outline" className="px-3 sm:px-4">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Button variant="ghost" className="px-3 sm:px-4">
                                Dashboard
                            </Button>
                            <UserButton
                                appearance={{
                                    variables: {
                                        fontFamily: 'var(--font-sans)',
                                    },
                                }}
                            />
                        </SignedIn>
                    </Suspense>
                </nav>
            </header>
            <div className="h-[72px]" aria-hidden="true" />
        </>
    );
}

function AuthLoadingSkeleton() {
    return (
        <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="h-9 w-16 animate-pulse rounded-md bg-white/10" />
            <div className="h-9 w-20 animate-pulse rounded-md bg-white/10" />
        </div>
    );
}
