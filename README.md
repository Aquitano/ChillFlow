# ChillFlow

ChillFlow is a productivity application that combines lo-fi beats with task management and focus tools. It helps users achieve a state of flow through ambient sounds and structured work sessions.

<!-- ![ChillFlow Screenshot](./public/screenshot.png) -->

## Features

- **Lo-fi Music**: Curated playlists designed for deep focus
- **Pomodoro Timer**: Built-in focus timer with customizable work/break intervals
- **Task Management**: Track tasks and accomplish goals in a distraction-free environment
- **Sound Mixing**: Combine ambient sounds with lo-fi beats for your perfect work environment
- **Focus Analytics**: Track productivity patterns over time
- **User Accounts**: Sync your settings across devices

## Tech Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Clerk Authentication
- Sentry for error monitoring

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm or bun

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/aquitano/chill-flow.git
    cd chill-flow
    ```

2. Install dependencies:

    ```bash
    pnpm install
    # or
    bun install
    ```

3. Create a `.env.local` file in the project root and add:

    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    ```

4. Start the development server:

    ```bash
    npm run dev
    # or
    pnpm dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Homepage**: Browse available focus sounds and features
- **Focus Session**: Start a timer, select your sounds, and begin working
- **Account**: Sign up to save your preferences and track progress

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
