import { db } from "@/db/db";
import PageHeader from "../../_components/PageHeader";
import ProductForm from "../../new/_components/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const {id} = await params
    const product = await db.product.findUnique({where:{id}})
    return (
        <>
            <PageHeader>Edit Products</PageHeader>
            <ProductForm product={product} />
        </>
    )
}