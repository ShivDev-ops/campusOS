'use client'

import { useState, useEffect } from 'react'

interface Props {
  text: string
  speed?: number
  maxIterations?: number
  className?: string
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[]\\;,./'

export default function DecryptedText({ text, speed = 40, maxIterations = 5, className = '' }: Props) {
  const [displayText, setDisplayText] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    let currentIteration = 0
    let revealedIndex = 0
    
    const interval = setInterval(() => {
      const result = text.split('').map((char, index) => {
        if (char === ' ') return ' '
        if (index < revealedIndex) {
          return text[index]
        }
        return chars[Math.floor(Math.random() * chars.length)]
      }).join('')

      setDisplayText(result)

      currentIteration++
      if (currentIteration >= maxIterations) {
        currentIteration = 0
        revealedIndex++
      }

      if (revealedIndex > text.length) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, maxIterations, isMounted])

  if (!isMounted) {
    return <span className={className}>{text}</span>
  }

  return <span className={className}>{displayText}</span>
}
