/* OM3RATE — animação quadro a quadro do guardião.
   A imagem original é preservada; 25 quadros são pré-renderizados no navegador. */
(() => {
  const canvas = document.getElementById('robot-canvas');
  const source = document.getElementById('robot-source');
  if (!canvas || !source) return;

  const FRAME_COUNT = 25;
  const FRAME_MS = 92;
  const W = 432;
  const H = 911;
  const TAU = Math.PI * 2;
  const frames = [];
  let startedAt = 0;
  let lastFrame = -1;

  const parts = [
    {
      name: 'leftLeg',
      poly: [[.18,.54],[.51,.54],[.50,.98],[.18,.98],[.15,.73]],
      pivot: [.40,.60], z: 1
    },
    {
      name: 'rightLeg',
      poly: [[.47,.53],[.75,.52],[.84,.99],[.48,.99]],
      pivot: [.58,.60], z: 2
    },
    {
      name: 'hips',
      poly: [[.26,.44],[.72,.44],[.76,.66],[.60,.71],[.38,.69],[.24,.58]],
      pivot: [.50,.55], z: 3
    },
    {
      name: 'torso',
      poly: [[.25,.14],[.72,.13],[.82,.30],[.75,.52],[.61,.60],[.36,.58],[.20,.37]],
      pivot: [.50,.36], z: 4
    },
    {
      name: 'leftArm',
      poly: [[.01,.17],[.36,.17],[.40,.38],[.29,.50],[.10,.44],[.00,.31]],
      pivot: [.33,.24], z: 5
    },
    {
      name: 'rightArm',
      poly: [[.57,.16],[.86,.18],[.94,.35],[.88,.51],[.65,.46],[.53,.27]],
      pivot: [.67,.24], z: 6
    },
    {
      name: 'book',
      poly: [[.51,.26],[1,.25],[1,.45],[.88,.49],[.60,.45],[.48,.35]],
      pivot: [.74,.38], z: 7
    },
    {
      name: 'head',
      poly: [[.36,.01],[.63,.01],[.69,.09],[.65,.20],[.56,.24],[.42,.23],[.34,.15]],
      pivot: [.50,.18], z: 8
    },
    {
      name: 'astrolabe',
      circle: [.105,.215,.165],
      pivot: [.105,.215], z: 9
    }
  ].sort((a,b) => a.z-b.z);

  function pathFor(ctx, part, grow = 0) {
    if (part.circle) {
      const [cx, cy, r] = part.circle;
      ctx.beginPath();
      ctx.arc(cx * W, cy * H, r * W + grow, 0, TAU);
      return;
    }
    const pts = part.poly;
    const cx = pts.reduce((s,p)=>s+p[0],0) / pts.length;
    const cy = pts.reduce((s,p)=>s+p[1],0) / pts.length;
    ctx.beginPath();
    pts.forEach((p,i) => {
      let x = p[0] * W;
      let y = p[1] * H;
      if (grow) {
        const vx = p[0] - cx;
        const vy = p[1] - cy;
        const len = Math.hypot(vx * W, vy * H) || 1;
        x += grow * (vx * W / len);
        y += grow * (vy * H / len);
      }
      if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.closePath();
  }

  function clearPart(ctx, part) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    pathFor(ctx, part, 4);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();
  }

  function drawPart(ctx, img, part, angle, dx, dy, scale = 1) {
    const [px, py] = part.pivot;
    ctx.save();
    ctx.translate(px * W + dx, py * H + dy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.translate(-px * W, -py * H);
    pathFor(ctx, part, 1.5);
    ctx.clip();
    ctx.drawImage(img, 0, 0, W, H);
    ctx.restore();
  }

  function motion(name, p) {
    const s = Math.sin(p);
    const c = Math.cos(p);
    switch (name) {
      case 'head':
        return {a:(3.8*Math.sin(p+.15))*Math.PI/180, x:2.4*Math.sin(p*2), y:-3.2*Math.sin(p+.25), s:1};
      case 'leftArm':
        return {a:(-5.2*Math.sin(p+.42))*Math.PI/180, x:-3.5*Math.sin(p+.42), y:-5*Math.sin(p+.42), s:1};
      case 'astrolabe':
        return {a:(4.5*Math.sin(p+.70))*Math.PI/180, x:-2*Math.sin(p+.70), y:-3*Math.sin(p+.70), s:1.012+0.008*Math.sin(p+.70)};
      case 'rightArm':
        return {a:(4.4*Math.sin(p+2.35))*Math.PI/180, x:3.5*Math.sin(p+2.35), y:-4.5*Math.sin(p+2.35), s:1};
      case 'book':
        return {a:(-2.8*Math.sin(p+.80))*Math.PI/180, x:4.5*Math.sin(p+.80), y:-6*Math.sin(p+.80), s:1.006+0.008*Math.sin(p+.80)};
      case 'torso':
        return {a:(1.05*Math.sin(p+.20))*Math.PI/180, x:1.5*Math.sin(p+.20), y:-2.2*Math.sin(p), s:1.003+0.004*Math.sin(p)};
      case 'hips':
        return {a:(-.85*Math.sin(p))*Math.PI/180, x:-2.4*Math.sin(p), y:1.2*Math.sin(p), s:1};
      case 'leftLeg':
        return {a:(1.7*Math.sin(p+Math.PI))*Math.PI/180, x:-1.7*Math.sin(p), y:2.2*Math.sin(p), s:1};
      case 'rightLeg':
        return {a:(-1.7*Math.sin(p+Math.PI))*Math.PI/180, x:1.7*Math.sin(p), y:-2.2*Math.sin(p), s:1};
      default:
        return {a:0,x:0,y:0,s:1};
    }
  }

  function renderFrame(index) {
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const ctx = off.getContext('2d', {alpha:true});
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const p = TAU * index / FRAME_COUNT;

    ctx.clearRect(0,0,W,H);

    // A base permanece parada: somente o personagem muda entre os 25 quadros.
    const floatY = -3.2 * Math.sin(p);
    ctx.drawImage(source,0,0,W,H);

    // Retira as posições originais das regiões móveis.
    for (const part of parts) clearPart(ctx, part);

    // Recoloca cada região em sua posição específica para este quadro.
    for (const part of parts) {
      const m = motion(part.name,p);
      drawPart(ctx,source,part,m.a,m.x,m.y+floatY,m.s);
    }

    return off;
  }

  function buildFrames() {
    frames.length = 0;
    for (let i=0;i<FRAME_COUNT;i++) frames.push(renderFrame(i));
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d',{alpha:true});
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctx.clearRect(0,0,W,H);
      ctx.drawImage(frames[0],0,0);
      return;
    }

    function tick(t) {
      if (!startedAt) startedAt = t;
      const index = Math.floor((t-startedAt)/FRAME_MS) % FRAME_COUNT;
      if (index !== lastFrame) {
        ctx.clearRect(0,0,W,H);
        ctx.drawImage(frames[index],0,0);
        lastFrame = index;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (source.complete && source.naturalWidth) buildFrames();
  else source.addEventListener('load', buildFrames, {once:true});
})();