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
    : `<img src="${it.src}" alt="${esc(it.name)}" loading="lazy">`;
  return `<div class="media">${it.pick ? '<span class="tag">추천</span>' : ''}${it.tag ? `<span class="tag dark">${esc(it.tag)}</span>` : ''}${inner}<span class="zoom">크게 보기</span></div>`;
}
const plain = (it, cls = '', extra = '') => { const i = reg(it); return `<button class="card ${cls} ${it.pick ? 'pick' : ''}" data-i="${i}">${media(it)}${extra}</button>`; };

const prompts = [];
const pbtn = (title, text, label = '프롬프트 보기') => { prompts.push({ title, text }); return `<button class="btn ghost" data-p="${prompts.length - 1}">${label}</button>`; };
const copyBtn = (text, label = '복사') => { prompts.push({ title: '', text }); return `<button class="btn primary" data-copy="${prompts.length - 1}">${label}</button>`; };
const head = (part, fixed, changed, right = '') => `<div class="head"><span class="pill">${part}</span>${fixed ? `<span class="chip">고정 · ${fixed}</span>` : ''}${changed ? `<span class="chip on">바꾼 것 · ${changed}</span>` : ''}<span class="grow"></span>${right}</div>`;
const take = html => `<div class="take"><span>${html}</span></div>`;

// ── 1 표지
slide('표지', '시작', 'cover', () => {
  const a = { kind: 'img', src: `${A}p1/m07-nanopro.jpg`, name: '동화책 삽화' };
  const b = { kind: 'vid', src: `${A}p2/g08-omni12.mp4`, name: '졸업식 인트로' };
  const c = { kind: 'vid', src: `${A}p3/t04-kling40.mp4`, name: '모션 타이포' };
  const tile = (it, go, k, t) => `<button class="card" data-go="${go}">${media(it)}<span class="cap">${t}<small>${k}</small></span></button>`;
  return `<div class="wrap"><div>
    <span class="pill">힉스필드 모델 샘플러 <b>20장</b></span>
    <h1 style="margin-top:22px">같은 조건,<br><em>다른 모델</em></h1>
    <p class="sub">프롬프트는 그대로 두고 <b>모델만 바꿔</b> 나란히 놓았어요. 동화책 삽화, 졸업식 인트로, 모션 타이포 세 가지를 이미지 모델 16종과 영상 모델 12종으로 직접 만들어 봤어요.</p>
    <div class="cta"><button class="btn primary big" data-go="2">샘플러 보기</button><button class="btn ghost" style="height:40px" data-toc>목차</button><span class="chip">2026. 11. 21. 직접 생성</span></div>
  </div><div class="tiles">${tile(a, 3, '1부 · 이미지 모델 16종', '동화책 삽화')}${tile(b, 9, '2부 · 영상 모델 12종', '졸업식 인트로')}${tile(c, 14, '3부 · 영상 모델 12종', '모션 타이포')}</div></div>`;
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
    ${j(3, `${A}p1/m04-gpt26.jpg`, 'img', '1부 · 3–8쪽', '동화책 삽화', '어린 왕자 한 장면을 이미지 모델 16종, 그림체 8종, 이어지는 4쪽으로.')}
    ${j(9, `${A}p2/start-nano.jpg`, 'img', '2부 · 9–13쪽', '졸업식 인트로', '칠판 사진 한 장을 영상 모델 12종으로 움직이고, 인트로 컨셉 4가지를 더했어요.')}
    ${j(14, `${A}p3/end-ideogram.jpg`, 'img', '3부 · 14–17쪽', '모션 타이포', '교권 보호 문구가 움직이는 영상을 12종으로. 글자를 정확히 맞추는 방법까지.')}
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

// ── 14 3부 표지
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
  return `${head('정리', '', '', '<span class="chip">글을 누르면 전체가 열려요</span>')}<h2>바로 쓰는 <em>프롬프트</em> 6개</h2><div class="body"><div class="prompts">
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

// ── 20 만든 기록
slide('만든 기록', '정리', '', () => {
  const L = [['이미지 46장', 60], ['타이포 영상 12편', 182], ['졸업식 영상 11편', 157], ['인트로 컨셉 4편', 140], ['시작·끝 장면 영상 4편', 72.5]];
  const line = ([n, v]) => `<div class="line"><span>${n}</span><i><u style="width:${v / 182 * 100}%"></u></i><b>${v}</b></div>`;
  return `${head('정리', '', '', '<span class="chip">2026. 11. 21. 직접 생성</span>')}<h2>이 샘플러를 <em>만든 기록</em></h2><div class="body"><div class="ledger">
    <div class="box"><h3>쓴 크레딧</h3><div class="total">612<small>크레딧 · 이미지 46장과 영상 31편</small></div>${L.map(line).join('')}
      <p style="margin-top:18px;font-size:13px;line-height:20px;color:var(--text-2)">영상이 전체의 90%예요. 이미지는 46장을 만들어도 60 크레딧이라 마음껏 여러 번 뽑아도 돼요. 거부되거나 막힌 생성 7건은 모두 환불됐어요.</p></div>
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
stage.innerHTML = slides.map((s, n) => `<section class="slide ${s.cls}" data-n="${n + 1}">${s.html}</section>`).join('') +
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
  els.forEach((e, i) => { const on = i === n - 1; e.classList.toggle('active', on); playVideos(e, on); });
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
    ${it.note ? `<div class="note">${esc(it.note)}</div>` : ''}${it.use ? `<div class="use">→ ${esc(it.use)}</div>` : ''}
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

function toast(t) { const el = $('.toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 1400); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e2) {} ta.remove(); }
  toast('복사했어요');
}

document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-copy],[data-p],[data-i],[data-go],[data-toc],[data-toc-close],[data-prev],[data-next],[data-full],[data-close],[data-step]');
  if (!t) { if (ev.target === lb || ev.target === toc) { closeLb(); closeToc(); } return; }
  if (t.dataset.copy !== undefined) return copy(t.dataset.copy === 'lb' ? prompts.lbCopy : prompts[+t.dataset.copy].text);
  if (t.dataset.p !== undefined) return openPrompt(prompts[+t.dataset.p]);
  if (t.dataset.i !== undefined) return openItems(slides[now - 1].items, +t.dataset.i);
  if (t.dataset.go !== undefined) { closeToc(); closeLb(); return go(+t.dataset.go); }
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
