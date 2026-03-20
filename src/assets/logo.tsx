interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className='text-xl font-bold'>TRÁMITE</span>
    </div>
  )
}
