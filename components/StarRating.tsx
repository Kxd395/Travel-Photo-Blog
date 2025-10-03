'use client'
import { useMemo } from 'react'
type Props = { value: number, size?: number, className?: string }
export default function StarRating({ value, size=18, className='' }: Props) {
  const stars = useMemo(() => {
    const full = Math.floor(value)
    const half = value - full >= 0.5
    return { full, half }
  }, [value])
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rating ${value} out of 5`}>
      {[...Array(stars.full)].map((_,i)=>(<Star key={i} size={size}/>))}
      {stars.half && <Star size={size} half/>}
      {[...Array(5 - stars.full - (stars.half?1:0))].map((_,i)=>(<Star key={`e${i}`} size={size} empty/>))}
    </div>
  )
}
function Star({size, half=false, empty=false}:{size:number, half?:boolean, empty?:boolean}){
  const fill = empty ? 'none' : 'currentColor'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={empty? 'text-gray-300' : 'text-amber-500'}>
      <defs>
        {!empty && half && <linearGradient id="halfGrad"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="transparent"/></linearGradient>}
      </defs>
      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.87 1.401-8.168L.132 9.211l8.2-1.193L12 .587z"
        fill={empty? 'none' : half ? 'url(#halfGrad)' : fill} stroke="currentColor" />
    </svg>
  )
}
