'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type Voucher = {
    id: number
    voucher_code: string
    discount_percent: number
    expiry_date: string
    created_at: string
    updated_at: string
}

export type Input = {
    voucher_code: string
    discount_percent: number
    expiry_date: string
}

type Params = {
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
    limit?: number
    offset?: number
}

export async function getVouchers(params: Params = {}): Promise<{
    vouchers: Voucher[]
    total: number
}> {
    const query = new URLSearchParams({
        search: params.search ?? '',
        sort: params.sort ?? 'created_at',
        order: params.order ?? 'asc',
        limit: String(params.limit ?? 5),
        offset: String(params.offset ?? 0),
    }).toString()

    const res = await fetch(`http://localhost:5000/vouchers?${query}`, {
        headers: {
            Authorization: 'Bearer 123456',
        },
        cache: 'no-store',
    })

    if (!res.ok) throw new Error('Failed to fetch vouchers')

    const result = await res.json()
    const vouchers = result.data?.vouchers ?? []
    return {
        vouchers: vouchers,
        total:
            result.data.total ??
            (Array.isArray(vouchers) ? vouchers.length : 0),
    }
}

export async function saveVoucher(data: Input, id?: number) {
    const url = id
        ? `http://localhost:5000/vouchers/${id}`
        : `http://localhost:5000/vouchers`

    const method = id ? 'PUT' : 'POST'

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 123456',
        },
        body: JSON.stringify({
            voucher_code: data.voucher_code,
            discount_percent: data.discount_percent,
            expiry_date: data.expiry_date,
        }),
    })

    if (!res.ok) {
        const errorBody = await res.json()
        throw new Error(errorBody.message || 'Failed to save voucher')
    }

    return await res.json()
}

export async function deleteVoucher(id: number) {
    const res = await fetch(`http://localhost:5000/vouchers/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer 123456',
        },
    })

    if (!res.ok) throw new Error('Failed to delete voucher')

    return await res.json()
}

export async function exportVoucher() {
    const response = await fetch('http://localhost:5000/vouchers/export', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer 123456',
        },
    })

    if (!response.ok) {
        const contentType = response.headers.get('Content-Type')
        let message = 'Gagal mengekspor voucher.'

        if (contentType?.includes('application/json')) {
            const result = await response.json()
            message = result?.message || message
        } else {
            const text = await response.text()
            message = text || message
        }

        throw new Error(message)
    }

    const blob = await response.blob()
    return {
        success: true,
        blob,
    }
}

export async function logoutAction() {
    ;(await cookies()).delete('token')
    redirect('/login')
}
