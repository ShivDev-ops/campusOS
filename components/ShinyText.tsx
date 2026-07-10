'use client'

interface Props {
  text: string
  className?: string
  speed?: number // in seconds
}

export default function ShinyText({ text, className = '', speed = 6 }: Props) {
  return (
    <>
      <style>{`
        @keyframes shiny-text-sweep {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .shiny-text-sweep-class {
          background: linear-gradient(
            120deg,
            #1f2a44 35%,
            #c98a2c 50%,
            #1f2a44 65%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shiny-text-sweep ${speed}s linear infinite;
          display: inline-block;
        }
      `}</style>
      <span className={`shiny-text-sweep-class ${className}`}>{text}</span>
    </>
  )
}
