'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const voucherSchema = z.object({
    voucher_code: z.string().min(1, 'Voucher code is required'),
    discount_percent: z.number().min(1).max(100),
    expiry_date: z
        .date()
        .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
            message: 'Expiry date is required',
        }),
})
export type VoucherFormValues = z.infer<typeof voucherSchema>

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (data: VoucherFormValues) => void
    defaultValues?: VoucherFormValues
}

export default function VoucherFormModal({
    open,
    onClose,
    onSubmit,
    defaultValues,
}: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<VoucherFormValues>({
        resolver: zodResolver(voucherSchema),
        defaultValues: {
            voucher_code: '',
            discount_percent: undefined,
            expiry_date: undefined,
        },
    })

    useEffect(() => {
        if (open) {
            reset(
                defaultValues ?? {
                    voucher_code: '',
                    discount_percent: undefined,
                    expiry_date: undefined,
                }
            )
        }
    }, [defaultValues, open, reset])

    const expiry_date = watch('expiry_date')

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {defaultValues ? 'Edit Voucher' : 'Create Voucher'}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) => {
                        onSubmit(data)
                    })}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="voucher_code" className="mb-2">
                            Kode
                        </Label>
                        <Input
                            id="voucher_code"
                            {...register('voucher_code')}
                        />
                        {errors.voucher_code && (
                            <p className="text-sm text-red-500">
                                {errors.voucher_code.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="discount_percent" className="mb-2">
                            Diskon (%)
                        </Label>
                        <Input
                            id="discount_percent"
                            type="number"
                            {...register('discount_percent', {
                                valueAsNumber: true,
                            })}
                        />
                        {errors.discount_percent && (
                            <p className="text-sm text-red-500">
                                {errors.discount_percent.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-2">Tanggal Kadaluarsa</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !expiry_date && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {expiry_date
                                        ? format(expiry_date, 'yyyy-MM-dd')
                                        : 'Pilih tanggal'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={expiry_date}
                                    onSelect={(date) => {
                                        if (date) setValue('expiry_date', date)
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.expiry_date && (
                            <p className="text-sm text-red-500">
                                {errors.expiry_date.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
