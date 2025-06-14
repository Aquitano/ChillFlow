import { Background, Quote, Task, Track } from '@/models/app';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ModeSettings = {
    label: string;
    description: string;
    showQuote: boolean;
    showBackground: boolean;
    showTasks: boolean;
    showStreak: boolean;
    showTimer: boolean;
};

export type TimerMode = 'focus' | 'pomodoro';

export type PomodoroSettings = {
    focusMinutes: number;
    breakMinutes: number;
    longBreakMinutes: number;
    sessionsBeforeLongBreak: number;
    currentSession: number;
    isBreak: boolean;
};

interface AppState {
    isPlaying: boolean;
    currentTrack: Track | null;
    lastTrack: Track | null;

    volume: number[];

    isMenuOpen: boolean;

    currentMode: string;
    modes: Record<string, ModeSettings>;

    currentQuote: Quote | null;
    tasks: Task[];
    backgrounds: Background[];

    timerMode: TimerMode;
    timerSeconds: number;
    timerActive: boolean;
    selectedPreset: string;
    customMinutes: string;
    pomodoroSettings: PomodoroSettings;
    focusTimerSeconds: number;
    pomodoroTimerSeconds: number;

    togglePlay: () => void;
    setVolume: (volume: number[]) => void;
    toggleMenu: () => void;
    setMenuOpen: (open: boolean) => void;
    setMode: (mode: string) => void;

    setLastTrack: (track: Track) => void;

    setTimerMode: (mode: TimerMode) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    setTimerPreset: (preset: string) => void;
    setCustomTime: (minutes: string) => void;
    decrementTimer: () => void;
    updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
    advancePomodoroPhase: () => void;

    getCurrentModeSettings: () => ModeSettings;

    selectModeFeatures: (state: AppState) => {
        showStreak: boolean;
        showTimer: boolean;
    };
}

export const useAppStore = create<AppState>()(
    devtools(
        (set, get) => ({
            isPlaying: false,
            currentTrack: null,
            volume: [50],
            isMenuOpen: false,
            currentMode: 'DeepWork',
            modes: {
                'DeepWork': {
                    label: 'DeepWork',
                    description: 'Ultra-minimal environment for deep, distraction-free work.',
                    showQuote: false,
                    showBackground: false,
                    showTasks: false,
                    showStreak: false,
                    showTimer: true,
                },
                'LearnFlow': {
                    label: 'LearnFlow',
                    description: 'Ideal for studying, skill-building, or research sessions.',
                    showQuote: true,
                    showBackground: true,
                    showTasks: true,
                    showStreak: true,
                    showTimer: true,
                },
                'TaskDrive': {
                    label: 'TaskDrive',
                    description: 'Manage a to-do list or tasks in a straightforward, focused workspace.',
                    showQuote: false,
                    showBackground: false,
                    showTasks: true,
                    showStreak: true,
                    showTimer: true,
                },
                'CreativeSpark': {
                    label: 'CreativeSpark',
                    description: 'Inspire brainstorming, design, or writing sessions with a stimulating yet focused environment.',
                    showQuote: true,
                    showBackground: true,
                    showTasks: false,
                    showStreak: false,
                    showTimer: false,
                },
            },
            currentQuote: {
                id: '1',
                text: 'Our true nationality is humankind.',
                author: 'H. G. Wells',
                tags: ['humanity', 'unity'],
            },
            tasks: [
                { id: '1', text: 'Review notes', isCompleted: false, priority: 'medium' },
                { id: '2', text: 'Practice coding', isCompleted: false, priority: 'high' },
                { id: '3', text: 'Write summary', isCompleted: false, priority: 'low' },
            ],
            backgrounds: [],

            timerMode: 'focus',
            timerSeconds: 25 * 60,
            timerActive: false,
            selectedPreset: '25m',
            customMinutes: '25',
            focusTimerSeconds: 25 * 60,
            pomodoroTimerSeconds: 25 * 60,
            pomodoroSettings: {
                focusMinutes: 25,
                breakMinutes: 5,
                longBreakMinutes: 15,
                sessionsBeforeLongBreak: 4,
                currentSession: 1,
                isBreak: false,
            },

            togglePlay: () => set(state => ({ isPlaying: !state.isPlaying }), false, 'togglePlay'),
            setVolume: (volume) => set({ volume }, false, 'setVolume'),
            toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen }), false, 'toggleMenu'),
            setMenuOpen: (open) => set({ isMenuOpen: open }, false, 'setMenuOpen'),
            setMode: (mode) => set({ currentMode: mode }, false, 'setMode'),
            setLastTrack: (track) => set({ lastTrack: track }, false, 'setLastTrack'),

            setTimerMode: (mode) => {
                const state = get();
                const currentSeconds = state.timerSeconds;

                if (state.timerMode === 'focus') {
                    set({ focusTimerSeconds: currentSeconds }, false, 'saveFocusTimerState');
                } else if (state.timerMode === 'pomodoro') {
                    set({ pomodoroTimerSeconds: currentSeconds }, false, 'savePomodoroTimerState');
                }

                if (mode === 'focus') {
                    set({
                        timerMode: mode,
                        timerSeconds: state.focusTimerSeconds,
                        timerActive: false
                    }, false, 'switchToFocusMode');
                } else {
                    const useInfinitePreset = state.selectedPreset === '∞' && state.timerMode === 'focus';

                    if (useInfinitePreset) {
                        const pomodoroMinutes = state.pomodoroSettings.isBreak
                            ? state.pomodoroSettings.breakMinutes
                            : state.pomodoroSettings.focusMinutes;

                        set({
                            timerMode: mode,
                            timerSeconds: pomodoroMinutes * 60,
                            pomodoroTimerSeconds: pomodoroMinutes * 60,
                            selectedPreset: `${pomodoroMinutes}m`,
                            timerActive: false
                        }, false, 'switchToPomodoroModeFromInfinite');
                    } else {
                        set({
                            timerMode: mode,
                            timerSeconds: state.pomodoroTimerSeconds,
                            timerActive: false
                        }, false, 'switchToPomodoroMode');
                    }
                }
            },

            startTimer: () => {
                const state = get();

                if (!state.isPlaying) {
                    set({ isPlaying: true }, false, 'startPlaybackWithTimer');
                }

                set({ timerActive: true }, false, 'startTimer');
            },

            pauseTimer: () => set({ timerActive: false }, false, 'pauseTimer'),

            resetTimer: () => {
                const state = get();

                if (state.selectedPreset === '∞') return;

                if (state.timerMode === 'focus') {
                    const presetMinutes = state.selectedPreset === '∞'
                        ? 0
                        : parseInt(state.selectedPreset.replace('m', '')) || 25;

                    set({ timerSeconds: presetMinutes * 60, timerActive: false }, false, 'resetFocusTimer');
                } else {
                    const { pomodoroSettings } = state;
                    const minutes = pomodoroSettings.isBreak
                        ? pomodoroSettings.breakMinutes
                        : pomodoroSettings.focusMinutes;

                    set({ timerSeconds: minutes * 60, timerActive: false }, false, 'resetPomodoroTimer');
                }
            },

            setTimerPreset: (preset) => {
                const state = get();

                if (preset === '∞') {
                    if (state.timerMode === 'focus') {
                        set({
                            selectedPreset: preset,
                            timerSeconds: 0,
                            focusTimerSeconds: 0,
                            timerActive: false
                        }, false, 'setInfiniteTimerPreset');
                    } else {
                        set({
                            selectedPreset: preset,
                            timerSeconds: 0,
                            pomodoroTimerSeconds: 0,
                            timerActive: false
                        }, false, 'setInfiniteTimerPreset');
                    }
                } else {
                    const minutes = parseInt(preset.replace('m', '').replace('h', '')) || 25;
                    const seconds = minutes * 60;

                    if (state.timerMode === 'focus') {
                        set({
                            selectedPreset: preset,
                            timerSeconds: seconds,
                            focusTimerSeconds: seconds,
                            timerActive: false
                        }, false, 'setFocusTimerPreset');
                    } else {
                        set({
                            selectedPreset: preset,
                            timerSeconds: seconds,
                            pomodoroTimerSeconds: seconds,
                            timerActive: false
                        }, false, 'setPomodoroTimerPreset');
                    }
                }
            },

            setCustomTime: (minutes) => {
                const state = get();
                const mins = parseInt(minutes) || 25;
                let displayLabel = `${mins}m`;
                const seconds = mins * 60;

                if (mins >= 60) {
                    const hours = Math.floor(mins / 60);
                    const remainingMins = mins % 60;
                    displayLabel = remainingMins > 0 ?
                        `${hours}h ${remainingMins}m` :
                        `${hours}h`;
                }

                if (state.timerMode === 'focus') {
                    set({
                        customMinutes: minutes,
                        timerSeconds: seconds,
                        focusTimerSeconds: seconds,
                        selectedPreset: displayLabel,
                        timerActive: false
                    }, false, 'setCustomFocusTime');
                } else {
                    set({
                        customMinutes: minutes,
                        timerSeconds: seconds,
                        pomodoroTimerSeconds: seconds,
                        selectedPreset: displayLabel,
                        timerActive: false
                    }, false, 'setCustomPomodoroTime');
                }
            },

            decrementTimer: () => {
                const state = get();

                if (!state.timerActive) return;

                if (state.selectedPreset === '∞') {
                    if (state.timerMode === 'focus') {
                        return;
                    }
                }

                if (state.timerSeconds > 0) {
                    const newSeconds = state.timerSeconds - 1;
                    if (state.timerMode === 'focus') {
                        set({
                            timerSeconds: newSeconds,
                            focusTimerSeconds: newSeconds
                        }, false, 'decrementFocusTimer');
                    } else {
                        set({
                            timerSeconds: newSeconds,
                            pomodoroTimerSeconds: newSeconds
                        }, false, 'decrementPomodoroTimer');
                    }
                } else {
                    if (state.timerMode === 'pomodoro') {
                        get().advancePomodoroPhase();
                    } else {
                        set({ timerActive: false }, false, 'timerCompleted');
                    }
                }
            },

            updatePomodoroSettings: (settings) =>
                set(
                    state => ({
                        pomodoroSettings: { ...state.pomodoroSettings, ...settings }
                    }),
                    false,
                    'updatePomodoroSettings'
                ),

            advancePomodoroPhase: () => {
                const { pomodoroSettings } = get();
                let nextSession = pomodoroSettings.currentSession;
                let isBreak = !pomodoroSettings.isBreak;

                if (!isBreak) {
                    nextSession = pomodoroSettings.isBreak ? nextSession + 1 : nextSession;
                }

                if (nextSession > pomodoroSettings.sessionsBeforeLongBreak) {
                    nextSession = 1;
                }

                const nextMinutes = isBreak
                    ? ((nextSession === pomodoroSettings.sessionsBeforeLongBreak)
                        ? pomodoroSettings.longBreakMinutes
                        : pomodoroSettings.breakMinutes)
                    : pomodoroSettings.focusMinutes;

                set({
                    pomodoroSettings: {
                        ...pomodoroSettings,
                        currentSession: nextSession,
                        isBreak
                    },
                    timerSeconds: nextMinutes * 60,
                    timerActive: true
                }, false, 'advancePomodoroPhase');
            },

            getCurrentModeSettings: () => {
                const { currentMode, modes } = get();
                return modes[currentMode];
            },

            selectModeFeatures: (state: AppState) => {
                const mode = state.modes[state.currentMode];
                return {
                    showStreak: mode?.showStreak ?? false,
                    showTimer: mode?.showTimer ?? false
                };
            }
        })
    )
);
