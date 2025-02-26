import { Button } from '@/components/ui/button';
import { IconBrandDiscord, IconBrandGithub, IconBrandTwitter } from '@tabler/icons-react';

export function Footer() {
    const links = [
        {
            title: 'Product',
            items: ['Features', 'Pricing', 'Download App', 'Changelog'],
        },
        {
            title: 'Resources',
            items: ['Community', 'Sound Library', 'Focus Guide', 'Blog'],
        },
        {
            title: 'Company',
            items: ['About', 'Careers', 'Legal', 'Contact'],
        },
    ];

    return (
        <footer className="relative z-10 mt-32">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="mx-auto max-w-7xl px-8 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="text-xl font-bold">ChillFlow</div>
                        <p className="mt-4 text-sm text-neutral-400">
                            Your daily companion for focus and productivity through carefully curated sounds.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <Button variant="ghost" size="icon" className="hover:text-neutral-100">
                                <IconBrandTwitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-neutral-100">
                                <IconBrandGithub className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-neutral-100">
                                <IconBrandDiscord className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    {links.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold">{section.title}</h3>
                            <ul className="mt-4 space-y-2">
                                {section.items.map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-3 pt-8 text-center text-sm text-neutral-400">
                    <div className="inset-x-0 mb-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <p>© 2025 ChillFlow. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
