import { getTranslations } from 'next-intl/server'
import { Star, Quote } from 'lucide-react'

export async function Testimonials() {
  const t = await getTranslations('landing')

  const testimonials = [
    {
      name: t('testimonial1Name'),
      role: t('testimonial1Role'),
      location: t('testimonial1Location'),
      quote: t('testimonial1Quote'),
      rating: 5,
      initials: 'CM',
      color: 'bg-orange/20 text-orange',
    },
    {
      name: t('testimonial2Name'),
      role: t('testimonial2Role'),
      location: t('testimonial2Location'),
      quote: t('testimonial2Quote'),
      rating: 5,
      initials: 'RG',
      color: 'bg-risk-low/20 text-risk-low',
    },
    {
      name: t('testimonial3Name'),
      role: t('testimonial3Role'),
      location: t('testimonial3Location'),
      quote: t('testimonial3Quote'),
      rating: 5,
      initials: 'ML',
      color: 'bg-status-generated/20 text-status-generated',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-warm-white py-20 sm:py-28">
      {/* Subtle background accent */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-orange/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />
              ))}
            </div>
            <span className="text-xs font-semibold text-orange">{t('testimonialsRating')}</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            {t('testimonialsTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-dark">
            {t('testimonialsSubtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="group relative rounded-2xl border border-warm-gray bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Quote icon */}
              <Quote className="mb-4 h-8 w-8 text-orange/20" />

              {/* Quote text */}
              <blockquote className="text-sm leading-relaxed text-navy/80">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              {/* Stars */}
              <div className="mt-4 flex gap-0.5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange text-orange" />
                ))}
              </div>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 border-t border-warm-gray pt-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${item.color}`}>
                  {item.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy">{item.name}</div>
                  <div className="text-xs text-warm-dark">{item.role} &middot; {item.location}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
