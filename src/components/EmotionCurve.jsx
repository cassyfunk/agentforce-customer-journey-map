import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { STAGES } from '../data/journeyData'

// Draws a smooth SVG path connecting each stage's sentiment score.
// sentiment range: -2 (very negative) → +2 (very positive)

export default function EmotionCurve() {
  const svgRef = useRef(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const W = el.clientWidth || 800
    const H = 80
    const padding = { left: 60, right: 60, top: 10, bottom: 10 }

    d3.select(el).selectAll('*').remove()

    const svg = d3.select(el)
      .attr('width', W)
      .attr('height', H)

    const xScale = d3.scaleLinear()
      .domain([0, STAGES.length - 1])
      .range([padding.left, W - padding.right])

    const yScale = d3.scaleLinear()
      .domain([-2, 2])
      .range([H - padding.bottom, padding.top])

    // Neutral midline
    svg.append('line')
      .attr('x1', padding.left).attr('x2', W - padding.right)
      .attr('y1', yScale(0)).attr('y2', yScale(0))
      .attr('stroke', '#e2e8f0').attr('stroke-dasharray', '4,4').attr('stroke-width', 1)

    // Labels
    svg.append('text')
      .attr('x', 4).attr('y', yScale(2) + 4)
      .text('😊').attr('font-size', 14).attr('text-anchor', 'start')
    svg.append('text')
      .attr('x', 4).attr('y', yScale(-2) + 4)
      .text('😟').attr('font-size', 14).attr('text-anchor', 'start')

    // Gradient fill
    const defs = svg.append('defs')
    const grad = defs.append('linearGradient')
      .attr('id', 'emotionGrad').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#22c55e').attr('stop-opacity', 0.3)
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#22c55e').attr('stop-opacity', 0.0)

    const points = STAGES.map((s, i) => [xScale(i), yScale(s.sentiment)])

    const line = d3.line().curve(d3.curveCatmullRom.alpha(0.5))
    const area = d3.area().curve(d3.curveCatmullRom.alpha(0.5))
      .x(d => d[0]).y0(yScale(0)).y1(d => d[1])

    svg.append('path')
      .datum(points)
      .attr('d', area)
      .attr('fill', 'url(#emotionGrad)')

    svg.append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#16a34a')
      .attr('stroke-width', 2.5)

    // Dots
    STAGES.forEach((s, i) => {
      svg.append('circle')
        .attr('cx', xScale(i)).attr('cy', yScale(s.sentiment))
        .attr('r', 5)
        .attr('fill', 'white').attr('stroke', '#16a34a').attr('stroke-width', 2)
    })
  }, [])

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
        Customer Sentiment
      </p>
      <svg ref={svgRef} className="w-full" style={{ height: 80 }} />
    </div>
  )
}
