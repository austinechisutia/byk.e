'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { bikeDetails, products } from '@/lib/products';
import { useCart } from '@/context/CartContext';

export default function BikeDetailsPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const product = products.find(
    (item) =>
      item.id === productId &&
      (item.category === 'Bikes' || item.category === 'Electric Bikes'),
  );
  const details = product ? bikeDetails[product.id] : undefined;
  const { addToCart } = useCart();

  if (!product || !details) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f9f9f7] px-6 pt-24">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-gray-900">Bike not found</h1>
          <Link href="/shop" className="mt-5 inline-block text-[#11430F] underline">
            Browse the shop
          </Link>
        </div>
      </main>
    );
  }

  const facts = [
    { label: 'Best terrain', value: details.terrain },
    { label: 'Fit and age', value: details.fit },
    { label: 'Speed', value: details.speed },
    { label: 'Longevity and care', value: details.longevity },
  ];

  return (
    <main className="min-h-screen bg-[#f9f9f7] pb-20 pt-24 md:pt-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <Link href="/shop" className="text-sm text-[#11430F] hover:underline">
          &larr; Back to shop
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4" />
          </div>

          <section className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#11430F]">
              {product.category} / {product.tag}
            </p>
            <h1 className="mt-3 font-serif text-4xl text-gray-900 md:text-5xl">{product.name}</h1>
            <p className="mt-5 leading-relaxed text-gray-600">{details.overview}</p>

            <h2 className="mt-8 text-xl font-semibold text-gray-900">Why riders choose it</h2>
            <ul className="mt-3 space-y-3">
              {details.advantages.map((advantage) => (
                <li key={advantage} className="flex gap-3 text-gray-700">
                  <span aria-hidden="true" className="font-bold text-[#11430F]">+</span>
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">
              <span className="text-2xl font-bold text-gray-900">{product.price}</span>
              {product.sourceUrl ? (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#11430F] px-6 py-3 font-medium text-white transition hover:bg-black"
                >
                  View offer on Kilimall
                </a>
              ) : (
                <button
                  onClick={() => void addToCart(product)}
                  className="rounded-full bg-[#11430F] px-6 py-3 font-medium text-white transition hover:bg-black"
                >
                  Add to cart
                </button>
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              {product.sourceUrl
                ? 'This is a third-party listing, not a Byk.e stock item. Price, size options, and availability may change; confirm details with the seller before purchase.'
                : 'Illustrative product artwork and sample price. Confirm the actual model, components, sizing, availability, and local riding requirements before purchase.'}
            </p>
          </section>
        </div>

        <section className="mt-14">
          <h2 className="font-serif text-3xl text-gray-900">Find your fit and ride</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {facts.map((fact) => (
              <article key={fact.label} className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-gray-900">{fact.label}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{fact.value}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-500">
            Guidance is based on general bicycle category characteristics, not verified specifications
            for a particular make or build. Read more in the{' '}
            <a href={details.sourceUrl} target="_blank" rel="noreferrer" className="text-[#11430F] underline">
              {details.sourceLabel}
            </a>
            . The right fit depends on the individual rider; bike choice is not determined by gender.
          </p>
        </section>
      </div>
    </main>
  );
}
