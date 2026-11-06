import Link from 'next/link';

const rides = [
  {
    title: 'The daily commute',
    category: 'City rides',
    description: 'Make the morning route your own.',
    image:
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=85',
    alt: 'Cyclist riding along a city street',
    imagePosition: 'center',
  },
  {
    title: 'Take the long way',
    category: 'Trails & hikes',
    description: 'Find fresh air beyond the pavement.',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=85',
    alt: 'Rider enjoying an outdoor trail',
    imagePosition: 'center',
  },
  {
    title: 'Good things on the way',
    category: 'Delivery days',
    description: 'Bring the neighborhood a little closer.',
    image:
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=85',
    alt: 'Cyclist out for a ride',
    imagePosition: 'center',
  },
  {
    title: 'Leave the jam behind',
    category: 'Beat the traffic',
    description: 'Keep moving when the roads slow down.',
    image:
      'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1200&q=85',
    alt: 'Cyclists riding together on an open road',
    imagePosition: 'center',
  },
  {
    title: 'Race day energy',
    category: 'Competition',
    description: 'Big goals are better on two wheels.',
    image:
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=85',
    alt: 'Bicycle ready for a day of riding',
    imagePosition: 'center',
  },
  {
    title: 'Your own backyard',
    category: 'Neighborhood',
    description: 'Little rides can make the best memories.',
    image: '/electric-bikes/city-bike.jpg',
    alt: 'Bicycle ready for a neighborhood ride',
    imagePosition: 'center',
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f9f9f7] pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 font-sans tracking-wide md:px-12">
        <header className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#52704e]">
              The Byk.e ride gallery
            </p>
            <h1 className="max-w-3xl text-3xl font-normal leading-tight text-gray-900 sm:text-4xl md:text-5xl">
              One bike, <span className="font-serif italic">many ways</span> to get there.
            </h1>
          </div>
          <p className="max-w-sm leading-relaxed text-gray-600">
            From busy streets to open trails, see where a good ride can take you.
          </p>
        </header>

        <section aria-label="Riders and bikes in different places" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rides.map((ride, index) => (
            <article key={ride.title} className="group relative isolate aspect-[4/5] overflow-hidden rounded-xl bg-gray-200">
              <img
                src={ride.image}
                alt={ride.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: ride.imagePosition }}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/80">
                  {ride.category}
                </p>
                <h2 className="text-2xl font-medium md:text-3xl">{ride.title}</h2>
                <p className="mt-2 text-sm text-white/85">{ride.description}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-gray-200 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-gray-600">
            What will your next ride look like? Find a bike for your route and make it yours.
          </p>
          <Link
            href="/shop"
            className="border border-[#11430F] px-6 py-3 text-sm text-[#11430F] transition-colors hover:bg-[#11430F] hover:text-white"
          >
            Find your bike
          </Link>
        </div>
      </div>
    </main>
  );
}
