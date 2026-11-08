import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const LINK_DISTANCE = 150;

/**
 * The slow-moving hero background: drifting connected nodes over an abstract
 * chart line. The line is decorative noise and represents no real market data.
 */
export default function NetworkCanvas() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const node = styles.getPropertyValue('--net-node').trim();
    const line = styles.getPropertyValue('--net-line').trim();
    const chart = styles.getPropertyValue('--net-chart').trim();

    let width = 0;
    let height = 0;
    let nodes = [];
    let frame = 0;
    let visible = true;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.round((width * height) / 24000), 60);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        r: 1 + Math.random() * 1.5,
      }));
    };

    const drawChart = () => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const t = x * 0.006 + time * 0.00016;
        const y = height * 0.74 - Math.sin(t) * 34 - Math.sin(t * 2.3 + 1) * 17 - Math.sin(t * 5.1 + 2) * 7 - (x / width) * height * 0.2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `rgba(${node}, 0)`);
      gradient.addColorStop(0.45, `rgba(${node}, 0.3)`);
      gradient.addColorStop(1, `rgba(${chart}, 0.42)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawChart();
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${line}, ${0.17 * (1 - d / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${node}, 0.5)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now) => {
      time = now;
      if (visible && !document.hidden) {
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        });
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(canvas);

    if (reduced) draw();
    else frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [reduced, theme]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />;
}
