'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type LoginInput = {
    email: string
    password: string
}

export async function loginAction({ email, password }: LoginInput) {
    if (email !== 'admin@gmail.com' || password !== '123456') {
        throw new Error('Invalid credentials')
    }

    const token = 'dummy-token'

    const cookieStore = cookies()
    ;(await cookieStore).set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })

    redirect('/')
}
