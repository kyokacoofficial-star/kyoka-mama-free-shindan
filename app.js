const TYPES = {
  wait: { symbol: "待", name: "待てるか", subtitle: "誰かがもたついた一瞬の、体の動き", preview: "あんたが次に見るんは、優しい言葉やない　誰かが遅れたり、間違えたりした時、その人が一歩下がって待てるかや　思い通りにならん一瞬に、よう出るからな", keyword: "待てるか" },
  unseen: { symbol: "裏", name: "見てへん時", subtitle: "あんたが見てへんと思てる時の顔と言い方", preview: "目の前であんたに優しいかより、得する相手がおらん時にどう振る舞うかを見てな　店員さんへの言い方や、誰かが席を立ったあとの顔に出ることがあるで", keyword: "見てへん時" },
  reply: { symbol: "返", name: "都合の悪い話への返事", subtitle: "断りにくい話に、いつどう返すか", preview: "楽しい話への返事やないで　頼みを断る時、約束を変える時、言いにくい話から逃げずに返してくるかを見るんや　返事の中身より、溜め方に出ることがある", keyword: "都合の悪い返事" },
  leave: { symbol: "引", name: "引き方", subtitle: "帰り際と、話を終える時のふるまい", preview: "近づき方より、引き方を見てな　帰る時間を尊重できるか、話を終えたあとに追いかけてこんか　長う付き合える人かは、別れ際に出ることがあるで", keyword: "引き方" }
};

const QUESTIONS = [
  { q: "その人のことで、いちばん引っかかってるんは？", a: [["あたしのペースを待ってくれへん","wait"],["人によって顔や言い方が変わる","unseen"],["大事な話ほど返事が遅い","reply"],["帰りたい時に帰らせてくれへん","leave"]] },
  { q: "夜に何回も思い返してまう場面は？", a: [["急かされた時の顔や声","wait"],["誰かへの態度が急に変わった時","unseen"],["返事を待ち続けた時間","reply"],["話を終わらせられへんかった時","leave"]] },
  { q: "その人とおる時、体に出やすいんは？", a: [["失敗せんよう急いでしまう","wait"],["誰がおるかを気にしてしまう","unseen"],["スマホを何回も見てしまう","reply"],["帰る時間が近づくと重うなる","leave"]] },
  { q: "その人が、他の誰かにしてることで気になるんは？", a: [["もたつく人を急かす","wait"],["相手がおらん所で言い方が変わる","unseen"],["都合の悪い話を流す","reply"],["相手が終わりたい合図を無視する","leave"]] },
  { q: "あんたが一度だけ確かめたいんは？", a: [["考える時間をくれるか","wait"],["見返りのない相手にも同じ態度か","unseen"],["言いにくい話にも返事するか","reply"],["あんたの『ここまで』を守るか","leave"]] },
  { q: "その人との間で、まだ見られてへん場面は？", a: [["予定が狂った時の反応","wait"],["あんたがおらん時の振る舞い","unseen"],["断らなあかん話への返事","reply"],["会話や時間を切り上げる瞬間","leave"]] },
  { q: "次に会う時、一個だけ見るなら？", a: [["誰かが遅れた時に待てるか","wait"],["店員さんへの言い方","unseen"],["都合の悪い話にいつ返すか","reply"],["帰り際がきれいか","leave"]] },
  { q: "今のあんたが、いちばん取り戻したいんは？", a: [["自分のペース","wait"],["人を信じる感覚","unseen"],["返事を待たん時間","reply"],["自分で終わりを決める感覚","leave"]] }
];

const screens = { start: document.querySelector("#start"), quiz: document.querySelector("#quiz"), result: document.querySelector("#result") };
const state = { index: 0, answers: [] };

function showScreen(name){ Object.entries(screens).forEach(([key,el]) => el.classList.toggle("is-active", key === name)); window.scrollTo({top:0,behavior:"smooth"}); }
function renderQuestion(){
  const current = QUESTIONS[state.index];
  document.querySelector("#question-number").textContent = state.index + 1;
  document.querySelector("#question-label").textContent = `QUESTION ${String(state.index + 1).padStart(2,"0")}`;
  document.querySelector("#question-title").textContent = current.q;
  document.querySelector(".progress").setAttribute("aria-valuenow", state.index + 1);
  document.querySelector("#progress-bar").style.width = `${((state.index + 1) / QUESTIONS.length) * 100}%`;
  document.querySelector("#back-button").style.visibility = state.index === 0 ? "hidden" : "visible";
  const box = document.querySelector("#options"); box.replaceChildren();
  current.a.forEach(([label,type],i) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "option";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65+i)}</span><span class="option-text"></span>`;
    button.querySelector(".option-text").textContent = label;
    button.addEventListener("click", () => choose(type)); box.append(button);
  });
}
function choose(type){ state.answers[state.index] = type; if(state.index < QUESTIONS.length - 1){ state.index += 1; renderQuestion(); } else { renderResult(); } }
function renderResult(){
  const scores = Object.fromEntries(Object.keys(TYPES).map(k => [k,0])); state.answers.forEach(k => scores[k]++);
  const order = ["wait","unseen","reply","leave"];
  const winner = order.reduce((best,k) => scores[k] > scores[best] ? k : best, state.answers[0] || order[0]);
  const data = TYPES[winner];
  document.querySelector("#result-symbol").textContent = data.symbol;
  document.querySelector("#result-title").textContent = data.name;
  document.querySelector("#result-subtitle").textContent = data.subtitle;
  document.querySelector("#result-preview").textContent = data.preview;
  document.querySelector("#result-keyword").textContent = data.keyword;
  document.querySelector("#copy-keyword").dataset.keyword = data.keyword;
  showScreen("result");
}
document.querySelector("#start-button").addEventListener("click", () => { state.index = 0; state.answers = []; renderQuestion(); showScreen("quiz"); });
document.querySelector("#back-button").addEventListener("click", () => { if(state.index > 0){ state.index -= 1; renderQuestion(); } });
document.querySelector("#retry-button").addEventListener("click", () => { state.index = 0; state.answers = []; showScreen("start"); });
document.querySelector("#copy-keyword").addEventListener("click", async e => {
  try { await navigator.clipboard.writeText(e.currentTarget.dataset.keyword); document.querySelector("#copy-status").textContent = "コピーしました"; }
  catch { document.querySelector("#copy-status").textContent = `LINEで「${e.currentTarget.dataset.keyword}」と送ってください`; }
});

if (navigator.modelContext?.registerTool) {
  navigator.modelContext.registerTool({name:"start_kyoka_diagnosis",description:"鏡花ママの無料診断を開始します",inputSchema:{type:"object",properties:{}}},async()=>{state.index=0;state.answers=[];renderQuestion();showScreen("quiz");return{content:[{type:"text",text:"診断を開始しました"}]}});
}
