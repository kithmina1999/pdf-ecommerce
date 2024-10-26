import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Tailwind,
  } from "@react-email/components"
  import { OrderInformation } from "./components/OrderInformation"
  import React from "react"
  
  type OrderHistoryEmailProps = {
    orders: {
      id: string
      pricePaidInCents: number
      createdAt: Date
      downloadVerificationId: string
      product: {
        name: string
        imagePath: string
        description: string
      }
    }[]
  }
  
  OrderHistoryEmail.PreviewProps = {
    orders: [
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 10000,
        downloadVerificationId: crypto.randomUUID(),
        product: {
          name: "Product name",
          description: "Some description",
          imagePath:
            "/products/956159dc-4d3a-449a-b0d0-8673dd830d09-freepik__fun-whimsical-elements-with-bright-colors-and-a-se__14651.jpeg",
        },
      },
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 2000,
        downloadVerificationId: crypto.randomUUID(),
        product: {
          name: "Product name 2",
          description: "Some other desc",
          imagePath:
            "/products/956159dc-4d3a-449a-b0d0-8673dd830d09-freepik__fun-whimsical-elements-with-bright-colors-and-a-se__14651.jpeg",
        },
      },
    ],
  } satisfies OrderHistoryEmailProps
  
  export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
    return (
      <Html>
        <Preview>Order History & Downloads</Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Order History</Heading>
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <OrderInformation
                    order={order}
                    product={order.product}
                    downloadVerificationId={order.downloadVerificationId}
                  />
                  {index < orders.length - 1 && <Hr />}
                </React.Fragment>
              ))}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }