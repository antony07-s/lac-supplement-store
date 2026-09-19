import { ArrowRight, Heart, Leaf, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const promises = [
  { icon: Leaf, label: 'Natural Ingredients', solid: true },
  { icon: Heart, label: 'Everyday Wellness' },
  { icon: UsersRound, label: 'For You & Your Family', solid: true },
]

// Upload hero-banner-clean.jpg to Cloudinary as  ayusydah-home/hero-banner-clean
// (it is the approved banner with the text/buttons removed; all copy below stays live HTML)
const heroImage = (width) =>
  `https://res.cloudinary.com/pggies6d/image/upload/f_auto,q_auto,w_${width}/v1789817334/hero-banner-clean.jpg.png`

// Sizes are measured from the 2172px-wide banner: px ÷ 21.72 = vw, so the text scales
// exactly like the picture. Each value is capped at a 1800px viewport and has a mobile minimum.
const u = (px, min) => `clamp(${min}px, ${(px / 21.72).toFixed(3)}vw, ${Math.round((px * 1800) / 2172)}px)`

const serif = '"Source Serif 4", "Source Serif Pro", Georgia, serif'

const t = {
  line1: {
    fontSize: u(94, 38),
    lineHeight: u(88, 42),
    letterSpacing: '-.012em'
  },

  line2: {
    fontSize: u(76, 29),
    lineHeight: u(84, 34),
    letterSpacing: '-.012em'
  },

  tm: {
    fontSize: '.27em',
    lineHeight: 0,
    marginLeft: '.12em'
  },

  subtitle: {
    fontSize: u(30, 14),
    lineHeight: 1.3,
    marginTop: u(30, 16)
  },

  paragraph: {
    fontSize: u(29.5, 16),
    lineHeight: u(43, 26),
    marginTop: u(26, 14)
  },

  // UPDATED: slightly more spacing between the buttons
  buttons: {
    gap: u(24, 12),
    marginTop: u(38, 24)
  },

  // UPDATED: larger Shop Now button
  primary: {
    fontSize: u(23, 14),
    minHeight: u(62, 46),
    paddingInline: u(52, 24)
  },

  // UPDATED: larger Shop Best Sellers button
  secondary: {
    fontSize: u(21, 13),
    minHeight: u(62, 46),
    paddingInline: u(44, 22)
  },

  promises: {
    marginTop: u(43, 26),
    fontSize: u(20, 13)
  },

  icon: {
    width: u(40, 22),
    height: u(40, 22),
    flex: 'none'
  },

  divider: {
    width: 1,
    height: u(30, 16),
    marginLeft: u(28, 14),
    marginRight: u(14, 0)
  }
}

function HeroSlider() {
  return (
    <section
      aria-label="AYUSYDAH natural wellness"
      className="relative isolate overflow-hidden bg-white lg:aspect-[3/1] lg:max-h-[600px]"
    >
      <div className="relative z-10 flex flex-col justify-center bg-white px-5 pb-4 pt-10 sm:px-8 lg:h-full lg:bg-transparent lg:pl-[3.87vw] lg:pr-0 lg:py-0">
        <h1 className="font-semibold text-[#123b53]" style={{ fontFamily: serif }}>
          <span className="block lg:whitespace-nowrap" style={t.line1}>
            AYUSYDAH
            <sup className="align-super" style={t.tm}>™</sup>
          </span>

          <span className="block lg:whitespace-nowrap" style={t.line2}>
            Natural Wellness Malaysia
          </span>
        </h1>

        <p
          className="font-normal text-[#274c60] lg:whitespace-nowrap"
          style={t.subtitle}
        >
          Herbal Supplements • Ayurvedic Wellness • Juices • Skin &amp; Hair Care
        </p>

        <p className="text-slate-600" style={t.paragraph}>
          Inspired by nature. Designed for everyday wellness.
          <br className="hidden sm:block" /> A healthier you, a brighter tomorrow.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap" style={t.buttons}>
          <Link
            to="/products"
            style={t.primary}
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-[.55em]
              whitespace-nowrap
              rounded-full
              bg-[#b87932]
              font-bold
              uppercase
              tracking-wide
              text-white
              shadow-[0_7px_20px_rgba(184,121,50,0.25)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#123b53]
              hover:shadow-[0_10px_25px_rgba(18,59,83,0.22)]
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#123b53]
            "
          >
            Shop Now

            <ArrowRight
              size="1em"
              strokeWidth={2.4}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/#best-sellers"
            style={t.secondary}
            className="
              inline-flex
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              border-2
              border-[#123b53]
              bg-white/95
              font-bold
              uppercase
              tracking-wide
              text-[#123b53]
              shadow-[0_4px_14px_rgba(18,59,83,0.08)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#123b53]
              hover:text-white
              hover:shadow-[0_10px_24px_rgba(18,59,83,0.18)]
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#123b53]
            "
          >
            Shop Best Sellers
          </Link>
        </div>

        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:gap-x-0"
          style={t.promises}
        >
          {promises.map(({ icon: Icon, label, solid }, i) => (
            <div key={label} className="flex items-center gap-[.65em]">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden bg-slate-300/80 lg:block"
                  style={t.divider}
                />
              )}

              <Icon
                aria-hidden="true"
                style={t.icon}
                strokeWidth={solid ? 1.5 : 2.2}
                fill={solid ? 'currentColor' : 'none'}
                className="text-[#3c715b]"
              />

              <span className="text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photo: behind the text on desktop, under the text on mobile */}
      <div className="relative lg:absolute lg:inset-0 lg:-z-10">
        <img
          src={heroImage(2172)}
          srcSet={`${heroImage(1200)} 1200w, ${heroImage(1800)} 1800w, ${heroImage(2172)} 2172w`}
          sizes="100vw"
          width="2172"
          height="724"
          alt="AYUSYDAH herbal supplements, aloe vera juice, natural skin care cream and hair care oil with fresh botanicals. Goodness from Nature for Everyday Life."
          className="h-[300px] w-full object-cover object-right sm:h-[380px] lg:h-full"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent lg:hidden" />
      </div>
    </section>
  )
}

export default HeroSlider