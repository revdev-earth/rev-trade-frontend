import { motion } from "framer-motion"
import { memo, useLayoutEffect, useState, useRef } from "react"
import create_y_positions from "./create_y_positions"

interface Chart {
  yValues?: number[] // [ 5000, 4000, 3000, 4500, 3500, 5000, 4000, 3000, 4500, 3500, 5000, 4000, 3000, 4500, 3500 ]
  circleRadius?: number
}

export default memo(
  ({
    yValues = [
      5000, 4000, 3000, 4500, 3500, 5000, 4000, 3000, 4500, 3500, 5000, 4000,
      3000, 4500, 3500
    ],
    circleRadius = 3
  }: Chart) => {
    const color = "deeppink"
    const svgRef = useRef<SVGSVGElement>(null)
    const [width, setWidth] = useState<number>(window.innerWidth * 0.5)
    const [height, setHeight] = useState<number>(window.innerHeight * 0.5)

    // console.log(width, height)

    useLayoutEffect(() => {
      const get_sizes = () => {
        // console.log({ current: svgRef.current })
        if (svgRef.current) {
          // console.log(svgRef.current.clientWidth, svgRef.current.clientHeight)
          setWidth(svgRef.current.clientWidth)
          setHeight(svgRef.current.clientHeight)
        }
      }
      get_sizes()
      window.addEventListener("resize", get_sizes)
      return () => window.removeEventListener("resize", get_sizes)
    }, [svgRef.current])

    const circles = create_y_positions({
      width,
      height,
      yValues,
      color,
      circleRadius
    })

    if (!circles) return <motion.div>No hay circulos.</motion.div>
    if (circles.length < 2)
      return <motion.div>pon mas de dos circulos</motion.div>

    const linePoints = circles
      .map((circle) => `${circle.x},${circle.y}`)
      .join(" ")

    return (
      <motion.svg
        ref={svgRef}
        style={{ width: "100%", height: "100%" }}
        className="flex-1"
        {...{
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1,
            width,
            height,
            transition: {
              duration: 0.5
            }
          }
        }}
      >
        {/*  */}

        <>
          <motion.path
            d={`M ${linePoints}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1,
              transition: {
                delay: 1.2
              }
            }}
          />
        </>

        {circles.map((circle, index) => (
          <motion.circle
            key={index}
            cx={circle.x}
            cy={circle.y}
            r={circle.radius}
            fill={circle.color}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1,
              transition: {
                delay: 1
              }
            }}
          />
        ))}

        {/*  */}
      </motion.svg>
    )
  }
)
