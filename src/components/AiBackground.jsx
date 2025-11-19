import React, { useRef, useEffect } from 'react';

// --- Konfigurasi Animasi (Warna terang) ---
const CONFIG = {
  particleColor: `rgba(29, 78, 216, 0.5)`, // Biru-700
  lineColor: `rgba(59, 130, 246, 0.3)`,     // Biru-600
  particleAmount: 70,
  defaultRadius: 2,
  variantRadius: 2,
  defaultSpeed: 0.05,
  variantSpeed: 0.1,
  linkRadius: 200,
};

// --- Kelas Partikel ---
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * CONFIG.defaultSpeed + (Math.random() - 0.5) * CONFIG.variantSpeed;
    this.vy = (Math.random() - 0.5) * CONFIG.defaultSpeed + (Math.random() - 0.5) * CONFIG.variantSpeed;
    this.radius = Math.random() * CONFIG.variantRadius + CONFIG.defaultRadius;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > this.canvas.width || this.x < 0) this.vx *= -1;
    if (this.y > this.canvas.height || this.y < 0) this.vy *= -1;
  }

  draw(ctx) {
    ctx.fillStyle = CONFIG.particleColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Komponen React ---
const AiBackground = () => {
  const canvasRef = useRef(null); 
  const mouse = useRef({ x: 0, y: 0 }); 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      // --- PERUBAHAN --- Kembali menggunakan window.innerWidth/Height
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particles = [];
      for (let i = 0; i < CONFIG.particleAmount; i++) {
        particles.push(new Particle(canvas));
      }
    };

    const handleMouseMove = (e) => { 
      // --- PERUBAHAN --- Kembali menggunakan e.clientX/Y
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (distance < CONFIG.linkRadius) {
            const opacity = 1 - (distance / CONFIG.linkRadius);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`; 
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const particle of particles) {
           const distance = Math.hypot(particle.x - mouse.current.x, particle.y - mouse.current.y);
           if (distance < CONFIG.linkRadius) {
              const opacity = 1 - (distance / CONFIG.linkRadius);
              ctx.strokeStyle = `rgba(29, 78, 216, ${opacity * 0.4})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(mouse.current.x, mouse.current.y);
              ctx.stroke();
           }
      }
      
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    animate();
    
    // --- PERUBAHAN --- Kembali mendengarkan di 'window'
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); 

  return (
    <canvas
      ref={canvasRef}
      style={{
        // --- PERUBAHAN --- dari 'absolute' kembali ke 'fixed'
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        // --- PERUBAHAN --- Mengatur warna bg-blue-50 di sini
        background: '#eff6ff', 
        pointerEvents: 'none', 
      }}
    />
  );
};

export default AiBackground ;