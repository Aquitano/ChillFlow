'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export function TaskInput() {
    const [task, setTask] = useState('');
    const { user } = useUser();

    return (
        <div className="group relative mx-auto w-full max-w-xl rounded-xl bg-gradient-to-r from-black/20 via-black/10 to-black/20 transition-colors duration-300 hover:from-black/60 hover:via-black/40 hover:to-black/60">
            <div className="rounded-xl border-2 border-white/20 bg-black/50 p-4 shadow-lg transition-colors duration-300 hover:border-white/40">
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder={
                        user
                            ? `What would you like to focus on, ${user.firstName}?`
                            : 'What would you like to focus on?'
                    }
                    className="w-full bg-transparent p-2 text-white placeholder-gray-400 focus:outline-none"
                />
                <div className="mt-3 flex justify-end">
                    <Button variant="outline" disabled={!task}>
                        Add to Flow
                    </Button>
                </div>
            </div>
        </div>
    );
}
