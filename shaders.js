'use strict';
window.WORLD_SHADERS=(()=>{
  const shared=`
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_power;
uniform float u_burst;
uniform float u_hue;
varying vec2 v_uv;
#define PI 3.14159265359
#define TAU 6.28318530718
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float n=0.,amp=.5;for(int i=0;i<4;i++){n+=amp*noise(p);p=rot(.62)*p*2.07+vec2(2.4,1.3);amp*=.48;}return n;}
float line(float d,float w){return exp(-abs(d)/w);}
vec3 palette(float t){return .5+.5*cos(TAU*(t+vec3(.05,.38,.68)+u_hue));}
float stars(vec2 p,float scale,float threshold){vec2 g=p*scale,id=floor(g),f=fract(g)-.5;float h=hash(id);float star=pow(max(0.,1.-length(f)*3.7),9.);return star*step(threshold,h)*(.6+.4*sin(u_time*.5+h*40.));}
vec2 sceneUV(){vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;return p;}
float edgeGlow(float d){return .0015/max(abs(d),.0015);}
`;
  const cyber=`
float seg(vec2 p,vec2 a,vec2 b){vec2 v=b-a;return length(p-a-v*clamp(dot(p-a,v)/dot(v,v),0.,1.));}
void main(){
 vec2 p=sceneUV();float aspect=u_resolution.x/u_resolution.y;float t=u_time;bool mobile=aspect<.85;
 vec2 center=vec2(mobile?0.:aspect*.22,mobile?-.10:.03)+u_mouse*.025;
 vec2 q=p-center;vec3 col=vec3(.018,.031,.070);
 col+=vec3(.01,.025,.09)*fbm(p*3.+vec2(t*.025,0.));
 float horizon=-.13;float floorMask=smoothstep(horizon+.04,horizon-.04,p.y);
 float depth=1./max(.03,horizon-p.y);vec2 gridUV=vec2(p.x*depth,depth*.32+t*.7*(.5+u_power));
 vec2 grid=abs(fract(gridUV*.6)-.5);float g=min(grid.x,grid.y);float gridline=line(g,.012)*floorMask;
 col+=vec3(.0,.16,.29)*gridline*.65;
 col+=vec3(.04,.10,.28)*line(p.y-horizon,.03)*.35;
 float size=.48+u_burst*.025;vec2 a=vec2(0.,size),b=vec2(-size*.86,-size*.48),c=vec2(size*.86,-size*.48);
 vec2 portal=q;portal.y*=1.05;portal*=rot(sin(t*.23)*.055+u_mouse.x*.07);
 float d=min(seg(portal,a,b),min(seg(portal,b,c),seg(portal,c,a)));
 col+=vec3(.12,.47,1.0)*line(d,.004)*3.;col+=vec3(.1,.24,.85)*line(d,.034)*.8;
 float d2=min(seg(portal*.80,a,b),min(seg(portal*.80,b,c),seg(portal*.80,c,a)));
 col+=vec3(.69,.06,.61)*line(d2,.0025)*1.2;
 float core=exp(-length(q)*5.);float turbulence=fbm(q*8.+vec2(0.,t*.2));
 col+=vec3(.10,.06,.4)*core*turbulence*.6;
 for(int i=0;i<14;i++){
  float fi=float(i);float angle=fi*.4488+t*.03;vec2 v=rot(angle)*q;float radius=.16+.016*fi;
  float arc=line(length(q)-radius,.0008)*step(.35,sin(atan(q.y,q.x)*4.+fi+t*.3));
  col+=mix(vec3(.04,.55,.85),vec3(.7,.1,.55),sin(fi)*.5+.5)*arc*.18;
 }
 float scanY=sin(t*.32)*.43;col+=vec3(.08,.25,.6)*line(q.y-scanY,.002)*exp(-abs(q.x)*3.);
 col+=vec3(.16,.32,.62)*stars(p+vec2(t*.004,0.),80.,.975)*.8;
 float ring=line(length(q)-u_burst*.72,.004)*u_burst;col+=vec3(.8,.05,.5)*ring*1.6;
 col*=1.-.1*sin(gl_FragCoord.y*2.1);float vignette=1.-smoothstep(.35,1.2,length(p));col*=.6+.4*vignette;
 gl_FragColor=vec4(col,1.);
}`;
  const singularity=`
void main(){
 vec2 p=sceneUV();float aspect=u_resolution.x/u_resolution.y;bool mobile=aspect<.85;float t=u_time;
 vec2 center=vec2(mobile?0.:aspect*.19,mobile?-.09:.045)+u_mouse*.027;
 vec2 q=p-center;q*=rot(-.08+u_mouse.x*.06);float r=length(q);float angle=atan(q.y,q.x);
 float hole=.192+u_power*.014;vec2 warped=p+normalize(q)*.024/max(r,.08);
 vec3 col=vec3(.014,.014,.029);
 float neb=fbm(warped*3.4+vec2(t*.012,0.));col+=vec3(.09,.025,.11)*pow(neb,3.)*.55;
 col+=vec3(.55,.65,.82)*stars(warped+vec2(t*.001,0.),98.,.976);
 col+=vec3(.3,.34,.45)*stars(warped*1.3,155.,.989)*.7;
 float ellipse=length(vec2(q.x,q.y*4.9));float disk=exp(-pow((ellipse-.34)/.15,2.));
 float stream=fbm(vec2(angle*4.,ellipse*28.-t*(1.+u_power)))+.32*noise(vec2(angle*38.,ellipse*70.-t*2.));
 float diskLight=disk*(.7+stream)*smoothstep(hole*.93,hole*1.08,r);
 vec3 heat=mix(vec3(1.,.20,.035),vec3(1.,.67,.24),smoothstep(.28,.17,ellipse));
 col+=heat*diskLight*.90;
 col+=vec3(1.,.23,.05)*disk*.07;
 float photon=line(r-hole,.003);float corona=line(r-hole,.022);
 float warpTop=length(vec2(q.x,q.y*1.02));float top=smoothstep(-.02,.12,q.y);
 float lens=exp(-pow((warpTop-(hole+.035))/.023,2.))*top;
 float streaks=.35+.65*fbm(vec2(angle*12.-t*.07,r*88.));
 col+=vec3(1.,.59,.22)*lens*streaks*.80;
 col+=vec3(1.,.48,.15)*corona*.33;
 col*=smoothstep(hole-.013,hole-.001,r);
 col+=vec3(1.,.83,.53)*photon*1.5;
 float horizontal=line(q.y,.0019)*exp(-abs(q.x)*2.5);col+=vec3(1.,.50,.18)*horizontal*smoothstep(hole*.93,hole*1.05,r)*1.9;
 float ring=line(r-(hole+.55*u_burst),.006)*u_burst;col+=vec3(.54,.35,.95)*ring;
 col+=vec3(.75,.13,.06)*exp(-r*5.)*.08;
 gl_FragColor=vec4(col,1.);
}`;
  const prism=`
vec3 spin(vec3 p){p.xz=rot(u_time*(.08+u_power*.22)+u_mouse.x*.4)*p.xz;p.xy=rot(.35+sin(u_time*.13)*.26+u_mouse.y*.25)*p.xy;return p;}
float mapScene(vec3 p){p=spin(p);float oct=(dot(abs(p),vec3(1.))-1.28)*.57735;float box=max(max(abs(p.x),abs(p.y)),abs(p.z))-.92;float h=clamp(.5+.5*(oct-box)/.10,0.,1.);float shape=mix(box,oct,h)+.10*h*(1.-h)-.042;float cavity=length(p)-.81;float k=clamp(.5+.5*(shape+cavity)/.05,0.,1.);return mix(-cavity,shape,k)+.05*k*(1.-k);}
vec3 normal(vec3 p){vec2 e=vec2(.0016,0.);return normalize(vec3(mapScene(p+e.xyy)-mapScene(p-e.xyy),mapScene(p+e.yxy)-mapScene(p-e.yxy),mapScene(p+e.yyx)-mapScene(p-e.yyx)));}
vec3 env(vec3 r){float bands=sin(r.y*9.+r.x*3.+u_time*.07);vec3 color=palette(r.x*.22+r.y*.27+.13);return color*(.4+pow(max(bands,0.),10.)*1.3)+pow(max(0.,dot(r,normalize(vec3(-1.,2.,1.)))),35.)*vec3(2.);}
void main(){
 vec2 p=sceneUV();float aspect=u_resolution.x/u_resolution.y;bool mobile=aspect<.85;
 vec2 center=vec2(mobile?0.:aspect*.21,mobile?-.10:.0);vec2 q=p-center;
 vec3 col=vec3(.038,.028,.085);
 col+=palette(.15+p.x*.10+u_time*.009)*exp(-length(q)*4.)*.15;
 col+=vec3(.36,.40,.7)*stars(p+vec2(u_time*.001,0.),100.,.99)*.5;
 vec2 rq=rot(-.35+u_time*.01)*q;
 float orbit=length(vec2(rq.x,rq.y*2.8));col+=palette(.08)*line(orbit-.44,.0013)*.20;
 col+=palette(.39)*line(length(vec2(rq.x,rq.y*1.85))-.58,.0008)*.18;
 if(length(q)<.53){
  vec3 ro=vec3(0.,0.,3.2);vec3 rd=normalize(vec3(q*3.5,-2.6));
  float travel=0.;bool hit=false;vec3 pos=ro;
  for(int i=0;i<64;i++){pos=ro+rd*travel;float d=mapScene(pos);if(d<.0018){hit=true;break;}travel+=d*.82;if(travel>5.0)break;}
  if(hit){
   vec3 n=normal(pos);vec3 refl=reflect(rd,n);float fres=pow(1.-max(0.,dot(-rd,n)),3.);
   vec3 reflection=env(refl);vec3 light=normalize(vec3(-1.,2.,2.));float diffuse=max(0.,dot(n,light));
   col=reflection*(.7+.40*diffuse);col+=palette(dot(n,vec3(.8,.3,.5))*.43+u_time*.035)*fres*.75;
   float edge=pow(max(0.,1.-abs(dot(-rd,n))),4.);col+=palette(.1+n.y*.5)*edge*.9;
   col+=pow(max(0.,dot(reflect(-light,n),-rd)),55.)*vec3(1.4,1.5,1.7);
   col*=.80+.20*clamp(travel,0.,3.);
  }
 }
 float pulse=line(length(q)-u_burst*.6,.005)*u_burst;col+=palette(.5)*pulse;
 gl_FragColor=vec4(col,1.);
}`;
  const hyperdrive=`
void main(){
 vec2 p=sceneUV();float t=u_time;float aspect=u_resolution.x/u_resolution.y;
 vec2 center=u_mouse*.055+vec2(.0,.04);vec2 q=p-center;
 q*=rot(sin(t*.09)*.08);float r=length(q);float a=atan(q.y,q.x);float speed=.40+u_power*1.4+u_burst*2.0;
 float z=.28/max(r,.014)+t*speed;
 float octRadius=max(max(abs(q.x),abs(q.y)),max(abs(q.x+q.y),abs(q.x-q.y))*.7071);
 float depth=.26/max(octRadius,.014)+t*speed;
 float ring=line(abs(fract(depth)-.5),.019)*smoothstep(.02,.12,r);
 float radial=line(abs(fract((a/TAU+.5)*8.)-.5),.010)*smoothstep(.0,.14,r);
 vec3 col=vec3(.025,.005,.058);
 vec3 stripes=mix(vec3(.08,.60,.97),vec3(.71,.055,.81),.5+.5*sin(a*4.+t*.2));
 col+=stripes*ring*.82;
 col+=stripes*radial*.27;
 float panels=pow(max(0.,sin(a*8.)),18.)*line(abs(fract(z*.37)-.5),.08)*.23;
 col+=stripes*panels;
 for(int i=0;i<3;i++){
  float fi=float(i);float streakID=floor(a*(22.+fi*7.));float random=hash(vec2(streakID,fi));
  float ang=abs(fract(a*(22.+fi*7.))-.5);float st=line(ang,.012)*pow(max(0.,sin(z*(.15+random*.6)+random*TAU)),35.);
  col+=mix(vec3(.24,.67,.97),vec3(.95,.18,.67),random)*st*(.15+r)*1.6;
 }
 float glow=exp(-r*7.);col+=vec3(.19,.04,.49)*glow*.9;
 float inner=line(r-.034,.004);col+=vec3(.52,.30,.87)*inner;
 col+=vec3(.05,.11,.31)*exp(-abs(q.y+.27)*8.);
 col+=stripes*u_burst*.17;
 col*=.6+.4*smoothstep(1.2,.1,r);
 gl_FragColor=vec4(col,1.);
}`;
  return {vertex:'attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}',cyber:shared+cyber,singularity:shared+singularity,prism:shared+prism,hyperdrive:shared+hyperdrive};
})();
