import React from 'react'
import PageHeader from '@/app/admin/users/_components/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/db/db'
import { MoreVertical } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DeleteDropdownItem } from './_components/OrdersActions'

const AdminOrdersPage = () => {
    return (
        <>
            <div className='flex justify-between items-center gap-4'>
                <PageHeader>Orders</PageHeader>
            </div>
            <OrderTable />
        </>
    )
}

function getOrders() {
    return db.order.findMany({
        select: {
            id: true,
            product: { select: { name: true } },
            user: { select: { email: true } },
            pricePaidInCents: true
        },
        orderBy: { createdAt: "desc" }
    })
}

async function OrderTable() {
    const orders = await getOrders()
    if (orders.length === 0) return <p> No Users found</p>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead className='w-0'>
                    <span className='sr-only'>Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {orders.map(orders => (
                <TableRow key={orders.id}>
                    <TableCell>
                        {orders.product.name}
                    </TableCell>
                    <TableCell>
                        {orders.user.email}
                    </TableCell>
                    <TableCell>
                        {formatCurrency(orders.pricePaidInCents/100)}
                    </TableCell>
                    <TableCell className='text-center'>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className='sr-only'>Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DeleteDropdownItem id={orders.id} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default AdminOrdersPage