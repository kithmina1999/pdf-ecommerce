'use server'
import { db } from '@/db/db'
import fs from 'fs/promises'
import { notFound, redirect } from 'next/navigation'
import { addSchema, editSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'



export async function addProduct(formData: FormData) {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if (result.success === false) return { error: result.error.formErrors }

    const data = result.data

    await fs.mkdir("products", { recursive: true })
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("public/products", { recursive: true })
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    await db.product.create({
        data: {
            isAvailableForPurchase: false,
            name: data.name,
            description: data.description,
            priceInCents: data.priceInCents,
            filePath,
            imagePath
        }
    })
    revalidatePath("/");
    revalidatePath("/products")

    redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    if (result.success === false) return { error: result.error.formErrors }

    const data = result.data
    const product = await db.product.findUnique({ where: { id } })

    if (product == null) return notFound()

    let filePath = product.filePath

    if (data.file != null && data.file.size > 0) {
        await fs.unlink(product.filePath)
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    }

    let imagePath = product.imagePath
    if (data.image != null && data.image.size > 0) {
        await fs.unlink(`public${imagePath}`)
        imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    }


    await db.product.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            priceInCents: data.priceInCents,
            filePath,
            imagePath
        }
    })
    revalidatePath("/");
    revalidatePath("/products")

    redirect("/admin/products");
}

export async function toggleProductAvailablity(id: string, isAvailableForPurchase: boolean) {
    await db.product.update({
        where: { id },
        data: {
            isAvailableForPurchase,
        }
    })
    revalidatePath("/");
    revalidatePath("/products")
}

export async function deleteProduct(id: string) {
    const product = await db.product.delete({
        where: { id }
    })
    if (product == null) return notFound()
    await fs.unlink(product.filePath)
    await fs.unlink(`public${product.imagePath}`)
    revalidatePath("/");
    revalidatePath("/products")
}

