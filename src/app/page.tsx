import { FeaturesSection } from './components/features';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Hero } from './components/hero';

export default function Home() {
    return (
        <div className="bg-main relative min-h-screen overflow-hidden font-sans">
            <Header />
            <Hero />

            <div
                className="pointer-events-none fixed inset-0"
                style={{
                    background: 'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 50%)',
                }}
            />

            <div className="relative z-10 my-25 h-px w-full">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <section className="relative z-10 flex flex-col items-center py-10 text-center">
                <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                    IMMERSIVE FOCUS ENVIRONMENT
                </p>
                <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">Let the beats guide your flow.</h2>
                <p className="font-serif text-4xl text-neutral-400 md:text-5xl">Curated sounds for every mood.</p>
            </section>

            <FeaturesSection />

            <Footer />
        </div>
    );
}
