/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { validateCSV } from './actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type Voucher = {
    voucher_code: string
    discount_percent: number
    expiry_date: string
    row?: number
    status?: 'success' | 'failed'
    message?: string
}

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<Voucher[]>([])
    const [uploadResult, setUploadResult] = useState<Voucher[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        setUploadResult(null)

        if (!selected || selected.type !== 'text/csv') {
            setFile(null)
            setPreview([])
            setError('File harus bertipe CSV')
            return
        }

        const formData = new FormData()
        formData.append('file', selected)

        setLoading(true)

        const result = await validateCSV(formData)
        setLoading(false)

        if (result.status !== 'ok') {
            setError(`${result.message}`)
            setPreview([])
            return
        }

        setFile(selected)

        if (Array.isArray(result.preview)) {
            setPreview(result.preview as Voucher[])
        }

        setError(null)
    }

    async function uploadVoucherCSV(formData: FormData) {
        const res = await fetch('http://localhost:5000/vouchers/upload-csv', {
            headers: {
                Authorization: 'Bearer 123456',
            },
            method: 'POST',
            body: formData,
        })

        const contentType = res.headers.get('Content-Type')

        const data = contentType?.includes('application/json')
            ? await res.json()
            : { message: await res.text() }

        if (!res.ok) {
            throw new Error(data?.message || 'Gagal mengunggah CSV')
        }

        return data.result
    }

    const handleSubmit = async () => {
        if (!file || preview.length === 0) return

        const formData = new FormData()

        formData.append('file', file)

        setLoading(true)

        try {
            const result = await uploadVoucherCSV(formData)

            const updated = preview.map((row, idx) => {
                const res = result.find((r: any) => r.row - 2 === idx)

                return {
                    ...row,
                    row: idx + 2,
                    status: res?.status,
                    message: res?.message,
                }
            })

            setUploadResult(updated)
            setError(null)
        } catch {
            setError('Upload gagal')
            setUploadResult(null)
        } finally {
            setLoading(false)
        }
    }

    const isValid = file && preview.length > 0 && !error

    return (
        <div className="md:p-10 p-8 flex flex-col gap-6">
            <div className="flex md:flex-row flex-col gap-4 items-center">
                <Label htmlFor="file">Upload File (.csv)</Label>
                <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="max-w-xs"
                />
                <Button
                    onClick={handleSubmit}
                    className="hover:cursor-pointer"
                    disabled={!isValid || loading}
                >
                    {loading ? 'Loading...' : 'Submit'}
                </Button>
                <span className="text-sm text-muted-foreground">
                    {error ? error : !file ? 'Belum ada file' : 'Siap submit'}
                </span>
            </div>

            <div className="border p-4 rounded-xl bg-muted/40">
                {preview.length > 0 ? (
                    <div className="overflow-auto max-h-[500px] text-sm">
                        <table className="w-full text-left border border-gray-300">
                            <thead className="bg-muted text-muted-foreground">
                                <tr>
                                    <th className="p-1">Row</th>
                                    <th className="p-1">Voucher Code</th>
                                    <th className="p-1">Discount</th>
                                    <th className="p-1">Expiry</th>
                                    {uploadResult && (
                                        <>
                                            <th className="p-1">Status</th>
                                            <th className="p-1">Message</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {(uploadResult ?? preview).map((v, idx) => (
                                    <tr key={idx}>
                                        <td className="p-1">
                                            {v.row || idx + 2}
                                        </td>
                                        <td className="p-1">
                                            {v.voucher_code}
                                        </td>
                                        <td className="p-1">
                                            {v.discount_percent}
                                        </td>
                                        <td className="p-1">{v.expiry_date}</td>
                                        {uploadResult && (
                                            <>
                                                <td className="p-1">
                                                    {v.status === 'success'
                                                        ? '✅'
                                                        : '❌'}
                                                </td>
                                                <td className="p-1 text-red-500">
                                                    {v.message || '-'}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">
                        Belum ada preview
                    </p>
                )}
            </div>
        </div>
    )
}
