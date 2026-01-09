import { FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

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
              <p>adrienbusinessgroupltd@gmail.com</p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-5 pt-6 text-lg text-gray-400">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:text-white transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:text-white transition"
              >
                <FaYoutube />
              </a>
              <a
                href="mailto:info@wall-corp.com"
                className="cursor-pointer hover:text-white transition"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* MIDDLE COLUMN – LOCATIONS */}
          <div className="space-y-12 text-sm leading-relaxed">
            <div>
              <p className="text-gray-400 mb-1">RWANDA</p>
              <p>FJXP+RGW, 4 A, Musanze</p>
            </div>
           
          </div>

          {/* RIGHT COLUMN – CONTACT FORM */}
          <div className="space-y-10">
            

            {/* Map with Location */}
            <div className="pt-10">
  <h4 className="text-sm tracking-[0.25em] uppercase text-gray-400">
    Our Location:
  </h4>

  <div className="pt-4">
    <div className="w-full h-56 rounded-xl overflow-hidden border border-white/10">
      <iframe
        title="Our location"
        src="https://www.google.com/maps?q=FJXP+RGW,4+A,Musanze&output=embed"
        className="w-full h-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
</div>

          </div>

        </div>
      </div>
    </footer>
  );
}
