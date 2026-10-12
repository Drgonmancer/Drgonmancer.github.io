'use strict';
(() => {
 const worlds={
  cyber:{file:'01-cyber.html',name:'CYBER',description:'鼠标带电、文字故障、激光门。点击背景或触发电磁脉冲。'},
  singularity:{file:'02-singularity.html',name:'SINGULARITY',description:'旋转吸积盘与弯曲星光。拉高引力，触发一次引力坍缩。'},
  prism:{file:'03-prism.html',name:'PRISM',description:'旋转镂空晶体与全息光彩。移动鼠标或点击切换光谱。'},
  hyperdrive:{file:'04-hyperdrive.html',name:'HYPERDRIVE',description:'拉高速度，触发超速模式，穿过无尽的霓虹隧道。'}
 };
 const tabs=Array.from(document.querySelectorAll('.world-tab')),frame=document.getElementById('world-frame'),panel=document.getElementById('preview-panel'),pause=document.getElementById('pause-button');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches;
 const send=type=>frame.contentWindow.postMessage({type,paused},location.protocol==='file:'?'*':location.origin);
 function select(id,focus=false){const d=worlds[id];if(!d)return;tabs.forEach(tab=>{const active=tab.dataset.world===id;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});frame.src=d.file;frame.title=d.name+'实时特效预览';document.getElementById('direction-description').textContent=d.description;document.getElementById('open-world').href=d.file;document.getElementById('live-name').textContent='LIVE / '+d.name;panel.setAttribute('aria-labelledby','tab-'+id);history.replaceState(null,'','#'+id);}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab.dataset.world));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(tabs[next].dataset.world,true);});});
 document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{panel.classList.toggle('mobile',button.dataset.device==='mobile');document.querySelectorAll('[data-device]').forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});}));
 const update=()=>{pause.textContent=paused?'继续':'暂停';pause.setAttribute('aria-pressed',String(paused));};
 pause.addEventListener('click',()=>{paused=!paused;update();send('concept-motion');});document.getElementById('burst-button').addEventListener('click',()=>send('concept-burst'));frame.addEventListener('load',()=>send('concept-motion'));reduced.addEventListener('change',event=>{paused=event.matches;update();send('concept-motion');});update();
 const initial=location.hash.slice(1);if(worlds[initial])select(initial);
})();
