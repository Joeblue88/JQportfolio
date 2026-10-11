/* Self-contained WebGL flat-disc projection; no remote runtime. */
window.ParticleSpace=(()=>{
 const el=document.getElementById('particleSpace');let gl,program,buffer,ready=false;
 const vertex=`precision highp float;
 attribute vec3 a_position; attribute vec4 a_color; attribute float a_radius;
 uniform vec2 u_resolution; uniform float u_turn; uniform float u_dpr;
 varying vec4 v_color; varying float v_size;
 void main(){
 vec3 q=vec3(a_position.x-450.0,350.0-a_position.y,a_position.z);
 float c=cos(u_turn),s=sin(u_turn);q=vec3(c*q.x+s*q.z,q.y,-s*q.x+c*q.z);
 float perspective=900.0/(900.0-q.z);
 vec2 p=q.xy*perspective;
 gl_Position=vec4(p/(u_resolution*.5),0.0,1.0);
 gl_PointSize=max(1.0,a_radius*2.0*u_dpr*perspective);
 v_size=gl_PointSize;v_color=a_color;
 }`;
 const fragment=`precision highp float; varying vec4 v_color; varying float v_size;
 void main(){
 vec2 p=gl_PointCoord*2.0-1.0;float r2=dot(p,p);if(r2>1.0)discard;
 float edge=1.0-smoothstep(1.0-max(.025,1.5/v_size),1.0,r2);
 gl_FragColor=vec4(v_color.rgb,v_color.a*edge);
 }`;
 function compile(type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
 try{
 gl=el.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:false});if(!gl)throw Error('unavailable');
 program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('link');
 gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 for(const [name,size,offset] of [['a_position',3,0],['a_color',4,12],['a_radius',1,28]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,32,offset)}
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform2f(gl.getUniformLocation(program,'u_resolution'),900,700);gl.uniform1f(gl.getUniformLocation(program,'u_dpr'),2);ready=true;el.dataset.renderer='webgl';
 }catch{el.dataset.renderer='canvas'}
 el.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;el.dataset.renderer='canvas';window.Geometry?.redraw()});
 const cache=new Map();function rgb(c){if(cache.has(c))return cache.get(c);const hex=c.replace('#','');let a=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255);cache.set(c,a);return a}
 return {get available(){return ready},draw(dots,turn){if(!ready)return;gl.viewport(0,0,el.width,el.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(gl.getUniformLocation(program,'u_turn'),turn);const sorted=dots.filter(d=>d.a>.005&&d.r>.1).sort((a,b)=>a.z-b.z);const data=new Float32Array(sorted.length*8);sorted.forEach((d,i)=>{data.set([d.x,d.y,d.z,...rgb(d.color||d.c),d.a,d.r],i*8)});gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.drawArrays(gl.POINTS,0,sorted.length)}};
})();
