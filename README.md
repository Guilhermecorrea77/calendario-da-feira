# 🍊 Calendário da Feira

**Um fichário de couro para ir à feira.** Abre com uma capa em aquarela de uma banca de frutas e, por dentro, junta num lugar só o **clima do dia**, as **frutas da safra**, a **lista de compras** e as **anotações** de cada dia.

**Acesse:** https://guilhermecorrea77.github.io/calendario-da-feira/

---

## ✨ Como funciona

### 🎨 Capa
- Banca de feira pintada em aquarela, com o mês, o dia e as frutas que estão na banca.
- Toque em **Abrir** para entrar no fichário. A aba **Capa**, na lombada, volta para ela.

### 📒 Bloco de notas (lado esquerdo)
- **Mini calendário do mês** com navegação e botão *Hoje*. Cada dia mostra o que tem:
  - traço azul: anotação
  - quadradinho verde: lista com itens a comprar
  - quadradinho verde vazado: lista toda comprada
- **Anotações:** papel pautado, uma página por dia. **Tudo é salvo sozinho.**
- **Lista:** itens com caixinha, *Repetir lista anterior* (traz a última lista dos últimos 60 dias) e *Tirar comprados*.
- **Frutas do mês:** a safra do mês no Sudeste, com o botão **+ lista** em cada fruta.

### 🌦️ Aparelho do clima (lado direito)
- Tela de LCD com temperatura, sensação, mínima e máxima, chance de chuva, umidade, vento, nascer e pôr do sol.
- **Próximos 8 dias** em teclas: tocar numa tecla, ou num dia do calendário, mostra a previsão e as notas daquele dia.
- Cidade padrão: Campinas. Dá para **trocar a cidade** ou usar **Minha localização**.
- **Dica da feira:** muda com o clima (chuva, calor, frio, UV alto) e traz a *fruta do dia* com um jeito de escolher a boa.

### 📤 Exportar (botão vermelho na lombada)
- Ficha do dia em **PNG** no formato de story, com a capa, o clima, o calendário, a lista, as anotações e as frutas. Você escolhe o que entra.
- **Compartilhar** pelo celular, **copiar a lista em texto** com ☐ e ☑, **imprimir/salvar em PDF**.
- **Adicionar à agenda:** evento `.ics` com a lista e um lembrete às 7h.
- **Backup:** baixar uma cópia e restaurar em outro aparelho, sem apagar o que já existe.

### ⌨️ Atalhos
- `←` e `→` trocam o dia; `Esc` fecha o painel de exportação.

---

## 🔧 O que mudou em relação à primeira versão

| Antes | Agora |
|---|---|
| Um único arquivo HTML com tudo dentro | `index.html`, `css/`, `js/` e testes, no padrão dos outros projetos |
| Cada dia salvo numa chave solta (`feira-nota-…`, `feira-lista-…`) no espaço do GitHub Pages | Tudo numa chave própria (`calendarioFeira:v1`), sem misturar com outros projetos |
| Lógica de lista, clima e exportação misturada com a tela | Modelo em `js/dados.js`, sem tela e com testes |

**As notas e listas da primeira versão são trazidas automaticamente** na primeira abertura, e os backups antigos continuam podendo ser restaurados.

---

## 🗺️ Próximos passos sugeridos
1. **Preço por quilo na lista**, com o total estimado da feira e o histórico de preços de cada fruta.
2. **Feiras do bairro:** dia, horário e endereço das feiras livres perto de você, com lembrete na véspera.
3. **Lista compartilhada** com a família, para quem for à feira ver o que os outros pediram.
4. **Safra por região:** escolher Sul, Nordeste etc., e incluir verduras e legumes.
5. **Receitas da estação** a partir das frutas da lista.

---

## 💻 Desenvolvimento
HTML, CSS e JavaScript puro (módulos ES), sem etapa de build.

```bash
git clone https://github.com/Guilhermecorrea77/calendario-da-feira.git
cd calendario-da-feira
python3 -m http.server 8080   # abra http://localhost:8080
npm test                       # testes do modelo de dados (Node 18+)
```

```
/
├── index.html
├── css/estilo.css     # fichário de couro, bloco de notas, aparelho do clima, capa
├── js/dados.js        # modelo: dias, lista, safra, clima, textos, .ics, backup e migração (testado)
├── js/capa.js         # ilustração da capa em aquarela (SVG)
├── js/ficha.js        # ficha do dia em PNG (canvas)
├── js/app.js          # telas e interação
└── tests/dados.test.js
```

> Os dados ficam só no navegador do aparelho (localStorage). O app consulta a previsão na [Open-Meteo](https://open-meteo.com/) e, se você pedir *Minha localização*, o nome da cidade na BigDataCloud. Safra aproximada para o Sudeste, com base no calendário de sazonalidade da CEAGESP.
