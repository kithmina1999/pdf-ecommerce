import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Expired() {
  return (
    <>
        <h1 className='text-4xl mb-4'>Download link expired</h1>
        <Button asChild size='lg'>
            <Link href='/orders'>Get New link</Link>
        </Button>
    </>
  )
}
