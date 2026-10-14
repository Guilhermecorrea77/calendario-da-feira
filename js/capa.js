/* =====================================================================
 * capa.js — ilustração da capa: banca de feira em aquarela (SVG).
 * Desenho determinístico: a mesma capa em todas as aberturas.
 * ===================================================================== */

/** Conteúdo do <svg viewBox="0 0 600 520"> da capa. */
export function desenharCapa() {
    let seed=7;const R=()=>((seed=(seed*16807)%2147483647)-1)/2147483646,j=a=>(R()-.5)*a;
    let s=`<defs>
      <filter id="wc" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation=".6" result="b"/>
        <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="9" result="g"/>
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.35" result="ga"/>
        <feComposite in="b" in2="ga" operator="in"/>
      </filter>
      <filter id="wash" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="2" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="40" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation="5"/>
      </filter></defs>`;
    s+=`<g filter="url(#wash)" opacity=".55"><ellipse cx="300" cy="150" rx="290" ry="150" fill="#9cc3d9" opacity=".6"/><ellipse cx="120" cy="90" rx="110" ry="70" fill="#f3d38a" opacity=".5"/><ellipse cx="300" cy="500" rx="300" ry="40" fill="#b9a36b" opacity=".6"/></g>`;
    s+=`<g filter="url(#wc)"><rect x="66" y="60" width="10" height="440" fill="#7b4f2a"/><rect x="524" y="60" width="10" height="440" fill="#7b4f2a"/></g>`;
    const N=13;let aw="";
    for(let i=0;i<N;i++){const t0=90+i*420/N,t1=90+(i+1)*420/N,b0=40+i*520/N,b1=40+(i+1)*520/N,col=i%2?"#f5e7cf":"#d24d3a",r=(b1-b0)/2;
      aw+=`<path d="M${t0} 58L${t1} 58L${b1} 140L${b0} 140Z" fill="${col}"/><path d="M${b0} 139A${r} ${r} 0 0 0 ${b1} 139Z" fill="${col}"/>`}
    s+=`<g filter="url(#wc)">${aw}<rect x="84" y="44" width="432" height="16" rx="3" fill="#9c2f24"/></g>`;
    s+=`<g filter="url(#wc)"><path d="M225 150L240 176M375 150L360 176" stroke="#6b5a45" stroke-width="2"/><rect x="200" y="172" width="200" height="54" rx="4" fill="#2f3f35"/><rect x="200" y="172" width="200" height="54" rx="4" fill="none" stroke="#8a5a30" stroke-width="5"/></g>`;
    s+=`<text x="300" y="209" text-anchor="middle" font-family="Amatic SC, Caveat, sans-serif" font-weight="700" font-size="28" fill="#f4efe2" letter-spacing="1">FRUTAS DA ESTAÇÃO</text>`;
    let gr=`<path d="M112 140L112 168" stroke="#6b5a45" stroke-width="2"/><path d="M112 168c-14-6-22 2-24 10 10 2 20-2 24-10z" fill="#6f9a3e"/>`;let yy=178;
    [5,4,4,3,3,2,1].forEach(n=>{for(let k=0;k<n;k++){const x=112-(n-1)*7+k*14+j(2),c=["#7b5aa6","#6a4a92","#8e6bb8","#5c3f84"][Math.floor(R()*4)];gr+=`<circle cx="${x}" cy="${yy+j(2)}" r="7.5" fill="${c}" fill-opacity=".9"/><circle cx="${x-2.5}" cy="${yy-2.5}" r="2" fill="#fff" fill-opacity=".45"/>`}yy+=11});
    s+=`<g filter="url(#wc)">${gr}</g>`;
    let bn=`<path d="M488 140L488 162" stroke="#6b5a45" stroke-width="2"/>`;
    [-110,-95,-80,-65,-50].forEach((a,i)=>{bn+=`<g transform="translate(488 164) rotate(${a+90})"><path d="M0 0C4 26 26 48 56 50C34 40 16 22 8 -2Z" fill="${i%2?"#efc943":"#e6bd35"}"/><path d="M0 0C4 26 26 48 56 50" fill="none" stroke="#b9901f" stroke-width="1.4" stroke-opacity=".6"/><circle cx="56" cy="50" r="2.5" fill="#4a3a1e"/></g>`});
    s+=`<g filter="url(#wc)">${bn}<rect x="482" y="158" width="12" height="10" rx="3" fill="#6b7a2e"/></g>`;
    let back=`<g transform="translate(150 322)"><path d="M-62 0A62 62 0 0 1 62 0Z" fill="#3f7a3a"/><path d="M-54 0A54 54 0 0 1 54 0Z" fill="#e9f0c8"/><path d="M-49 0A49 49 0 0 1 49 0Z" fill="#dd4a55"/>`;
    for(let k=0;k<9;k++){const a=Math.PI*(0.12+k*0.085),r=24+(k%2)*10,x=-Math.cos(a)*r,y=-Math.sin(a)*r;back+=`<ellipse cx="${x}" cy="${y}" rx="2" ry="3.2" fill="#2a1d1a" transform="rotate(${k*14-50} ${x} ${y})"/>`}
    back+=`</g><g transform="translate(300 290)"><path d="M0 -40l-8 -34 8 16 6 -30 4 30 12 -24 -8 36z" fill="#5e8f3c"/><path d="M-6 -38l-22 -26 18 12M6 -38l24 -22 -16 16" stroke="#4e7f30" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="30" ry="42" fill="#d9a441"/>`;
    for(let k=-3;k<=3;k++)back+=`<path d="M${k*10-20} -36L${k*10+30} 34" stroke="#9c6b1f" stroke-opacity=".55" stroke-width="1.5"/><path d="M${k*10+20} -36L${k*10-30} 34" stroke="#9c6b1f" stroke-opacity=".55" stroke-width="1.5"/>`;
    back+=`</g><ellipse cx="430" cy="300" rx="20" ry="32" fill="#f08a3a" transform="rotate(-18 430 300)"/><ellipse cx="462" cy="304" rx="19" ry="30" fill="#8aab3e" transform="rotate(12 462 304)"/><ellipse cx="455" cy="302" rx="10" ry="24" fill="#f2a24a" opacity=".7" transform="rotate(12 455 302)"/><ellipse cx="490" cy="306" rx="18" ry="28" fill="#f08a3a" transform="rotate(22 490 306)"/>`;
    s+=`<g filter="url(#wc)">${back}</g>`;
    function pile(cx,baseY,w,r,cols){
      const n0=Math.floor(w/(r*1.85)),rows=[];
      for(let row=0;row<4;row++){const n=n0-row;if(n<=0)break;const y=baseY-row*r*1.35,x0=cx-(n-1)*r*.92,it=[];
        for(let k=0;k<n;k++)it.push([x0+k*r*1.84+j(3),y+j(3),r*(0.92+R()*.14),cols[Math.floor(R()*cols.length)]]);rows.push(it)}
      let o="";rows.reverse().forEach(it=>it.forEach(([x,y,rr,c])=>{o+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${c}" fill-opacity=".92"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.6"/><ellipse cx="${(x-rr*.35).toFixed(1)}" cy="${(y-rr*.38).toFixed(1)}" rx="${(rr*.3).toFixed(1)}" ry="${(rr*.22).toFixed(1)}" fill="#fff" fill-opacity=".38"/>`}));
      return o;
    }
    s+=`<g filter="url(#wc)">${pile(150,342,130,15,["#f0a13a","#ec9530","#f4b04a"])}${pile(300,342,130,14,["#cf3f3a","#b8312f","#d85a3e","#9fb843"])}${pile(450,344,130,12,["#8fbf4a","#7aab3a","#e8d14a"])}</g>`;
    let cr="";[[80,"#c9955b"],[230,"#c38e53"],[380,"#cc9a60"]].forEach(([x,c])=>{cr+=`<rect x="${x}" y="330" width="140" height="52" fill="#6d4524"/>`;for(let k=0;k<3;k++)cr+=`<rect x="${x}" y="${331+k*17}" width="140" height="13" fill="${c}"/>`;cr+=`<rect x="${x}" y="330" width="9" height="52" fill="#a8743f"/><rect x="${x+131}" y="330" width="9" height="52" fill="#a8743f"/>`});
    s+=`<g filter="url(#wc)">${cr}</g>`;
    let tb=`<rect x="54" y="380" width="492" height="12" fill="#7d4c26"/><rect x="62" y="392" width="476" height="96" fill="#b07a45"/>`;
    for(let k=0;k<4;k++)tb+=`<path d="M62 ${414+k*22}H538" stroke="#7d4c26" stroke-opacity=".45" stroke-width="2"/>`;
    tb+=`<rect x="70" y="488" width="12" height="20" fill="#6d4524"/><rect x="518" y="488" width="12" height="20" fill="#6d4524"/>`;
    s+=`<g filter="url(#wc)">${tb}</g><text x="300" y="455" text-anchor="middle" font-family="Amatic SC, Caveat, sans-serif" font-weight="700" font-size="46" fill="#fbf0d8" fill-opacity=".92" letter-spacing="4">FEIRA LIVRE</text>`;
    const tag=(x,y,rot,t)=>`<g transform="rotate(${rot} ${x} ${y})"><path d="M${x} ${y+14}V${y+40}" stroke="#7b5a3a" stroke-width="2"/><rect x="${x-30}" y="${y-12}" width="60" height="28" rx="2" fill="#fffaf0" stroke="#c9b48c"/><text x="${x}" y="${y+8}" text-anchor="middle" font-family="Caveat, cursive" font-weight="600" font-size="19" fill="#b3413a">${t}</text></g>`;
    s+=tag(190,286,-6,"3 por 10")+tag(345,288,5,"R$ 8 kg")+tag(505,294,-4,"dz R$ 6");
  return s;
}
