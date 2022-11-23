import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import Stripe from "stripe"
import { ProductObject } from ".."
import { stripe } from "../../lib/stype"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

interface ProductWithDescription extends ProductObject {
  description: string
}

interface ProductProps {
  product: ProductWithDescription
}

export default function Product({ product }: ProductProps) {

  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Loading...</p>
  }

  const { imageUrl, description, name, price } = product

  return (
    <ProductContainer>

      <ImageContainer>
        <Image src={imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{name}</h1>
        <span>{price}</span>

        <p>{description}</p>

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
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = String(params?.id)

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