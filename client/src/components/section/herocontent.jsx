export default function HeroContent() {
  return (
    <section className="w-full bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center">
            <p className="max-w-md text-lg leading-relaxed tracking-wide text-gray-900 mb-6">
              14 years, we have been designing unique structures for better cities
              and a more aesthetic life around the world.
            </p>
            <p className="max-w-md text-lg leading-relaxed tracking-wide text-gray-900">
              We design original and unique structures in every field, from house
              design, the smallest building unit, to floating parks, vertical
              farms for sustainable living, hospitals, offices, factories, museums,
              and art centers reflecting the collective spirit of social life. Every
              detail is meticulously considered to create lasting, thoughtful designs.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col justify-center">
            <p className="max-w-xl text-lg leading-relaxed tracking-wide text-gray-900">
              While we renovate old buildings for a sustainable future, we also
              design new structures in empty spaces. Renovation and new construction
              are both part of our workflow, blending history with modern vision.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
