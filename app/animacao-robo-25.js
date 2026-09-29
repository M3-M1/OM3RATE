/* OM3RATE — guardião em 25 quadros com transição suave entre frames. */
(() => {
  const canvas = document.getElementById('robot-canvas');
  const source = document.getElementById('robot-source');
  if (!canvas || !source) return;

  const W = 432;
  const H = 911;
  const FRAME_COUNT = 25;
  const FRAME_DURATION = 105;
  const TAU = Math.PI * 2;
  const frames = [];

  canvas.width = W;
  canvas.height = H;
  const out = canvas.getContext('2d', { alpha: true });
  out.imageSmoothingEnabled = true;
  out.imageSmoothingQuality = 'high';

  const parts = [
    {name:'leftLeg',poly:[[.18,.54],[.51,.54],[.50,.99],[.18,.99],[.15,.73]],pivot:[.40,.60]},
    {name:'rightLeg',poly:[[.47,.53],[.75,.52],[.84,.99],[.48,.99]],pivot:[.58,.60]},
    {name:'hips',poly:[[.26,.44],[.72,.44],[.76,.66],[.60,.71],[.38,.69],[.24,.58]],pivot:[.50,.55]},
    {name:'torso',poly:[[.25,.14],[.72,.13],[.82,.30],[.75,.52],[.61,.60],[.36,.58],[.20,.37]],pivot:[.50,.36]},
    {name:'leftArm',poly:[[.01,.17],[.36,.17],[.40,.38],[.29,.50],[.10,.44],[.00,.31]],pivot:[.33,.24]},
    {name:'rightArm',poly:[[.57,.16],[.86,.18],[.94,.35],[.88,.51],[.65,.46],[.53,.27]],pivot:[.67,.24]},
    {name:'book',poly:[[.51,.26],[1,.25],[1,.45],[.88,.49],[.60,.45],[.48,.35]],pivot:[.74,.38]},
    {name:'head',poly:[[.36,.01],[.63,.01],[.69,.09],[.65,.20],[.56,.24],[.42,.23],[.34,.15]],pivot:[.50,.18]},
    {name:'astrolabe',circle:[.105,.215,.165],pivot:[.105,.215]}
  ];

  function makePath(ctx, part, grow=0) {
    if (part.circle) {
      const [cx,cy,r] = part.circle;
      ctx.beginPath();
      ctx.arc(cx*W, cy*H, r*W + grow, 0, TAU);
      return;
    }
    const pts = part.poly;
    const cx = pts.reduce((s,p)=>s+p[0],0)/pts.length;
    const cy = pts.reduce((s,p)=>s+p[1],0)/pts.length;
    ctx.beginPath();
    pts.forEach((p,i)=>{
      let x=p[0]*W, y=p[1]*H;
      if(grow){
        const vx=p[0]-cx, vy=p[1]-cy;
        const len=Math.hypot(vx*W,vy*H)||1;
        x += grow*(vx*W/len);
        y += grow*(vy*H/len);
      }
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.closePath();
  }

  function clearPart(ctx, part) {
    ctx.save();
    ctx.globalCompositeOperation='destination-out';
    makePath(ctx,part,3);
    ctx.fillStyle='#000';
    ctx.fill();
    ctx.restore();
  }

  function drawPart(ctx, part, motion) {
    const [px,py]=part.pivot;
    ctx.save();
    ctx.translate(px*W+motion.x, py*H+motion.y);
    ctx.rotate(motion.a);
    ctx.scale(motion.s,motion.s);
    ctx.translate(-px*W,-py*H);
    makePath(ctx,part,1);
    ctx.clip();
    ctx.drawImage(source,0,0,W,H);
    ctx.restore();
  }

  function motion(name,p) {
    switch(name){
      case 'head': return {a:Math.sin(p+.2)*2.0*Math.PI/180,x:1.2*Math.sin(p*2),y:-1.8*Math.sin(p+.2),s:1};
      case 'leftArm': return {a:-Math.sin(p+.45)*2.7*Math.PI/180,x:-1.8*Math.sin(p+.45),y:-2.8*Math.sin(p+.45),s:1};
      case 'astrolabe': return {a:Math.sin(p+.7)*2.2*Math.PI/180,x:-1.2*Math.sin(p+.7),y:-1.8*Math.sin(p+.7),s:1.005};
      case 'rightArm': return {a:Math.sin(p+2.3)*2.4*Math.PI/180,x:1.8*Math.sin(p+2.3),y:-2.5*Math.sin(p+2.3),s:1};
      case 'book': return {a:-Math.sin(p+.8)*1.6*Math.PI/180,x:2.2*Math.sin(p+.8),y:-3*Math.sin(p+.8),s:1.004};
      case 'torso': return {a:Math.sin(p+.2)*.55*Math.PI/180,x:.7*Math.sin(p+.2),y:-1.2*Math.sin(p),s:1.002};
      case 'hips': return {a:-Math.sin(p)*.45*Math.PI/180,x:-1.1*Math.sin(p),y:.5*Math.sin(p),s:1};
      case 'leftLeg': return {a:Math.sin(p+Math.PI)*.8*Math.PI/180,x:-.8*Math.sin(p),y:1.1*Math.sin(p),s:1};
      case 'rightLeg': return {a:-Math.sin(p+Math.PI)*.8*Math.PI/180,x:.8*Math.sin(p),y:-1.1*Math.sin(p),s:1};
      default: return {a:0,x:0,y:0,s:1};
    }
  }

  function renderFrame(i){
    const off=document.createElement('canvas');
    off.width=W; off.height=H;
    const ctx=off.getContext('2d',{alpha:true});
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality='high';

    const p=TAU*i/FRAME_COUNT;
    ctx.clearRect(0,0,W,H);
    ctx.drawImage(source,0,0,W,H);

    for(const part of parts) clearPart(ctx,part);
    for(const part of parts) drawPart(ctx,part,motion(part.name,p));

    return off;
  }

  function ease(t){
    return 0.5 - Math.cos(Math.PI*t)/2;
  }

  function start(){
    frames.length=0;
    for(let i=0;i<FRAME_COUNT;i++) frames.push(renderFrame(i));

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      out.clearRect(0,0,W,H);
      out.drawImage(frames[0],0,0);
      return;
    }

    let startTime=0;
    function animate(now){
      if(!startTime) startTime=now;
      const raw=(now-startTime)/FRAME_DURATION;
      const base=Math.floor(raw);
      const current=base%FRAME_COUNT;
      const next=(current+1)%FRAME_COUNT;
      const mix=ease(raw-base);

      out.clearRect(0,0,W,H);
      out.globalAlpha=1-mix;
      out.drawImage(frames[current],0,0);
      out.globalAlpha=mix;
      out.drawImage(frames[next],0,0);
      out.globalAlpha=1;

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  if(source.complete && source.naturalWidth) start();
  else source.addEventListener('load',start,{once:true});
})();