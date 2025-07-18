'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ScanText, HardDrive } from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
    { href: '/website-analyzer', label: 'Website Analyzer', icon: ScanText },
    { href: '/shodan', label: 'IP/Domain Intel', icon: HardDrive },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
            <div className="flex items-center h-16 border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="">Sentinel Hub</span>
                </Link>
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                                    pathname === item.href && "bg-muted text-primary"
                                )}>
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
