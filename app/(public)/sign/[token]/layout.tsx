export default function SignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-warm-white">
      <header className="border-b border-warm-gray bg-white px-4 py-3">
        <div className="mx-auto max-w-md">
          <span className="text-lg font-bold text-navy">
            Obra<span className="text-orange">Kit</span>
          </span>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
