import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../js/dados.js';

const novo = () => D.normalizar(D.bancoVazio());
const K = '2026-10-14';

test('datas no horário local e textos do dia', () => {
    assert.equal(D.hoje(new Date(2026, 9, 14, 23, 30)), K);
    assert.equal(D.somarDias('2026-10-31', 1), '2026-11-01');
    assert.equal(D.somarDias('2026-03-01', -1), '2026-02-28');
    assert.equal(D.tituloDia(K), 'Quarta, 14 de outubro');
    assert.equal(D.dataCurta(K), '14/10');
});

test('grade do mês começa no domingo e tem 5 ou 6 semanas', () => {
    const out = D.gradeDoMes(2026, 9); // outubro de 2026 começa numa quinta
    assert.equal(out[0].k, '2026-09-27');
    assert.equal(out[0].doMes, false);
    assert.equal(out.find((x) => x.doMes).k, '2026-10-01');
    assert.equal(out.length % 7, 0);
    assert.ok(out.length === 35 || out.length === 42);
});

test('frutas da safra, dica e fruta do dia', () => {
    assert.equal(D.safraDoMes(9).length, 9);
    assert.ok(D.safraDoMes(9).includes('Jabuticaba'));
    assert.match(D.dicaDe('Banana-prata'), /penca/); // usa a dica de "Banana"
    assert.match(D.dicaDe('Fruta inventada'), /perfuma/);
    assert.ok(D.safraDoMes(9).includes(D.frutaDoDia(K)));
    for (const mes of D.SAFRA) for (const f of mes) assert.ok(D.COR_FRUTA[f], `sem cor: ${f}`);
});

test('anotações: grava, apaga o dia vazio e não altera o original', () => {
    const b = novo();
    const b2 = D.gravarNota(b, K, 'Levar sacolas');
    assert.equal(D.diaDe(b2, K).nota, 'Levar sacolas');
    assert.equal(b.dias[K], undefined);
    assert.equal(D.gravarNota(b2, K, '   ').dias[K], undefined);
});

test('lista: adicionar sem repetir, marcar, remover e tirar comprados', () => {
    let b = novo(), r;
    r = D.adicionarItem(b, K, ' Banana '); assert.ok(r.ok); b = r.banco;
    r = D.adicionarItem(b, K, 'banana'); assert.equal(r.motivo, 'repetido');
    r = D.adicionarItem(b, K, ''); assert.equal(r.motivo, 'vazio');
    b = D.adicionarItem(b, K, 'Alface').banco;
    b = D.adicionarItem(b, K, 'Tomate').banco;
    assert.deepEqual(D.diaDe(b, K).lista.map((x) => x.t), ['Banana', 'Alface', 'Tomate']);
    b = D.marcarItem(b, K, 0, true);
    assert.deepEqual(D.marcas(b, K), { nota: false, lista: 'pendente' });
    b = D.removerItem(b, K, 1);
    const t = D.tirarComprados(b, K);
    assert.equal(t.removidos, 1);
    assert.deepEqual(D.diaDe(t.banco, K).lista, [{ t: 'Tomate', d: false }]);
});

test('marcas: anotação, lista pendente e lista toda comprada', () => {
    let b = D.gravarNota(novo(), K, 'oi');
    assert.deepEqual(D.marcas(b, K), { nota: true, lista: null });
    b = D.adicionarItem(b, K, 'Ovos').banco;
    b = D.marcarItem(b, K, 0, true);
    assert.deepEqual(D.marcas(b, K), { nota: true, lista: 'comprada' });
    assert.deepEqual(D.marcas(b, '2026-10-15'), { nota: false, lista: null });
});

test('repetir a lista anterior traz só o que falta, desmarcado', () => {
    let b = novo();
    b = D.adicionarItem(b, '2026-10-07', 'Banana').banco;
    b = D.adicionarItem(b, '2026-10-07', 'Ovos').banco;
    b = D.marcarItem(b, '2026-10-07', 0, true);
    b = D.adicionarItem(b, K, 'ovos').banco;
    const r = D.repetirListaAnterior(b, K);
    assert.equal(r.de, '2026-10-07');
    assert.equal(r.adicionados, 1);
    assert.deepEqual(D.diaDe(r.banco, K).lista, [{ t: 'ovos', d: false }, { t: 'Banana', d: false }]);
    assert.equal(D.repetirListaAnterior(novo(), K).de, null);
});

const previsao = {
    current: { temperature_2m: 24.6, apparent_temperature: 25.2, relative_humidity_2m: 61, wind_speed_10m: 9.4, weather_code: 2 },
    daily: {
        time: [K, '2026-10-15'], weather_code: [3, 63],
        temperature_2m_max: [27.4, 22.1], temperature_2m_min: [15.2, 16.8],
        precipitation_probability_max: [10, 80], uv_index_max: [9.1, 4],
        sunrise: ['2026-10-14T05:52', '2026-10-15T05:51'], sunset: ['2026-10-14T18:21', '2026-10-15T18:22'],
    },
};

test('clima do dia: hoje usa o tempo de agora, os outros dias a previsão', () => {
    const c = D.climaDoDia(previsao, K, K);
    assert.equal(c.texto, 'Parcialmente nublado');
    assert.deepEqual(c.agora, { temp: 25, sensacao: 25, umidade: 61, vento: 9 });
    assert.equal(c.max, 27); assert.equal(c.nascer, '05:52');
    const am = D.climaDoDia(previsao, '2026-10-15', K);
    assert.equal(am.agora, null); assert.equal(am.texto, 'Chuva moderada'); assert.equal(am.icone, 'rain');
    assert.equal(D.climaDoDia(previsao, '2026-12-01', K), null);
    assert.equal(D.climaDoDia(null, K, K), null);
});

test('dica do clima conforme chuva, calor, frio e UV', () => {
    assert.match(D.dicaDoClima(null), /xepa/);
    assert.match(D.dicaDoClima({ chuva: 80, max: 22, min: 16, uv: 4 }), /Chuva provável \(80%\)/);
    assert.match(D.dicaDoClima({ chuva: 10, max: 33, min: 20, uv: 9 }), /Dia quente/);
    assert.match(D.dicaDoClima({ chuva: 10, max: 22, min: 10, uv: 3 }), /Manhã fria/);
    assert.match(D.dicaDoClima({ chuva: 10, max: 27, min: 15, uv: 9 }), /UV alto/);
});

test('texto do dia e evento .ics', () => {
    let b = D.adicionarItem(novo(), K, 'Banana').banco;
    b = D.adicionarItem(b, K, 'Ovos, caipira').banco;
    b = D.marcarItem(b, K, 0, true);
    b = D.gravarNota(b, K, 'Levar sacolas');
    const clima = D.climaDoDia(previsao, K, K);
    const t = D.textoDoDia(b, K, { clima });
    assert.match(t, /^Feira · Quarta, 14\/10\/2026/);
    assert.match(t, /Clima em Campinas, SP: parcialmente nublado, mín 15° \/ máx 27°, chuva 10%/);
    assert.match(t, /☑ Banana\n☐ Ovos, caipira/);
    assert.match(t, /Anotações:\nLevar sacolas/);
    const so = D.textoDoDia(b, K, { clima, incluir: { ...D.INCLUIR_TUDO, notas: false, frutas: false } });
    assert.doesNotMatch(so, /Anotações|safra/);

    const ics = D.eventoIcs(b, K, { agora: new Date(Date.UTC(2026, 9, 14, 11, 0, 0)) });
    assert.match(ics, /DTSTART;VALUE=DATE:20261014\r\nDTEND;VALUE=DATE:20261015/);
    assert.match(ics, /SUMMARY:Feira · 2 itens/);
    assert.match(ics, /Ovos\\, caipira/); // vírgula escapada
    assert.match(ics, /TRIGGER;RELATED=START:PT7H/);
});

test('backup e restaurar juntam sem apagar', () => {
    let a = D.adicionarItem(novo(), K, 'Banana').banco;
    a = D.gravarNota(a, K, 'nota de casa');
    let outro = D.adicionarItem(novo(), K, 'banana').banco;
    outro = D.adicionarItem(outro, K, 'Alface').banco;
    outro = D.gravarNota(outro, K, 'nota do celular');
    outro = D.gravarNota(outro, '2026-10-01', 'outro dia');
    const r = D.restaurar(a, D.backup(outro));
    assert.equal(r.dias, 2);
    assert.deepEqual(D.diaDe(r.banco, K).lista.map((x) => x.t), ['Banana', 'Alface']);
    assert.equal(D.diaDe(r.banco, K).nota, 'nota de casa\nnota do celular');
    assert.equal(D.diaDe(r.banco, '2026-10-01').nota, 'outro dia');
    // restaurar o mesmo backup de novo não duplica nada
    assert.deepEqual(D.restaurar(r.banco, D.backup(outro)).banco.dias, r.banco.dias);
    assert.throws(() => D.restaurar(a, 'não é json'));
    assert.throws(() => D.restaurar(a, '{"x":1}'));
});

test('versão anterior: converte as chaves feira-* e o backup antigo', () => {
    const antigas = [
        ['feira-nota-2026-09-28', 'Levar sacolas'],
        ['feira-lista-2026-09-28', JSON.stringify([{ t: 'Banana', d: true }, { t: 'Abacaxi', d: false }])],
        ['feira-lista-2026-09-29', 'quebrado{'],
        ['feira-local', JSON.stringify({ name: 'Santos, São Paulo', lat: -23.96, lon: -46.33 })],
        ['feira-aba', 'list'],
        ['outra-coisa', 'x'],
    ];
    const { banco, migrados } = D.migrarAntigo(antigas);
    assert.equal(migrados, 2);
    assert.deepEqual(D.diaDe(banco, '2026-09-28'), { nota: 'Levar sacolas', lista: [{ t: 'Banana', d: true }, { t: 'Abacaxi', d: false }] });
    assert.deepEqual(banco.config, { aba: 'list', local: { nome: 'Santos, São Paulo', lat: -23.96, lon: -46.33 } });
    const velho = JSON.stringify({ app: 'calendario-da-feira', versao: 1, dados: Object.fromEntries(antigas) });
    assert.equal(D.restaurar(novo(), velho).dias, 1);
});

test('normalizar descarta dados quebrados', () => {
    const b = D.normalizar({ dias: { 'xx': { nota: 'a' }, [K]: { nota: 3, lista: [{ t: ' ' }, { t: 'Uva', d: 1 }, null] } }, config: { aba: 'nada', local: { nome: 'X' } } });
    assert.deepEqual(b.dias, { [K]: { nota: '', lista: [{ t: 'Uva', d: true }] } });
    assert.equal(b.config.aba, 'notes');
    assert.deepEqual(b.config.local, D.LOCAL_PADRAO);
    assert.deepEqual(D.normalizar(null), D.bancoVazio());
});
