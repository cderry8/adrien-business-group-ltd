export default function HeroVideo() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      {/* FIXED Background video */}
      <video
        className="fixed inset-0 h-full w-full object-cover -z-10"
        src="https://adrien.b-cdn.net/kigali.webm"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Soft overlay */}
      <div className="fixed inset-0 bg-black/40 -z-10" />

      {/* Center content */}
      <div className="relative z-10 flex h-full w-full items-end justify-center pb-24">
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <p className="text-sm text-white/80">
            Subscribe email for our newsletter
          </p>
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full rounded-full bg-white/90 px-6 py-3 text-sm black outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

    </section>
  );
}
