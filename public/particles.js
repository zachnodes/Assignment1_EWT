// Animated background: soft circles the same colour as the page,
// with a faint shadow so they look embossed and barely there.
// Plain JavaScript and a <canvas>, no libraries.

(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');

  // Same colours as style.css
  const pageColour = '#e9e4dc';
  const shadowColour = 'rgba(160, 150, 135, 0.18)';
  const highlightColour = 'rgba(255, 255, 255, 0.25)';

  const particles = [];
  let width = 0;
  let height = 0;

  // Respect people who turn off animations in their system settings
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 6 + Math.random() * 22,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25
    };
  }

  function setup() {
    resize();
    particles.length = 0;

    // Fewer particles on small screens
    const count = Math.round((width * height) / 38000);
    for (let i = 0; i < count; i++) {
      particles.push(makeParticle());
    }
  }

  function drawParticle(p) {
    // Soft shadow down and to the right, so it looks raised
    ctx.shadowColor = shadowColour;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = pageColour;
    ctx.fill();

    // Very faint highlight on the top-left edge
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, Math.PI * 1.05, Math.PI * 1.45);
    ctx.strokeStyle = highlightColour;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function moveParticle(p) {
    p.x += p.speedX;
    p.y += p.speedY;

    // Wrap around the edges so particles never disappear
    if (p.x < -p.radius) { p.x = width + p.radius; }
    if (p.x > width + p.radius) { p.x = -p.radius; }
    if (p.y < -p.radius) { p.y = height + p.radius; }
    if (p.y > height + p.radius) { p.y = -p.radius; }
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      moveParticle(particles[i]);
      drawParticle(particles[i]);
    }
    window.requestAnimationFrame(frame);
  }

  window.addEventListener('resize', setup);
  setup();

  if (reduceMotion) {
    // Draw once and don't animate
    for (let i = 0; i < particles.length; i++) {
      drawParticle(particles[i]);
    }
  } else {
    frame();
  }
})();