/* =====================================================================
 * app.js — telas e interação do Calendário da Feira.
 * O modelo (sem tela) está em dados.js.
 * ===================================================================== */
import * as D from './dados.js';
import { desenharCapa } from './capa.js';
import { desenharFicha } from './ficha.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------------- armazenamento ---------------- */
function carregar() {
    try {
        const salvo = localStorage.getItem(D.CHAVE);
        if (salvo) return D.normalizar(JSON.parse(salvo));
        // primeira abertura: traz as notas e listas da versão anterior (chaves feira-*)
        const antigas = Object.keys(localStorage).filter((k) => k.startsWith('feira-')).map((k) => [k, localStorage.getItem(k)]);
        const { banco } = D.migrarAntigo(antigas);
        localStorage.setItem(D.CHAVE, JSON.stringify(banco));
        return banco;
    } catch (e) {
        return D.bancoVazio();
    }
}
let banco = carregar();
function salvar() {
    try { localStorage.setItem(D.CHAVE, JSON.stringify(banco)); return true; } catch (e) { return false; }
}
function mudar(novo) { banco = novo; return salvar(); }

let avisoT;
function aviso(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(avisoT); avisoT = setTimeout(() => t.classList.remove('show'), 2400); }

/* ---------------- estado da tela ---------------- */
const kHoje = D.hoje();
let sel = kHoje;
let vista = { a: D.dataDe(kHoje).getFullYear(), m: D.dataDe(kHoje).getMonth() };
let previsao = null;
let estadoClima = 'carregando'; // carregando | ok | erro
const climaSel = () => D.climaDoDia(previsao, sel, kHoje);

function bolinha(cor, semente) {
    let s = semente * 9301 % 233280; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const pts = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, rad = 10 + r() * 3.2; pts.push([15 + Math.cos(a) * rad, 15 + Math.sin(a) * rad]); }
    let d = 'M' + pts[0].join(' ');
    for (let i = 0; i < pts.length; i++) { const p = pts[(i + 1) % pts.length], q = pts[i]; d += ` Q${q[0].toFixed(1)} ${q[1].toFixed(1)} ${((q[0] + p[0]) / 2).toFixed(1)} ${((q[1] + p[1]) / 2).toFixed(1)}`; }
    d += 'Z';
    return `<svg viewBox="0 0 30 30" aria-hidden="true"><path d="${d}" fill="${cor}" fill-opacity=".78"/><path d="${d}" fill="none" stroke="${cor}" stroke-width="1.2" transform="translate(.6 .6)"/><ellipse cx="11" cy="10" rx="3.2" ry="2.2" fill="#fff" fill-opacity=".45"/><path d="M15 4 q2 -3 5 -2" stroke="#5b7a33" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
}

/* ---------------- mini calendário ---------------- */
function marcasHtml(k) {
    const m = D.marcas(banco, k);
    const h = (m.nota ? '<i class="m-note"></i>' : '') + (m.lista ? `<i class="m-list${m.lista === 'comprada' ? ' done' : ''}"></i>` : '');
    return h ? `<span class="marks">${h}</span>` : '';
}
function marcasRotulo(k) {
    const m = D.marcas(banco, k), n = D.diaDe(banco, k).lista.length;
    return (m.nota ? ', com anotação' : '') + (n ? `, lista com ${n} itens` : '');
}
function desenharMini() {
    $('miniTitle').innerHTML = `${D.maiuscula(D.MESES[vista.m])} <small>${vista.a}</small>`;
    let h = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((l) => `<div class="wd" aria-hidden="true">${l}</div>`).join('');
    for (const { k, dia, doMes } of D.gradeDoMes(vista.a, vista.m)) {
        const c = ['day']; if (!doMes) c.push('out'); if (k === kHoje) c.push('today'); if (k === sel) c.push('sel');
        h += `<button type="button" class="${c.join(' ')}" data-k="${k}" aria-label="${rotuloDia(k)}"${k === sel ? ' aria-current="date"' : ''}>${dia}${marcasHtml(k)}</button>`;
    }
    $('miniGrid').innerHTML = h;
    desenharFrutas();
}
const rotuloDia = (k) => { const d = D.dataDe(k); return `${d.getDate()} de ${D.MESES[d.getMonth()]}${k === kHoje ? ', hoje' : ''}${marcasRotulo(k)}`; };
function atualizarMarca() {
    const b = document.querySelector(`.day[data-k="${sel}"]`);
    if (b) { b.innerHTML = D.dataDe(sel).getDate() + marcasHtml(sel); b.setAttribute('aria-label', rotuloDia(sel)); }
}

function escolher(k) {
    gravarNotaPendente();
    sel = k; const d = D.dataDe(k); vista = { a: d.getFullYear(), m: d.getMonth() };
    desenharMini(); carregarNota(); desenharLista(); desenharClima(); desenharTeclas(); desenharDica();
}

/* ---------------- abas ---------------- */
function aba(v) {
    document.querySelectorAll('.seg button').forEach((b) => b.setAttribute('aria-selected', b.dataset.v === v));
    ['notes', 'list', 'fruits'].forEach((x) => { $('v-' + x).hidden = x !== v; });
    mudar(D.comConfig(banco, { aba: v }));
}

/* ---------------- anotações ---------------- */
let notaT = null;
function carregarNota() {
    $('notes').value = D.diaDe(banco, sel).nota;
    document.querySelectorAll('.dayTitle').forEach((e) => { e.textContent = D.tituloDia(sel); });
    document.querySelectorAll('.dayShort').forEach((e) => { e.textContent = D.dataCurta(sel); });
    $('saveState').textContent = $('notes').value ? 'Salvo neste aparelho' : '';
}
function gravarNotaAgora() {
    const ok = mudar(D.gravarNota(banco, sel, $('notes').value));
    $('saveState').textContent = ok ? 'Salvo neste aparelho' : 'Não foi possível salvar aqui';
    atualizarMarca();
}
function gravarNotaPendente() { if (notaT) { clearTimeout(notaT); notaT = null; gravarNotaAgora(); } }

/* ---------------- lista ---------------- */
function desenharLista() {
    const l = D.diaDe(banco, sel).lista;
    $('checklist').innerHTML = l.length
        ? l.map((it, i) => `<li class="${it.d ? 'done' : ''}"><input type="checkbox" id="it${i}" data-i="${i}" ${it.d ? 'checked' : ''}><label class="txt" for="it${i}">${esc(it.t)}</label><button class="rm" type="button" data-rm="${i}" aria-label="Remover ${esc(it.t)}">×</button></li>`).join('')
        : '<li class="empty" style="border:0">Nada na lista ainda. Escreva acima ou use “+ lista” nas frutas do mês.</li>';
    $('listCount').textContent = l.length ? `${l.filter((x) => x.d).length} de ${l.length} comprados` : '';
    marcarBotoesFruta();
}
function adicionar(t) {
    const r = D.adicionarItem(banco, sel, t);
    if (!r.ok) { if (r.motivo === 'repetido') aviso(`${t.trim()} já está na lista`); return false; }
    mudar(r.banco); desenharLista(); atualizarMarca(); return true;
}

/* ---------------- frutas ---------------- */
function desenharFrutas() {
    const l = D.safraDoMes(vista.m);
    $('fruitsTitle').textContent = 'Na safra em ' + D.MESES[vista.m];
    $('fruitsCount').textContent = l.length + ' frutas';
    $('fruitList').innerHTML = l.map((f, i) => `<li>${bolinha(D.COR_FRUTA[f] || '#c08a4a', i * 37 + vista.m * 11 + 3)}<span>${f}</span><button class="add" type="button" data-f="${f}">+ lista</button></li>`).join('');
    marcarBotoesFruta();
}
function marcarBotoesFruta() {
    document.querySelectorAll('.fruits .add').forEach((b) => { const on = D.temItem(banco, sel, b.dataset.f); b.classList.toggle('in', on); b.textContent = on ? 'na lista' : '+ lista'; });
}

/* ---------------- clima ---------------- */
const ICONE = {
    sun: '<circle cx="24" cy="24" r="8"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"/>',
    part: '<circle cx="18" cy="18" r="6"/><path d="M18 5v4M5 18h4M8.8 8.8l2.8 2.8M27.2 8.8l-2.8 2.8"/><path d="M16 38h20a7 7 0 0 0 0-14 9 9 0 0 0-17 2.5A5.8 5.8 0 0 0 16 38z" fill="currentColor" fill-opacity=".12"/>',
    cloud: '<path d="M13 36h23a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.6 6.6 0 0 0-2 13z" fill="currentColor" fill-opacity=".12"/>',
    fog: '<path d="M13 26h23a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.6 6.6 0 0 0-2 13z"/><path d="M9 32h30M13 38h24"/>',
    drizzle: '<path d="M13 28h23a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.6 6.6 0 0 0-2 13z" fill="currentColor" fill-opacity=".12"/><path d="M17 34v2M24 34v2M31 34v2M20 40v2M28 40v2"/>',
    rain: '<path d="M13 28h23a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.6 6.6 0 0 0-2 13z" fill="currentColor" fill-opacity=".12"/><path d="M17 33l-3 7M25 33l-3 7M33 33l-3 7"/>',
    storm: '<path d="M13 28h23a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.6 6.6 0 0 0-2 13z" fill="currentColor" fill-opacity=".12"/><path d="M25 30l-5 8h6l-4 7"/>',
    snow: '<path d="M13 28h23a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.6 6.6 0 0 0-2 13z"/><path d="M18 34v6M15 37h6M30 34v6M27 37h6"/>',
};
const icone = (k, sw = 2.6) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONE[k]}</svg>`;

async function buscarClima() {
    const local = banco.config.local;
    $('cityName').textContent = local.nome; $('updated').textContent = 'Buscando previsão…'; estadoClima = 'carregando';
    try {
        const r = await fetch(D.urlPrevisao(local)); if (!r.ok) throw new Error(r.status);
        previsao = await r.json(); estadoClima = 'ok';
        const n = new Date(); $('updated').textContent = `Atualizado às ${D.pad(n.getHours())}:${D.pad(n.getMinutes())} · Open-Meteo`;
    } catch (e) {
        previsao = null; estadoClima = 'erro';
        $('updated').textContent = 'Sem conexão com o serviço de clima. Toque em Atualizar para tentar de novo.';
    }
    desenharClima(); desenharTeclas(); desenharDica();
}
function desenharClima() {
    const d = D.dataDe(sel), por = (id, v) => { $(id).textContent = v; };
    por('lcdDate', `${D.DIAS_CURTOS[d.getDay()]} · ${d.getDate()} ${D.MESES[d.getMonth()].slice(0, 3).toUpperCase()} ${d.getFullYear()}`);
    const c = climaSel();
    if (!c) {
        $('lcdIcon').innerHTML = icone('cloud'); por('lcdTemp', '--°'); por('lcdTag', ''); $('tape').innerHTML = ''; por('stHumL', 'Umidade');
        por('lcdCond', estadoClima === 'carregando' ? 'Carregando o clima…' : estadoClima === 'erro' ? 'Clima indisponível' : sel < kHoje ? 'Data passada' : 'Sem previsão ainda');
        ['stMinMax', 'stRain', 'stHum', 'stWind'].forEach((x) => por(x, '--'));
        if (previsao && sel > kHoje) { const ult = D.dataDe(previsao.daily.time.at(-1)); $('tape').innerHTML = `<span>A previsão vai até ${ult.getDate()} de ${D.MESES[ult.getMonth()]}</span>`; }
        return;
    }
    $('lcdIcon').innerHTML = icone(c.icone);
    if (c.agora) {
        por('lcdTemp', c.agora.temp + '°'); por('lcdCond', `${c.texto} · sensação ${c.agora.sensacao}°`); por('lcdTag', 'AGORA');
        por('stHumL', 'Umidade'); por('stHum', c.agora.umidade + '%'); por('stWind', c.agora.vento + ' km/h');
    } else {
        por('lcdTemp', c.max + '°'); por('lcdCond', c.texto + ' · máxima'); por('lcdTag', 'PREVISÃO');
        por('stHumL', 'Índice UV'); por('stHum', c.uv ?? '--'); por('stWind', '--');
    }
    por('stMinMax', `${c.min}° / ${c.max}°`); por('stRain', c.chuva != null ? c.chuva + '%' : '--');
    $('tape').innerHTML = `<span class="op">NASCER</span><span>${c.nascer || '--:--'}</span><span class="op">PÔR</span><span>${c.por || '--:--'}</span>`;
}
function desenharTeclas() {
    let h = '';
    for (let n = 0; n < 8; n++) {
        const k = D.somarDias(kHoje, n), d = D.dataDe(k), c = D.climaDoDia(previsao, k, null), cls = ['key'];
        if (n === 0) cls.push('is-today'); if (k === sel) cls.push('is-sel'); if (!c) cls.push('skeleton');
        h += `<button type="button" class="${cls.join(' ')}" data-k="${k}" aria-label="${D.DIAS[d.getDay()]}, ${d.getDate()}"><span class="kd">${n === 0 ? 'HOJE' : D.DIAS_CURTOS[d.getDay()]}</span><span class="kn">${d.getDate()}</span>${icone(c ? c.icone : 'cloud', 3)}<span class="kt">${c ? `${c.max}° <i>${c.min}°</i>` : '--° <i>--°</i>'}</span></button>`;
    }
    $('keys').innerHTML = h;
}
function desenharDica() {
    const f = D.frutaDoDia(sel);
    $('tipWeather').textContent = D.dicaDoClima(climaSel());
    $('tipFruit').innerHTML = `<strong>Fruta do dia: ${esc(f)}.</strong> ${esc(D.maiuscula(D.dicaDe(f)))}`;
}
function trocarLocal(local) { mudar(D.comConfig(banco, { local })); buscarClima(); }

/* ---------------- capa ---------------- */
function pintarCapa() {
    const d = D.dataDe(kHoje);
    $('coverMonth').innerHTML = `${D.maiuscula(D.MESES[d.getMonth()])} <span>${d.getFullYear()}</span>`;
    const fr = D.safraDoMes(d.getMonth()).slice(0, 3).map((f) => f.toLowerCase().replace(/-.*/, '')).join(', ');
    $('coverSub').textContent = `${D.maiuscula(D.DIAS[d.getDay()])}, ${d.getDate()} · na banca: ${fr}`;
    $('coverArt').innerHTML = desenharCapa();
}
function abrirCapa() {
    const cv = $('cover'), rapido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    cv.classList.add('fading');
    setTimeout(() => {
        $('stage').classList.remove('closed'); cv.classList.remove('fading');
        $('interior').setAttribute('aria-hidden', 'false'); cv.setAttribute('aria-hidden', 'true');
        window.scrollTo({ top: 0 }); $('closeBtn').focus({ preventScroll: true });
    }, rapido ? 0 : 280);
}
function fecharCapa() {
    gravarNotaPendente(); $('stage').classList.add('closed');
    $('interior').setAttribute('aria-hidden', 'true'); $('cover').setAttribute('aria-hidden', 'false');
    window.scrollTo({ top: 0 }); $('openBtn').focus({ preventScroll: true });
}

/* ---------------- exportação ---------------- */
let ultimoPng = null, ultimaUrl = null;
const incluir = () => ({ clima: $('inc-weather').checked, calendario: $('inc-cal').checked, lista: $('inc-list').checked, notas: $('inc-notes').checked, frutas: $('inc-fruits').checked });
const nomeArquivo = () => 'feira-' + sel;

function imagemDaCapa() {
    return new Promise((res) => {
        try {
            const svg = $('coverArt').cloneNode(true); svg.setAttribute('width', '600'); svg.setAttribute('height', '520');
            const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
            const img = new Image(); img.onload = () => { res(img); setTimeout(() => URL.revokeObjectURL(url), 1000); }; img.onerror = () => res(null); img.src = url;
        } catch (e) { res(null); }
    });
}
const paraPng = (c) => new Promise((res, rej) => { try { c.toBlob((b) => (b ? res(b) : rej(new Error('png'))), 'image/png'); } catch (e) { rej(e); } });
async function montarPrevia() {
    $('preview').innerHTML = '<span class="meta">Montando a ficha…</span>';
    const op = { banco, k: sel, kHoje, clima: climaSel(), local: banco.config.local, incluir: incluir() };
    let png;
    try { png = await paraPng(await desenharFicha({ ...op, arte: await imagemDaCapa() })); }
    catch (e) { png = await paraPng(await desenharFicha({ ...op, arte: null })); } // sem a ilustração se o navegador bloquear
    ultimoPng = png; if (ultimaUrl) URL.revokeObjectURL(ultimaUrl); ultimaUrl = URL.createObjectURL(png);
    $('preview').innerHTML = `<img src="${ultimaUrl}" alt="Prévia da ficha do dia">`; $('printImg').src = ultimaUrl;
}
function baixar(conteudo, nome, tipo) {
    const b = conteudo instanceof Blob ? conteudo : new Blob([conteudo], { type: tipo });
    const u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = nome;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000);
}
const textoAtual = () => D.textoDoDia(banco, sel, { clima: climaSel(), incluir: incluir() });
function abrirPainel() {
    gravarNotaPendente();
    const d = D.dataDe(sel);
    $('sheetLead').textContent = `Ficha de ${D.DIAS[d.getDay()]}, ${d.getDate()} de ${D.MESES[d.getMonth()]}: calendário, clima, lista e frutas da safra.`;
    $('sheetBack').hidden = false; $('sheetClose').focus(); montarPrevia();
}
function fecharPainel() { $('sheetBack').hidden = true; $('exportBtn').focus(); }

/* ---------------- eventos ---------------- */
$('miniGrid').addEventListener('click', (e) => { const b = e.target.closest('.day'); if (b) escolher(b.dataset.k); });
$('prevM').onclick = () => { vista.m--; if (vista.m < 0) { vista.m = 11; vista.a--; } desenharMini(); };
$('nextM').onclick = () => { vista.m++; if (vista.m > 11) { vista.m = 0; vista.a++; } desenharMini(); };
$('todayBtn').onclick = () => escolher(kHoje);
document.querySelector('.seg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) aba(b.dataset.v); });

$('notes').addEventListener('input', () => { $('saveState').textContent = 'Salvando…'; clearTimeout(notaT); notaT = setTimeout(() => { notaT = null; gravarNotaAgora(); }, 500); });
window.addEventListener('pagehide', gravarNotaPendente);
window.addEventListener('beforeunload', gravarNotaPendente);

$('listForm').addEventListener('submit', (e) => { e.preventDefault(); if (adicionar($('listInput').value)) $('listInput').value = ''; $('listInput').focus(); });
$('checklist').addEventListener('change', (e) => { const i = e.target.dataset.i; if (i == null) return; mudar(D.marcarItem(banco, sel, +i, e.target.checked)); desenharLista(); atualizarMarca(); });
$('checklist').addEventListener('click', (e) => { const i = e.target.dataset.rm; if (i == null) return; mudar(D.removerItem(banco, sel, +i)); desenharLista(); atualizarMarca(); });
$('clearDone').onclick = () => { const r = D.tirarComprados(banco, sel); if (!r.removidos) { aviso('Nenhum item marcado como comprado'); return; } mudar(r.banco); desenharLista(); atualizarMarca(); };
$('copyPrev').onclick = () => {
    const r = D.repetirListaAnterior(banco, sel);
    if (!r.de) { aviso('Não encontrei listas nos últimos 60 dias'); return; }
    mudar(r.banco); desenharLista(); atualizarMarca();
    aviso(r.adicionados ? `${r.adicionados} itens trazidos de ${D.dataCurta(r.de)}` : 'A lista já tem esses itens');
};
$('fruitList').addEventListener('click', (e) => {
    const b = e.target.closest('.add'); if (!b) return;
    if (b.classList.contains('in')) { aviso(`${b.dataset.f} já está na lista`); return; }
    if (adicionar(b.dataset.f)) aviso(`${b.dataset.f} entrou na lista de ${D.dataCurta(sel)}`);
});

$('keys').addEventListener('click', (e) => { const b = e.target.closest('.key'); if (b) escolher(b.dataset.k); });
$('refreshBtn').onclick = buscarClima;
$('cityBtn').onclick = () => { const f = $('cityForm'); f.hidden = !f.hidden; if (!f.hidden) $('cityInput').focus(); };
$('cityForm').addEventListener('submit', async (e) => {
    e.preventDefault(); const q = $('cityInput').value.trim(); if (!q) return;
    $('updated').textContent = 'Procurando cidade…';
    try {
        const j = await (await fetch(D.urlBuscaCidade(q))).json();
        if (!j.results || !j.results.length) { $('updated').textContent = `Não encontrei "${q}". Tente com o estado, ex.: Santos SP.`; return; }
        const g = j.results[0];
        $('cityForm').hidden = true; $('cityInput').value = '';
        trocarLocal({ nome: g.name + (g.admin1 ? ', ' + g.admin1 : ''), lat: g.latitude, lon: g.longitude });
    } catch (err) { $('updated').textContent = 'Não consegui buscar a cidade agora. Verifique a conexão.'; }
});
$('geoBtn').onclick = () => {
    if (!navigator.geolocation) { $('updated').textContent = 'Este navegador não informa a localização.'; return; }
    $('updated').textContent = 'Pedindo sua localização…';
    navigator.geolocation.getCurrentPosition(async (p) => {
        const lat = +p.coords.latitude.toFixed(4), lon = +p.coords.longitude.toFixed(4);
        let nome = 'Minha localização';
        try {
            const j = await (await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`)).json();
            if (j.city || j.locality) nome = (j.city || j.locality) + (j.principalSubdivisionCode ? ', ' + j.principalSubdivisionCode.split('-').pop() : '');
        } catch (e) { /* fica "Minha localização" */ }
        trocarLocal({ nome, lat, lon });
    }, () => { $('updated').textContent = 'Localização negada. Use Trocar para digitar a cidade.'; }, { timeout: 8000 });
};

$('openBtn').onclick = abrirCapa; $('closeBtn').onclick = fecharCapa;
$('exportBtn').onclick = abrirPainel; $('sheetClose').onclick = fecharPainel;
$('sheetBack').addEventListener('click', (e) => { if (e.target === $('sheetBack')) fecharPainel(); });
$('include').addEventListener('change', montarPrevia);
$('exPng').onclick = async () => { if (!ultimoPng) await montarPrevia(); baixar(ultimoPng, nomeArquivo() + '.png'); aviso('Imagem baixada'); };
$('exText').onclick = async () => {
    const t = textoAtual();
    try { await navigator.clipboard.writeText(t); aviso('Texto copiado. É só colar na conversa.'); }
    catch (e) { baixar(t, nomeArquivo() + '.txt', 'text/plain'); aviso('Não deu para copiar; baixei um .txt'); }
};
$('exShare').onclick = async () => {
    if (!ultimoPng) await montarPrevia();
    const arq = new File([ultimoPng], nomeArquivo() + '.png', { type: 'image/png' });
    try {
        if (navigator.canShare && navigator.canShare({ files: [arq] })) await navigator.share({ files: [arq], text: textoAtual(), title: 'Feira' });
        else if (navigator.share) await navigator.share({ text: textoAtual(), title: 'Feira' });
        else { await navigator.clipboard.writeText(textoAtual()); aviso('Este navegador não compartilha direto; copiei o texto'); }
    } catch (e) { if (e && e.name !== 'AbortError') aviso('Não foi possível compartilhar agora'); }
};
$('exPrint').onclick = async () => { if (!ultimoPng) await montarPrevia(); const img = $('printImg'); if (!img.complete) await new Promise((r) => { img.onload = r; }); window.print(); };
$('exIcs').onclick = () => { baixar(D.eventoIcs(banco, sel, { texto: textoAtual() }), nomeArquivo() + '.ics', 'text/calendar'); aviso('Evento baixado. Abra o arquivo para adicionar à agenda.'); };
$('exBackup').onclick = () => { baixar(D.backup(banco), `feira-backup-${kHoje}.json`, 'application/json'); aviso(`Backup com ${Object.keys(banco.dias).length} dias salvo`); };
$('exImport').onclick = () => $('importFile').click();
$('importFile').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
        const r = D.restaurar(banco, await f.text());
        mudar(r.banco); desenharMini(); carregarNota(); desenharLista(); montarPrevia();
        aviso(`Backup restaurado: ${r.dias} dias`);
    } catch (err) { aviso('Arquivo inválido. Escolha um backup .json do Calendário da Feira.'); }
    e.target.value = '';
});

document.addEventListener('keydown', (e) => {
    if (!$('sheetBack').hidden && e.key === 'Escape') { fecharPainel(); return; }
    if ($('stage').classList.contains('closed') || !$('sheetBack').hidden) return;
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') escolher(D.somarDias(sel, e.key === 'ArrowLeft' ? -1 : 1));
});

/* ---------------- início ---------------- */
pintarCapa();
desenharMini(); carregarNota(); desenharLista(); desenharTeclas(); desenharClima(); desenharDica();
aba(banco.config.aba);
buscarClima();
