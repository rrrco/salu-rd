import { Hero } from './components/sections/Hero'
import { FeaturedProducts } from './components/sections/FeaturedProducts'
import { Purpose } from './components/sections/Purpose'
import { AnimalBand } from './components/sections/AnimalBand'
import { Testimonials } from './components/sections/Testimonials'
import { Contact } from './components/sections/Contact'
import { CtaBand } from './components/sections/CtaBand'
import { client } from './lib/sanity'
import { productsQuery } from './lib/queries'
import type { SanityProduct } from './lib/types'

export const revalidate = 60

/**
 * Eight sections, eight distinct layout families, no family repeated.
 *
 * `#contact` sits at position 7 rather than 3. Every anchor ID is preserved from
 * the previous build, so existing links and any downstream tracking still
 * resolve. See DESIGN.md section 6.
 */
export default async function Home() {
  let products: SanityProduct[] = []
  try {
    products = await client.fetch(productsQuery)
  } catch {
    /* Sanity unreachable. The featured grid renders its own fallback rather
       than taking the page down. */
    products = []
  }

  return (
    <>
      {/* The figures now live inside the hero, layered on the gradient, as
          they did in the original design. */}
      <Hero />
      <FeaturedProducts products={products} />
      <Purpose />
      <AnimalBand />
      <Testimonials />
      <Contact />
      <CtaBand />
    </>
  )
}
