import { LanguageToggle } from '@/components/ui/language-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-white px-4">
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-navy">
          Obra<span className="text-orange">Kit</span>
        </h1>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
