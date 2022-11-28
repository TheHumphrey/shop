import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { useKeenSlider } from 'keen-slider/react'

import { HomeContainer, Product } from "../styles/pages/home"

import 'keen-slider/keen-slider.min.css'
import { stripe } from '../lib/stype'
import Stripe from 'stripe'

export interface ProductObject {
  id: string
  name: string
  imageUrl: string
  url: string | null
  price: string
}

interface HomeProps {
  products: ProductObject[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRed] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })

  return (
    <>
      <Head>
        <title>Home | Shop</title>
      </Head>

      <HomeContainer ref={sliderRed} className="keen-slider">


        {
          products.map((product) => {
            return (
              <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
                <Product className="keen-slider__slide" key={product.id}>
                  <Image src={product.imageUrl} width={520} height={480} alt="" />

                  <footer>
                    <strong>{product.name}</strong>
                    <span>{product.price}</span>
                  </footer>
                </Product>
              </Link>
            )
          })
        }
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products: ProductObject[] = response.data.map(product => {
    const price = product.default_price as Stripe.Price
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      url: product.url,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format((price.unit_amount || 0) / 100),
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}