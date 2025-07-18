'use client'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { logoutAction } from '@/app/actions'
import { useTransition } from 'react'
import { Button } from './ui/button'

const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Upload CSV', href: '/upload' },
]

export function Topbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleLogout = async () => {
        startTransition(async () => {
            await logoutAction()
            router.push('/login')
        })
    }

    return (
        <header className="border-b shadow-sm px-8 py-3 flex justify-between items-center">
            <NavigationMenu>
                <NavigationMenuList className="space-x-6 p-3">
                    {menuItems.map((item) => (
                        <NavigationMenuItem key={item.href}>
                            <Link
                                href={item.href}
                                className={clsx(
                                    'text-md',
                                    pathname === item.href
                                        ? 'text-black underline font-bold'
                                        : 'text-gray-700'
                                )}
                            >
                                {item.label}
                            </Link>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            <Button
                onClick={handleLogout}
                className="text-sm disabled:opacity-50 bg-red-600 text-white hover:cursor-pointer"
                disabled={isPending}
            >
                {isPending ? 'Logging out...' : 'Logout'}
            </Button>
        </header>
    )
}
