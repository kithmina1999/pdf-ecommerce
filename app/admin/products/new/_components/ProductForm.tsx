'use client'

import { addProduct, updateProduct } from '@/app/admin/_actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import { addSchema, editSchema } from '@/schemas'
import { Product } from '@prisma/client'
import Image from 'next/image'
import React, { useState, useTransition } from 'react'
import { z } from 'zod'

function ProductForm({ product }: { product?: Product | null }) {
    const schema = product!=null ? editSchema : addSchema
    const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents || 0)
    const [errors, setErrors] = useState<z.inferFlattenedErrors<typeof schema> | null>(null)
    const [isPending, startTransition] = useTransition()
    const handleSubmit = async (data: FormData) => {
        setErrors(null);
        startTransition(async () => {

            if (product == null) {
                const response = await addProduct(data)
                if (response.error) {
                    setErrors(response.error)
                }
            } else {
                const response = await updateProduct(product.id, data)
                if (response.error) {
                    setErrors(response.error)
                }
            }
        })
    }
    return (
        <form action={handleSubmit} className='space-y-8'>
            <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input type='text' id='name' name='name' required={product==null} defaultValue={product?.name || ""} />
                {errors?.fieldErrors.name && (<div className='text-red-500  text-sm'>hello{errors.fieldErrors.name}</div>)}
            </div>
            <div className='space-y-2'>
                <Label htmlFor='priceInCents'>Price in Cents</Label>
                <Input type='number' id='priceInCents' name='priceInCents' required={product==null}
                    value={priceInCents|| 0} onChange={e => setPriceInCents(Number(e.target.value))}
                />
                <div className='text-muted-foreground'>
                    {formatCurrency((priceInCents || 0) / 100)}
                </div>
                {errors?.fieldErrors.priceInCents && (<div className='text-red-500 text-sm'>{errors.fieldErrors.priceInCents}</div>)}
            </div>
            <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea id='description' name='description' required={product==null} defaultValue={product?.description || ""} />
                {errors?.fieldErrors.description && (<div className='text-red-500 text-sm'>{errors.fieldErrors.description}</div>)}
            </div>
            <div className='space-y-2'>
                <Label htmlFor='file'>File</Label>
                <Input type='file' id='file' name='file' required={product == null} />
                {product != null && (
                    <div className='text-muted-foreground'>{product.filePath}</div>
                )}
                {errors?.fieldErrors.file && (<div className='text-red-500 text-sm'>{errors.fieldErrors.file}</div>)}
            </div>
            <div className='space-y-2'>
                <Label htmlFor='image'>Image</Label>
                <Input type='file' id='image' name='image' required={product == null} />
                {product != null && (
                    <Image src={product.imagePath} alt={product.name} height={400} width={400} />
                )}
                {errors?.fieldErrors.image && (<div className='text-red-500 text-sm'>{errors.fieldErrors.image}</div>)}
            </div>
            <SubmitButton pending={isPending} />
        </form>
    )
}

export default ProductForm

function SubmitButton({ pending }: { pending: boolean }) {

    return <Button type='submit' disabled={pending}>{pending ? 'Saving' : 'Save'} </Button>
}