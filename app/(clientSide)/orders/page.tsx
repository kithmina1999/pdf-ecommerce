'use client'
import { emailOrderHistory } from '@/actions/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useTransition } from 'react'

export default function MyOrdersPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null);
    const handleSubmit = (data: FormData) => {
        startTransition(async () => {
            const response = await emailOrderHistory(data)
            if (response.error) {
                setError(response.error)
                setSuccess(null)
            } else {
                setSuccess(response.message as string)
                setError(null)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>Enter your email and we will email you your order history and download links</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input type='email' required name="email" id='email' />
                        {error && (<span className='text-destructive text-sm'>{error}</span>)}
                        {success && (<span className='text-lime-500'>{success}</span>)}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton pending={isPending} />
                </CardFooter>
            </Card>
        </form>
    )
}

// Ensure the SubmitButton receives props correctly
interface SubmitButtonProps {
    pending: boolean;
}

function SubmitButton({ pending }: SubmitButtonProps) {
    return (
        <Button className='w-full' size='lg' type='submit' disabled={pending}>
            {pending ? 'Sending...' : 'Send'}
        </Button>
    );
}