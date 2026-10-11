/* Diagram structures are retained; typography, strokes and emphasis share one visual system.
   Source screenshots are reference material only, never displayed by this module. */
window.MethodRedraws = (() => {
 const icons = window.MaterialIcons;
 function draw(s,h,p,en){
  const {T,text,line,path,rect,dot,group,C,iconPerson}=h;
  const tx=(x,y,t,w=400,size=24,col=C.ink)=>text(x,y,t,{width:w,size,color:col,leading:size*1.4});
  const mid=(x,y,t,w=400,size=24,col=C.ink)=>text(x,y,t,{width:w,size,color:col,anchor:'middle',leading:size*1.35});
  const arrow=(x,y,xx,yy,col=C.line,dash='')=>{const a=Math.atan2(yy-y,xx-x),b=10;return line(x,y,xx,yy,{color:col,dash})+path(`M${xx-b*Math.cos(a-.42)} ${yy-b*Math.sin(a-.42)}L${xx} ${yy}L${xx-b*Math.cos(a+.42)} ${yy-b*Math.sin(a+.42)}`,col)};
  const center=(x,y,t,w=400,size=24,col=C.ink)=>text(x,y,t,{width:w,size,color:col,anchor:'middle',centerY:y,leading:size*1.35});
  const label=(x,y,t,w=150)=>{const size=s.key==='stakeholder-circle'?15:17;
   return `<g data-label-mask="true">${rect(x-w/2,y-size,w,size+10,{fill:C.plane,stroke:'none'})+mid(x,y,t,w-16,size,C.muted)}</g>`;
  };
  const circle=(x,y,r,fill='none',stroke=C.line)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
  const icon=(name,x,y,size=54)=>window.MaterialIcons.diagram(name,x,y,size,C.ink);
  const divider=x=>line(x,44,x,474);
  const steps=(x,y,list,w=510,size=23)=>list.map((a,i)=>tx(x,y+i*100,String(i+1)+'. '+a,w,size)).join('');
  let o='';
  switch(s.key){
   case 'problem':{
    // Node centers sit exactly on a true circle, at equal 90-degree intervals.
    const cx=720,cy=245,R=190,r=66,gap=7;
    const angles=[-3*Math.PI/4,-Math.PI/4,Math.PI/4,3*Math.PI/4];
    const point=a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)];
    const clearance=2*Math.asin((r+gap)/(2*R));
    o+='<g stroke-linecap="round" stroke-linejoin="round">';
    angles.forEach((a,i)=>{const b=a+Math.PI/2,start=a+clearance,end=b-clearance,A=point(start),B=point(end);
     o+=path(`M${A[0]} ${A[1]}A${R} ${R} 0 0 1 ${B[0]} ${B[1]}`);
     const tangent=end+Math.PI/2,len=8,spread=.48;
     o+=path(`M${B[0]-len*Math.cos(tangent-spread)} ${B[1]-len*Math.sin(tangent-spread)}L${B[0]} ${B[1]}L${B[0]-len*Math.cos(tangent+spread)} ${B[1]-len*Math.sin(tangent+spread)}`);
    });
    o+='</g>';
    o+=circle(cx,cy,82,C.ground)+center(cx,cy,T('问题是\n什么？','What is the\nproblem?'),148,28);
    angles.forEach((a,i)=>{const [x,y]=point(a);o+=group(i,circle(x,y,r,C.ground)+icon(window.MaterialIcons.forItem(s.key,i),x-14,y-38,28)+center(x,y+15,s.items[i][0],112,25))});
    o+=center(cx,492,T('商业 · 市场 · 用户 · 技术，围绕同一个问题相互校验。','Business, market, users and technology inform one shared problem.'),1280,20,C.muted);break;
   }
   case 'business-methods':{
    const zh=['利益相关者涟漪','期望与失望','热气球法'],eng=['Stakeholder Circle','Hopes & Fears','Hot Air Balloon'];
    [240,720,1200].forEach((x,i)=>{let b='';if(i===0){[36,67,98].forEach(r=>b+=circle(x,170,r));b+=line(x-55,120,x,170)+line(x,170,x+85,209);[[x,170],[x-55,120],[x+85,209]].forEach(([xx,yy])=>b+=dot(xx,yy,7))}else if(i===1){b+=rect(x-118,100,92,112)+rect(x+26,100,92,112)+path(`M${x-48} 140h-45m0 28h45M${x+48} 140h45m-45 28h45`)}else{b+=`<path d="M${x} 67C${x-120} 67 ${x-130} 190 ${x-25} 239H${x+25}C${x+130} 190 ${x+120} 67 ${x} 67Z" fill="none" stroke="${C.line}"/>`+path(`M${x-25} 239l7 35h36l7-35`)+rect(x-20,274,40,27)}
     o+=group(i,b+mid(x,347,T(zh[i],eng[i]),410,30)+mid(x,404,s.items[i][1],380,23,C.muted));});o+=divider(480)+divider(960);break;
   }
   case 'stakeholder-circle':{
    const cx=360,cy=260;[94,164,236].forEach(r=>o+=circle(cx,cy,r));
    const roles=[['项目经理','Project manager',286,133],['客户经理','Account manager',357,70],['客户','Client',375,264],['开发人员','Developers',125,190],['设计人员','Designers',146,385],['市场团队','Marketing team',370,431],['协作系统','Collaboration tool',268,330],['财务系统','Finance system',483,267],['财务行政','Finance admin',590,264],['负责人','Director',487,358]];
    const edges=[[0,1,'提案','Pitch',306,40],[0,2,'会议','Meetings',295,215],[1,2,'合同／启动','Contract / kickoff',454,145],[3,6,'消息','Messages',167,278],[4,6,'消息','Messages',165,345],[6,2,'消息','Messages',306,295],[2,7,'支付','Payment',454,232],[7,2,'发票','Invoices',438,273],[7,9,'报告','Reports',550,340],[8,7,'创建发票','Create invoices',591,216],[9,5,'更新','Updates',408,421]];
    edges.forEach(([a,b,z,e,x,y])=>{const A=roles[a],B=roles[b];o+=arrow(A[2],A[3],B[2],B[3]);o+=label(x,y,T(z,e),en?126:100)});
    roles.forEach(([z,e,x,y],i)=>o+=circle(x,y,10,i===2?C.signal:C.ink,'none')+label(x,y+36,T(z,e),en?145:120));
    o+=divider(700)+tx(756,64,T('步骤与示例','Steps and example'),600,28)+steps(756,130,T('枚举所有业务参与角色。|按重要程度放入圈层；可用标记区分部门。|标出沟通与业务关系，如周会、邮件、合同和支付。','List every business participant.|Place roles by importance; use markers for departments.|Label communication and business links: meetings, email, contracts and payments.').split('|'),605,en?21:23);
    o+=tx(756,459,T('由内而外：最重要 → 次重要 → 较不重要','From inside out: most → less important'),620,22,C.muted);break;
   }
   case 'hopes':{
    o=divider(710);
    [205,515].forEach((x,i)=>o+=group(i,icon(window.MaterialIcons.forItem(s.key,i),x-28,24,56)+center(x,105,T(i?'失望／担忧':'期望',i?'Fears':'Hopes'),275,24)));
    const bubbles=[[152,237,80,0,T('体验\n一致性','Consistent\nexperience')],[284,324,60,0,T('全功能\n团队','Cross-functional\nteam')],[493,320,92,1,T('系统集成\n依赖性强','Integration\ndependencies')],[596,174,63,1,T('上线时间\n很长','Long time\nto launch')]];
    bubbles.forEach(([x,y,r,i,t])=>o+=group(i,circle(x,y,r,C.ground)+center(x,y,t,r*1.7,en?19:23)));
    o+=group(0,circle(79,382,22)+circle(282,424,28))+group(1,circle(617,440,18)+circle(642,332,28));
    o+=group(2,icon(window.MaterialIcons.forItem(s.key,2),756,40,40)+tx(812,64,T('步骤与示例','Steps and example'),550,28)+steps(756,145,T('在不同颜色的便签上写下项目期望与担忧。|将同类主题归在一起；统计被提及的次数。|电子化时，用气泡大小表达实际关注度。','Write hopes and fears on different-colored notes.|Group related themes; count mentions.|When digitizing, use bubble size to show attention.').split('|'),605,en?21:23));break;
   }
   case 'balloon':{
    o=divider(700);
    // A centered balloon and two paired forces: each arrow belongs to its own text column.
    o+=`<path d="M350 60C245 60 220 204 301 281H399C480 204 455 60 350 60Z" fill="none" stroke="${C.line}"/>`+path('M301 281L320 326H380L399 281')+rect(319,326,62,45);
    o+=center(350,164,T('资金 · 技术\n团队 · 市场','Funding · Technology\nPeople · Market'),170,en?18:20,C.muted);
    [0,1].forEach(i=>{const x=i?570:130,head=T(i?'资源劣势':'资源优势',i?'Constraints':'Strengths');
     o+=group(i,icon(window.MaterialIcons.forItem(s.key,i),x-28,30,56)+center(x,120,head,220,24)+center(x,244,s.items[i][1],240,18,C.muted)+arrow(x,i?372:414,x,i?414:372)+center(x,451,T(i?'下降':'上升',i?'Down':'Up'),200,20));
    });
    o+=tx(756,64,T('步骤与示例','Steps and example'),600,28)+steps(756,126,T('工作坊前绘制热气球模板。|在便签上写下资源优势与劣势。|比较资金、技术、团队和市场资源。|判断优势能否抵消劣势，热气球是否能上升。','Prepare the balloon template.|Write resource strengths and constraints.|Weigh funding, technology, people and market resources.|Discuss whether strengths outweigh constraints and lift the balloon.').split('|'),605,en?21:23);break;
   }
   case 'research-levels':{
    const widths=[550,480,410],ys=[48,202,382];o=tx(39,137,T('桌面\n调研','Desk\nresearch'),116,23)+tx(80,436,T('用户\n调研','User\nresearch'),116,23);
    o+=arrow(138,55,138,325)+arrow(198,380,198,498)+line(38,350,1410,350,{dash:'6 8'});
    ys.forEach((y,i)=>{const w=widths[i],x=230+(550-w)/2;o+=group(i,`<path d="M${x} ${y}H${x+w}L${x+w-26} ${y+111}H${x+26}Z" fill="${C.ground}" stroke="${C.line}"/>`+mid(505,y+66,s.items[i][0],w-50,29)+tx(838,y+47,s.items[i][1],530,en?23:25,C.muted))});break;
   }
   case 'research-audience':{
    o=mid(720,64,T('用户调研的对象，不应仅仅只有“用户”','User research extends beyond the end user'),1310,27);
    const xs=[167,475,730,985,1240];o+=arrow(278,259,366,259,C.signal);
    xs.forEach((x,i)=>o+=group(i,circle(x,259,i?80:108,C.ground)+icon(window.MaterialIcons.forItem(s.key,i),x-36,198,72)+center(x,305,s.items[i][0],i?144:190,en?25:30)+mid(x,421,s.items[i][1],i?222:235,en?20:22,C.muted)));break;
   }
   case 'customer-user':{
    const coords={vendor:[110,268],product:[325,268],customer:[605,87],user:[605,431],potential:[909,268]};
    const edges=[['vendor','product','推广','Promote',210,230],['customer','product','使用','Use',410,143],['customer','product','钱／支付','Payment',470,215],['user','product','使用','Use',434,405],['potential','product','有需求，暂未使用','Needs it; not yet a user',757,304],['potential','customer','转化','Convert',791,129],['potential','user','转化','Convert',791,409],['customer','user','延伸','May overlap',667,265]];
    edges.forEach(([a,b,z,e,x,y],i)=>{const A=coords[a],B=coords[b];let xx=A[0],yy=A[1],xxx=B[0],yyy=B[1];const ang=Math.atan2(yyy-yy,xxx-xx);xx+=65*Math.cos(ang);yy+=65*Math.sin(ang);xxx-=65*Math.cos(ang);yyy-=65*Math.sin(ang);if(i===2){xx+=20;xxx+=20;}o+=arrow(xx,yy,xxx,yyy,C.line,'4 6');if(i===7)o+=arrow(xxx,yyy,xx,yy,C.line,'4 6');o+=label(x,y,T(z,e),i===4?202:112)});
    [['vendor','商家','Provider',3],['product','产品＋服务','Product + service',-1],['customer','客户','Customer',0],['user','用户','User',1],['potential','潜在用户','Potential user',2]].forEach(([id,z,e,i])=>{const [x,y]=coords[id];let symbol=id==='product'?icon('inventory_2',-22,-22,44):iconPerson(0,0,{scale:.8});
     let b=`<g data-center-card="true">${rect(x-75,y-55,150,110,{fill:C.plane,stroke:'none'})}<g data-card-content="true"><g data-symbol="true" transform="translate(${x} ${y-12})">${symbol}</g>${center(x,y+32,T(z,e),138,20)}</g></g>`;o+=i<0?b:group(i,b)});
    o+=divider(1050);s.items.forEach(([h,b],i)=>o+=group(i,tx(1100,58+i*120,h,290,27)+tx(1100,96+i*120,b,298,en?20:22,C.muted)));break;
   }
   case 'demand-types':{
    const zs=T('理论上有需求，实际情境中没有真实需求。|理论与实际都有需求，但替代性强，容易被其他方案替代。|需求与痛点都明确。','A need assumed without evidence from the actual context.|A real need that existing alternatives can already meet.|A well-evidenced need with a clear pain point.').split('|');
    [235,720,1205].forEach((x,i)=>{let ic=icon(window.MaterialIcons.forItem(s.key,i),x-40,52,80);o+=group(i,ic+mid(x,208,s.items[i][0],360,28)+mid(x,278,zs[i],370,22,C.muted));});o+=line(477,44,477,418)+line(962,44,962,418)+tx(45,483,T('练习：找出真实行为证据，列出替代方案，并讨论不解决的后果。','Practice: find behavioral evidence, list substitutes and discuss the cost of inaction.'),1350,22,C.muted);break;
   }
   case 'ab-process':{
    const xs=[166,443,720,997,1274];
    xs.forEach((x,i)=>{if(i<4)o+=arrow(x+32,57,xs[i+1]-32,57);o+=group(i,circle(x,57,18,C.ground)+center(x,57,String(i+1),28,17)+icon(window.MaterialIcons.forItem(s.key,i),x-48,105,96)+center(x,243,s.items[i][0],242,25)+tx(x-121,291,s.items[i][1],242,18,C.muted))});break;
   }
   case 'ab-cautions':{
    const heads=T('筛选用户|合理的偏差范围|合理的指标','Representative samples|Statistical uncertainty|Meaningful metrics').split('|');
    const texts=T('让样本与总体具有相似性；“1% → 100%”表达代表性。随机分组，检查两组可比较。|两组不可能完全相同。预先规划样本量、时长与可接受的不确定性。|过高或过低的指标会影响行动和判断；一起观察主要指标与负面影响。','Use a relevant sample and random assignment. The source’s 1% → 100% example illustrates representativeness.|Plan sample size, duration and uncertainty before interpreting the results.|Choose a meaningful primary metric and monitor guardrail metrics for potential harm.').split('|');
    [235,720,1205].forEach((x,i)=>o+=group(i,icon(window.MaterialIcons.forItem(s.key,i),x-60,70,120)+center(x,258,heads[i],390,29)+mid(x,319,texts[i],379,en?24:25,C.muted)));
    o+=line(477,44,477,486)+line(962,44,962,486);break;
   }
   case 'qual-quant':{
    const data=[T('把大量资料归类成主题。|理解经验、动机与情境，分析模式与反例。|用透明的分析过程反思主观偏见。','Group evidence into themes.|Understand experience, motivation and context; examine patterns and counterexamples.|Reflect on bias through a transparent analysis process.'),T('依赖统计推断，估计频率、分布与差异。|使用统计学方法分析不确定性。|误差和解释边界受数据收集方式与人群影响。','Use inference to estimate frequency, distributions and differences.|Analyze uncertainty with statistical methods.|Collection methods and populations shape error and interpretation.')];
    [64,800].forEach((x,i)=>o+=group(i,icon(window.MaterialIcons.forItem(s.key,i),x,48,120)+tx(x,220,s.items[i][0],576,31)+data[i].split('|').map((v,j)=>tx(x,280+j*74,v,576,en?24:25,C.muted)).join('')));o+=line(720,48,720,482);break;
   }
   case 'purchase':{
    o=tx(48,77,T('从定量到定性','From quantitative to qualitative'),395,29)+tx(48,134,T('审视各项指标，了解哪里有问题；再用定性研究弄清，人们为什么遇到这个问题。','Review the metrics to locate a problem. Then use qualitative research to understand why people encounter it.'),366,25,C.muted)+divider(465);
    const terms=['Acquisition','Activation','Retention','Revenue','Referral'],vals=[120,80,60,32,5];
    vals.forEach((v,i)=>{const w=420-i*52,x=516+(420-w)/2,y=55+i*84;o+=group(i,rect(x,y,w,62,{fill:C.plane})+mid(726,y+38,en?terms[i]:terms[i]+' · '+s.items[i][0],w-22,24)+tx(968,y+39,String(v),66,29))});
    o+=arrow(1054,48,1054,469)+tx(1105,72,T('数据揭示位置','Data locates the issue'),283,26)+tx(1105,117,T('无法单凭数字解释原因。','Numbers alone do not explain why.'),285,23,C.muted)+tx(1105,232,T('定性：理解原因\n定量：A/B 验证方案','Qualitative: explain why\nQuantitative: test the solution'),285,23,C.muted);break;
   }
   case 'gemba':{
    o=divider(910)+group(0,icon('map-pin',155,44,64)+mid(188,163,T('发生在真实情境中','In the real context'),370,30))+group(1,icon('users-round',601,44,64)+mid(633,163,T('访谈中的表达','What people say'),410,30));
    o+=line(48,200,862,200)+tx(48,254,T('• 直接获得资料，减少中间环节。\n• 及时捕捉正在发生的现象。\n• 搜集一些无法言表的材料。','• Obtain firsthand evidence with fewer intermediaries.\n• Capture events as they happen.\n• Notice what is hard to express in words.'),815,26,C.muted)+tx(48,452,T('把说法与行为对照；观察记录也需要反思偏见。','Compare words with actions; observation also needs bias reflection.'),818,22,C.muted);
    o+=tx(971,100,T('结构化记录','Structured observation'),398,30)+tx(971,179,'A E I O U',400,44,C.signal)+tx(971,259,T('活动 · 环境 · 互动\n物件 · 人物','Activities · Environments\nInteractions · Objects · Users'),400,25,C.muted)+line(971,349,1375,349)+tx(971,404,'I + Q',398,36)+tx(971,455,T('洞见与问题，另作整理','Keep insights and questions separate'),400,23,C.muted);break;
   }
   case 'aeiou':{
    o=tx(40,53,T('AEIOU · 观察记录','AEIOU · Observation'),945,30)+tx(1051,53,T('I + Q · 分析输出','I + Q · Synthesis'),348,30)+divider(995);
    s.items.slice(0,5).forEach(([a,b],i)=>{const y=114+i*80;let letter=['A','E','I','O','U'][i];o+=group(i,circle(68,y+3,23,C.ground)+mid(68,y+11,letter,43,25)+tx(118,y+11,a.split(' · ')[1]||a,210,24)+tx(338,y+11,b,610,en?20:22,C.muted))});
    s.items.slice(5).forEach(([a,b],i)=>o+=group(i+5,circle(1073,167+i*225,23,C.ground)+mid(1073,175+i*225,['I','Q'][i],42,25)+tx(1113,176+i*225,a.split(' · ')[1]||a,255,27)+tx(1051,226+i*225,b,342,en?23:24,C.muted)));break;
   }
   case 'affinity':{
    o='<defs><linearGradient id="note-paper" x2="0" y2="1"><stop stop-color="#dddcd3"/><stop offset=".18" stop-color="#f1f0e7"/><stop offset="1" stop-color="#e7e6dd"/></linearGradient><filter id="note-shadow" x="-8%" y="-10%" width="116%" height="130%"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".22"/></filter></defs>';
    s.items.forEach(([a,b],i)=>{const x=30+(i%4)*354,y=26+Math.floor(i/4)*167;
     const sheet=`<path d="M${x} ${y}H${x+324}V${y+132}Q${x+307} ${y+148} ${x+291} ${y+145}H${x}Z" fill="url(#note-paper)" stroke="none" filter="url(#note-shadow)"/><path d="M${x+291} ${y+145}Q${x+303} ${y+132} ${x+324} ${y+132}" fill="none" stroke="#c3c1b7"/>`;
     const copy=(tx(x+20,y+34,a,280,en?23:24,'#222222')+tx(x+20,y+74,b,280,en?19:20,'#44443e')).replaceAll('<text ',`<text font-family="${'Manrope, Noto Sans SC, sans-serif'}" `);
     o+=group(i,sheet+copy);
    });break;
   }
   case 'peak-combined':{
    const x0=108,x1=940,values=s.qualitative,points=values.map((v,i)=>[x0+(x1-x0)*i/(values.length-1),64+v*56]);
    const ys=[64,120,176,232,288];ys.forEach((y,i)=>o+=tx(24,y+5,T(['愉悦','舒服','一般','不舒服','糟糕'][i],['Delighted','Comfortable','Neutral','Uncomfortable','Poor'][i]),80,14,C.muted)+line(x0,y,x1,y,{dash:i===4?'3 5':''}));
    o+=path(points.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(''),C.ink);points.forEach(([x,y])=>o+=dot(x,y,3));
    [15,8,19].forEach((j,i)=>{const [x,y]=points[j];o+=group([i,i+3],circle(x,y,7,i===p%3?C.signal:C.ink,'none')+label(Math.max(210,Math.min(825,x)),Math.max(34,y-34),T(['底线','峰值','终值'][i],['Baseline','Peak','Ending'][i]),150))});
    o+=arrow(x0,318,x1,318)+tx(866,345,T('时间','Time'),74,16,C.muted)+line(978,36,978,496);
    const caseMode=p>=3;[0,1,2].forEach(i=>{const [head,body]=s.items[i+(caseMode?3:0)],y=68+i*146;o+=group([i,i+3],tx(1014,y,(caseMode?T('宜家 · ','IKEA · '):'')+head,378,25)+tx(1014,y+42,body,378,18,C.muted))});
    s.touchpoints.forEach((t,i)=>o+=tx(44+(i%5)*180,382+Math.floor(i/5)*34,`${i+1}. ${t}`,170,en?13:14,C.muted));break;
   }
   case 'peak':case 'ikea':{
    const ikea=s.key==='ikea',values=ikea?s.qualitative:[2.7,2.6,3,2.1,.4,1,2.5,3.5,2.6,1.4],max=values.length-1,x0=112,x1=1393;
    ['愉悦','舒服','一般','不舒服','糟糕'].forEach((t,j)=>o+=tx(25,80+j*66,T(t,['Delighted','Comfortable','Neutral','Uncomfortable','Poor'][j]),90,17,C.muted)+line(x0,75+j*66,x1,75+j*66,{dash:j===4?'5 6':''}));
    const points=values.map((v,i)=>[x0+(x1-x0)*i/max,80+v*62]);o+=path(points.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(''),C.ink);
    points.forEach(([x,y],i)=>o+=dot(x,y,3));const picked=ikea?[15,8,19]:[7,4,9];picked.forEach((j,i)=>{const [x,y]=points[j];o+=group(i,circle(x,y,8,C.signal,'none')+label(Math.max(210,Math.min(1260,x)),Math.max(48,y-40),s.items[i][0],225))});
    o+=arrow(x0,371,x1,371)+tx(1280,402,T('时间','Time'),130,19,C.muted);
    if(ikea){s.touchpoints.forEach((t,i)=>o+=tx(40+(i%10)*140,434+Math.floor(i/10)*47,`${i+1}. ${t}`,134,en?14:17,C.muted));}else o+=tx(45,446,T('结束案例：迪士尼花车游行与烟火秀，让疲惫一天的人休息并留下美好记忆。','Ending example: a Disney parade and fireworks offer rest and a memorable close to a tiring day.'),1340,23,C.muted);break;
   }
   default:return null;
  }
  return `<defs><marker id="method-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="${C.line}"/></marker></defs>${o}`;
 }
 return {draw,icons};
})();
