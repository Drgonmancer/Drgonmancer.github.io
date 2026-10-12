'use strict';
(() => {
 const world=document.body.dataset.world,config=window.WORLD_CONFIG[world];
 const scene=document.getElementById('scene'),canvas=document.getElementById('world-canvas'),particlesCanvas=document.getElementById('particle-canvas');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),motion=document.getElementById('motion-button'),soundButton=document.getElementById('sound-button');
 const ctx=particlesCanvas.getContext('2d');
 let gl=null,program=null,uniforms={},width=1,height=1,paused=reduced.matches,visible=true,lost=false;
 let time=11.7,frame=0,last=0,burstAt=-100,burst=0,power=.65,hue=0,frames=0;
 let pointerX=0,pointerY=0,targetX=0,targetY=0,pointerActive=false,screenX=0,screenY=0;
 let trails=[],sparks=[],waves=[],ambient=[],audio=null,audioGain=null,soundOn=false;
 const accents={cyber:['#80f7de','#ed64bf','#68a6ff'],singularity:['#f6b984','#dc8265','#b5a4e7'],prism:['#d5b9ff','#97e6d1','#f2acd8'],hyperdrive:['#fc83dc','#68d8ed','#ad8fee']};
 const color=accents[world];
 function shader(type,source){const compiled=gl.createShader(type);gl.shaderSource(compiled,source);gl.compileShader(compiled);if(!gl.getShaderParameter(compiled,gl.COMPILE_STATUS)){const log=gl.getShaderInfoLog(compiled);gl.deleteShader(compiled);throw new Error(log);}return compiled;}
 function setupGL(){
  try{
   gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
   if(!gl)throw new Error('WebGL unavailable');
   const vertex=shader(gl.VERTEX_SHADER,window.WORLD_SHADERS.vertex),fragment=shader(gl.FRAGMENT_SHADER,window.WORLD_SHADERS[world]);
   program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
   gl.deleteShader(vertex);gl.deleteShader(fragment);gl.useProgram(program);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
   const location=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
   ['u_resolution','u_mouse','u_time','u_power','u_burst','u_hue'].forEach(name=>uniforms[name]=gl.getUniformLocation(program,name));
   canvas.dataset.renderer='webgl';canvas.dataset.shader='compiled';document.body.dataset.renderer='webgl';
  }catch(error){
   canvas.dataset.renderer='fallback';document.body.dataset.renderer='fallback';canvas.dataset.shaderError=error.message;
   gl=null;program=null;document.body.classList.add('fallback-renderer');
   document.querySelector('.fx-status').textContent='当前设备使用轻量视觉模式。';
  }
 }
 function resize(){
  const rect=scene.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
  const scale=width>1100?.70:width>700?.8:Math.min(window.devicePixelRatio||1,1.35);
  canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
  const dpr=Math.min(window.devicePixelRatio||1,1.5);particlesCanvas.width=Math.round(width*dpr);particlesCanvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  if(gl&&!lost){gl.viewport(0,0,canvas.width,canvas.height);}
  const count=width<700?48:105;
  ambient=Array.from({length:count},(_,i)=>({x:((i*37.73)%100)/100*width,y:((i*53.19)%100)/100*height,z:.15+(i%7)/8,size:.4+(i%5)*.20,phase:i*.51}));
  render();
 }
 function drawGL(){
  if(!gl||lost)return;
  gl.useProgram(program);gl.uniform2f(uniforms.u_resolution,canvas.width,canvas.height);gl.uniform2f(uniforms.u_mouse,pointerX,pointerY);
  gl.uniform1f(uniforms.u_time,time);gl.uniform1f(uniforms.u_power,power);gl.uniform1f(uniforms.u_burst,burst);gl.uniform1f(uniforms.u_hue,hue);
  gl.drawArrays(gl.TRIANGLES,0,6);
 }
 function fallback(){
  const cx=width*.5,cy=height*.55,r=Math.min(width,height)*.30;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(time*.05);
  const gradient=ctx.createRadialGradient(0,0,r*.18,0,0,r*1.6);gradient.addColorStop(0,'transparent');gradient.addColorStop(.42,color[0]+'48');gradient.addColorStop(.66,color[1]+'24');gradient.addColorStop(1,'transparent');ctx.fillStyle=gradient;ctx.fillRect(-width,-height,width*2,height*2);
  ctx.strokeStyle=color[0];ctx.lineWidth=1;
  for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(0,0,r*(1+i*.06),r*(.35+i*.05),i*.4,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
 }
 function drawParticles(){
  ctx.clearRect(0,0,width,height);
  if(!gl)fallback();
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const p of ambient){
   let x=p.x+pointerX*p.z*18,y=p.y+pointerY*p.z*18;
   if(world==='hyperdrive'){
    const t=(time*(.045+power*.10)+p.phase)%1,angle=p.phase*2.5,extent=(.035+t*t)*Math.max(width,height)*.69;
    x=width*.5+Math.cos(angle)*extent;y=height*.53+Math.sin(angle)*extent;
    ctx.strokeStyle=color[p.phase>20?0:1];ctx.globalAlpha=.08+t*.38;ctx.lineWidth=p.size;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*(3+t*t*24),y+Math.sin(angle)*(3+t*t*24));ctx.stroke();
   }else{
    x+=Math.sin(time*.10+p.phase)*5;y+=Math.cos(time*.12+p.phase)*4;ctx.fillStyle=color[Math.floor(p.phase)%3];ctx.globalAlpha=.07+p.z*.22;ctx.fillRect(x,y,p.size,p.size);
   }
  }
  for(let i=0;i<trails.length;i++){
   const p=trails[i],life=Math.max(0,1-(time-p.born)/.58);ctx.globalAlpha=life*.65;ctx.fillStyle=color[p.color];ctx.shadowColor=color[p.color];ctx.shadowBlur=14*life;
   ctx.beginPath();ctx.arc(p.x,p.y,(p.size*life)+.25,0,Math.PI*2);ctx.fill();
   if(i>0&&Math.hypot(p.x-trails[i-1].x,p.y-trails[i-1].y)<60){ctx.strokeStyle=color[p.color];ctx.lineWidth=1.2*life;ctx.beginPath();ctx.moveTo(trails[i-1].x,trails[i-1].y);ctx.lineTo(p.x,p.y);ctx.stroke();}
  }
  ctx.shadowBlur=0;
  for(const p of sparks){const age=time-p.born,life=Math.max(0,1-age/p.life);const dx=p.vx*age*(1+age*.3),dy=p.vy*age+age*age*20;ctx.globalAlpha=life*.9;ctx.strokeStyle=color[p.color];ctx.lineWidth=p.size*life+.3;ctx.beginPath();ctx.moveTo(p.x+dx,p.y+dy);ctx.lineTo(p.x+dx-p.vx*.026,p.y+dy-p.vy*.026);ctx.stroke();}
  for(const p of waves){const age=time-p.born,life=Math.max(0,1-age/1.7);const radius=age*(210+power*120);ctx.globalAlpha=life*.45;ctx.strokeStyle=color[0];ctx.lineWidth=1.4*life;ctx.shadowColor=color[0];ctx.shadowBlur=11;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
  if(pointerActive&&width>700&&!paused){ctx.globalAlpha=.45;ctx.strokeStyle=color[0];ctx.lineWidth=.7;ctx.beginPath();ctx.arc(screenX,screenY,11,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.9;ctx.fillStyle=color[0];ctx.beginPath();ctx.arc(screenX,screenY,2,0,Math.PI*2);ctx.fill();}
  ctx.restore();
 }
 function render(){drawGL();drawParticles();canvas.dataset.frame=String(frames);canvas.dataset.time=time.toFixed(3);}
 function allowed(){return !paused&&visible&&!document.hidden&&!lost;}
 function tick(now){frame=0;if(!allowed())return;
  if(!last||now-last>=31){
   const delta=last?Math.min((now-last)/1000,.09):.001;last=now;time+=delta;frames++;
   pointerX+=(targetX-pointerX)*.10;pointerY+=(targetY-pointerY)*.10;
   burst=Math.max(0,1-(time-burstAt)/1.55);if(burst<=0)document.body.classList.remove('burst-active');
   trails=trails.filter(p=>time-p.born<.6);sparks=sparks.filter(p=>time-p.born<p.life);waves=waves.filter(p=>time-p.born<1.7);
   render();
  }
  frame=requestAnimationFrame(tick);
 }
 function sync(){
  if(frame)cancelAnimationFrame(frame);frame=0;last=0;
  document.body.classList.toggle('is-paused',paused);document.body.dataset.motion=paused?'paused':'running';
  motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'继续动效':'暂停动效');
  motion.querySelector('span').textContent=paused?'PLAY':'PAUSE';motion.querySelector('svg').innerHTML=paused?'<path d="m5 3 11 6-11 6z"/>':'<path d="M4 3h3v12H4zm7 0h3v12h-3z"/>';
  render();if(allowed())frame=requestAnimationFrame(tick);
  if(audio){if(document.hidden)audio.suspend();else if(soundOn)audio.resume();}
 }
 function trigger(x=width*.68,y=height*.49){
  if(reduced.matches||paused){if(world==='prism'){hue=(hue+.333)%1;render();}return;}
  burstAt=time;burst=1;document.body.classList.add('burst-active');scene.dataset.bursts=String(Number(scene.dataset.bursts||0)+1);
  const count=width<700?43:84;
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2,velocity=45+((i*23.7)%160);sparks.push({x,y,vx:Math.cos(a)*velocity,vy:Math.sin(a)*velocity,color:i%3,size:.6+(i%4)*.3,life:.65+(i%6)*.16,born:time});}
  waves.push({x,y,born:time});if(world==='prism')hue=(hue+.333)%1;
  render();
 }
 scene.addEventListener('pointermove',event=>{
  if(paused||!window.matchMedia('(pointer:fine)').matches)return;
  const r=scene.getBoundingClientRect();const x=event.clientX-r.left,y=event.clientY-r.top;
  screenX=x;screenY=y;targetX=x/width-.5;targetY=.5-y/height;pointerActive=true;
  trails.push({x,y,color:Math.floor(time*5)%3,size:1.8+(trails.length%3)*.7,born:time});if(trails.length>85)trails.shift();
  const elX=document.getElementById('mouse-x'),elY=document.getElementById('mouse-y');if(elX){elX.textContent=targetX.toFixed(3);elY.textContent=targetY.toFixed(3);}
 },{passive:true});
 scene.addEventListener('pointerleave',()=>{pointerActive=false;targetX=targetY=0;});
 scene.addEventListener('click',event=>{if(event.target.closest('button,a,input,label,.scene-controls'))return;const r=scene.getBoundingClientRect();trigger(event.clientX-r.left,event.clientY-r.top);});
 document.querySelectorAll('[data-burst]').forEach(button=>button.addEventListener('click',()=>trigger(width*(width<700?.5:.68),height*.51)));
 document.querySelectorAll('[data-hue]').forEach(button=>button.addEventListener('click',()=>{hue=Number(button.dataset.hue);document.querySelectorAll('[data-hue]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
 const slider=document.getElementById('power');slider.addEventListener('input',()=>{power=Number(slider.value)/100;document.getElementById('power-output').value=slider.value+'%';scene.dataset.power=slider.value;render();});
 motion.addEventListener('click',()=>{paused=!paused;sync();});
 reduced.addEventListener('change',event=>{paused=event.matches;trails=[];sparks=[];waves=[];burst=0;sync();});
 document.addEventListener('visibilitychange',sync);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.06}).observe(scene);
 new ResizeObserver(resize).observe(scene);
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.dataset.context='lost';if(frame)cancelAnimationFrame(frame);document.querySelector('.fx-status').textContent='视觉引擎暂时暂停，正在等待恢复。';});
 canvas.addEventListener('webglcontextrestored',()=>{lost=false;setupGL();resize();sync();document.querySelector('.fx-status').textContent='';canvas.dataset.context='restored';});
 window.addEventListener('message',event=>{if(event.source!==window.parent||!event.data)return;if(event.data.type==='concept-motion'){paused=Boolean(event.data.paused)||reduced.matches;sync();}if(event.data.type==='concept-burst')trigger();});
 soundButton.addEventListener('click',async()=>{
  try{
   if(!audio){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)throw new Error('unsupported');audio=new AudioContext();audioGain=audio.createGain();audioGain.gain.value=0;audioGain.connect(audio.destination);
    const base={cyber:55,singularity:44,prism:73.42,hyperdrive:61.74}[world];[1,1.5,2.003].forEach((factor,i)=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type=i===0?'sine':'triangle';osc.frequency.value=base*factor;gain.gain.value=.10/(i+1);osc.connect(gain);gain.connect(audioGain);osc.start();});
   }
   soundOn=!soundOn;await audio.resume();audioGain.gain.cancelScheduledValues(audio.currentTime);audioGain.gain.setTargetAtTime(soundOn?.11:0,audio.currentTime,.18);
   soundButton.setAttribute('aria-pressed',String(soundOn));soundButton.setAttribute('aria-label',soundOn?'关闭环境音':'开启环境音');soundButton.querySelector('span').textContent=soundOn?'SOUND ON':'SOUND OFF';soundButton.querySelector('svg').innerHTML=soundOn?'<path d="m8 4-4 3H2v4h2l4 3zM11 6q4 3 0 6M13 3q7 6 0 12"/>':'<path d="m8 4-4 3H2v4h2l4 3zM11 6l5 6m0-6-5 6"/>';
  }catch{document.querySelector('.fx-status').textContent='当前浏览器无法开启环境音。';}
 });
 // Browser QA reads these actual values; they are not invented performance numbers.
 window.DRGON={state:()=>({world,renderer:gl?'webgl':'fallback',paused,time,frames,power,hue,burst,bursts:Number(scene.dataset.bursts||0),visible,soundOn}),render:()=>render()};
 setupGL();resize();sync();
})();
