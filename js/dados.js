/* =====================================================================
 * dados.js — modelo do Calendário da Feira (sem tela).
 * Testado em tests/dados.test.js
 *
 * banco = {
 *   v: 1,
 *   dias:   { 'AAAA-MM-DD': { nota: '', lista: [{ t: 'Banana', d: false }] } },
 *   config: { aba: 'notes'|'list'|'fruits', local: { nome, lat, lon } }
 * }
 * ===================================================================== */

export const VERSAO = 1;
export const CHAVE = 'calendarioFeira:v1';

export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const DIAS_CURTOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
export const LOCAL_PADRAO = { nome: 'Campinas, SP', lat: -22.9056, lon: -47.0608 };

export const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const pad = (n) => String(n).padStart(2, '0');

/* ---------- datas (sempre no horário local) ---------- */
export const chave = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export function dataDe(k) { const [a, m, d] = k.split('-').map(Number); return new Date(a, m - 1, d); }
export function somarDias(k, n) { const d = dataDe(k); d.setDate(d.getDate() + n); return chave(d); }
export const hoje = (agora = new Date()) => chave(agora);
export function tituloDia(k) { const d = dataDe(k); return `${maiuscula(DIAS[d.getDay()])}, ${d.getDate()} de ${MESES[d.getMonth()]}`; }
export function dataCurta(k) { const d = dataDe(k); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; }

/** Semanas do mês para o mini calendário: 5 ou 6 linhas de 7 chaves, começando no domingo. */
export function gradeDoMes(ano, mes) {
    const primeiro = new Date(ano, mes, 1);
    const inicio = new Date(ano, mes, 1 - primeiro.getDay());
    const dias = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(inicio); d.setDate(inicio.getDate() + i);
        if (i >= 35 && d.getMonth() !== mes) break;
        dias.push({ k: chave(d), dia: d.getDate(), doMes: d.getMonth() === mes });
    }
    return dias;
}

/* ---------- frutas da safra (Sudeste, aproximado, base CEAGESP) ---------- */
export const COR_FRUTA = {
    'Abacaxi': '#d9a441', 'Abacate': '#6f8f3a', 'Ameixa': '#7a3b5c', 'Banana-maçã': '#e9cf63', 'Banana-prata': '#efc943', 'Banana-nanica': '#e6c13c',
    'Caqui': '#e0703a', 'Carambola': '#e8c53a', 'Caju': '#e25a3a', 'Cereja': '#b3263a', 'Coco verde': '#7e9a4a', 'Figo': '#6d4a6b',
    'Fruta-do-conde': '#9bbf7a', 'Goiaba': '#e98a8a', 'Jabuticaba': '#3d2a3d', 'Jaca': '#b7a13e', 'Kiwi': '#8a9a3a', 'Laranja': '#f0a13a',
    'Laranja-lima': '#f2b24a', 'Laranja-pera': '#f0a13a', 'Lichia': '#d4545c', 'Maçã': '#cf3f3a', 'Mamão': '#f08a3a', 'Manga': '#f2b33a',
    'Maracujá': '#d9c14a', 'Melancia': '#d94a5a', 'Melão': '#e3cf73', 'Mexerica': '#f28a2a', 'Morango': '#d6384a', 'Nectarina': '#e8743a',
    'Nêspera': '#f0b04a', 'Pera': '#bfc25a', 'Pêssego': '#f4a27a', 'Tangerina murcote': '#f07f2a', 'Ponkan': '#f39228', 'Uva': '#7b5aa6',
    'Limão': '#8fbf4a', 'Acerola': '#d8402f', 'Graviola': '#7fa65a',
};
export const SAFRA = [
    ['Abacaxi', 'Ameixa', 'Coco verde', 'Figo', 'Goiaba', 'Manga', 'Maracujá', 'Melancia', 'Melão', 'Pêssego', 'Uva'],
    ['Abacaxi', 'Ameixa', 'Figo', 'Fruta-do-conde', 'Goiaba', 'Jaca', 'Manga', 'Maracujá', 'Melancia', 'Uva'],
    ['Abacate', 'Banana-maçã', 'Caqui', 'Carambola', 'Figo', 'Goiaba', 'Jaca', 'Maçã', 'Maracujá', 'Pera', 'Uva'],
    ['Abacate', 'Banana-prata', 'Caqui', 'Carambola', 'Kiwi', 'Maçã', 'Mexerica', 'Pera', 'Acerola'],
    ['Abacate', 'Banana-nanica', 'Caqui', 'Kiwi', 'Laranja-lima', 'Maçã', 'Mexerica', 'Pera'],
    ['Abacate', 'Banana-nanica', 'Carambola', 'Kiwi', 'Laranja-pera', 'Mexerica', 'Morango', 'Ponkan'],
    ['Abacate', 'Carambola', 'Kiwi', 'Laranja-pera', 'Mexerica', 'Morango', 'Ponkan', 'Tangerina murcote'],
    ['Carambola', 'Jabuticaba', 'Laranja', 'Morango', 'Ponkan', 'Tangerina murcote', 'Limão', 'Mexerica'],
    ['Abacaxi', 'Banana-nanica', 'Jabuticaba', 'Laranja', 'Maçã', 'Mamão', 'Morango', 'Nêspera', 'Tangerina murcote'],
    ['Abacaxi', 'Banana-prata', 'Caju', 'Jabuticaba', 'Laranja', 'Mamão', 'Manga', 'Morango', 'Nêspera'],
    ['Abacaxi', 'Caju', 'Jabuticaba', 'Lichia', 'Mamão', 'Manga', 'Melão', 'Nectarina', 'Pêssego', 'Graviola'],
    ['Abacaxi', 'Ameixa', 'Cereja', 'Figo', 'Lichia', 'Manga', 'Melancia', 'Nectarina', 'Pêssego', 'Uva'],
];
export const DICAS = {
    'Abacaxi': 'se a folha do centro solta fácil, está maduro.',
    'Banana': 'prefira pencas com a ponta ainda verde para durar a semana.',
    'Jabuticaba': 'escolha as brilhantes e firmes; duram só dois dias.',
    'Laranja': 'a mais pesada na mão tem mais suco.',
    'Maçã': 'casca lisa e firme, sem pontos moles.',
    'Mamão': 'casca amarelando e cedendo de leve ao toque.',
    'Morango': 'vermelho até o cabinho; só lave na hora de comer.',
    'Nêspera': 'dourada e macia; leve por cima na sacola.',
    'Tangerina': 'casca fina e colada costuma ter mais suco.',
    'Mexerica': 'casca fina e colada costuma ter mais suco.',
    'Ponkan': 'pesada e de casca brilhante.',
    'Manga': 'perfume forte perto do cabo indica o ponto.',
    'Melancia': 'som oco ao bater e mancha amarelada embaixo.',
    'Melão': 'cheiro doce na base e casca levemente macia.',
    'Caju': 'pedúnculo firme e sem rachaduras.',
    'Uva': 'cabinhos verdes são sinal de colheita recente.',
    'Pêssego': 'perfumado e cedendo de leve perto do cabo.',
    'Nectarina': 'perfumada e cedendo de leve perto do cabo.',
    'Abacate': 'se ceder ao apertar perto do cabo, está no ponto.',
    'Kiwi': 'levemente macio; o firme amadurece junto de uma maçã.',
    'Caqui': 'bem laranja e macio, sem partes escuras.',
    'Goiaba': 'perfumada e cedendo um pouco ao toque.',
    'Lichia': 'casca avermelhada; as marrons já passaram.',
    'Cereja': 'cabinho verde e fruta firme e escura.',
    'Figo': "macio e com o 'olho' levemente aberto.",
    'Limão': 'casca lisa e fina rende mais suco.',
    'Carambola': 'amarela com as pontas levemente escuras.',
    'Maracujá': 'casca enrugada é mais doce, não mais velha.',
};
export const safraDoMes = (mes) => SAFRA[mes];
export function dicaDe(fruta) {
    return DICAS[fruta] || DICAS[fruta.split(/[- ]/)[0]] || 'cheire e sinta o peso; fruta boa perfuma a banca.';
}
export function frutaDoDia(k) {
    const d = dataDe(k), l = SAFRA[d.getMonth()];
    return l[(d.getDate() * 7 + d.getMonth()) % l.length];
}

/* ---------- banco ---------- */
export const bancoVazio = () => ({ v: VERSAO, dias: {}, config: { aba: 'notes', local: { ...LOCAL_PADRAO } } });
const ABAS = ['notes', 'list', 'fruits'];

/** Garante a forma do banco, descartando o que vier quebrado. */
export function normalizar(b) {
    const out = bancoVazio();
    if (!b || typeof b !== 'object') return out;
    for (const [k, dia] of Object.entries(b.dias || {})) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !dia) continue;
        const nota = typeof dia.nota === 'string' ? dia.nota : '';
        const lista = Array.isArray(dia.lista) ? dia.lista.filter((i) => i && typeof i.t === 'string' && i.t.trim()).map((i) => ({ t: i.t.trim(), d: !!i.d })) : [];
        if (nota.trim() || lista.length) out.dias[k] = { nota, lista };
    }
    const c = b.config || {};
    if (ABAS.includes(c.aba)) out.config.aba = c.aba;
    const l = c.local;
    if (l && typeof l.nome === 'string' && Number.isFinite(l.lat) && Number.isFinite(l.lon)) out.config.local = { nome: l.nome, lat: l.lat, lon: l.lon };
    return out;
}

export const diaDe = (b, k) => b.dias[k] || { nota: '', lista: [] };
const comDia = (b, k, dia) => {
    const dias = { ...b.dias };
    if (dia.nota.trim() || dia.lista.length) dias[k] = dia; else delete dias[k];
    return { ...b, dias };
};
export const comConfig = (b, mudanca) => ({ ...b, config: { ...b.config, ...mudanca } });

/* ---------- anotações ---------- */
export const gravarNota = (b, k, nota) => comDia(b, k, { ...diaDe(b, k), nota: String(nota ?? '') });

/* ---------- lista ---------- */
const mesmoItem = (a, b) => a.trim().toLocaleLowerCase('pt-BR') === b.trim().toLocaleLowerCase('pt-BR');
export const temItem = (b, k, t) => diaDe(b, k).lista.some((i) => mesmoItem(i.t, t));

/** Devolve { banco, ok, motivo } — motivo: 'vazio' | 'repetido'. */
export function adicionarItem(b, k, texto) {
    const t = String(texto ?? '').trim();
    if (!t) return { banco: b, ok: false, motivo: 'vazio' };
    if (temItem(b, k, t)) return { banco: b, ok: false, motivo: 'repetido' };
    const dia = diaDe(b, k);
    return { banco: comDia(b, k, { ...dia, lista: [...dia.lista, { t, d: false }] }), ok: true };
}
export function marcarItem(b, k, i, comprado) {
    const dia = diaDe(b, k);
    if (!dia.lista[i]) return b;
    return comDia(b, k, { ...dia, lista: dia.lista.map((x, j) => (j === i ? { ...x, d: !!comprado } : x)) });
}
export function removerItem(b, k, i) {
    const dia = diaDe(b, k);
    return comDia(b, k, { ...dia, lista: dia.lista.filter((_, j) => j !== i) });
}
/** Devolve { banco, removidos }. */
export function tirarComprados(b, k) {
    const dia = diaDe(b, k), resto = dia.lista.filter((x) => !x.d);
    return { banco: comDia(b, k, { ...dia, lista: resto }), removidos: dia.lista.length - resto.length };
}
/** Copia, sem marcar, a lista mais recente antes do dia k (até `limite` dias). Devolve { banco, de, adicionados }. */
export function repetirListaAnterior(b, k, limite = 60) {
    for (let n = 1; n <= limite; n++) {
        const de = somarDias(k, -n), anterior = diaDe(b, de).lista;
        if (!anterior.length) continue;
        let banco = b, adicionados = 0;
        for (const it of anterior) { const r = adicionarItem(banco, k, it.t); if (r.ok) { banco = r.banco; adicionados++; } }
        return { banco, de, adicionados };
    }
    return { banco: b, de: null, adicionados: 0 };
}

/** O que marcar no calendário: anotação e/ou lista (pendente ou toda comprada). */
export function marcas(b, k) {
    const dia = diaDe(b, k);
    return { nota: !!dia.nota.trim(), lista: dia.lista.length ? (dia.lista.every((x) => x.d) ? 'comprada' : 'pendente') : null };
}

/* ---------- clima (resposta da Open-Meteo) ---------- */
export function urlPrevisao({ lat, lon }) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
        + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m'
        + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max'
        + '&timezone=auto&forecast_days=16';
}
export const urlBuscaCidade = (q) => `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=pt&format=json`;

/** Código WMO → [texto, ícone]. */
export function descreverTempo(c) {
    if (c === 0) return ['Céu limpo', 'sun'];
    if (c === 1) return ['Sol entre nuvens', 'part'];
    if (c === 2) return ['Parcialmente nublado', 'part'];
    if (c === 3) return ['Nublado', 'cloud'];
    if (c === 45 || c === 48) return ['Neblina', 'fog'];
    if (c >= 51 && c <= 57) return ['Garoa', 'drizzle'];
    if (c === 61) return ['Chuva fraca', 'rain'];
    if (c === 63) return ['Chuva moderada', 'rain'];
    if (c >= 65 && c <= 67) return ['Chuva forte', 'rain'];
    if (c >= 71 && c <= 77) return ['Neve', 'snow'];
    if (c === 80) return ['Pancadas fracas', 'rain'];
    if (c === 81 || c === 82) return ['Pancadas de chuva', 'rain'];
    if (c >= 95) return ['Trovoadas', 'storm'];
    return ['—', 'cloud'];
}

/** Clima de um dia; `agora` (temperatura, sensação, umidade, vento) só para hoje. null se não houver previsão. */
export function climaDoDia(prev, k, kHoje) {
    if (!prev || !prev.daily || !Array.isArray(prev.daily.time)) return null;
    const i = prev.daily.time.indexOf(k);
    if (i < 0) return null;
    const D = prev.daily, ehHoje = k === kHoje && prev.current;
    const [texto, icone] = descreverTempo(ehHoje ? prev.current.weather_code : D.weather_code[i]);
    const r = (v) => (v == null ? null : Math.round(v));
    return {
        texto, icone,
        min: r(D.temperature_2m_min[i]), max: r(D.temperature_2m_max[i]),
        chuva: D.precipitation_probability_max ? r(D.precipitation_probability_max[i]) : null,
        uv: D.uv_index_max ? r(D.uv_index_max[i]) : null,
        nascer: (D.sunrise?.[i] || '').slice(11, 16), por: (D.sunset?.[i] || '').slice(11, 16),
        agora: ehHoje ? {
            temp: r(prev.current.temperature_2m), sensacao: r(prev.current.apparent_temperature),
            umidade: r(prev.current.relative_humidity_2m), vento: r(prev.current.wind_speed_10m),
        } : null,
    };
}

export function dicaDoClima(c) {
    if (!c) return 'Chegue cedo para escolher com calma; no fim da feira vem a xepa, com preços mais baixos.';
    if (c.chuva != null && c.chuva >= 60) return `Chuva provável (${c.chuva}%). Leve guarda-chuva e sacola fechada; em dia de chuva a xepa costuma sair mais barata.`;
    if (c.max >= 31) return `Dia quente (${c.max}°). Vá cedo, compre folhas por último e leve uma bolsa térmica para as frutas.`;
    if (c.min <= 12) return `Manhã fria (${c.min}°). Os cítricos estão no melhor momento; aproveite para comprar para suco.`;
    if (c.uv != null && c.uv >= 8) return `UV alto (${c.uv}). Prefira ir antes das 10h e leve chapéu.`;
    return 'Tempo firme. Vá cedo para escolher; se quiser economizar, a xepa começa perto do meio-dia.';
}

/* ---------- exportação ---------- */
export const INCLUIR_TUDO = { clima: true, calendario: true, lista: true, notas: true, frutas: true };

/** Texto para colar numa conversa. `clima` = resultado de climaDoDia (ou null). */
export function textoDoDia(b, k, { clima = null, local = b.config.local, incluir = INCLUIR_TUDO } = {}) {
    const d = dataDe(k), dia = diaDe(b, k), out = [];
    out.push(`Feira · ${maiuscula(DIAS[d.getDay()])}, ${dataCurta(k)}/${d.getFullYear()}`);
    if (incluir.clima && clima) out.push(`Clima em ${local.nome}: ${clima.texto.toLowerCase()}, mín ${clima.min}° / máx ${clima.max}°, chuva ${clima.chuva ?? '--'}%`);
    if (incluir.lista && dia.lista.length) { out.push('', 'Lista:'); dia.lista.forEach((i) => out.push(`${i.d ? '☑' : '☐'} ${i.t}`)); }
    if (incluir.notas && dia.nota.trim()) out.push('', 'Anotações:', dia.nota.trim());
    if (incluir.frutas) { out.push('', `Na safra: ${SAFRA[d.getMonth()].join(', ').toLowerCase()}`, `Dica: ${dicaDoClima(clima)}`); }
    return out.join('\n');
}

const escaparIcs = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
/** Evento de dia inteiro com a lista na descrição e um lembrete às 7h. */
export function eventoIcs(b, k, { agora = new Date(), texto } = {}) {
    const ini = k.replace(/-/g, ''), fim = somarDias(k, 1).replace(/-/g, ''), n = diaDe(b, k).lista.length;
    const carimbo = agora.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    return [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Calendario da Feira//PT-BR', 'BEGIN:VEVENT',
        `UID:feira-${ini}-${agora.getTime()}@calendario-da-feira`, `DTSTAMP:${carimbo}`,
        `DTSTART;VALUE=DATE:${ini}`, `DTEND;VALUE=DATE:${fim}`,
        `SUMMARY:${escaparIcs('Feira' + (n ? ` · ${n} itens` : ''))}`,
        `DESCRIPTION:${escaparIcs(texto ?? textoDoDia(b, k))}`,
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Hora da feira', 'TRIGGER;RELATED=START:PT7H', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
}

/* ---------- backup e versão anterior ---------- */
export function backup(b, agora = new Date()) {
    return JSON.stringify({ app: 'calendario-da-feira', versao: VERSAO, criado: agora.toISOString(), banco: b }, null, 2);
}

/**
 * Junta um backup ao banco atual sem apagar nada: itens de lista que faltam entram,
 * anotações diferentes são somadas. Aceita o backup novo ({ banco }) e o da primeira versão ({ dados: { 'feira-*': ... } }).
 * Devolve { banco, dias } ou lança Error se o arquivo não for reconhecido.
 */
export function restaurar(b, texto) {
    let j;
    try { j = JSON.parse(texto); } catch (e) { throw new Error('arquivo inválido'); }
    let vindo;
    if (j && j.banco) vindo = normalizar(j.banco);
    else if (j && j.dados && typeof j.dados === 'object') vindo = migrarAntigo(Object.entries(j.dados)).banco;
    else throw new Error('arquivo inválido');
    let banco = b;
    for (const [k, dia] of Object.entries(vindo.dias)) {
        const atual = diaDe(banco, k);
        let nota = atual.nota;
        if (dia.nota.trim() && !atual.nota.includes(dia.nota.trim())) nota = atual.nota.trim() ? `${atual.nota.trim()}\n${dia.nota.trim()}` : dia.nota;
        const lista = [...atual.lista];
        for (const it of dia.lista) if (!lista.some((x) => mesmoItem(x.t, it.t))) lista.push({ ...it });
        banco = comDia(banco, k, { nota, lista });
    }
    return { banco, dias: Object.keys(vindo.dias).length };
}

/**
 * Converte as chaves da primeira versão (feira-nota-AAAA-MM-DD, feira-lista-…, feira-local, feira-aba).
 * `entradas` = [[chave, valor], ...] do localStorage. Devolve { banco, migrados }.
 */
export function migrarAntigo(entradas, b = bancoVazio()) {
    let banco = b, migrados = 0;
    for (const [k, v] of entradas) {
        if (typeof v !== 'string') continue;
        let m;
        if ((m = /^feira-nota-(\d{4}-\d{2}-\d{2})$/.exec(k))) {
            if (v.trim() && !diaDe(banco, m[1]).nota.trim()) { banco = gravarNota(banco, m[1], v); migrados++; }
        } else if ((m = /^feira-lista-(\d{4}-\d{2}-\d{2})$/.exec(k))) {
            let l; try { l = JSON.parse(v); } catch (e) { continue; }
            if (!Array.isArray(l)) continue;
            let mudou = false;
            for (const it of l) {
                if (!it || typeof it.t !== 'string') continue;
                const r = adicionarItem(banco, m[1], it.t);
                if (r.ok) { banco = r.banco; mudou = true; if (it.d) banco = marcarItem(banco, m[1], diaDe(banco, m[1]).lista.length - 1, true); }
            }
            if (mudou) migrados++;
        } else if (k === 'feira-local') {
            try { const l = JSON.parse(v); if (l && l.name && Number.isFinite(l.lat) && Number.isFinite(l.lon)) banco = comConfig(banco, { local: { nome: l.name, lat: l.lat, lon: l.lon } }); } catch (e) { /* ignora */ }
        } else if (k === 'feira-aba' && ABAS.includes(v)) {
            banco = comConfig(banco, { aba: v });
        }
    }
    return { banco, migrados };
}
