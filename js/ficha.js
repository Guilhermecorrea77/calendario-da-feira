/* =====================================================================
 * ficha.js — a "ficha do dia" em PNG (formato de story), desenhada em canvas.
 * ===================================================================== */
import * as D from './dados.js';

const UI = '"Barlow Semi Condensed", "Arial Narrow", Arial, sans-serif';
const MAO = '"Caveat", "Segoe Print", cursive';
const PLACA = '"Amatic SC", "Caveat", sans-serif';

function quebrar(ctx, texto, x, y, larg, alt, maxLinhas) {
    const linhas = [];
    String(texto).split('\n').forEach((par) => {
        let l = '';
        par.split(/\s+/).forEach((p) => { const t = l ? `${l} ${p}` : p; if (ctx.measureText(t).width > larg && l) { linhas.push(l); l = p; } else l = t; });
        linhas.push(l);
    });
    const vis = maxLinhas ? linhas.slice(0, maxLinhas) : linhas;
    if (maxLinhas && linhas.length > maxLinhas) vis[vis.length - 1] = vis[vis.length - 1].replace(/\s*\S*$/, '') + '…';
    vis.forEach((l, i) => ctx.fillText(l, x, y + i * alt));
    return y + vis.length * alt;
}
function retangulo(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function mancha(ctx, cx, cy, r, cor, semente) {
    let s = semente; const R = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI * 2, rad = r * (0.86 + R() * 0.22), x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); ctx.globalAlpha = 0.8; ctx.fillStyle = cor; ctx.fill(); ctx.globalAlpha = 1;
}

/**
 * Desenha a ficha e devolve o canvas.
 * opcoes = { banco, k, kHoje, clima, local, incluir, arte (Image|null) }
 */
export async function desenharFicha({ banco, k, kHoje, clima, local, incluir, arte }) {
    if (document.fonts) await document.fonts.ready;
    const W = 1080, H = 2800, c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'), d = D.dataDe(k), dia = D.diaDe(banco, k);
    x.fillStyle = '#f9f5ec'; x.fillRect(0, 0, W, H);
    let y = 70;
    if (arte) { x.drawImage(arte, 160, y, 760, 659); y += 680; } else y += 20;

    x.textAlign = 'center'; x.fillStyle = '#8a6f4c'; x.font = `600 26px ${UI}`;
    x.fillText('CALENDÁRIO DA FEIRA'.split('').join(String.fromCharCode(8202)), W / 2, y + 20);
    x.fillStyle = '#2f4a3a'; x.font = `700 118px ${PLACA}`; x.fillText(D.maiuscula(D.DIAS[d.getDay()]), W / 2, y + 130);
    x.fillStyle = '#b3413a'; x.font = `600 54px ${MAO}`; x.fillText(`${d.getDate()} de ${D.MESES[d.getMonth()]} de ${d.getFullYear()}`, W / 2, y + 192);
    y += 240;
    const L = 80, COL = 440, RX = 560, RW = 440;
    let yEsq = y, yDir = y;

    if (incluir.clima) {
        retangulo(x, L, y, W - 160, 190, 18); x.fillStyle = '#191613'; x.fill();
        retangulo(x, L + 14, y + 14, W - 188, 162, 8);
        const g = x.createLinearGradient(0, y, 0, y + 190); g.addColorStop(0, '#d3dabc'); g.addColorStop(1, '#b7bf9e'); x.fillStyle = g; x.fill();
        x.fillStyle = '#283020'; x.textAlign = 'left'; x.font = `600 24px ${UI}`; x.fillText(local.nome.toUpperCase(), L + 40, y + 56);
        x.font = `500 30px ${UI}`;
        if (clima) {
            x.fillText(clima.texto + (clima.agora ? ` · sensação ${clima.agora.sensacao}°` : ''), L + 40, y + 100);
            x.font = `600 26px ${UI}`; x.fillText(`Mín ${clima.min}°  ·  Máx ${clima.max}°  ·  Chuva ${clima.chuva ?? '--'}%`, L + 40, y + 140);
            x.font = `500 22px ${UI}`; x.fillText(`Sol ${clima.nascer} – ${clima.por}`, L + 40, y + 166);
            x.textAlign = 'right'; x.font = `700 118px ${UI}`; x.fillText(`${clima.agora ? clima.agora.temp : clima.max}°`, W - L - 40, y + 140);
        } else x.fillText('Sem previsão para esta data', L + 40, y + 104);
        y += 230; yEsq = yDir = y;
    }

    if (incluir.calendario) {
        x.textAlign = 'left'; x.fillStyle = '#3b3127'; x.font = `600 50px ${MAO}`; x.fillText(`${D.maiuscula(D.MESES[d.getMonth()])} ${d.getFullYear()}`, L, yEsq + 36);
        const cw = COL / 7, ch = 58; let gy = yEsq + 84;
        x.font = `600 20px ${UI}`; x.fillStyle = '#877b6d'; x.textAlign = 'center';
        ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach((l, i) => x.fillText(l, L + cw * i + cw / 2, gy)); gy += 16;
        const desloc = new Date(d.getFullYear(), d.getMonth(), 1).getDay(), nDias = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        for (let n = 1; n <= nDias; n++) {
            const p = desloc + n - 1, cx = L + cw * (p % 7) + cw / 2, cy = gy + Math.floor(p / 7) * ch + ch / 2;
            const kk = D.chave(new Date(d.getFullYear(), d.getMonth(), n)), sel = kk === k;
            if (sel) { mancha(x, cx, cy, 25, '#b3413a', n * 31 + 7); x.fillStyle = '#fff'; x.font = `700 26px ${UI}`; }
            else { x.fillStyle = '#3b3127'; x.font = `500 26px ${UI}`; if (kk === kHoje) { x.strokeStyle = '#b3413a'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, 24, 0, 7); x.stroke(); } }
            x.fillText(n, cx, cy + 9);
            const m = D.marcas(banco, kk);
            let mx = cx - ((m.nota ? 12 : 0) + (m.lista ? 10 : 0) + (m.nota && m.lista ? 4 : 0)) / 2;
            if (m.nota) { x.fillStyle = sel ? '#fff' : '#3f63a0'; retangulo(x, mx, cy + 19, 12, 4, 2); x.fill(); mx += 16; }
            if (m.lista) {
                retangulo(x, mx, cy + 16, 10, 10, 2);
                if (m.lista === 'comprada') { x.strokeStyle = sel ? '#fff' : '#6f8f3a'; x.lineWidth = 2; x.stroke(); } else { x.fillStyle = sel ? '#fff' : '#6f8f3a'; x.fill(); }
            }
        }
        yEsq = gy + Math.ceil((desloc + nDias) / 7) * ch + 30;
    } else yDir = yEsq;

    const dirX = incluir.calendario ? RX : L, dirW = incluir.calendario ? RW : W - 160;
    if (incluir.lista) {
        x.textAlign = 'left'; x.fillStyle = '#3b3127'; x.font = `600 50px ${MAO}`; x.fillText('Lista da feira', dirX, yDir + 36); yDir += 70;
        if (!dia.lista.length) { x.fillStyle = '#a8a092'; x.font = `400 32px ${MAO}`; x.fillText('Lista vazia', dirX, yDir + 20); yDir += 50; }
        const max = incluir.calendario ? 12 : 16;
        dia.lista.slice(0, max).forEach((it) => {
            x.strokeStyle = '#7d8fa8'; x.lineWidth = 2.5; retangulo(x, dirX, yDir, 26, 26, 5); x.stroke();
            if (it.d) { x.strokeStyle = '#b3413a'; x.lineWidth = 4; x.beginPath(); x.moveTo(dirX + 5, yDir + 13); x.lineTo(dirX + 11, yDir + 20); x.lineTo(dirX + 22, yDir + 6); x.stroke(); }
            x.fillStyle = it.d ? '#8d97a6' : '#2d3f6b'; x.font = `400 36px ${MAO}`;
            let t = it.t; while (x.measureText(t).width > dirW - 50 && t.length > 3) t = t.slice(0, -2); if (t !== it.t) t += '…';
            x.fillText(t, dirX + 42, yDir + 24);
            if (it.d) { const tw = x.measureText(t).width; x.strokeStyle = 'rgba(179,65,58,.7)'; x.lineWidth = 2; x.beginPath(); x.moveTo(dirX + 40, yDir + 14); x.lineTo(dirX + 44 + tw, yDir + 14); x.stroke(); }
            x.strokeStyle = 'rgba(90,130,170,.22)'; x.lineWidth = 1; x.beginPath(); x.moveTo(dirX, yDir + 40); x.lineTo(dirX + dirW, yDir + 40); x.stroke();
            yDir += 48;
        });
        if (dia.lista.length > max) { x.fillStyle = '#877b6d'; x.font = `500 22px ${UI}`; x.fillText(`+ ${dia.lista.length - max} itens`, dirX, yDir + 16); yDir += 34; }
        yDir += 20;
    }

    if (incluir.notas && dia.nota.trim()) {
        let nx, nw, ny;
        if (!incluir.calendario) { nx = L; nw = W - 160; ny = Math.max(yEsq, yDir); }
        else if (yEsq <= yDir) { nx = L; nw = COL; ny = yEsq; } else { nx = dirX; nw = dirW; ny = yDir; }
        x.textAlign = 'left'; x.fillStyle = '#3b3127'; x.font = `600 50px ${MAO}`; x.fillText('Anotações', nx, ny + 36);
        x.fillStyle = '#2d3f6b'; x.font = `400 32px ${MAO}`;
        const fim = quebrar(x, dia.nota, nx, ny + 86, nw, 40, 8) + 10;
        if (nx === L && nw === COL) yEsq = fim; else yDir = fim;
    }
    y = Math.max(yEsq, yDir) + 10;

    if (incluir.frutas) {
        x.strokeStyle = 'rgba(160,120,70,.3)'; x.beginPath(); x.moveTo(L, y); x.lineTo(W - L, y); x.stroke(); y += 56;
        x.textAlign = 'left'; x.fillStyle = '#3b3127'; x.font = `600 50px ${MAO}`; x.fillText(`Na safra em ${D.MESES[d.getMonth()]}`, L, y); y += 40;
        let fx = L; x.font = `500 26px ${UI}`;
        D.SAFRA[d.getMonth()].forEach((f, i) => {
            const tw = x.measureText(f).width + 56; if (fx + tw > W - L) { fx = L; y += 50; }
            mancha(x, fx + 16, y + 18, 15, D.COR_FRUTA[f] || '#c08a4a', i * 37 + 11); x.fillStyle = '#3b3127'; x.fillText(f, fx + 38, y + 27); fx += tw + 10;
        });
        y += 76;
        const fd = D.frutaDoDia(k);
        x.fillStyle = '#fbf5e6'; retangulo(x, L, y, W - 160, 190, 6); x.fill(); x.strokeStyle = 'rgba(160,120,70,.25)'; x.stroke();
        x.fillStyle = '#8a6f4c'; x.font = `700 20px ${UI}`; x.fillText('DICA DA FEIRA', L + 24, y + 36);
        x.fillStyle = '#4a3d30'; x.font = `400 30px ${MAO}`; quebrar(x, `${D.dicaDoClima(clima)} Fruta do dia: ${fd}, ${D.dicaDe(fd)}`, L + 24, y + 74, W - 208, 36, 3);
        y += 210;
    }

    const altura = Math.max(1350, y + 120), c2 = document.createElement('canvas'); c2.width = W; c2.height = altura;
    const x2 = c2.getContext('2d'); x2.drawImage(c, 0, 0);
    x2.strokeStyle = 'rgba(160,120,70,.35)'; x2.lineWidth = 2; x2.strokeRect(34, 34, W - 68, altura - 68);
    x2.textAlign = 'center'; x2.fillStyle = '#9a8d7c'; x2.font = `500 20px ${UI}`;
    x2.fillText(`Calendário da Feira · ${local.nome} · previsão Open-Meteo`, W / 2, altura - 62);
    return c2;
}
