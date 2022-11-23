import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Stripe from "stripe"
import { ProductObject } from ".."
import { stripe } from "../../lib/stype"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

interface ProductWithDescription extends ProductObject {
  description: string
}

interface ProductProps {
  products: ProductWithDescription
}

export default function Product({ products }: ProductProps) {

  return (
    <ProductContainer>

      <ImageContainer>
        <Image src={products.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{products.name}</h1>
        <span>{products.price}</span>

        <p>{products.description}</p>

        <button>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_MqFb8h4BknSW3S' } }
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        url: product.url,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format((price.unit_amount || 0) / 100),
        description: product.description,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}