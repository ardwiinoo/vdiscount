/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getVouchers, Voucher, saveVoucher, deleteVoucher, exportVoucher } from './actions'
import { format } from 'date-fns'
import VoucherFormModal from '@/components/VoucherForm'
import { toast } from 'sonner'

export default function DashboardPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<
        'expiry_date' | 'discount_percent' | ''
    >('')
    const [sortAsc, setSortAsc] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [modalOpen, setModalOpen] = useState(false)
    const [editVoucher, setEditVoucher] = useState<Voucher | null>(null)

    const limit = 5
    const offset = (currentPage - 1) * limit
    const totalPages = Math.ceil(total / limit)

    async function load() {
        try {
            const res = await getVouchers({
                search,
                limit,
                offset,
                sort: sortKey || 'created_at',
                order: sortAsc ? 'asc' : 'desc',
            })

            setVouchers(res.vouchers)
            setTotal(res.total)
        } catch (err: any) {
            console.error('Failed to load vouchers:', err)
            toast.error('Failed to load vouchers')
        }
    }

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, sortKey, sortAsc])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setCurrentPage(1)
            load()
        }, 300)
        return () => clearTimeout(delayDebounce)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const handleSort = (key: typeof sortKey) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc)
        } else {
            setSortKey(key)
            setSortAsc(true)
        }
    }

    const handleCreate = () => {
        setEditVoucher(null)
        setModalOpen(true)
    }

    const handleEdit = (voucher: Voucher) => {
        setEditVoucher(voucher)
        setModalOpen(true)
    }

    const handleSubmit = async (data: {
        voucher_code: string
        discount_percent: number
        expiry_date: Date
    }) => {
        try {
            await saveVoucher(
                {
                    voucher_code: data.voucher_code,
                    discount_percent: data.discount_percent,
                    expiry_date: data.expiry_date.toISOString(),
                },
                editVoucher?.id
            )
            setModalOpen(false)
            await load()
            toast.success(
                `Voucher ${editVoucher ? 'updated' : 'created'} successfully`
            )
        } catch (err: any) {
            const message = err?.message || 'Unknown error'
            console.error('Save voucher error:', err)
            toast.error(`Failed to save voucher: ${message}`)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this voucher?')) return

        try {
            await deleteVoucher(id)
            toast.success('Voucher deleted successfully')
            await load()
        } catch (err: any) {
            const message = err?.message || 'Unknown error'
            console.error('Delete voucher error:', err)
            toast.error(`Failed to delete voucher: ${message}`)
        }
    }

    const handleExport = async () => {
        try {
            const result = await exportVoucher()

            const url = window.URL.createObjectURL(result.blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'vouchers.csv'
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.success('File voucher.csv berhasil diunduh.')
        } catch (error: any) {
            toast.error(error?.message || 'Terjadi kesalahan saat ekspor file.')
        }
    }

    return (
        <div className="space-y-6 md:p-10 p-8">
            <div className="flex justify-between md:flex-row flex-col-reverse gap-4 items-center">
                <Input
                    placeholder="Search voucher code..."
                    className="w-64 p-3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="space-x-4">
                    <Button
                        className="hover:cursor-pointer"
                        onClick={handleCreate}
                    >
                        Create
                    </Button>
                    <Button
                        variant="default"
                        className="hover:cursor-pointer bg-green-600 text-white"
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                    <thead className="bg-gray-200   ">
                        <tr>
                            <th className="px-4 py-2 border">No</th>
                            <th className="px-4 py-2 border">Voucher Code</th>
                            <th
                                className="px-4 py-2 border cursor-pointer"
                                onClick={() => handleSort('discount_percent')}
                            >
                                Discount (%)
                            </th>
                            <th
                                className="px-4 py-2 border cursor-pointer"
                                onClick={() => handleSort('expiry_date')}
                            >
                                Expiry Date
                            </th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    No vouchers found.
                                </td>
                            </tr>
                        ) : (
                            vouchers.map((v, i) => (
                                <tr key={v.id}>
                                    <td className="px-4 py-2 border text-center">
                                        {(currentPage - 1) * limit + i + 1}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {v.voucher_code}
                                    </td>
                                    <td className="px-4 py-2 border text-center">
                                        {v.discount_percent}%
                                    </td>
                                    <td className="px-4 py-2 border text-center">
                                        {format(
                                            new Date(v.expiry_date),
                                            'yyyy-MM-dd'
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border text-center space-x-2">
                                        <Button
                                            variant="link"
                                            className="text-blue-600 p-0 h-auto text-sm hover:cursor-pointer"
                                            onClick={() => handleEdit(v)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="link"
                                            className="text-red-600 p-0 h-auto text-sm hover:cursor-pointer"
                                            onClick={() => handleDelete(v.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex md:flex-row flex-col gap-3 justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                    Showing {(offset || 0) + 1} to{' '}
                    {Math.min(offset + limit, total)} of {total} entries
                </div>
                <div className="space-x-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:cursor-pointer"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Prev
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            className="hover:cursor-pointer"
                            variant={
                                currentPage === i + 1 ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:cursor-pointer"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <VoucherFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                defaultValues={
                    editVoucher
                        ? {
                              voucher_code: editVoucher.voucher_code,
                              discount_percent: editVoucher.discount_percent,
                              expiry_date: new Date(editVoucher.expiry_date),
                          }
                        : undefined
                }
            />
        </div>
    )
}
