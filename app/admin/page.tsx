import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import React from 'react'

interface DashboardCardProps {
  title: string,
  subTitle: string
  body: string
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  })
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count
  }
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true }
    })
  ])

  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
  }
}


async function getproductData() {

  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } })
  ])
  return{
    activeCount,
    inactiveCount
  }
}

function DashboardCard({ title, subTitle, body }: DashboardCardProps) {

  return <Card className=''>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{subTitle}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{body}</p>
    </CardContent>
  </Card>
}

const AdminDashboard = async () => {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getproductData()
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title='Sales' subTitle={`${formatNumber(salesData.numberOfSales)} orders`} body={formatCurrency(salesData.amount)} />
      <DashboardCard title='Customers' subTitle={`${formatCurrency(userData.averageValuePerUser)} Avarage value`} body={formatNumber(userData.userCount)} />
      <DashboardCard title='Active Products' subTitle={`${formatNumber(productData.inactiveCount)} Inactive`} body={formatNumber(productData.activeCount)} />
    </div>
  )
}

export default AdminDashboard