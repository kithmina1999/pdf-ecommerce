'use server';
import { db } from '@/db/db';
import OrderHistoryEmail from '@/Email/OrderHistory';
import { Resend } from 'resend';
import { z } from 'zod'

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function emailOrderHistory(formData: FormData): Promise<{ message?: string; error?: string }> {

    const result = emailSchema.safeParse(formData.get("email"))

    if (result.success === false) {
        return { error: "Invalid email address" }
    }
    const user = await db.user.findUnique({
        where: { email: result.data },
        select: {
            email: true,
            orders: {
                select: {
                    id: true,
                    pricePaidInCents: true,
                    createdAt: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            imagePath: true,
                            description: true
                        }
                    }
                }
            }
        }
    })
    if (user == null) {
        return {
            message: "Check your email is to view your order history and download your product"
        }
    }

    const orders = await Promise.all(user.orders.map(async (order) => {
        const downloadVerification = await db.downloadVerification.create({
            data: {
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
                productId: order.product.id,
            }
        });

        return {
            ...order,
            downloadVerificationId: downloadVerification.id, // assuming you want to return the ID
        };
    }));

    const data = await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: "order History",
        react: <OrderHistoryEmail orders={orders} />
    })
    if (data.error) {
        return { error: "There was an error sending your email. Please try again!" }
    }
    return { message: "Check your email to view your order history and download your products" }
}