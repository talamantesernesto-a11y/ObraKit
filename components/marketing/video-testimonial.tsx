import { getTranslations } from 'next-intl/server'
import { Play, Star } from 'lucide-react'

export async function VideoTestimonial() {
  const t = await getTranslations('landing')

  return (
    <section className="bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Video placeholder */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0">
            {/* Video container */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-navy-dark shadow-2xl">
              {/* Placeholder thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy" />

              {/* Construction imagery overlay */}
              <div className="absolute inset-0 bg-blueprint opacity-30" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange shadow-lg shadow-orange/30 transition-transform hover:scale-110">
                  <Play className="ml-1 h-8 w-8 text-white" fill="white" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">2:30</span>
              </div>

              {/* "Watch story" label */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">{t('videoWatchStory')}</span>
              </div>
            </div>
          </div>

          {/* Right: Quote + info */}
          <div>
            {/* Stars */}
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-orange text-orange" />
              ))}
            </div>

            <blockquote className="font-display text-2xl font-semibold leading-relaxed text-white sm:text-3xl">
              &ldquo;{t('videoQuote')}&rdquo;
            </blockquote>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange/20 font-display text-lg font-bold text-orange">
                {t('videoAuthorInitials')}
              </div>
              <div>
                <div className="font-semibold text-white">{t('videoAuthor')}</div>
                <div className="text-sm text-white/60">{t('videoAuthorRole')}</div>
                <div className="text-sm text-white/40">{t('videoAuthorLocation')}</div>
              </div>
            </div>

            {/* Key metric */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
              <span className="font-display text-2xl font-bold text-orange">{t('videoMetricValue')}</span>
              <span className="text-sm text-white/70">{t('videoMetricLabel')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
