import { GetStaticProps } from 'next'
import Image from 'next/image'

import { useKeenSlider } from 'keen-slider/react'

import { HomeContainer, Product } from "../styles/pages/home"

import camiseta1 from '../assets/1.png'
import camiseta2 from '../assets/2.png'
import camiseta3 from '../assets/3.png'
import camiseta4 from '../assets/4.png'

import 'keen-slider/keen-slider.min.css'
import { stripe } from '../lib/stype'
import Stripe from 'stripe'

interface ProductObject {
  id: string
  name: string
  imageUrl: string
  url: string | null
  price: number | null
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
    <HomeContainer ref={sliderRed} className="keen-slider">
      {
        products.map((product) => {
          return (
            <Product className="keen-slider__slide" key={product.id}>
              <Image src={product.imageUrl} width={520} height={480} alt="" />

              <footer>
                <strong>{product.name}</strong>
                <span>R$ {product.price}</span>
              </footer>
            </Product>
          )
        })
      }
    </HomeContainer>
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
      price: price.unit_amount,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}