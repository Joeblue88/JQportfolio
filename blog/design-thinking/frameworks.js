/* Training diagrams retain their dimensions, relationships and example cells.
   Only the current teaching emphasis changes between builds. */
window.Frameworks=(()=>{
 const host=document.getElementById('frameworkLayer'),NS='http://www.w3.org/2000/svg';
 const measure=document.createElement('canvas').getContext('2d');
 let en=false,key='',current=null,currentStep=-1;
 const C={ink:'#f7f7f2',muted:'#ababab',line:'#777770',signal:'#f7f250',ground:'#101110',plane:'#282828'};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const T=(zh,english)=>en?english:zh;
 const font=()=> 'Manrope, Noto Sans SC, sans-serif';
 function rows(str,size,width,weight=400){measure.font=`${weight} ${size}px ${font()}`;const result=[];for(const p of String(str??'').split('\n')){let row='';const bits=en?p.split(/(?<=\s)/):[...p];for(const bit of bits){if(row&&measure.measureText(row+bit).width>width&&!/^[，。；：？！、]/.test(bit)){result.push(row.trim());row=bit.trimStart()}else row+=bit}result.push(row.trim())}return result}
 function text(x,y,str,{size=22,width=780,anchor='start',color=C.ink,leading=null,weight=null,centerY=null,role=null}={}){
  if(en)str=window.EnglishEmphasis?.label(str)??str;
  const authoredSize=size;role=role||(color===C.muted?'aux':size>=28?'title':size>=22?'label':'small');
  if(role==='title')size=size>=36?Math.min(size,34):26;else if(role==='label')size=20;else if(role==='aux')size=Math.min(size,18);
  weight=weight??(role==='title'?(en?800:900):role==='label'?500:role==='aux'&&size>=18?200:400);leading=leading===null?size*(role==='title'?1.3:1.5):Math.max(size*1.3,leading*size/authoredSize);
  const measuredWeight=role==='label'?Math.max(weight,en?700:800):role==='small'?Math.max(weight,700):weight;const lines=rows(str,size,width,measuredWeight);
  if(centerY!==null){measure.font=`${measuredWeight} ${size}px ${font()}`;const metrics=lines.map(l=>measure.measureText(l||'Ag'));const asc=Math.max(...metrics.map(m=>m.actualBoundingBoxAscent||size*.8)),desc=Math.max(...metrics.map(m=>m.actualBoundingBoxDescent||size*.2));y=centerY-(asc+desc+(lines.length-1)*leading)/2+asc;}
  return `<text data-type-role="${role}" x="${x}" y="${y}" text-anchor="${anchor}" fill="${color===C.muted?C.ink:color}" font-size="${size}" font-weight="${weight}">${lines.map((l,i)=>`<tspan x="${x}" dy="${i?leading:0}">${esc(l)}</tspan>`).join('')}</text>`
 }
 const line=(x1,y1,x2,y2,{color=C.line,dash='',width=1.2}={})=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
 const path=(d,color=C.line,dash='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="1.2"${dash?` stroke-dasharray="${dash}"`:''}/>`;
 const rect=(x,y,w,h,{fill='none',stroke=C.line,r=0}={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
 const dot=(x,y,r=5,color=C.ink)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="none"/>`;
 const icon=(name,x,y,size=28)=>window.MaterialIcons.diagram(name,x,y,size,C.ink);
 const itemIcon=(s,i,x,y,size=28)=>icon(window.MaterialIcons.forItem(s.key,i),x,y,size);
 const group=(i,body)=>`<g class="fw-emphasis" data-build="${Array.isArray(i)?i.join(','):i}">${body}</g>`;
 const heading=(str)=>text(436,62,str,{size:24,anchor:'middle',width:770});
 function panel(x,y,w,h,title,body,i,{size=22}={}){return group(i,rect(x,y,w,h,{fill:C.ground})+text(x+20,y+36,title,{size,width:w-40})+text(x+20,y+80,body,{size:19,width:w-40,color:C.muted,leading:28}))}
 function names(s){return s.items.map(x=>x[0])}
 function process(s,{y=250,x=70,w=710,labels=names(s)}={}){const n=labels.length,step=w/(n-1||1);let out='';for(let j=0;j<n-1;j++)out+=line(x+j*step,y,x+(j+1)*step,y);labels.forEach((n,j)=>{out+=group(j,dot(x+j*step,y,8)+text(x+j*step,y+48,n,{size:20,width:Math.min(step-16,160,2*x-20),anchor:'middle'}))});return out}
 function iconPerson(x,y,{scale=1,color=C.ink}={}){return window.MaterialIcons.diagram('person',x-40*scale,y-40*scale,80*scale,color)}
 function node(x,y,w,h,label,i=-1,fill=C.ground){const body=rect(x,y,w,h,{fill})+text(x+w/2,y+h/2+7,label,{size:21,width:w-20,anchor:'middle',centerY:y+h/2});return i>=0?group(i,body):body}
 function table(headers,data,{width=1440,height=530,columns=null,active=true,rowOffset=0}={}){
  const widths=columns||headers.map(()=>100/headers.length);let x=0,svg='';const head=70,row=(height-head)/data.length;
  headers.forEach((h,i)=>{const w=width*widths[i]/100;svg+=rect(x,0,w,head,{fill:C.plane})+text(x+16,30,h,{size:22,width:w-28,leading:27});x+=w});
  data.forEach((r,j)=>{let xx=0;const yy=head+j*row;let body=rect(0,yy,width,row,{fill:C.ground});r.forEach((v,i)=>{const w=width*widths[i]/100;let size=en?21:23;while(size>17&&(rows(v,size,w-32).length-1)*size*1.32+size>row-25)size--;body+=text(xx+16,yy+size+13,v,{size,width:w-32,leading:size*1.32});if(i)body+=line(xx,yy,xx,yy+row);xx+=w});body+=line(0,yy+row,width,yy+row);svg+=active?group(j+rowOffset,body):body});return svg
 }
 function diagram(s){let out='',type=s.framework;const title=names(s);
  const redrawn=window.MethodRedraws?.draw(s,{T,text,line,path,rect,dot,group,C,iconPerson,rows,measureText:(str,size)=>{measure.font=`400 ${size}px ${font()}`;return measure.measureText(str).width}},currentStep,en);
  if(redrawn!==null&&redrawn!==undefined)out=redrawn;else switch(type){
   case 'methodList':case 'qualMethods':case 'personaDefinition':case 'gemba':case 'qualQuant':case 'abCautions':{
    const entries=s.items,n=entries.length;const rh=Math.min(155,560/n);out=heading(type==='qualMethods'?T('定性研究的四种方法','Four qualitative methods'):type==='personaDefinition'?T('研究 → 归纳 → 模型','Research → Synthesis → Model'):T('维度与要点','Dimensions and considerations'));
    entries.forEach(([h,b],i)=>{const y=98+i*rh,baseline=y+rh/2+7;out+=group(i,line(48,y+rh,824,y+rh)+itemIcon(s,i,56,y+rh/2-14)+text(100,baseline,h,{size:25,width:186,centerY:y+rh/2})+text(310,baseline,b,{size:en?20:22,width:470,color:C.muted,leading:29,centerY:y+rh/2}))});break
   }
   case 'stakeholderCircle':{
    const role=[['项目经理','Project manager',430,245],['客户经理','Account manager',180,140],['客户','Client',710,140],['开发人员','Developers',190,360],['设计人员','Designers',430,440],['市场团队','Marketing team',690,360],['协作系统','Collaboration tool',430,580],['财务系统','Finance system',705,560],['财务行政','Finance admin',170,560],['负责人','Director',690,245]];
    out=heading(T('角色、重要性与业务连接','Roles, priority and business connections'));
    out+=`<circle cx="435" cy="340" r="255" fill="none" stroke="${C.line}"/><circle cx="435" cy="340" r="155" fill="none" stroke="${C.line}"/>`;
    [[0,1,'周会','Meetings'],[0,2,'合同与启动','Contract / kickoff'],[0,3,'消息','Messages'],[0,4,'消息','Messages'],[0,5,'更新','Updates'],[4,6,'协作','Collaboration'],[3,6,'协作','Collaboration'],[2,7,'支付','Payment'],[7,8,'发票','Invoices'],[6,9,'报告','Reports']].forEach(([a,b,zh,e],j)=>{const A=role[a],B=role[b];out+=path(`M${A[2]} ${A[3]}L${B[2]} ${B[3]}`);const mx=(A[2]+B[2])/2+(j===7?86:0),my=(A[3]+B[3])/2-(j===7?13:0);out+=rect(mx-57,my-15,114,28,{fill:C.ground,stroke:'none'})+text(mx,my+5,T(zh,e),{size:15,width:110,anchor:'middle',color:C.muted})});
    role.forEach(([z,e,x,y])=>{out+=rect(x-73,y-25,146,50,{fill:C.ground})+text(x,y+7,T(z,e),{size:18,width:138,anchor:'middle'})});out+=text(436,666,T('圈层表达重要性；连线表达业务关系','Rings show priority; lines show business relationships'),{size:18,anchor:'middle',width:800,color:C.muted});break
   }
   case 'hopes':{
    out=heading(T('先记录，再归类，最后比较关注度','Record, group, then compare attention'));
    out+=group(0,text(80,145,T('期望','Hopes'),{size:28})+rect(80,180,305,200,{fill:C.ground})+text(105,226,T('体验一致性\n全功能团队','Consistent experience\nCross-functional team'),{size:25,width:260,leading:46}));
    out+=group(1,text(480,145,T('失望','Disappointments'),{size:28})+rect(480,180,305,200,{fill:C.ground})+text(505,226,T('系统集成依赖性强\n上线时间很长','Strong integration dependencies\nLong time to launch'),{size:25,width:260,leading:38}));
    out+=group(2,line(80,438,785,438)+text(80,495,T('同类归并','Cluster related themes'),{size:24})+text(80,540,T('被提及越多，关注度越高；用气泡大小表达实际计数。','More mentions indicate greater attention. Size bubbles using actual counts.'),{size:22,width:705,color:C.muted}));break
   }
   case 'balloon':{
    out=heading(T('资源的升力与负担','Resources: lift and constraints'));
    out+=`<ellipse cx="438" cy="274" rx="125" ry="170" fill="none" stroke="${C.ink}"/>`+path('M350 400L400 500H475L525 400')+rect(399,500,78,58);
    out+=group(0,text(46,185,T('资源优势','Strengths'),{size:25,width:250})+text(46,231,T('市场潜力巨大\n市场方向人才充足\n拥有试点资源','Market potential\nMarket expertise\nPilot resources'),{size:22,width:235,leading:38})+line(287,345,339,300,{color:C.signal}));
    out+=group(1,text(590,185,T('资源劣势','Constraints'),{size:25,width:250})+text(590,231,T('商业市场认知不足\n缺少 IT 技术人才','Limited market understanding\nLimited IT expertise'),{size:22,width:240,leading:38})+line(570,345,520,398,{color:C.signal}));
    out+=group(2,text(436,620,T('资金 · 技术 · 团队 · 市场','Funding · Technology · Team · Market'),{size:23,anchor:'middle',width:800})+text(436,659,T('准备模板 → 写下优势与劣势 → 权衡资源','Prepare → Record strengths and constraints → Weigh resources'),{size:19,anchor:'middle',width:800,color:C.muted}));break
   }
   case 'levels':{
    out=heading(T('桌面调研与用户调研','Desk research and user research'));
    const data=[[T('总体性研究','Broad research'),T('消费习惯、品牌偏好等统计数据','Consumption habits, brand preferences and statistics')],[T('目标性研究','Goal-focused research'),T('社交、精神、娱乐等需求方向','Social, psychological and entertainment needs')],[T('行为环境研究','Behavior and context'),T('满足需求的具体行为与发生环境','Specific actions and the environments in which they occur')]];
    out+=text(54,190,T('桌面\n调研','Desk\nresearch'),{size:20,color:C.muted,width:100})+text(54,550,T('用户\n调研','User\nresearch'),{size:20,color:C.muted,width:100});
    data.forEach(([n,b],j)=>{let y=126+j*165,l=150+j*20,r=810-j*20;out+=group(j,`<path d="M${l} ${y}H${r}L${r-24} ${y+122}H${l+24}Z" fill="${C.ground}" stroke="${C.line}"/>`+text(480,y+40,n,{size:25,anchor:'middle',width:580})+text(480,y+84,b,{size:20,anchor:'middle',width:540,color:C.muted,leading:27}))});out+=line(40,446,830,446,{dash:'5 7'});break
   }
   case 'audience':{
    out=heading(T('研究不只面对使用者','Research beyond the end user'));
    const xs=[105,268,431,594,757];xs.forEach((x,i)=>{out+=group(i,iconPerson(x,280)+text(x,355,title[i],{size:24,anchor:'middle',width:145}));if(i<4)out+=line(x+40,280,x+123,280)});
    out+=text(436,505,T('每个位置，都可能提供不同的证据与约束。','Each position can reveal different evidence and constraints.'),{size:23,width:720,anchor:'middle',color:C.muted});break
   }
   case 'customerUser':{
    const positions={provider:[90,265],product:[350,265],customer:[640,110],user:[640,405],potential:[905,265]};
    [['provider','product',T('推广','Promote')],['product','customer',T('使用','Use')],['customer','product',T('支付','Pay')],['product','user',T('使用','Use')],['potential','customer',T('转化','Convert')],['potential','user',T('转化','Convert')],['customer','user',T('可能重合','May overlap')]].forEach(([a,b,l],i)=>{const A=positions[a],B=positions[b];out+=line(A[0],A[1],B[0],B[1],{dash:'4 6'});const x=(A[0]+B[0])/2,y=(A[1]+B[1])/2+(i===2?35:-16);out+=rect(x-64,y-22,128,30,{fill:C.ground,stroke:'none'})+text(x,y,l,{size:21,width:120,anchor:'middle',color:C.muted})});
    [['provider',T('商家','Provider'),3],['product',T('产品＋服务','Product + service'),-1],['customer',T('客户','Customer'),0],['user',T('用户','User'),1],['potential',T('潜在用户','Potential user'),2]].forEach(([k,l,i])=>{const [x,y]=positions[k];out+=node(x-80,y-35,160,70,l,i)});
    out+=line(1030,35,1030,485);s.items.forEach(([h,b],i)=>{out+=group(i,text(1070,70+i*110,h,{size:25,width:330})+text(1070,107+i*110,b,{size:en?20:22,width:330,color:C.muted,leading:28}))});break
   }
   case 'demand':{
    out=heading(T('伪需求 · 痒需求 · 刚需求','Unsubstantiated · Replaceable · Essential'));
    s.items.forEach(([h,b],i)=>{const x=48+i*267;out+=group(i,text(x,150,h,{size:en?25:29,width:244})+line(x,en?250:180,x+240,en?250:180)+text(x,en?290:225,b,{size:23,width:235,leading:34}))});out+=text(436,604,T('练习：用事实、替代方案和不解决的后果，判断一个需求。','Practice: examine evidence, substitutes and the consequences of leaving a need unmet.'),{size:23,anchor:'middle',width:770,color:C.muted});break
   }
   case 'abProcess':{
    out=heading(T('A/B 测试五步法','The five steps of an A/B test'));
    const positions=[[230,170],[637,170],[705,390],[436,567],[170,390]];
    positions.forEach(([x,y],i)=>{const next=positions[(i+1)%5];out+=line(x,y,next[0],next[1]);out+=group(i,rect(x-118,y-57,236,115,{fill:C.ground})+text(x,y-11,s.items[i][0],{size:23,width:218,anchor:'middle'})+text(x,y+31,T(['确定提升点','排序假设','版本差异','记录数据','发布／保持'][i],['Define goals','Rank hypotheses','Version differences','Record data','Release / retain'][i]),{size:18,width:218,anchor:'middle',color:C.muted}))});out+=rect(330,290,212,100,{fill:C.ground})+text(436,334,'A/B',{size:40,anchor:'middle'})+text(436,367,T('可信的对照','A credible comparison'),{size:18,anchor:'middle'});break
   }
   case 'funnel':{
    out=heading(T('购买行为：从定量到定性','Purchase behavior: quantitative to qualitative'));
    [120,80,60,32,5].forEach((v,j)=>{const y=130+j*94,w=410*v/120;out+=group(j,text(60,y+20,s.items[j][0],{size:24,width:130})+rect(220,y,w,44,{fill:C.plane})+text(650,y+29,String(v),{size:28,width:150}))});out+=text(436,649,T('定位流失 → 解释原因 → 提出方案 → A/B 验证','Locate drop-off → Explain why → Propose → Test'),{size:20,anchor:'middle',width:780,color:C.muted});break
   }
   case 'aeiou':{
    out=text(52,61,T('AEIOU：观察记录','AEIOU: observation'),{size:25,width:540})+text(600,61,T('I＋Q：分析输出','I + Q: synthesis'),{size:25,width:238});out+=line(560,87,560,650);
    s.items.slice(0,5).forEach(([h,b],i)=>{const y=135+i*103;out+=group(i,`<circle cx="80" cy="${y}" r="23" fill="${C.ground}" stroke="${C.line}"/>`+text(80,y+8,['A','E','I','O','U'][i],{size:25,anchor:'middle',width:45}).replace('<text ','<text class="fw-letter" ')+text(126,y-9,h.split(' · ')[1]||h,{size:24,width:390})+text(126,y+27,b,{size:18,width:390,color:C.muted,leading:25}))});
    s.items.slice(5).forEach(([h,b],i)=>{const y=170+i*240;out+=group(i+5,text(601,y,h,{size:26,width:230})+text(601,y+52,b,{size:22,width:222,color:C.muted,leading:32}))});break
   }
   case 'busMatrix':{
    const hd=en?['A · Activity','E · Environment','I · Interaction','O · Object','U · User','I · Insight','Q · Question']:['A · 行为','E · 环境','I · 互动','O · 物件','U · 人物','I · 洞见','Q · 问题'];
    out=table(hd,s.matrix,{columns:[11,17,21,12,9,17,13]});out+=line(1008,0,1008,530,{color:C.signal,width:2});break
   }
   case 'modelMethods':{out=heading(T('用户建模的五类工作','Five kinds of persona work'))+process(s);out+=text(436,435,T('分群与共情提供资料，提炼与整合形成模型，完善让模型保持可用。','Segmentation and empathy provide evidence. Extraction and synthesis build the model. Refinement keeps it useful.'),{size:23,width:725,anchor:'middle',color:C.muted,leading:36});break}
   case 'routes':{
    out='';
    out+=text(38,175,T('线性推进','Linear progress'),{size:21,width:155})+text(38,351,T('迭代验证','Iteration'),{size:21,width:155})+text(38,546,T('并行探索','Parallel work'),{size:21,width:155});
    const paths=['M220 168H795','M220 345H795M655 345V408H365V345','M220 540L360 486H530L675 540H795M220 540L360 594H530L675 540'];
    paths.forEach((d,i)=>{let b=path(d);if(i<2)[220,365,510,655,795].forEach(x=>b+=dot(x,i?345:168,5));else [[220,540],[360,486],[530,486],[360,594],[530,594],[675,540],[795,540]].forEach(([x,y])=>b+=dot(x,y,5));out+=group(i,b)});
    const courses=['M220 168H795','M220 345H655V408H365V345H795','M220 540L360 486H530L675 540H795','M220 540L360 594H530L675 540H795'];
    courses.forEach((d,i)=>out+=`<circle class="fw-flow" data-route="${i===3?2:i}" data-path="${d}" r="8" cx="220" cy="${i===0?168:i===1?345:540}" fill="${C.signal}"/>`);out+=text(510,377,T('反馈与修正','Feedback and revision'),{size:18,width:250,anchor:'middle',centerY:377,color:C.muted});out+=text(735,580,T('汇合验证','Test together'),{size:18,width:124,anchor:'middle',centerY:580,color:C.muted});break
   }
   case 'segmentation':{
    out=heading(T('目标用户的关系图','A relationship map of target users'));
    const nodes=[[50,320,T('目标用户','Target users'),0],[305,130,T('先导型用户','Lead users'),1],[305,320,T('真实用户','Actual users'),1],[305,510,T('尝鲜型用户','Early users'),1],[620,130,T('主流用户','Mainstream'),2],[620,320,T('核心用户','Core users'),2],[620,510,T('潜在用户','Potential'),2]];
    [[0,1],[0,2],[0,3],[2,4],[2,5],[2,6]].forEach(([a,b])=>out+=line(nodes[a][0]+175,nodes[a][1]+39,nodes[b][0],nodes[b][1]+39));nodes.forEach(([x,y,l,i])=>out+=node(x,y,175,78,l,i));out+=text(436,659,T('标签可能交叉；以具体研究界定各组。','Labels can overlap; define them in the research context.'),{size:18,anchor:'middle',width:800,color:C.muted});break
   }
   case 'stakeholderMap':{
    out=heading(T('关注程度 × 影响力','Interest × Influence'))+line(105,604,814,604)+line(105,604,105,113)+text(805,653,T('对产品成败、发展的影响力','Influence on success and development'),{size:18,width:690,anchor:'end',color:C.muted})+text(105,90,T('对产品／服务的关注程度','Interest in the product / service'),{size:18,width:740,color:C.muted});
    const labels=[['合同经理','Contract manager',169,525],['物流承运商','Logistics',165,576],['客户经理','Account manager',285,550],['HRBP','HRBP',290,467],['TE/SE','TE/SE',327,403],['TD/TL','TD/TL',412,455],['站点工程师','Site engineer',267,190],['质量 QC','Quality QC',458,358],['PFC','PFC',455,415],['地区质量运营','Regional quality',460,514],['合作方经理','Partner manager',526,135],['合作方 PM','Partner PM',663,153],['合作方 TL','Partner TL',500,233],['客户工程人员','Client engineers',534,310],['业务经理','Business manager',696,305],['客户主管','Client lead',702,375],['区域 PM/PCM','Regional PM/PCM',709,221],['PCM','PCM',803,170],['PD/PM','PD/PM',806,278],['PMO','PMO',725,470],['SCM','SCM',585,511],['CEG','CEG',654,530],['高层管理者','Senior leader',787,564]];
    out+=path('M460 145Q710 80 830 180V403Q640 455 468 356Z',C.signal,'6 8');labels.forEach(([zh,e,x,y])=>{out+=rect(x-47,y-22,94,45,{fill:C.ground})+text(x,y+5,T(zh,e),{size:14,width:88,anchor:'middle',leading:17})});out+=group(2,text(652,430,T('核心用户群','Core participants'),{size:22,anchor:'middle',width:280}));break
   }
   case 'stakeholderProcess':{
    out=heading(T('从枚举到划分区域','From listing to relationship regions'));
    s.items.forEach(([h,b],i)=>{const y=106+i*106;out+=group(i,itemIcon(s,i,54,y+6,32)+text(108,y+29,h,{size:24,width:180})+text(300,y+29,b,{size:23,width:508}));if(i<4)out+=line(70,y+42,70,y+104)});break
   }
   case 'empathy':{
    out=heading(T('同理心地图','Empathy map'))+rect(64,111,744,488);
    // The four perspective areas meet at the person; labels stay clear of the diagonals.
    out+=path('M64 111L386 285M808 111L486 285M64 489L386 315M808 489L486 315');
    out+=line(64,489,808,489)+line(436,489,436,599);
    out+=rect(386,258,100,91,{fill:C.plane,stroke:C.line})+iconPerson(436,293,{scale:.65})+text(436,339,T('人','Person'),{size:18,anchor:'middle',width:130});
    const spots=[[436,175,410],[182,313,200],[690,313,200],[436,445,450],[249,554,310],[623,554,310]];
    spots.forEach(([x,y,w],i)=>out+=group(i,itemIcon(s,i,x-14,y-46,28)+text(x,y,title[i],{size:24,width:w,anchor:'middle'})));break
   }
   case 'affinity':{
    s.items.forEach(([h,b],i)=>{const x=18+(i%4)*360,y=12+Math.floor(i/4)*173;out+=group(i,rect(x,y,342,157)+text(x+16,y+31,h,{size:en?22:25,width:310,leading:26}));const noteY=y+80;for(let j=0;j<5;j++)out+=group(i,rect(x+16+j*61,noteY,49,53,{fill:C.plane}));});break
   }
   case 'tocTob':{
    out=table(en?['Dimension','Consumer persona','Enterprise persona']:['维度','消费者画像','企业画像'],en?[
     ['Modeling purpose','Group many people by shared goals and behaviors','Reveal the people behind company roles and decisions'],
     ['Decision context','Individual or family; experience, preferences and trade-offs','Many people evaluate value, efficiency, risk and trust'],
     ['Segmentation','Gender, occupation or behavioral preferences where relevant','Decision position, department and organizational context'],
     ['Research output','Typical groups and differences supported by evidence','A persona for each important buying or usage role']
    ]:[['建模目的','从大量用户的共同目标、行为和属性中，归纳典型类型','把不同规模、行业企业背后的具体角色带到台前'],['决策情境','个人或家庭；关注体验、偏好与取舍，可能出现冲动消费','多人评估价值、效率、风险与信任；也受到情绪与偏见影响'],['分类维度','与问题有关的性别、职业、行为偏好等关键属性','决策位置、部门特性与组织环境'],['画像输出','用研究证据解释典型人群及其差异','考虑整个购买决策团队，为关键角色分别建模']],{columns:[18,41,41],active:false});break
   }
   case 'roles':{const focus=T('资源投入与项目期待|采购标准、预算与授权|任务、特质与需求差异|决策权、约束与审批|协作、交接与职责|数据存储、支付对接与系统依赖','Resources and expectations|Buying criteria and authorization|Tasks and subgroup differences|Decision power and approvals|Cooperation and handoffs|Storage, payment and dependencies').split('|');out=table(en?['Category','Meaning','Research focus']:['角色／条件','含义','研究关注'],s.items.map(([h,b],i)=>[h,b,focus[i]]),{columns:[18,52,30]});break}
   case 'personaTemplate':{
    const f=en?['Personal information','Position information','Key characteristics','Company information','Organizational goals and priorities','Role in the buying process','Drivers and motivations','Fears and challenges','Preferred channels']:['个人基本信息','职业信息','职业特征','公司信息','组织目标和优先级','购买决策中的角色','角色驱动因素','担心与挑战','偏好渠道'];
    out=text(30,32,T('企业用户画像：填写模板','B2B buyer persona: a working template'),{size:26,width:1030})+line(1070,20,1070,515);
    const boxes=[[30,55,250,175,0],[30,238,250,170,1],[300,339,365,177,2],[675,339,365,177,3],[300,55,740,80,4],[300,143,740,80,5],[300,231,365,100,6],[675,231,365,100,7],[30,416,250,100,8]];
    boxes.forEach(([x,y,w,h,i])=>{out+=rect(x,y,w,h)+text(x+13,y+27,f[i],{size:20,width:w-26,leading:24});if([4,5,6,7].includes(i))out+=line(x+15,y+h-22,x+w-15,y+h-22,{dash:'3 7'})});
    const fields=[[[T('性别／年龄','Gender / age'),T('所在地','Location'),T('教育水平','Education level'),T('学位','Degree')],43,118,225],[[T('职位','Job title'),T('汇报对象','Reports to'),T('部门','Department'),T('职业背景','Career background'),T('职业路径','Career path')],43,294,225],[[T('行业','Industry'),T('B2B／B2C／两者','B2B / B2C / both'),T('公司规模','Company size'),T('所在地','Location'),T('竞争对手','Competitors'),T('商业模式','Business model')],688,391,337]];
    fields.forEach(([labels,x,y,w],col)=>labels.forEach((n,i)=>out+=col===2?text(x+(i%2)*172,397+Math.floor(i/2)*40,n,{size:16,width:160,color:C.muted}):text(x,y+i*(col===0?28:25),n,{size:16,width:w,color:C.muted}))); 
    [T('预算控制','Budget control'),T('决策影响力','Decision influence'),T('资历','Seniority')].forEach((n,i)=>{const y=400+i*44;out+=text(314,y,n,{size:17,width:335});out+=line(318,y+10,644,y+10);[0,25,50,75,100].forEach((v,j)=>{const x=318+j*81.5;out+=line(x,y+6,x,y+14)+text(x,y+20,String(v),{size:12,width:30,anchor:'middle',color:C.muted})})});
    out+=text(44,475,T('邮件／电话／面对面','Email / phone / in person'),{size:18,width:222,color:C.muted});
    const item=s.items[currentStep]||s.items[0];out+=text(1105,62,item[0],{size:24,width:295,color:C.signal})+text(1105,132,item[1],{size:en?20:22,width:295,color:C.muted,leading:en?28:32});break
   }
   case 'personaProcess':{
    const labels=T('用户研究|数据提炼|分析整合|优先级排列|完善用户信息','Research|Extract|Synthesize|Prioritize|Refine').split('|');
    labels.forEach((n,i)=>{const x=136+i*292;if(i<4)out+=line(x+32,64,x+260,64);out+=dot(x,64,5)+text(x,109,n,{size:24,width:240,anchor:'middle',weight:500})});
    // Separate the five-stage process from its three evidence sources on one shared grid.
    out+=line(64,176,1376,176)+text(64,220,T('用户研究的资料来源','Evidence for user research'),{size:18,width:1200,weight:500});
    [492,948].forEach(x=>out+=line(x,236,x,494));
    s.items.forEach(([h,b],i)=>{const x=64+i*456;out+=group(i,itemIcon(s,i,x+40,236,80)+text(x+40,356,h,{size:28,width:360,weight:en?700:800})+text(x+40,398,b,{size:18,width:360,role:'body',weight:400,leading:26}))});break
   }
   case 'experienceSystem':{
    out=heading(T('用户 · 场景 · 交付','People · Scenarios · Delivery'));const xs=[176,436,696];
    const body=T('用户为完成目标\n经历什么？|在哪些环节遇到阻力\n与不良体验？|前台、后台与支持过程\n如何共同交付？','What steps does the user\ntake to achieve\na goal?|Where does the user\nencounter friction\nor difficulty?|How do frontstage,\nbackstage and support\ndeliver the service?').split('|');
    out+=line(xs[0],245,xs[2],245);s.items.forEach(([h,b],i)=>out+=group(i,rect(xs[i]-52,193,104,104,{fill:C.ground,stroke:'none'})+itemIcon(s,i,xs[i]-40,205,80)+text(xs[i],333,h,{size:26,width:236,anchor:'middle',centerY:333})+text(xs[i],421,body[i],{size:18,width:252,anchor:'middle',centerY:421,color:C.muted,leading:27})));break
   }
   case 'personaJourney':{out=heading(T('画像与旅程相辅相成','Personas and journeys work together'));out+=group(0,rect(60,190,220,240)+text(170,241,T('用户画像','Persona'),{size:29,anchor:'middle',width:200})+text(170,310,T('具体族群\n目标与动机','A specific group\nGoals and motivations'),{size:24,anchor:'middle',width:190,color:C.muted}));out+=line(280,305,364,305)+group(1,rect(364,190,445,240)+text(586,241,T('用户旅程','User journey'),{size:29,anchor:'middle',width:400})+text(586,310,T('使用场景 → 实现目标的过程','Context → A process toward a goal'),{size:24,width:390,anchor:'middle',color:C.muted}));break}
   case 'journeyTypes':{out=heading(T('现状与未来，两种地图','Two maps: current state and future state'));out+=panel(50,140,360,390,title[0],T('梳理已经发生的行为\n\n像写一篇游记：\n记录真实发生了什么。','Map actions that have happened\n\nLike a travel diary:\nrecord what actually occurred.'),0);out+=panel(460,140,360,390,title[1],T('规划尚未发生的行为\n\n像做一份旅行计划：\n表达期望体验，再验证。','Plan actions that have not happened\n\nLike a travel plan:\nexpress an intended experience, then test.'),1);break}
   case 'journey':{
    const x0=276,x1=1388,cw=(x1-x0)/5,top=T('用户画像|使用情境|目标与期望','Persona|Scenario|Goals & expectations').split('|'),tw=(x1-x0-32)/3;
    out=text(40,64,T('用户视角','The lens'),{size:25,width:205});
    top.forEach((n,i)=>{const x=x0+i*(tw+16);out+=group(0,rect(x,28,tw,68,{fill:C.plane,stroke:'none'})+text(x+tw/2,62,n,{size:24,width:tw-32,anchor:'middle',centerY:62}))});
    out+=text(40,242,T('体验过程','The experience'),{size:25,width:205});
    const ys=[157,218,279,340],labs=T('阶段|行为|想法|情绪体验','Phases|Actions|Thoughts|Feelings').split('|');
    labs.forEach((n,i)=>{const build=i===0?1:i===3?3:2;let row=text(242,ys[i],n,{size:21,width:168,anchor:'end',centerY:ys[i]});
     for(let j=0;j<5;j++){const x=x0+j*cw;row+=rect(x,ys[i]-24,cw,48,{stroke:C.line});if(i===0)row+=text(x+cw/2,ys[i],T('阶段 ','Stage ')+(j+1),{size:18,width:cw-24,anchor:'middle',centerY:ys[i]});else if(i<3)row+=line(x+20,ys[i]+9,x+cw-20,ys[i]+9,{dash:'3 5'})}
     if(i===3){const values=[348,329,347,325,350],points=values.map((y,j)=>[x0+(j+.5)*cw,y]);let d=`M${points[0][0]} ${points[0][1]}`;for(let j=1;j<points.length;j++){const A=points[j-1],B=points[j];d+=`C${A[0]+cw/3} ${A[1]} ${B[0]-cw/3} ${B[1]} ${B[0]} ${B[1]}`}row+=path(d,C.ink)}
     out+=group(build,row);
    });
    out+=text(40,430,T('机会洞察','The insights'),{size:25,width:205});
    const bottom=T('痛点与机会|内部归属','Pain points & opportunities|Internal ownership').split('|'),bw=(x1-x0-16)/2;
    bottom.forEach((n,i)=>{const x=x0+i*(bw+16);out+=group(4,rect(x,402,bw,84,{fill:C.plane,stroke:'none'})+text(x+20,431,n,{size:24,width:bw-40})+line(x+20,462,x+bw-20,462,{dash:'3 5'}))});
    out+=text(x0,518,T('结合线上与线下触点、渠道和研究证据填写；曲线仅为结构示意。','Use online and offline touchpoints, channels and research evidence; the curve is illustrative.'),{size:16,width:x1-x0,color:C.muted});break
   }
   case 'railMap':{
    const stages=T('研究与规划|选购|预订|出发前|旅行中|旅行后','Research & planning|Shopping|Booking|Before travel|Travel|Post travel').split('|');
    const principles=T('方便、容易、灵活|订票是旅行的一部分|计划随时间逐步形成|尊重、高效、亲切的服务','Convenient, easy, flexible|Booking is part of a larger trip|Plans develop over time|Respectful, effective, personal service').split('|');
    principles.forEach((n,i)=>out+=rect(i*360,0,360,60,{fill:C.plane})+text(i*360+15,24,n,{size:18,width:330,leading:23}));
    const start=130,cw=216;stages.forEach((n,i)=>out+=text(start+i*cw+108,86,n,{size:20,width:204,anchor:'middle'}));
    const ys=[110,245,306];[T('行为','Doing'),T('想法','Thinking'),T('感受','Feeling')].forEach((n,i)=>out+=text(13,ys[i]+25,n,{size:19,width:110}));
    stages.forEach((n,i)=>{const x=start+i*cw;out+=line(x,98,x,364);let shape=i<2||i===5?`M${x+40} 143C${x+40} 112 ${x+175} 112 ${x+175} 143C${x+175} 174 ${x+40} 174 ${x+40} 143`:i===2?`M${x+20} 141H${x+192}`:`M${x+20} 141Q${x+60} 102 ${x+104} 141T${x+192} 141`;out+=path(shape,C.signal);if(i===2)[24,77,130,188].forEach(v=>out+=dot(x+v,141,4));out+=text(x+12,188,s.caseRows[0][i+1],{size:17,width:cw-24,leading:22})+text(x+12,270,s.caseRows[1][i+1],{size:17,width:cw-24,leading:22})+text(x+12,331,s.caseRows[2][i+1],{size:17,width:cw-24,leading:22})});
    [240,301,364].forEach(y=>out+=line(0,y,1440,y));
    out+=text(14,391,T('体验维度','Experience'),{size:18,width:114})+text(147,391,T('愉悦程度 · 相关性 · 帮助程度','Enjoyability · Relevance · Helpfulness'),{size:18,width:1240,color:C.muted});
    const opportunities=T('全程：清晰价值主张；找到帮助；自主解决；旅行知识；有目的的社交媒体|规划／选购／预订：渐进规划；可视化旅程；连接三个阶段；合理配送；决策信息|出发前／旅行中／旅行后：纸票体验；主动处理变化；状态透明；在欧洲继续规划预订','Throughout: clear value; find help; self-service; travel knowledge; purposeful social media|Plan / shop / book: progressive planning; trip visualization; connected stages; shipping; decision information|Before / during / after travel: paper tickets; proactive changes; clear status; plan and book in Europe').split('|');
    opportunities.forEach((n,i)=>out+=rect(i*480,412,480,80)+text(i*480+15,436,n,{size:17,width:450,leading:22}));
    out+=text(16,519,T('环形：持续非线性过程　　直线：线性过程　　波形：按时间展开的非线性过程','Loop: ongoing nonlinear process     Line: linear process     Wave: time-based nonlinear process'),{size:16,width:1400,color:C.muted});break
   }
   case 'theatre':{
    out=heading(T('一场演出背后的协作','The collaboration behind a performance'));
    // A shared theater illustration connects the visible stage to its people and equipment.
    // The luminance mask keeps linework flat and lets the current region share the teaching color.
    out+=`<defs><filter id="theatre-lines" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .5 .5 .5 0 -.2"/></filter><mask id="theatre-ink" maskUnits="userSpaceOnUse" x="36" y="128" width="800" height="300"><svg x="36" y="128" width="800" height="300" viewBox="40 105 1900 540" preserveAspectRatio="xMidYMid meet"><image href="assets/theatre-illustration.png" width="1983" height="793" filter="url(#theatre-lines)"/></svg></mask></defs>`;
    out+=rect(36,128,800,300,{fill:C.ink,stroke:'none'}).replace('/>',' mask="url(#theatre-ink)"/>');
    const zones=[[36,330,201,292],[366,242,487,216],[608,228,722,212]];
    s.items.forEach(([h,b],i)=>{const [x,w,cx,copyWidth]=zones[i];
     const highlight=rect(x,128,w,300,{fill:C.signal,stroke:'none'}).replace('/>',' class="theatre-highlight" mask="url(#theatre-ink)"/>');
     out+=group(i,highlight+line(cx,408,cx,448)+text(cx,486,h,{size:24,width:copyWidth,anchor:'middle',centerY:486})+text(cx,548,b,{size:18,width:copyWidth,anchor:'middle',centerY:548,color:C.muted,leading:27}));
    });
    out+=text(436,640,T('顾客看得见的前台，依赖后台与支持过程。','What the customer sees depends on backstage and support processes.'),{size:18,width:784,anchor:'middle',color:C.muted});break
   }
   case 'blueprintSequence':{
    // Core and optional lanes keep one geometry across every teaching build.
    const laneNames=T('时间|质量标准|情感历程|实体证据|顾客行为|前台员工／系统|后台员工行为|支持过程','Time|Quality standards|Emotional journey|Physical evidence|Customer actions|Frontstage / systems|Backstage actions|Support processes').split('|');
    const laneBuilds=[8,6,7,0,1,2,3,4],xs=[354,598,842,1086],start=103,rh=47;
    const item=s.items[currentStep]||s.items[0];
    out=text(44,29,item[0],{size:24,width:240,weight:en?700:800})+text(300,29,item[1],{size:17,width:1094,leading:23,color:C.muted});
    for(let j=0;j<4;j++)out+=text(xs[j],82,T('阶段 ','Stage ')+(j+1),{size:17,width:202,anchor:'middle',centerY:82});
    laneNames.forEach((name,r)=>{
     const y=start+r*rh,cy=y+rh/2;let lane=text(225,cy,name,{size:18,width:197,anchor:'end',centerY:cy,leading:24,weight:500});
     xs.forEach((x,j)=>{lane+=rect(x-101,y+4,202,rh-8);let sample='';
      if(r===0&&j<2)sample=j?T('5 分钟','5 min'):T('5 秒','5 sec');
      if(r===1&&j===0)sample=T('等待时间','Waiting time');
      if(r===2&&j===0)sample=T('恐惧／安心','Fear / reassurance');
      if(sample)lane+=text(x,cy,sample,{size:17,width:182,anchor:'middle',centerY:cy});
      else lane+=line(x-78,cy,x+78,cy,{dash:'2 6'});
     });out+=group(laneBuilds[r],lane);
    });
    // Boundary labels occupy their own right-hand margin, clear of the cells.
    [5,6,7].forEach((r,i)=>{const y=start+r*rh;let boundary=line(253,y,1187,y,{dash:'5 6'});
     boundary+=text(1306,y,T(['互动线','可视线','内部互动线'][i],['Line of interaction','Line of visibility','Internal interaction'][i]),{size:13,width:210,anchor:'middle',centerY:y,color:C.muted});out+=group(5,boundary);
    });
    out+=group(9,text(44,510,T('互动照片／草图','Photos / sketches'),{size:18,width:240,centerY:510,weight:500})+text(300,510,T('按服务步骤补充连续图像；空白格填写研究证据，示例值不代表实测结果。','Add images in service order. Fill blank cells with evidence; the examples are not measurements.'),{size:15,width:1094,centerY:510,color:C.muted}));break
   }
   case 'blueprint':case 'blueprintExtra':{
    const extra=type==='blueprintExtra';const rows=extra?T('时间|质量标准|情感历程|实体证据|顾客行为|前台员工／数字设备|后台员工／系统|支持过程','Time|Quality standards|Emotional journey|Physical evidence|Customer actions|Frontstage / digital|Backstage / systems|Support processes').split('|'):T('实体证据|顾客行为|前台员工／系统|后台员工行为|支持过程','Physical evidence|Customer actions|Frontstage / systems|Backstage actions|Support processes').split('|');
    const rh=extra?57:94,xs=[335,630,925,1220],start=extra?43:61;
    out=text(262,24,T('服务沿时间展开，泳道连接职责','The service unfolds over time; lanes connect responsibilities'),{size:22,width:1130,color:C.muted});
    rows.forEach((n,r)=>{let y=start+r*rh;out+=text(220,y+rh/2,n,{size:extra?18:21,width:188,anchor:'end',centerY:y+rh/2});if(r===0||extra&&r<3){xs.forEach((x,j)=>{out+=rect(x-98,y+8,196,rh-16)+text(x,y+rh/2,extra&&r===0?(j%2?T('5 分钟','5 min'):T('5 秒','5 sec')):extra&&r===1?T('等待时间','Waiting time'):extra&&r===2?T('恐惧／安心','Fear / reassurance'):'',{size:19,width:175,anchor:'middle',centerY:y+rh/2})})}else{xs.forEach((x,j)=>out+=rect(x-98,y+15,196,rh-30));for(let j=0;j<3;j++)out+=line(xs[j]+98,y+rh/2,xs[j+1]-98,y+rh/2);if((extra?r>=5:r>=2))xs.forEach((x,j)=>out+=line(x,y-8,x,y+15));if(!extra&&r===1){for(let j=0;j<3;j++)out+=dot(xs[j]+145,y+rh/2,5)}}
     const lane=r-(extra?3:0);if(lane>=2){out+=line(252,y,1399,y,{dash:'5 6',color:C.muted})+text(1397,y-7,T(['互动线','可视线','内部互动线'][lane-2],['Line of interaction','Line of visibility','Internal interaction'][lane-2]),{size:16,width:400,anchor:'end',color:C.muted})}
    });
    let r=s.key==='blueprint-customer'?1:s.key==='blueprint-frontstage'?2:s.key==='blueprint-structure'?currentStep:s.key==='blueprint-intro'?(currentStep?2:1):extra?([1,2,0,3][currentStep]):1;
    out+=rect(18,start+r*rh,1394,rh,{stroke:C.signal});if(extra)out+=text(264,515,T('照片／草图：用连续图像解释关键互动','Photos / sketches: show the important interactions in sequence'),{size:20,width:1130,color:currentStep===3?C.signal:C.muted});break
   }
   case 'inclusive':{
    out=heading(T('不同限制，同一阅读任务','Different constraints, the same reading task'));
    const examples=T('公交站：长期能力差异|公交站：受伤或短期受限|公交站：强光、语言或注意力限制','Bus stop: permanent ability differences|Bus stop: injury or temporary restriction|Bus stop: glare, language or attention constraints').split('|');
    s.items.forEach(([h,b],i)=>{const y=111+i*173,baseline=y+57;out+=group(i,text(60,baseline,h,{size:27,width:200})+text(307,baseline,b,{size:23,width:492,color:C.muted,leading:30})+text(307,baseline+52,examples[i],{size:20,width:492,leading:27})+line(60,y+158,809,y+158))});break
   }
   case 'hmwCase':{
    out=heading(T('从等待的困惑，到开放的问题','From waiting confusion to an open question'));
    s.items.forEach(([h,b],i)=>{const y=160+i*190;out+=group(i,itemIcon(s,i,54,y-24,28)+text(94,y,h,{size:26,width:715})+text(54,y+52,b,{size:20,width:745,leading:28})+line(54,y+110,816,y+110))});break
   }
   case 'ideationCase':{
    out=heading(T('预约等待：三种不同机制','Booking wait: three different mechanisms'));
    const ex=T('时间线、下一步与预计进展|交接记录、负责人和反馈|改期、取消与主动联系','Timeline, next steps and expected progress|Handoff log, owner and feedback|Rescheduling, cancellation and contact').split('|');
    s.items.forEach(([h,b],i)=>{const y=145+i*170;out+=group(i,itemIcon(s,i,54,y+7,28)+text(94,y,h,{size:26,width:180,centerY:y+21})+text(315,y,b,{size:22,width:485,centerY:y})+text(315,y+42,ex[i],{size:18,width:485,color:C.muted,centerY:y+42})+line(54,y+79,815,y+79))});break
   }
   case 'prototypeCase':{
    out=heading(T('预约服务：让人真正互动','Appointment service: something people can use'));
    out+=group(0,rect(55,119,763,163)+itemIcon(s,0,79,133,28)+text(119,157,T('界面原型','Interface prototype'),{size:26,width:685})+node(90,190,170,66,T('已提交','Submitted'),-1,C.plane)+node(340,190,170,66,T('待确认','Awaiting confirmation'),-1,C.plane)+node(590,190,170,66,T('可变更','Change available'),-1,C.plane)+line(260,223,340,223)+line(510,223,590,223));
    out+=group(1,itemIcon(s,1,57,315,28)+text(97,339,T('服务角色扮演','Service role-play'),{size:26,width:685})+line(150,397,710,397)+T('顾客|前台|后台','Customer|Frontstage|Backstage').split('|').map((n,i)=>dot(150+i*280,397,7)+text(150+i*280,445,n,{size:20,width:210,anchor:'middle'})).join(''));
    out+=group(2,itemIcon(s,2,57,500,28)+text(97,524,T('验证记录','Test record'),{size:26,width:685})+text(57,575,T('是否看懂状态？能否找到下一步？交接在哪里中断？\n记录表现、困惑、反例与新问题。','Is the status clear? Can people find the next step? Where does a handoff fail?\nRecord behavior, confusion, counterexamples and questions.'),{size:24,width:740,color:C.muted,leading:35}));break
   }
   case 'iterationCase':{
    out=heading(T('预约服务：用反馈推动下一轮','Appointment service: let feedback guide the next round'));
    const pos=[[53,145],[463,145],[463,427],[53,427]],ex=T('让人查看预约并申请变更|检查状态理解、完成任务与困惑|修改信息、流程或服务交接|再次观察；同时检查副作用','Ask someone to view a booking and change it|Check status understanding, task completion and confusion|Revise information, flow or handoff|Observe again; check side effects').split('|');
    // Connect the edges, then draw every node above the connections.
    out+=path('M403 239H463M638 333V427M463 521H403M228 427V333');
    pos.forEach(([x,y],i)=>out+=group(i,rect(x,y,350,188,{fill:C.plane})+itemIcon(s,i,x+24,y+20,28)+text(x+64,y+44,s.items[i][0],{size:28,width:262})+text(x+24,y+102,ex[i],{size:22,width:302,color:C.muted,leading:31})));break
   }
   case 'appointment':{
    const stages=T('提交预约|确认|等待／变更|到访','Submit|Confirm|Wait / change|Arrive').split('|');const lanes=T('实体证据|顾客行为|前台行为|后台行为|支持过程','Physical evidence|Customer actions|Frontstage actions|Backstage actions|Support processes').split('|');
    out=table([T('预约服务','Appointment service'),...stages],lanes.map((n,i)=>[n,...s.matrix.map(col=>col[i])]),{columns:[16,21,21,21,21],active:false});
    [254,346,438].forEach((y,i)=>out+=line(230,y,1440,y,{dash:'6 7',color:C.muted})+rect(1094,y-22,346,22,{fill:C.ground,stroke:'none'})+text(1428,y-5,T(['互动线','可视线','内部互动线'][i],['Interaction','Visibility','Internal interaction'][i]),{size:16,anchor:'end',width:334,color:C.muted}));
    const row=[1,2,3][currentStep];out+=rect(230,70+row*92,1210,92,{stroke:C.signal});break
   }
   default:out=heading(T('方法框架','Method framework'))+process(s);
  }
  return `<svg xmlns="${NS}" viewBox="0 0 ${s.wide?1440:872} ${s.wide?530:704}" role="img" aria-label="${esc(s.title.replaceAll('\n',' ')+'；'+s.items.map(x=>x.join('：')).join('；'))}" font-family="${font()}"><style>path:not([stroke="none"]),rect:not([stroke="none"]),circle:not([stroke="none"]),ellipse:not([stroke="none"]){stroke-width:1.2;vector-effect:none}text{stroke:none}.active .material-icon{color:#f7f250}.theatre-highlight{opacity:0;transition:opacity 850ms ease}.active>.theatre-highlight{opacity:1}.active > text:not(.fw-fixed){fill:#f7f250}.active > rect:not([stroke="none"]),.active > circle:not([stroke="none"]),.active > path:not([stroke="none"]){stroke:#f7f250}.active>text[data-type-role="label"]{font-weight:${en?700:800}}.active>text[data-type-role="small"]{font-weight:700}.fw-fixed{fill:#f7f7f2!important}</style>${out}</svg>`;
 }
 // Geometry is measured in the SVG's logical coordinate system, so scaling the stage
 // scales its rules too. Nested icon scales are compensated separately.
 function normalize(svg){
  svg.querySelectorAll('[data-label-mask]').forEach(g=>{const r=g.querySelector('rect'),b=g.querySelector('text').getBBox();r.setAttribute('x',b.x-8);r.setAttribute('y',b.y-5);r.setAttribute('width',b.width+16);r.setAttribute('height',b.height+10)});
  svg.querySelectorAll('[data-symbol]').forEach(g=>{const b=g.getBBox();g.setAttribute('transform',g.getAttribute('transform')+` translate(${-b.x-b.width/2} ${-b.y-b.height/2})`)});
  svg.querySelectorAll('[data-center-card]').forEach(g=>{const r=g.querySelector('rect'),c=g.querySelector('[data-card-content]'),b=c.getBBox();c.setAttribute('transform',`translate(${+r.getAttribute('x')+ +r.getAttribute('width')/2-b.x-b.width/2} ${+r.getAttribute('y')+ +r.getAttribute('height')/2-b.y-b.height/2})`)});
  svg.querySelectorAll('path,rect,circle,ellipse,line,polygon,polyline').forEach(e=>{if(e.getAttribute('stroke')==='none'||e.closest('defs'))return;let scale=1;for(let p=e.parentElement;p&&p!==svg;p=p.parentElement){const t=p.getAttribute('transform')||'',m=t.match(/scale\(([-.\d]+)/);if(m)scale*=+m[1]}e.style.strokeWidth=String(1.2/scale);e.style.vectorEffect='none';});
 }
 function motion(step,moving){host.querySelectorAll('.fw-flow').forEach(c=>{c.replaceChildren();const run=moving&&Number(c.dataset.route)===step;c.style.display=run?'':'none';if(run){const a=document.createElementNS(NS,'animateMotion');a.setAttribute('path',c.dataset.path);a.setAttribute('dur','7s');a.setAttribute('repeatCount','indefinite');a.setAttribute('calcMode','paced');c.setAttribute('cx','0');c.setAttribute('cy','0');c.append(a);a.beginElement()}})}
 function render(s,p,moving){host.hidden=!s.framework;document.getElementById('frameworkCaption').hidden=true;if(!s.framework)return;en=document.documentElement.lang==='en';current=s;currentStep=p;const nextKey=s.key+'|'+en;const contextual=['personaTemplate','journey','blueprint','blueprintExtra','blueprintSequence','appointment','peakCombined'].includes(s.framework);
  if(key!==nextKey||contextual){host.innerHTML=diagram(s);normalize(host.querySelector('svg'));key=nextKey}
  host.querySelectorAll('[data-build]').forEach(el=>{el.classList.toggle('active',el.dataset.build.split(',').map(Number).includes(p));el.classList.toggle('pending',Math.min(...el.dataset.build.split(',').map(Number))>p)});host.querySelectorAll('.theatre-highlight').forEach(el=>el.style.transition=moving?'':'none');host.setAttribute('aria-label',s.title.replaceAll('\n',' '));const item=s.items[p];document.getElementById('frameworkCaption').textContent=item?(item[0]+(item[1]?' · '+item[1].replaceAll('\n',' '):'')):'';if(s.framework==='routes')motion(p,moving);
 }
 return{render};
})();
