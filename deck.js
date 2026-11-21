// 슬라이드 그리기 · 이동 · 크게 보기
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const A = 'assets/';
const slides = [];
let cur = null;
function slide(title, group, cls, build) { const s = { title, group, cls, items: [] }; cur = s; s.html = build(); slides.push(s); }
const reg = it => { cur.items.push(it); return cur.items.length - 1; };
const cr = n => `${n} 크레딧`;

// 항목 만들기
const imgItem = (m, o = {}) => ({ kind: 'img', src: `${A}p1/${m.id}.jpg`, name: m.name, by: m.by, pick: m.pick, tag: m.tag, refused: m.refused,
  chips: [cr(m.cr) + (m.refused ? ' (환불)' : ''), IMG_SET, m.feel], note: m.note, use: m.use, prompt: P[m.prompt || 'img'], ...o });
const vidItem = (m, dir, prompt, o = {}) => ({ kind: 'vid', src: `${A}${dir}/${m.id}.mp4`, name: m.name, by: m.by, pick: m.pick, refused: m.refused,
  chips: [cr(m.cr) + (m.refused ? ' (환불)' : ''), m.spec].filter(Boolean), note: m.note, use: m.use, prompt, ...o });

function media(it) {
  const inner = it.refused ? `<div class="refused"><b>거부됨</b>${esc(it.refused)}</div>`
    : it.kind === 'vid' ? `<video data-src="${it.src}" muted loop playsinline preload="none"></video>`
    : `<img src="${it.src}" alt="${esc(it.name)}">`;
  return `<div class="media">${it.pick ? '<span class="tag">추천</span>' : ''}${it.tag ? `<span class="tag dark">${esc(it.tag)}</span>` : ''}${inner}<span class="zoom">크게 보기</span></div>`;
}
const plain = (it, cls = '', extra = '') => { const i = reg(it); return `<button class="card ${cls} ${it.pick ? 'pick' : ''}" data-i="${i}">${media(it)}${extra}</button>`; };

const prompts = [];
const pbtn = (title, text, label = '프롬프트 보기') => { prompts.push({ title, text }); return `<button class="btn ghost" data-p="${prompts.length - 1}">${label}</button>`; };
const copyBtn = (text, label = '복사') => { prompts.push({ title: '', text }); return `<button class="btn primary" data-copy="${prompts.length - 1}">${label}</button>`; };
// 내려받기: 파일 이름을 한글로 붙여 준다
const fileName = it => `힉스필드샘플러_${String(it.dl || it.name).replace(/[\/:*?"<>|·]/g, ' ').trim().replace(/\s+/g, '-')}.${it.kind === 'vid' ? 'mp4' : 'jpg'}`;
const dlBtn = (it, label, cls = 'primary') => `<a class="btn ${cls}" href="${it.src}" download="${fileName(it)}">${label}</a>`;
const head = (part, fixed, changed, right = '') => `<div class="head"><span class="pill">${part}</span>${fixed ? `<span class="chip">고정 · ${fixed}</span>` : ''}${changed ? `<span class="chip on">바꾼 것 · ${changed}</span>` : ''}<span class="grow"></span>${right}</div>`;
const take = html => `<div class="take"><span>${html}</span></div>`;

// ── 1 표지
slide('표지', '시작', 'cover', () => {
  const a = { kind: 'img', src: `${A}p1/m07-nanopro.jpg`, name: '동화책 삽화' };
  const b = { kind: 'vid', src: `${A}p2/g08-omni12.mp4`, name: '졸업식 인트로' };
  const c = { kind: 'vid', src: `${A}p3/t04-kling40.mp4`, name: '모션 타이포' };
  const tile = (it, go, k, t) => `<button class="card" data-go="${go}">${media(it)}<span class="cap">${t}<small>${k}</small></span></button>`;
  return `<div class="wrap"><div>
    <span class="pill">힉스필드 모델 샘플러 <b>{{n}}장</b></span>
    <h1 style="margin-top:22px">같은 조건,<br><em>다른 모델</em></h1>
    <p class="sub">프롬프트는 그대로 두고 <b>모델만 바꿔</b> 나란히 놓았어요. 동화책 삽화, 졸업식 인트로, 모션 타이포 세 가지를 이미지 모델 16종과 영상 모델 12종으로 직접 만들어 봤어요.</p>
    <div class="cta"><button class="btn primary big" data-go="2">샘플러 보기</button><button class="btn ghost" style="height:40px" data-toc>목차</button><span class="chip">2026. 11. 21. 직접 생성</span></div>
  </div><div class="tiles">${tile(a, '1부', '1부 · 이미지 모델 16종', '동화책 삽화')}${tile(b, '2부', '2부 · 영상 모델 12종', '졸업식 인트로')}${tile(c, '3부', '3부 · 영상 모델 12종', '모션 타이포')}</div></div>`;
});

// ── 2 읽는 법
slide('샘플러 읽는 법', '시작', '', () => {
  const j = (go, src, kind, k, t, d) => `<button class="card" data-go="${go}">${media({ kind, src, name: t })}<div class="txt"><div class="k">${k}</div><h3>${t}</h3><p>${d}</p></div></button>`;
  return `${head('시작하기 전에')}<h2>샘플러 <em>읽는 법</em></h2><div class="body">
  <div class="three">
    <div class="tile"><div class="n">01</div><h3>하나만 바꿔요</h3><p>프롬프트·비율·시작 이미지는 모두 똑같이 넣고 <b>모델 하나만</b> 바꿨어요. 그래서 차이는 전부 모델에서 나온 거예요.</p></div>
    <div class="tile"><div class="n">02</div><h3>기본 설정 그대로</h3><p>화질·해상도는 손대지 않고 <b>각 모델의 기본값</b>으로 만들었어요. 카드의 크레딧은 실제로 빠져나간 숫자예요.</p></div>
    <div class="tile"><div class="n">03</div><h3>눌러서 크게 봐요</h3><p>그림과 영상은 모두 <b>누르면 크게</b> 열려요. 옆에 넣은 프롬프트가 함께 나오고 <b>복사</b>할 수 있어요.</p></div>
  </div>
  <div class="jump">
    ${j('1부', `${A}p1/m04-gpt26.jpg`, 'img', '1부 · {{r:1부 동화책 삽화}}쪽', '동화책 삽화', '어린 왕자 한 장면을 이미지 모델 16종, 그림체 8종, 이어지는 4쪽으로.')}
    ${j('2부', `${A}p2/start-nano.jpg`, 'img', '2부 · {{r:2부 졸업식 인트로}}쪽', '졸업식 인트로', '칠판 사진 한 장을 영상 모델 12종으로 움직이고, 인트로 컨셉 4가지와 이스터에그를 더했어요.')}
    ${j('3부', `${A}p3/end-ideogram.jpg`, 'img', '3부 · {{r:3부 모션 타이포}}쪽', '모션 타이포', '교권 보호 문구가 움직이는 영상을 12종으로. 글자를 정확히 맞추는 방법까지.')}
  </div></div>`;
});

// ── 3 1부 표지
slide('1부 · 동화책 삽화', '1부 동화책 삽화', 'part', () => {
  const i = reg(imgItem(IMG_MODELS[3]));
  return `<div class="wrap"><div>
    <div class="no">1부 · 이미지 모델</div><h1>동화책<br>삽화</h1>
    <p class="sub">『어린 왕자』의 한 장면을 <b>같은 프롬프트</b>로 16개 모델에 넣었어요. 이어서 그림체 8가지, 같은 주인공으로 이어 그린 4쪽을 봐요.</p>
    <div class="facts"><div class="fact"><b>16</b><span>이미지 모델</span></div><div class="fact"><b>8</b><span>그림체</span></div><div class="fact"><b>4</b><span>이어지는 쪽</span></div><div class="fact"><b>3:4</b><span>세로 비율</span></div></div>
    <div class="promptbox"><div class="top"><span>모든 모델에 똑같이 넣은 프롬프트</span><span class="grow"></span>${copyBtn(P.img)}</div><pre>${esc(P.img)}</pre></div>
  </div><button class="hero tall card" data-i="${i}"><img src="${A}p1/m04-gpt26.jpg" alt=""><span class="tag dark">GPT Image 2.6 결과</span><span class="zoom">크게 보기</span></button></div>`;
});

// ── 4 이미지 모델 표
slide('이미지 모델 16종 한눈에', '1부 동화책 삽화', '', () => {
  const rows = IMG_MODELS.map(m => { const i = reg(imgItem(m)); return `<tr class="${m.pick ? 'pick' : ''} ${m.own ? 'own' : ''} ${m.refused ? 'no' : ''}" data-i="${i}" style="cursor:pointer">
    <td class="nm">${m.pick ? '<span class="dot"></span>' : ''}${esc(m.name)}</td><td class="by">${esc(m.by)}</td><td class="ds">${esc(m.about)}</td><td>${m.refused ? '거부됨 · ' + esc(m.refused) : esc(m.feel)}</td><td class="cr">${m.cr}</td></tr>`; }).join('');
  return `${head('1부 · 동화책 삽화', '', '', '<span class="chip">줄을 누르면 결과가 열려요</span>')}<h2>이미지 모델 <em>16종</em> 한눈에</h2><div class="body">
  <table class="table"><thead><tr><th>모델</th><th>만든 곳</th><th>한 줄 소개</th><th>이번 결과</th><th class="cr">1장 크레딧</th></tr></thead><tbody>${rows}</tbody></table>
  ${take('값 차이가 <b>약 30배</b>(0.12 ~ 3.5)예요. 가장 싼 모델이 가장 나쁘지도, 가장 비싼 모델이 가장 좋지도 않았어요. <b>Seedream 두 종은 이 소재를 아예 거부</b>했어요.')}</div>`;
});

// ── 5·6 이미지 모델 비교
const imgCompare = (title, list, tk) => slide(title, '1부 동화책 삽화', '', () => {
  const cards = list.map(m => plain(imgItem(m), '', `<div class="txt"><div class="name">${esc(m.name)}</div><div class="meta">${esc(m.by)} · <b>${m.cr}</b> 크레딧</div><div class="note">${esc(m.note)}</div><div class="use">→ ${esc(m.use)}</div></div>`)).join('');
  return `${head('1부 · 동화책 삽화', '프롬프트 · 3:4 · 기본 설정', '모델', pbtn('모든 모델에 똑같이 넣은 프롬프트', P.img))}<h2>${title}</h2><div class="body"><div class="grid-img">${cards}</div>${take(tk)}</div>`;
});
imgCompare('같은 프롬프트, <em>모델 8종</em> ①', IMG_MODELS.slice(0, 8), '힉스필드 자체 모델(Soul·Cinema Studio)은 <b>실사와 영화 장면</b>에 맞춰져 있어 삽화에서는 프롬프트를 벗어났어요. 동화책 삽화는 <b>GPT Image 2.6</b>(0.75)이 기본, 손그림 질감은 <b>Nano Banana Pro</b>(2).');
imgCompare('같은 프롬프트, <em>모델 8종</em> ②', IMG_MODELS.slice(8), '<b>Seedream 5.5와 5.0 Pro</b>는 책 제목을 빼도 저작권 제한으로 거부했어요. 유명 작품을 소재로 쓸 땐 모델을 바꿔야 해요. <b>Z Image</b>(0.15)는 가장 싸지만 깨진 글자가 들어갔어요.');
slides[4].title = '모델 비교 ① 힉스필드·GPT·Nano Banana'; slides[5].title = '모델 비교 ② Seedream·FLUX·Kling 외';

// ── 7 그림체
slide('그림체 8종 × 모델 2종', '1부 동화책 삽화', '', () => {
  const row = (key, label, sub) => `<div class="rowhead"><b>${label}</b><span>${sub}</span></div><div class="row">${STYLES.map((s, i) => plain({ kind: 'img', src: `${A}p1/s-${key}-${i + 1}.jpg`, name: `${s[0]} · ${label}`, by: '그림체만 바꿈', chips: [key === 'gpt' ? cr(0.75) : cr(2), IMG_SET], note: `그림체 줄: ${s[1]}`, prompt: P.style(i) })).join('')}</div>`;
  return `${head('1부 · 동화책 삽화', '장면 · 3:4', '[그림체] 한 줄', pbtn('그림체 줄만 바꾼 프롬프트 (예: 한국 민화)', P.style(5)))}<h2>그림체 <em>한 줄</em>만 바꾸면</h2><div class="body"><div class="styles">
    <div class="labels">${STYLES.map(s => `<span>${s[0]}</span>`).join('')}</div>
    ${row('gpt', 'GPT Image 2.6', '0.75 크레딧 · 구도는 그대로, 그림체만 바뀜')}
    ${row('nano', 'Nano Banana Pro', '2 크레딧 · 그림체마다 구도와 재료까지 새로 해석')}
  </div>${take('<b>GPT Image 2.6</b>은 8장 모두 구도가 같아서 한 책에 섞어 쓰기 좋아요. <b>Nano Banana Pro</b>는 종이 여백·한지·유리창 틀까지 재료째로 바꿔서 한 장짜리 작품에 좋아요.')}</div>`;
});

// ── 8 일관성
slide('동화책 4쪽, 같은 주인공', '1부 동화책 삽화', '', () => {
  const pg = (file, n, model, c, prompt, extra = {}) => plain({ kind: 'img', src: `${A}p1/${file}.jpg`, name: `${n + 1}쪽 · ${PAGES[n][0]}`, by: model, chips: [cr(c), IMG_SET], note: extra.note || '', prompt, tag: `${n + 1}쪽` });
  const r = (cls, k, t, d, pages, obs) => `<div class="r ${cls}"><div class="lab"><div class="k">${k}</div><div class="t">${t}</div><div class="d">${d}</div></div><div class="pages">${pages}</div><div class="obs">${obs}</div></div>`;
  const a = [0, 1, 2, 3].map(n => pg(`c-a-${n + 1}`, n, 'GPT Image 2.6 · 글만', 0.75, P.page(n))).join('');
  const b = pg('c-a-1', 0, 'GPT Image 2.6 · 1쪽(참고 이미지로 사용)', 0.75, P.page(0)) + [1, 2, 3].map(n => pg(`c-b-${n + 1}`, n, 'GPT Image 2.6 · 1쪽을 참고 이미지로', 0.75, P.pageRef(n))).join('');
  const c = pg('c-c-1', 0, 'Nano Banana Pro · 1쪽(참고 이미지로 사용)', 2, P.page(0)) + [1, 2, 3].map(n => pg(`c-c-${n + 1}`, n, 'Nano Banana Pro · 1쪽을 참고 이미지로', 2, P.pageRef(n))).join('');
  return `${head('1부 · 동화책 삽화', '주인공 설명 · 그림체', '참고 이미지 넣기', pbtn('1쪽을 첨부하고 넣은 프롬프트 (2쪽)', P.pageRef(1)))}<h2>4쪽이 <em>같은 주인공</em>으로 보이나요?</h2><div class="body"><div class="rows">
    ${r('', 'GPT Image 2.6', '글로만 4쪽', '쪽마다 주인공 설명을 똑같이 적어 넣음', a, '옷과 목도리는 같아요. 다만 3·4쪽에서 주인공이 <b>더 큰 아이처럼 길쭉해지고</b> 머리숱이 줄었어요.')}
    ${r('pick', 'GPT Image 2.6', '1쪽을 참고 이미지로', '1쪽 그림을 첨부하고 "같은 주인공, 같은 그림체로"', b, '1쪽의 <b>통통한 몸집과 풍성한 곱슬머리</b>가 4쪽까지 그대로예요. 색감과 붓 느낌도 이어져요.')}
    ${r('', 'Nano Banana Pro', '1쪽을 참고 이미지로', '모델만 바꿔 같은 방법으로', c, '종이 여백이 있는 손그림 느낌이 2·3쪽까지 이어져요. <b>4쪽에서는 여백이 사라졌어요.</b>')}
  </div></div>`;
});

// ── 9 2부 표지
slide('2부 · 졸업식 인트로', '2부 졸업식 인트로', 'part', () => {
  const i = reg({ kind: 'img', src: `${A}p2/start-nano.jpg`, name: '시작 이미지', by: 'Nano Banana Pro', chips: [cr(2), '16:9 · 2K'], note: '칠판의 한글 "졸업을 축하합니다"가 한 번에 정확하게 나왔어요. 이 그림 한 장을 12개 영상 모델의 첫 장면으로 넣었어요.', prompt: P.start });
  return `<div class="wrap"><div>
    <div class="no">2부 · 영상 모델</div><h1>졸업식<br>인트로</h1>
    <p class="sub"><b>시작 이미지 한 장</b>과 <b>움직임 한 줄</b>을 12개 영상 모델에 똑같이 넣었어요. 뒤에는 같은 모델로 만든 인트로 컨셉 4가지가 있어요.</p>
    <div class="facts"><div class="fact"><b>12</b><span>영상 모델</span></div><div class="fact"><b>4</b><span>인트로 컨셉</span></div><div class="fact"><b>16:9</b><span>가로 비율</span></div><div class="fact"><b>5초</b><span>Veo는 4초</span></div></div>
    <div class="promptbox"><div class="top"><span>모든 모델에 똑같이 넣은 움직임 한 줄</span><span class="grow"></span>${copyBtn(P.move)}</div><pre>${esc(P.move)}</pre></div>
  </div><button class="hero card" data-i="${i}"><img src="${A}p2/start-nano.jpg" alt=""><span class="tag dark">시작 이미지 · Nano Banana Pro</span><span class="zoom">크게 보기</span></button></div>`;
});

// ── 10 영상 모델 표
slide('영상 모델 12종 한눈에', '2부 졸업식 인트로', '', () => {
  const rows = GRAD.map(m => { const i = reg(vidItem(m, 'p2', P.move)); return `<tr class="${m.pick ? 'pick' : ''} ${m.own ? 'own' : ''}" data-i="${i}" style="cursor:pointer">
    <td class="nm">${m.pick ? '<span class="dot"></span>' : ''}${esc(m.name)}</td><td class="by">${esc(m.by)}</td><td class="ds">${esc(m.about)}</td><td>${m.len}</td><td>${m.res}</td><td>${esc(m.spec)}</td><td class="cr">${m.cr}</td></tr>`; }).join('');
  return `${head('2부 · 졸업식 인트로', '', '', '<span class="chip">줄을 누르면 결과가 열려요</span>')}<h2>영상 모델 <em>12종</em> 한눈에</h2><div class="body">
  <table class="table video"><thead><tr><th>모델</th><th>만든 곳</th><th>특징</th><th>만들 수 있는 길이</th><th>해상도</th><th>이번에 만든 설정</th><th class="cr">1편 크레딧</th></tr></thead><tbody>${rows}</tbody></table>
  ${take('같은 5초인데 <b>5 ~ 35 크레딧</b>으로 7배 차이가 나요. Kling 4.0은 기본이 1080p, MiniMax H3는 2K라서 같은 값이라도 화질이 달라요.')}</div>`;
});

// ── 11·12 졸업식 모델 비교
const vidCard = (m, dir, prompt) => plain(vidItem(m, dir, prompt), '', `<div class="txt"><div class="row"><span class="name">${esc(m.name)}</span><span class="meta"><b>${m.cr}</b> · ${esc(m.spec.split(' · ').slice(0, 2).join(' · '))}</span></div><div class="note">${esc(m.note)}</div></div>`);
const gradSide = `<div class="side"><h3>똑같이 넣은 것</h3><div class="thumb"><img src="${A}p2/start-nano.jpg" alt=""></div><p><b>시작 이미지</b> 한 장</p><div class="quote">카메라가 교실 뒤에서 칠판 쪽으로 천천히 다가간다. … 칠판의 글자와 교실 모습은 그대로 유지해줘.</div><p><b>움직임 한 줄</b> · 16:9 · 5초 (Veo 4초)</p><p>영상은 소리 없이 반복 재생돼요. 누르면 소리와 함께 크게 열려요.</p></div>`;
const gradCompare = (title, list, tk) => slide(title, '2부 졸업식 인트로', '', () =>
  `${head('2부 · 졸업식 인트로', '시작 이미지 · 움직임 한 줄', '모델', pbtn('모든 모델에 똑같이 넣은 움직임 한 줄', P.move))}<h2>같은 사진, <em>움직임이 달라요</em></h2><div class="body"><div class="split">${gradSide}<div class="grid-vid">${list.map(m => vidCard(m, 'p2', P.move)).join('')}</div></div>${take(tk)}</div>`);
gradCompare('영상 모델 비교 ① Seedance·Kling·Veo', GRAD.slice(0, 6), '만들어진 다섯 편 모두 칠판의 한글이 그대로 남았어요. <b>Seedance 2.0 Mini</b>(5)가 7배 비싼 2.5와 비슷하게 움직였어요. <b>2.5 Flash</b>는 같은 사진인데 저작권 제한으로 거부됐어요.');
gradCompare('영상 모델 비교 ② Omni·Wan·Cinema Studio 외', GRAD.slice(6), '"다가간다"는 지시는 <b>Gemini Omni Flash 1.2</b>가 가장 크게 따랐어요. <b>Cinema Studio 4.0</b>은 시작 사진을 벗어나 옆으로 돌아 들어가면서 칠판 글자가 흐려졌어요. 시작 장면을 지켜야 할 땐 맞지 않아요.');

// ── 13 인트로 컨셉
slide('인트로 컨셉 4가지', '2부 졸업식 인트로', '', () => {
  const cards = KONCEPT.map((m, n) => plain({ kind: 'vid', src: `${A}p2/${m.id}.mp4`, name: m.name, by: 'Cinema Studio 4.0 · 글만으로 생성', chips: [cr(m.cr), '5초 · 720p · 소리'], note: m.note, prompt: P.k[m.p] }, '', `<div class="txt"><div class="row"><span class="name">${n + 1}. ${esc(m.name)}</span><span class="meta"><b>${m.cr}</b> · 5초 · 720p</span></div></div>`)).join('');
  return `${head('2부 · 졸업식 인트로', '모델 (Cinema Studio 4.0)', '장면', pbtn('컨셉 3 · 종이비행기 프롬프트', P.k[2]))}<h2>이번엔 <em>장면</em>을 바꿔요</h2><div class="body"><div class="split wide">
    <div class="side"><h3>모델은 그대로, 장면만 4가지</h3><p>시작 이미지 없이 <b>글만으로</b> 만들었어요. 힉스필드 자체 모델인 <b>Cinema Studio 4.0</b>은 사진을 그대로 지키는 데는 약했지만, 장면을 통째로 맡기면 영화 같은 화면을 내놓아요.</p>
    ${KONCEPT.map((m, n) => `<div class="quote"><b style="font-family:var(--display);color:var(--lime);margin-right:8px">${n + 1}</b>${esc(m.note)}</div>`).join('')}
    <p>화면에 넣을 제목 글자는 영상 모델에 맡기지 않았어요. 편집 프로그램에서 얹는 쪽이 정확해요.</p></div>
    <div class="grid-vid two">${cards}</div></div></div>`;
});

// ── 이스터에그 7쪽: 1부의 어린 왕자를 2부 졸업식에 데려오기 (그림책 버전 + 콜라주 버전)
const G2 = '2부 졸업식 인트로', EGGP = '2부 · 이스터에그';
const shotItem = (list, n) => { const s = list[n]; return { kind: 'img', src: `${A}p2/${s.img}.jpg`, name: `장면 ${n + 1} · ${s.name}`, by: 'GPT Image 2.6 · 1부 주인공을 참고 이미지로', chips: [cr(1), '16:9 · 품질 중간', s.t], note: s.story, use: `카메라: ${s.cam}`, prompt: s.prompt, tag: s.t }; };
const eggPlane = () => ({ kind: 'vid', src: `${A}p2/k3-paperplane.mp4`, name: '종이비행기 인트로', by: 'Cinema Studio 4.0 · 13쪽 컨셉 3', chips: [cr(35), '5초 · 720p'], note: '실사 한 겹. 이 영상의 장면(빈 교실, 열린 창문, 파란 하늘, 하얀 종이비행기)을 콘티 프롬프트에 그대로 옮겼어요.', prompt: P.k[2] });
const bookFinal = () => ({ kind: 'vid', src: `${A}p2/egg-book.mp4`, name: '그림책 버전 · 어린 왕자의 졸업식', by: 'Seedance 2.5 · 콘티 4장', chips: [cr(140), '20초 · 720p · 소리'], note: EGG_NOTE.book.final, prompt: P.eggBook });
const layFinal = () => ({ kind: 'vid', src: `${A}p2/egg-layered.mp4`, name: '콜라주 버전 · 어린 왕자의 졸업 비행', by: 'Seedance 2.5 · 종이 인형 콘티 4장', chips: [cr(140), '20초 · 720p · 소리'], note: EGG_NOTE.lay.final, prompt: P.eggVideo });

slide('이스터에그 · 어린 왕자의 졸업식', G2, 'part', () => {
  const i = reg(shotItem(EGG_SHOTS, 2));
  return `<div class="wrap"><div>
    <div class="no">${EGGP}</div><h1>어린 왕자의<br>졸업식</h1>
    <p class="sub">1부의 <b>어린 왕자</b>를 2부 졸업식에 데려왔어요. 같은 주인공으로 20초짜리 두 편을 만들고, 마무리를 더해 1분 영상으로 이었어요. 수채화 한 겹으로만 그린 <b>그림책 버전</b>, 실사 화면 위에 오려 낸 그림을 얹은 <b>콜라주 버전</b>이에요.</p>
    <div class="facts"><div class="fact"><b>3</b><span>완성 영상</span></div><div class="fact"><b>21</b><span>콘티 그림</span></div><div class="fact"><b>1분</b><span>가장 긴 영상</span></div><div class="fact"><b>441</b><span>크레딧</span></div></div>
    <div class="promptbox"><div class="top"><span>만든 순서</span></div><pre style="max-height:none;-webkit-mask-image:none;mask-image:none">① 재료 고르기 — 이미 뽑아 둔 그림 캐릭터와 실사 영상
② 20초를 4장면으로 나누고 콘티 뽑기 — GPT Image 2.6
③ 콘티를 Seedance 2.5에 넣기 — 장면별 시간표와 카메라
④ 완성 영상 확인하기
⑤ 마무리 구간을 더 만들어 1분으로 잇기</pre></div>
  </div><button class="hero card" data-i="${i}"><img src="${A}p2/cut-3.jpg" alt=""><span class="tag dark">콜라주 버전 콘티 3 · GPT Image 2.6</span><span class="zoom">크게 보기</span></button></div>`;
});

slide('이스터에그 ① 콜라주: 실사 위에 그림 얹기', G2, '', () => {
  const hero = imgItem(IMG_MODELS[3], { name: '1부의 어린 왕자', by: 'GPT Image 2.6 · 5쪽 모델 비교 결과', pick: 0, note: '그림 한 겹. 이 그림을 참고 이미지로 넣어 콘티의 주인공을 맞췄어요.' });
  return `${head(EGGP, '', '', pbtn('콘티에 넣은 프롬프트 (콜라주 버전 장면 1)', EGG_SHOTS[0].prompt))}<h2>실사 위에 그림을 얹는 <em>콜라주</em></h2><div class="body"><div class="layers">
    ${plain(eggPlane(), '', `<div class="txt"><div class="name">실사 한 겹</div><div class="meta">13쪽의 종이비행기 인트로 · Cinema Studio 4.0</div></div>`)}
    <div class="op">+</div>
    ${plain(hero, 'tall', `<div class="txt"><div class="name">그림 한 겹</div><div class="meta">5쪽의 어린 왕자 · GPT Image 2.6</div></div>`)}
    <div class="op">=</div>
    ${plain(shotItem(EGG_SHOTS, 0), '', `<div class="txt"><div class="name">얹은 한 컷</div><div class="meta">콜라주 버전 콘티 1 · GPT Image 2.6 · 1 크레딧</div></div>`)}
  </div>${take('새로 만든 재료는 없어요. <b>이미 뽑아 둔 영상과 그림</b>을 참고 자료로 다시 넣었어요. 콘티 프롬프트 첫 줄에 <b>"실사 사진 위에 종이 인형을 얹은 콜라주 한 컷"</b>이라고 적고, 주인공은 <b>"수채화로 그려 가위로 오려 낸 납작한 종이 인형"</b>이라고 못박았어요.')}</div>`;
});

const boardSlide = (title, h2, list, pTitle, tk) => slide(title, G2, '', () => {
  const cards = list.map((s, n) => plain(shotItem(list, n), '', `<div class="txt"><div class="row"><span class="name">${n + 1}. ${esc(s.name)}</span></div><div class="note">${esc(s.story)}</div><div class="use">카메라 · ${esc(s.cam)}</div></div>`)).join('');
  return `${head(EGGP, '주인공 그림 한 장', '장면', pbtn(pTitle, list[2].prompt))}<h2>${h2}</h2><div class="body">
    <div class="timeline">${list.map(s => `<div><i></i><span>${s.t}</span></div>`).join('')}</div>
    <div class="grid-4">${cards}</div>${take(tk)}</div>`;
});
boardSlide('이스터에그 ② 콘티 · 그림책 버전', '콘티 ① <em>그림책 버전</em> · 20초를 4장면으로', EGG_BOOK_SHOTS, '그림책 버전 장면 3에 넣은 프롬프트',
  'GPT Image 2.6에 <b>1부 주인공 그림 한 장</b>을 참고 이미지로 넣고 장면만 바꿔 뽑았어요(장당 1 크레딧). 네 장 모두 같은 주인공이고 칠판의 한글도 정확해요. 여우는 프롬프트에 한 줄 적은 것만으로 장면 2~4에 같은 모습으로 나왔어요.');
boardSlide('이스터에그 ③ 콘티 · 콜라주 버전', '콘티 ② <em>콜라주 버전</em> · 종이비행기에 태우기', EGG_SHOTS, '콜라주 버전 장면 3에 넣은 프롬프트',
  '같은 주인공 그림을 넣고 이번엔 <b>배경을 실사로</b> 바꿨어요. 교실·하늘·구름은 사진처럼, 어린 왕자는 흰 테두리가 남은 <b>종이 인형</b>으로 얹혔어요. 장면마다 <b>카메라 움직임</b>을 미리 정해 두면 영상 프롬프트를 쓰기 쉬워요.');

slide('이스터에그 ④ Seedance 2.5에 넣기', G2, '', () => {
  const thumbs = list => list.map((s, n) => { const i = reg(shotItem(list, n)); return `<button class="thumb card" data-i="${i}"><img src="${A}p2/${s.img}.jpg" alt=""><span class="tag dark">${n + 1}</span></button>`; }).join('');
  const tried = reg({ kind: 'img', src: `${A}p2/lay-3.jpg`, name: '막힌 콘티', by: 'GPT Image 2.6 · 처음 뽑은 콜라주 콘티', chips: [cr(1), '16:9'], note: '실사 화면 속에 입체적으로 그린 아이 캐릭터. 이 콘티로는 Seedance 2.5가 두 번 모두 안전 필터로 생성을 막았어요. 참고 영상을 함께 넣었을 때도, 콘티만 넣었을 때도 같았어요.', prompt: EGG_TRY[2].prompt, tag: '막힘' });
  const passed = reg(shotItem(EGG_SHOTS, 2));
  return `${head(EGGP, '모델 · 20초 · 시간표 형식', '넣은 콘티', pbtn('그림책 버전 프롬프트', P.eggBook, '그림책 버전 프롬프트') + copyBtn(P.eggVideo, '콜라주 버전 복사'))}<h2>콘티를 Seedance 2.5에 <em>한 번에</em> 넣어요</h2><div class="body"><div class="split wide">
    <div class="side"><h3>넣은 것</h3>
      <p><b>그림책 버전</b> · 콘티 4장</p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${thumbs(EGG_BOOK_SHOTS)}</div>
      <p><b>콜라주 버전</b> · 종이 인형 콘티 4장</p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${thumbs(EGG_SHOTS)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px"><span class="chip on">Seedance 2.5</span><span class="chip">참고 그림 방식</span><span class="chip">16:9 · 20초 · 720p · 소리</span><span class="chip">편당 140 크레딧</span></div>
      <h3 style="margin-top:4px">콜라주 버전은 세 번 만에 통과</h3>
      <div style="display:grid;grid-template-columns:1fr 24px 1fr;gap:8px;align-items:center">
        <button class="thumb card" data-i="${tried}"><img src="${A}p2/lay-3.jpg" alt=""><span class="tag" style="background:var(--pink);color:#fff">두 번 막힘</span></button><span style="text-align:center;color:var(--lime);font-size:20px">→</span>
        <button class="thumb card" data-i="${passed}"><img src="${A}p2/cut-3.jpg" alt=""><span class="tag">통과</span></button></div>
      <p>실사 화면 속의 <b>입체적인 아이 캐릭터</b>는 안전 필터에 걸렸어요. 주인공을 <b>오려 낸 종이 인형</b>으로 바꾸니 통과했어요. 막힌 생성은 환불됐어요.</p></div>
    <div class="pcard" style="min-height:0"><div class="top"><h3>프롬프트는 네 덩어리 · 콜라주 버전 전문</h3></div>
      <div class="four"><span><b>1 역할</b> 그림 4장은 순서대로 장면 1~4의 콘티</span><span><b>2 겹</b> 배경은 실사로, 주인공은 끝까지 종이 인형으로</span><span><b>3 시간표</b> [0~5초]처럼 끊고 일어나는 일과 카메라 용어</span><span><b>4 마무리</b> 끊김 없이, 넣지 말 것, 음악과 소리</span></div>
      <pre style="-webkit-mask-image:none;mask-image:none;overflow:auto;cursor:auto;font-size:14px;line-height:22px">${esc(P.eggVideo)}</pre></div>
  </div></div>`;
});

const finaleSlide = (title, h2, item, note, extra) => slide(title, G2, '', () =>
  `${head(EGGP, '', '', dlBtn(item, '영상 내려받기') + pbtn('Seedance 2.5에 넣은 프롬프트', item.prompt))}<h2>${h2}</h2><div class="body"><div class="finale">
    ${plain(item, 'big pick', `<div class="txt"><div class="row"><span class="name">${esc(item.name)}</span><span class="meta"><b>140</b> · 20초 · 720p · 누르면 소리와 함께 크게</span></div></div>`)}
    <div class="side"><h3>결과에서 본 것</h3>${note.points.map(p => `<p>${p}</p>`).join('')}${extra || ''}</div>
  </div></div>`);
finaleSlide('이스터에그 ⑤ 완성 · 그림책 버전', '완성 ① <em>그림책 버전</em> · 20초', bookFinal(), EGG_NOTE.book);
finaleSlide('이스터에그 ⑥ 완성 · 콜라주 버전', '완성 ② <em>콜라주 버전</em> · 20초', layFinal(), EGG_NOTE.lay,
  `<div class="quote">${EGG_NOTE.compare}</div>`);

// ── 이스터에그 이어서: 영상 확장으로 20초를 1분으로
const minFinal = () => ({ kind: 'vid', src: `${A}p2/egg-1min.mp4`, name: '1분 졸업 축하 영상 · 어린 왕자의 졸업식', dl: '어린왕자 졸업 축하 영상 1분', by: 'Seedance 2.5 · 20초 세 편을 이어 붙임', chips: [cr(420), '60초 · 720p · 소리'], note: EGG_NOTE.min.final, prompt: `【처음 20초】\n${P.eggVideo}\n\n【확장 ① 20~40초】\n${P.ext1}\n\n【확장 ② 40~60초】\n${P.ext2}` });

slide('이스터에그 ⑦ 콘티 · 이어질 8장면', G2, '', () => {
  const cards = EGG_EXT_SHOTS.map((s, n) => {
    const it = shotItem(EGG_EXT_SHOTS, n);
    it.name = `장면 ${n + 5} · ${s.name}`;
    if (n < 4) { it.tag = '막힘'; it.chips = [cr(1), '16:9 · 품질 중간']; it.note = `${s.story} 이 장면이 든 구간은 영상으로 만들어지지 않았어요.`; }
    return plain(it, n < 4 ? 'dim' : 'pick', `<div class="txt"><div class="row"><span class="name">${n + 5}. ${esc(s.name)}</span><span class="meta">${n < 4 ? '영상으로는 막힘' : esc(s.cam)}</span></div></div>`);
  }).join('');
  return `${head(EGGP, '콜라주 방식 · 종이 인형', '장면', pbtn('장면 10에 넣은 프롬프트', EGG_EXT_SHOTS[5].prompt))}<h2>콘티 ③ <em>이어질 8장면</em> · 1분을 향해</h2><div class="body">
    <div class="grid-8">${cards}</div>
    ${take('콜라주 버전의 끝(장미가 있는 별)에서 이어지게 <b>8장면</b>을 더 짰어요. 콘티 그림은 여덟 장 모두 잘 나왔지만, 영상으로는 <b>아래 네 장면(9~12)만 통과</b>했어요. 위 네 장면은 여러 번 넣어도 막혀서 완성 영상에는 들어가지 못했어요.')}</div>`;
});

slide('이스터에그 ⑧ 20초 세 편을 이어 1분', G2, '', () => {
  const a = reg(bookFinal()), b = reg(layFinal());
  const c = reg({ kind: 'img', src: `${A}p2/cut-12.jpg`, name: '마무리 구간 (40~60초)', by: 'Seedance 2.5 · 콘티 장면 9~12', chips: [cr(140), '20초 · 720p · 소리'], note: '새로 만든 마무리 20초. 종이비행기와 학사모가 별이 되고, 밤의 교실 칠판으로 돌아와요.', prompt: P.seg3 });
  const x = reg({ kind: 'img', src: `${A}p2/cut-6x.jpg`, name: '막힌 장면', by: 'GPT Image 2.6 · 처음 짠 장면 6', chips: [cr(1), '16:9'], note: EGG_NOTE.blocked, tag: '막힘' });
  return `${head(EGGP, '모델 · 20초 · 콘티 4장씩', '구간', copyBtn(P.seg3, '마무리 구간 복사'))}<h2>20초 <em>세 편</em>을 이어 1분으로</h2><div class="body"><div class="split wide">
    <div class="side"><h3>20초 + 20초 + 20초</h3>
      <div class="extflow">
        <button class="thumb card" data-i="${a}"><img src="${A}p2/egg-2.jpg" alt=""><span class="tag dark">0–20초 · 그림책</span></button>
        <span>+</span><button class="thumb card" data-i="${b}"><img src="${A}p2/cut-3.jpg" alt=""><span class="tag dark">20–40초 · 콜라주</span></button>
        <span>+</span><button class="thumb card" data-i="${c}"><img src="${A}p2/cut-12.jpg" alt=""><span class="tag">40–60초 · 마무리</span></button></div>
      ${EGG_NOTE.ext.map(p => `<p>${p}</p>`).join('')}
      <div style="display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center"><button class="thumb card" data-i="${x}"><img src="${A}p2/cut-6x.jpg" alt=""><span class="tag" style="background:var(--pink);color:#fff">막힌 장면</span></button><p style="margin:0">${EGG_NOTE.blocked}</p></div></div>
    <div class="pcard" style="min-height:0"><div class="top"><h3>마무리 구간에 넣은 프롬프트 전문 (40~60초)</h3></div>
      <div class="four"><span><b>1 같은 머리말</b> 콜라주 방식과 종이 인형 설명을 앞 구간과 똑같이</span><span><b>2 콘티</b> 그 구간의 장면 4장을 참고 그림으로</span><span><b>3 시간표</b> 구간 안에서 다시 0초부터 적기</span><span><b>4 이음새</b> 앞 구간의 끝 장면에서 시작하게 짜기</span></div>
      <pre style="-webkit-mask-image:none;mask-image:none;overflow:auto;cursor:auto;font-size:14px;line-height:22px">${esc(P.seg3)}</pre></div>
  </div></div>`;
});

slide('이스터에그 ⑨ 완성 · 1분 졸업 축하 영상', G2, '', () => {
  const item = minFinal();
  return `${head(EGGP, '', '', dlBtn(item, '1분 영상 내려받기') + pbtn('세 번에 걸쳐 넣은 프롬프트', item.prompt))}<h2>완성 ③ <em>1분</em> 졸업 축하 영상</h2><div class="body"><div class="finale">
    ${plain(item, 'big pick', `<div class="txt"><div class="row"><span class="name">어린 왕자의 졸업식 · 1분</span><span class="meta"><b>420</b> · 60초 · 720p · 누르면 소리와 함께 크게</span></div></div>`)}
    <div class="side"><h3>결과에서 본 것</h3>${EGG_NOTE.min.points.map(p => `<p>${p}</p>`).join('')}
      <div class="quote">졸업식에서 바로 틀 수 있게 내려받기 단추를 달았어요. 오른쪽 위 <b style="color:var(--lime)">1분 영상 내려받기</b>를 누르세요.</div></div>
  </div></div>`;
});

// ── 3부 표지
slide('3부 · 모션 타이포', '3부 모션 타이포', 'part', () => {
  const i = reg(vidItem(TYPO[3], 'p3', P.typo));
  return `<div class="wrap"><div>
    <div class="no">3부 · 영상 모델</div><h1>모션<br>타이포</h1>
    <p class="sub">교권 보호 문구 <b>RESPECT → PROTECT → TEACHERS' RIGHTS</b>가 움직이는 영상을 <b>글 프롬프트 하나</b>로 12개 모델에 넣었어요. 영상 모델이 영어 글자를 얼마나 정확히 쓰는지 보는 실험이에요.</p>
    <div class="facts"><div class="fact"><b>12</b><span>영상 모델</span></div><div class="fact"><b>12/12</b><span>철자 정확</span></div><div class="fact"><b>16:9</b><span>가로 비율</span></div><div class="fact"><b>4</b><span>시작·끝 장면 방식</span></div></div>
    <div class="promptbox"><div class="top"><span>모든 모델에 똑같이 넣은 프롬프트</span><span class="grow"></span>${copyBtn(P.typo)}</div><pre>${esc(P.typo)}</pre></div>
  </div><button class="hero card" data-i="${i}" style="aspect-ratio:16/9"><video data-src="${A}p3/t04-kling40.mp4" muted loop playsinline preload="none"></video><span class="tag dark">Kling 4.0 결과</span><span class="zoom">크게 보기</span></button></div>`;
});

// ── 15·16 타이포 모델 비교
const typoSide = `<div class="side"><h3>똑같이 넣은 것</h3><div class="quote" style="font-family:var(--display);font-weight:700;font-size:18px;line-height:28px">RESPECT<br>PROTECT<br><span style="color:var(--lime)">TEACHERS' RIGHTS</span></div><p><b>글 프롬프트 하나</b> · 시작 이미지 없음</p><p>검은 배경, 흰 글자 두 번, 마지막에 라임색 큰 글자가 화면을 채우고 멈춤.</p><p>16:9 · 5초 (Veo 4초) · 기본 설정</p><p><b>12종 모두</b> 세 낱말의 철자와 아포스트로피까지 정확했어요.</p></div>`;
const typoCompare = (title, list, tk) => slide(title, '3부 모션 타이포', '', () =>
  `${head('3부 · 모션 타이포', '글 프롬프트 · 16:9', '모델', pbtn('모든 모델에 똑같이 넣은 프롬프트', P.typo))}<h2>같은 문구, <em>글꼴과 움직임</em>이 달라요</h2><div class="body"><div class="split">${typoSide}<div class="grid-vid">${list.map(m => vidCard(m, 'p3', P.typo)).join('')}</div></div>${take(tk)}</div>`);
typoCompare('타이포 모델 비교 ① Seedance·Kling·Veo', TYPO.slice(0, 6), '구호처럼 강하게는 <b>Kling 4.0</b>, 가장 역동적인 움직임은 <b>Veo 3.1</b>. 5 크레딧짜리 <b>Seedance 2.0 Mini</b>도 철자는 정확했어요.');
typoCompare('타이포 모델 비교 ② Omni·Wan·MiniMax 외', TYPO.slice(6), '"화면을 가득 채운다"는 지시는 <b>Wan 3.0</b>(7.5)이 가장 잘 따랐어요. <b>Veo 3.1 Lite</b>는 앞 낱말이 지워지지 않고 겹쳐 남았어요. 글꼴과 배치는 모델이 정해서 매번 달라져요.');

// ── 17 시작·끝 장면
slide('글꼴까지 맞추려면: 시작·끝 장면', '3부 모션 타이포', '', () => {
  const s = reg({ kind: 'img', src: `${A}p3/start-ideogram.jpg`, name: '시작 장면', by: 'Ideogram 4.6', chips: [cr(2), '16:9'], note: '이미지 모델로 먼저 만든 첫 장면이에요.', prompt: P.startImg });
  const e = reg({ kind: 'img', src: `${A}p3/end-ideogram.jpg`, name: '끝 장면', by: 'Ideogram 4.6', chips: [cr(2), '16:9'], note: '글꼴·크기·색·배치를 이 그림에서 정해 둬요. 영상은 이 장면에서 정확히 멈춰요.', prompt: P.endImg });
  const cards = SE.map(m => plain(vidItem(m, 'p3', P.se, { by: `${m.by} · 시작·끝 장면 사용` }), '', `<div class="txt"><div class="row"><span class="name">${esc(m.name)}</span><span class="meta"><b>${m.cr}</b> · ${esc(m.spec)}</span></div></div>`)).join('');
  return `${head('3부 · 모션 타이포', '시작 장면 · 끝 장면 · 움직임 한 줄', '모델', pbtn('시작·끝 장면과 함께 넣은 프롬프트', P.se))}<h2>글꼴까지 맞추려면 <em>끝 장면</em>을 넣어요</h2><div class="body"><div class="split wide">
    <div class="side"><h3>먼저 그림 두 장을 만들어요</h3>
      <div style="display:grid;grid-template-columns:1fr 24px 1fr;gap:8px;align-items:center">
        <button class="thumb card" data-i="${s}"><img src="${A}p3/start-ideogram.jpg" alt=""><span class="tag dark">시작 장면</span></button><span style="text-align:center;color:var(--lime);font-size:20px">→</span>
        <button class="thumb card" data-i="${e}"><img src="${A}p3/end-ideogram.jpg" alt=""><span class="tag dark">끝 장면</span></button></div>
      <p><b>1.</b> 글자를 잘 쓰는 이미지 모델(여기선 Ideogram 4.6, 장당 2)로 첫 장면과 마지막 장면을 만들어요.</p>
      <p><b>2.</b> 영상 모델에 두 장을 시작·끝 장면으로 넣고, 사이의 움직임만 한 줄로 적어요.</p>
      <p><b>3.</b> 네 모델 모두 마지막 프레임이 끝 장면과 똑같이 맞아떨어졌어요. 글꼴·크기·배치가 내가 정한 그대로예요.</p>
      <div class="quote">글만 넣으면 철자는 맞아도 <b style="color:var(--lime)">글꼴과 배치는 모델 마음</b>이에요. 정해진 디자인이 있으면 끝 장면을 넣는 쪽이 확실해요.</div>
      <p>Veo 3.1 Lite는 시작·끝 장면을 함께 쓰면 길이가 8초로 고정돼서 뺐어요.</p></div>
    <div class="grid-vid two">${cards}</div></div></div>`;
});

// ── 18 프롬프트 모음
slide('프롬프트 모음', '정리', '', () => {
  const pc = (t, w, text) => { const b = copyBtn(text); prompts.push({ title: t, text }); return `<div class="pcard"><div class="top"><h3>${t}</h3>${b}</div><div class="where">${w}</div><pre data-p="${prompts.length - 1}">${esc(text)}</pre></div>`; };
  return `${head('정리', '', '', '<span class="chip">글을 누르면 전체가 열려요</span><button class="btn primary" data-dltxt>전체 내려받기</button>')}<h2>바로 쓰는 <em>프롬프트</em> 6개</h2><div class="body"><div class="prompts">
    ${pc('① 동화책 삽화', '이미지 모델 · 3:4', P.img)}
    ${pc('② 그림체만 바꾸기', '이미지 모델 · [그림체] 줄만 교체', P.style(5))}
    ${pc('③ 같은 주인공으로 다음 쪽', '이미지 모델 · 1쪽을 참고 이미지로 첨부', P.pageRef(1))}
    ${pc('④ 졸업식 시작 이미지', '이미지 모델 · 16:9 · 한글 문구 포함', P.start)}
    ${pc('⑤ 움직임 한 줄', '영상 모델 · 시작 이미지와 함께', P.move)}
    ${pc('⑥ 모션 타이포', '영상 모델 · 글만으로', P.typo)}
  </div>${take('공통 규칙: <b>무엇 · 어떻게 · 어디서 · 그림체</b>를 적고, 끝에 <b>비율</b>과 <b>넣지 말 것</b>(글자·로고·사람)을 붙여요. 프롬프트는 모두 한국어 그대로 넣었어요.')}</div>`;
});

// ── 19 요약
slide('이럴 땐 이 모델', '정리', '', () => {
  const it = (q, a, c, w) => `<div class="it"><div class="q">${q}</div><div class="a">${a}<small>${c}</small></div><div class="w">${w}</div></div>`;
  return `${head('정리')}<h2>이럴 땐 <em>이 모델</em></h2><div class="body"><div class="sum">
    <div class="col"><h3>동화책 삽화</h3>
      ${it('기본으로 하나만 고른다면', 'GPT Image 2.6', '0.75', '지시를 빠짐없이 따르고, 그림체를 바꿔도 구도가 유지돼요.')}
      ${it('손그림 질감이 중요하면', 'Nano Banana Pro', '2', '종이 여백과 물감 번짐까지 그려요. 한글 문구도 정확해요.')}
      ${it('연습용으로 많이 뽑을 땐', 'GPT Image 2.5', '0.25', '품질은 2.6에 가깝고 값은 3분의 1이에요.')}
      ${it('피할 것', 'Seedream · Soul', '', '유명 작품은 Seedream이 거부해요. Soul은 실사용이에요.')}</div>
    <div class="col"><h3>졸업식 인트로</h3>
      ${it('사진을 지키며 움직이려면', 'Gemini Omni Flash 1.2', '11.25', '카메라 지시를 가장 크게 따르고 칠판 글자를 지켰어요.')}
      ${it('여러 장면을 싸게 뽑으려면', 'Seedance 2.0 Mini', '5', '7배 비싼 2.5와 움직임이 비슷했어요.')}
      ${it('강당 큰 화면에 틀 거면', 'Kling 4.0', '18.75', '기본 1080p. 움직임은 작지만 가장 선명해요.')}
      ${it('장면을 통째로 맡길 땐', 'Cinema Studio 4.0', '35', '글만으로 영화 같은 인트로 화면을 만들어요.')}</div>
    <div class="col"><h3>모션 타이포</h3>
      ${it('굵고 강한 구호', 'Kling 4.0', '18.75', '가장 크고 굵게, 1080p로 또렷해요.')}
      ${it('화면을 꽉 채우는 마무리', 'Wan 3.0', '7.5', '"화면을 가득" 지시를 가장 잘 따랐어요.')}
      ${it('역동적인 전환', 'Veo 3.1', '16', '글자가 휘고 기울며 날아들어요. 길이는 4초.')}
      ${it('정해진 디자인이 있을 땐', '시작·끝 장면 넣기', '+4', '이미지 모델로 두 장을 만들어 영상에 넣으면 글꼴까지 맞아요.')}</div>
  </div></div>`;
});

// ── 자료 내려받기
slide('자료 내려받기', '정리', '', () => {
  const v = (it, t, d, size) => `<div class="dlcard"><button class="card" data-i="${reg(it)}">${media(it)}</button><div class="txt"><h3>${t}</h3><p>${d}</p><div class="row">${dlBtn(it, '내려받기')}<span class="meta">${size}</span></div></div></div>`;
  return `${head('정리', '', '', '<span class="chip">수업과 학교 행사용</span>')}<h2>자료 <em>내려받기</em></h2><div class="body"><div class="dlgrid">
    ${v(minFinal(), '1분 졸업 축하 영상', '그림책 20초 + 콜라주 20초 + 마무리 20초', 'mp4 · 60초 · 720p')}
    ${v(layFinal(), '콜라주 버전 20초', '종이비행기를 타고 별까지', 'mp4 · 20초 · 720p')}
    ${v(bookFinal(), '그림책 버전 20초', '수채화로 그린 졸업식', 'mp4 · 20초 · 720p')}
    <div class="dlcard wide"><div class="txt"><h3>졸업 영상 묶음</h3><p>영상 3편과 콘티 그림 16장을 한 번에.</p><div class="row"><a class="btn primary" href="${A}dl/graduation-pack.zip" download="어린왕자-졸업영상-묶음.zip">묶음 내려받기</a><span class="meta">zip · 47MB</span></div></div></div>
    <div class="dlcard wide"><div class="txt"><h3>프롬프트 전체</h3><p>이 샘플러에 실제로 넣은 프롬프트를 글 파일 하나로.</p><div class="row"><button class="btn primary" data-dltxt>프롬프트 내려받기</button><span class="meta">txt</span></div></div></div>
    <div class="dlcard wide"><div class="txt"><h3>그림과 영상 하나씩</h3><p>어느 쪽에서든 그림이나 영상을 눌러 크게 연 뒤, 오른쪽의 <b>내려받기</b> 단추를 누르면 그 파일만 받을 수 있어요.</p></div></div>
  </div>${take('영상과 그림은 모두 이 샘플러를 위해 직접 생성한 것이에요. 수업과 학교 행사에서 쓰시도록 내려받기를 열어 두었어요.')}</div>`;
});

// ── 20 만든 기록
slide('만든 기록', '정리', '', () => {
  const L = [['이미지 67장', 81], ['타이포 영상 12편', 182], ['졸업식 영상 11편', 157], ['인트로 컨셉 4편', 140], ['시작·끝 장면 영상 4편', 72.5], ['이스터에그 20초 영상 3편', 420]];
  const line = ([n, v]) => `<div class="line"><span>${n}</span><i><u style="width:${v / 420 * 100}%"></u></i><b>${v}</b></div>`;
  return `${head('정리', '', '', '<span class="chip">2026. 11. 21. 직접 생성</span>')}<h2>이 샘플러를 <em>만든 기록</em></h2><div class="body"><div class="ledger">
    <div class="box"><h3>쓴 크레딧</h3><div class="total">1,053<small>크레딧 · 이미지 67장과 영상 34편</small></div>${L.map(line).join('')}
      <p style="margin-top:18px;font-size:13px;line-height:20px;color:var(--text-2)">영상이 전체의 92%예요. 이미지는 67장을 만들어도 81 크레딧이라 마음껏 여러 번 뽑아도 돼요. 거부되거나 막힌 생성 15건은 모두 환불됐어요.</p></div>
    <div class="box"><h3>만들면서 알게 된 것</h3><ul>
      <li><b>유명 작품은 모델에 따라 거부돼요.</b> <span>Seedream 5.5와 5.0 Pro는 책 제목을 빼도 『어린 왕자』 장면을 거부했어요.</span></li>
      <li><b>저작권 오탐도 있어요.</b> <span>빈 교실 사진(Seedance 2.5 Flash)과 학교 항공 장면(Cinema Studio 4.0)이 한 번씩 막혔어요. 문구를 바꾸거나 모델을 바꾸면 돼요.</span></li>
      <li><b>거부되면 크레딧은 돌아와요.</b> <span>실패가 무서워 못 넣을 이유는 없어요.</span></li>
      <li><b>영상 모델이 영어 글자를 정확히 써요.</b> <span>12종 모두 세 낱말 철자가 맞았어요. 한글 글자는 이미지 모델로 먼저 만들어 시작 장면으로 넣었어요.</span></li>
      <li><b>모든 결과는 한 번씩만 뽑았어요.</b> <span>다시 뽑으면 달라질 수 있으니, 경향을 보는 자료로 써 주세요. 개인이 수업용으로 만든 자료이며 힉스필드 공식 자료가 아니에요.</span></li>
    </ul></div></div></div>`;
});

// ── 화면에 올리기
const stage = $('#stage');
// 그림은 그 쪽에 들어갈 때(앞뒤 한 쪽 포함) 불러온다
// 쪽 수와 쪽 범위는 슬라이드를 다 만든 뒤에 채운다 (쪽이 늘어도 번호가 맞도록)
const firstOf = k => slides.findIndex(s => s.title.startsWith(k)) + 1;
const rangeOf = g => { const ix = slides.map((s, i) => (s.group === g ? i + 1 : 0)).filter(Boolean); return `${ix[0]}–${ix[ix.length - 1]}`; };
const fill = h => h.replace(/\{\{n\}\}/g, slides.length).replace(/\{\{r:(.+?)\}\}/g, (_, g) => rangeOf(g));
stage.innerHTML = slides.map((s, n) => `<section class="slide ${s.cls}" data-n="${n + 1}">${fill(s.html).replace(/<img src="/g, '<img data-src="')}</section>`).join('') +
  `<div class="bar"></div><div class="foot"><span class="where"></span><span class="grow"></span><button class="nav" data-prev title="이전">◀</button><span class="num"></span><button class="nav" data-next title="다음">▶</button><button class="btn ghost" data-toc>목차</button><button class="btn ghost" data-full>전체 화면</button></div><div class="toast"></div>`;
const els = $$('.slide', stage);
let now = 0;

function fit() { document.documentElement.style.setProperty('--s', Math.min(innerWidth / 1600, innerHeight / 900)); }
addEventListener('resize', fit); fit();

function playVideos(root, on) {
  $$('video[data-src]', root).forEach(v => {
    if (on) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else { v.pause(); }
  });
}
function go(n, push = true) {
  n = Math.max(1, Math.min(slides.length, n));
  els.forEach((e, i) => {
    const on = i === n - 1; e.classList.toggle('active', on); playVideos(e, on);
    if (Math.abs(i - (n - 1)) <= 1) $$('img[data-src]', e).forEach(im => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
  });
  now = n;
  $('.foot .where').innerHTML = `${esc(slides[n - 1].group)} · <b>${slides[n - 1].title.replace(/<[^>]+>/g, '')}</b>`;
  $('.foot .num').textContent = `${n} / ${slides.length}`;
  $('.bar').style.width = `${n / slides.length * 100}%`;
  if (push && location.hash !== `#${n}`) history.replaceState(null, '', `#${n}`);
}

// 크게 보기
const lb = $('#lightbox');
let lbItems = [], lbAt = 0;
function showItem() {
  const it = lbItems[lbAt];
  const view = it.refused ? `<div class="refused"><b>거부됨</b>${esc(it.refused)}</div>`
    : it.kind === 'vid' ? `<video src="${it.src}" controls autoplay loop playsinline></video>` : `<img src="${it.src}" alt="">`;
  prompts.lbCopy = it.prompt || '';
  lb.innerHTML = `<div class="lb"><div class="view">${view}${lbItems.length > 1 ? `<span class="chip count">${lbAt + 1} / ${lbItems.length}</span><button class="step prev" data-step="-1">◀</button><button class="step next" data-step="1">▶</button>` : ''}</div>
    <div class="info"><button class="x" data-close title="닫기">✕</button><div class="by">${esc(it.by || '')}</div><h3>${esc(it.name)}</h3>
    <div class="chips">${it.pick ? '<span class="chip on">추천</span>' : ''}${(it.chips || []).map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>
    ${it.refused ? '' : `<div>${dlBtn(it, it.kind === 'vid' ? '영상 내려받기' : '그림 내려받기', 'ghost')}</div>`}${it.note ? `<div class="note">${esc(it.note)}</div>` : ''}${it.use ? `<div class="use">→ ${esc(it.use)}</div>` : ''}
    ${it.prompt ? `<div class="ptitle"><span>넣은 프롬프트</span><span class="grow"></span><button class="btn primary" data-copy="lb">복사</button></div><pre>${esc(it.prompt)}</pre>` : ''}</div></div>`;
}
function openItems(items, at) { lbItems = items; lbAt = at; playVideos(els[now - 1], false); lb.hidden = false; showItem(); }
function openPrompt(p) { playVideos(els[now - 1], false); prompts.lbCopy = p.text; lb.hidden = false; lbItems = [];
  lb.innerHTML = `<div class="lb only"><div class="info"><button class="x" data-close title="닫기">✕</button><h3 style="font-size:24px;line-height:32px;text-transform:none">${esc(p.title || '프롬프트')}</h3><div class="ptitle"><span>그대로 복사해서 쓰세요</span><span class="grow"></span><button class="btn primary" data-copy="lb">복사</button></div><pre>${esc(p.text)}</pre></div></div>`; }
function closeLb() { lb.hidden = true; lb.innerHTML = ''; playVideos(els[now - 1], true); }

// 목차
const toc = $('#toc');
function openToc() { toc.hidden = false; toc.innerHTML = `<div class="tocbox"><button class="x lbx" data-toc-close style="position:absolute;right:18px;top:18px;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.08)">✕</button><h3>목차</h3><div class="tocgrid">${slides.map((s, i) => `<button data-go="${i + 1}" class="${i + 1 === now ? 'now' : ''}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${s.title.replace(/<[^>]+>/g, '')}</span><span class="g">${esc(s.group)}</span></button>`).join('')}</div></div>`; }
function closeToc() { toc.hidden = true; toc.innerHTML = ''; }

// 프롬프트 전체를 글 파일로 내려받기
function promptsText() {
  const sec = (t, body) => `■ ${t}\n${body}\n`;
  const shots = (t, list, first = 1) => list.map((s, n) => sec(`${t} · 장면 ${n + first} (${s.t}) ${s.name}`, s.prompt)).join('\n');
  return [
    '힉스필드 모델 샘플러 · 실제로 넣은 프롬프트 (2026. 11. 21.)\n',
    '【1부 동화책 삽화】',
    sec('모델 비교 (이미지 모델 16종에 똑같이)', P.img),
    sec('그림체만 바꾸기 (예: 한국 민화)', P.style(5)),
    sec('같은 주인공으로 다음 쪽 (1쪽을 참고 이미지로 첨부)', P.pageRef(1)),
    '【2부 졸업식 인트로】',
    sec('시작 이미지', P.start),
    sec('움직임 한 줄 (영상 모델 12종에 똑같이)', P.move),
    ...P.k.map((p, n) => sec(`인트로 컨셉 ${n + 1}`, p)),
    '【이스터에그 · 어린 왕자의 졸업식】',
    shots('그림책 버전 콘티', EGG_BOOK_SHOTS),
    sec('그림책 버전 영상 (Seedance 2.5 · 20초)', P.eggBook),
    shots('콜라주 버전 콘티', EGG_SHOTS),
    sec('콜라주 버전 영상 (Seedance 2.5 · 20초)', P.eggVideo),
    shots('마무리 구간 콘티', EGG_EXT_SHOTS.slice(4), 9),
    sec('1분 영상의 마무리 구간 (40~60초)', P.seg3),
    '【3부 모션 타이포】',
    sec('글만으로 (영상 모델 12종에 똑같이)', P.typo),
    sec('시작 장면 이미지', P.startImg),
    sec('끝 장면 이미지', P.endImg),
    sec('시작·끝 장면과 함께 넣은 움직임', P.se),
  ].join('\n');
}
function downloadText(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + text.replace(/\n/g, '\r\n')], { type: 'text/plain;charset=utf-8' }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('내려받았어요');
}
function toast(t) { const el = $('.toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 1400); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e2) {} ta.remove(); }
  toast('복사했어요');
}

document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-dltxt],[data-copy],[data-p],[data-i],[data-go],[data-toc],[data-toc-close],[data-prev],[data-next],[data-full],[data-close],[data-step]');
  if (!t) { if (ev.target === lb || ev.target === toc) { closeLb(); closeToc(); } return; }
  if (t.dataset.dltxt !== undefined) return downloadText('힉스필드샘플러_프롬프트.txt', promptsText());
  if (t.dataset.copy !== undefined) return copy(t.dataset.copy === 'lb' ? prompts.lbCopy : prompts[+t.dataset.copy].text);
  if (t.dataset.p !== undefined) return openPrompt(prompts[+t.dataset.p]);
  if (t.dataset.i !== undefined) return openItems(slides[now - 1].items, +t.dataset.i);
  if (t.dataset.go !== undefined) { closeToc(); closeLb(); const g = t.dataset.go; return go(/^\d+$/.test(g) ? +g : firstOf(g)); }
  if (t.dataset.tocClose !== undefined) return closeToc();
  if (t.dataset.toc !== undefined) return openToc();
  if (t.dataset.prev !== undefined) return go(now - 1);
  if (t.dataset.next !== undefined) return go(now + 1);
  if (t.dataset.close !== undefined) return closeLb();
  if (t.dataset.step !== undefined) { lbAt = (lbAt + +t.dataset.step + lbItems.length) % lbItems.length; return showItem(); }
  if (t.dataset.full !== undefined) { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});
addEventListener('keydown', ev => {
  if (ev.target.matches && ev.target.matches('input,textarea')) return;
  const k = ev.key;
  if (!lb.hidden) {
    if (k === 'Escape') closeLb();
    else if (lbItems.length > 1 && (k === 'ArrowRight' || k === 'ArrowLeft')) { lbAt = (lbAt + (k === 'ArrowRight' ? 1 : -1) + lbItems.length) % lbItems.length; showItem(); }
    return;
  }
  if (!toc.hidden) { if (k === 'Escape') closeToc(); return; }
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { ev.preventDefault(); go(now + 1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { ev.preventDefault(); go(now - 1); }
  else if (k === 'Home') go(1); else if (k === 'End') go(slides.length);
  else if (k === 'f' || k === 'F') $('[data-full]').click();
});
addEventListener('hashchange', () => go(parseInt(location.hash.slice(1)) || 1, false));
go(parseInt(location.hash.slice(1)) || 1, false);
