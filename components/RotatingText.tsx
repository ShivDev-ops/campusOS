'use client'

import { useEffect, useState } from 'react'

interface Props {
  texts: string[]
  className?: string
}

export default function RotatingText({ texts, className = '' }: Props) {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    if (texts.length <= 1) return

    const interval = setInterval(() => {
      setAnimate(false)
      // Wait for fade out animation to finish before updating text and fading in
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length)
        setAnimate(true)
      }, 300)
    }, 2500)

    return () => clearInterval(interval)
  }, [texts])

  return (
    <span
      className={`inline-block transition-all duration-300 ease-out transform ${
        animate 
          ? 'opacity-100 translate-y-0 filter blur-0' 
          : 'opacity-0 -translate-y-2 filter blur-[2px]'
      } ${className}`}
    >
      {texts[index]}
    </span>
  )
}
