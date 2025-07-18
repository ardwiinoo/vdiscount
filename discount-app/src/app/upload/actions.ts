'use server'

import { parse } from 'papaparse'

export async function validateCSV(formData: FormData) {
    const file = formData.get('file') as File

    if (!file || file.type !== 'text/csv') {
        return { status: 'error', message: 'File harus bertipe CSV' }
    }

    const text = await file.text()

    const { data, errors } = parse(text, {
        header: true,
        skipEmptyLines: true,
    })

    if (errors.length > 0 || !Array.isArray(data)) {
        return {
            status: 'error',
            message: 'CSV tidak dapat diparse dengan benar',
        }
    }

    const requiredHeaders = ['voucher_code', 'discount_percent', 'expiry_date']
    const actualHeaders = Object.keys(data[0] ?? {})

    const isValidHeader = requiredHeaders.every((h) =>
        actualHeaders.includes(h)
    )

    if (!isValidHeader) {
        return {
            status: 'invalid-header',
            message: 'Header CSV tidak valid',
            preview: data,
        }
    }

    return { status: 'ok', message: 'CSV valid', preview: data }
}
