import { notFound } from 'next/navigation'
import { DialogTitle } from '@/components/ui/dialog'
import { getProduct } from '../../../../lib/products'
import { ProductDetail } from '../../../../components/product/ProductDetail'
import { ProductModal } from '../../../../components/product/ProductModal'

export const revalidate = 60

/**
 * Intercepts `/productos/[slug]` when the buyer is already on `/productos`.
 *
 * The body is the same `ProductDetail` the standalone page renders, so there is
 * one description of a product in the codebase and the two views cannot drift.
 * The title is Radix's `DialogTitle` here and an `h1` there: same words, but
 * inside a modal it also has to name the dialog for assistive technology.
 */
export default async function InterceptedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  return (
    <ProductModal
      href={`/productos/${slug}`}
      title={<DialogTitle className="truncate text-lead">{product.name}</DialogTitle>}
    >
      <ProductDetail product={product} variant="modal" />
    </ProductModal>
  )
}
