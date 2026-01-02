export default function Footer() {
  return (
    <footer className="bg-black text-[#9a9a9a] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-12">
            <h4 className="text-sm tracking-[0.25em] uppercase text-gray-400">
              Get in touch:
            </h4>

            <div className="text-sm">
              <p className="text-gray-400 mb-1">Email:</p>
              <p>info@wall-corp.com</p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-5 pt-6 text-lg text-gray-400">
              <span className="cursor-pointer hover:text-white transition">f</span>
              <span className="cursor-pointer hover:text-white transition">◎</span>
              <span className="cursor-pointer hover:text-white transition">⦿</span>
              <span className="cursor-pointer hover:text-white transition">▶</span>
              <span className="cursor-pointer hover:text-white transition">in</span>
            </div>
          </div>

          {/* MIDDLE COLUMN – LOCATIONS */}
          <div className="space-y-12 text-sm leading-relaxed">
            <div>
              <p className="text-gray-400 mb-1">RWANDA</p>
              <p>Gisozi, District of Gasabo, Kigali</p>
            </div>

            <div>
              <p className="text-gray-400 mb-1">KENYA</p>
              <p>Landvale, No:30, Westlands</p>
              <p>Rd, Nairobi</p>
            </div>
          </div>

          {/* RIGHT COLUMN – CONTACT FORM */}
          <div className="space-y-10">
            <h4 className="text-sm tracking-[0.25em] uppercase text-gray-400">
              Contact us:
            </h4>

            <form className="grid grid-cols-2 gap-4 text-sm">
              <input
                type="text"
                placeholder="Name"
                className="bg-transparent border border-gray-600 px-4 py-3 focus:outline-none focus:border-gray-400"
              />

              <textarea
                placeholder="Message"
                className="row-span-3 bg-transparent border border-gray-600 px-4 py-3 resize-none focus:outline-none focus:border-gray-400"
              />

              <input
                type="email"
                placeholder="E-mail *"
                className="bg-transparent border border-gray-600 px-4 py-3 focus:outline-none focus:border-gray-400"
              />

              <input
                type="text"
                placeholder="Subject"
                className="bg-transparent border border-gray-600 px-4 py-3 focus:outline-none focus:border-gray-400"
              />

              <div className="col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#b29b85] text-black px-6 py-2 text-sm tracking-wide hover:bg-[#c7b39e] transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}
    