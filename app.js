// 休肝日ノート（試作品）
// 記録はこのスマホの中（localStorage）にだけ保存します。
//
// ご褒美の考え方：
//   飲まなかった日 → 大きなご褒美（ステージの中で紙吹雪・効果音・キャラが大喜び）
//   飲んだ日 → 責めずに、キャラがやさしく声をかけるだけ
//   連続記録が途切れても、何かを失うことはない
//
// ドット絵キャラ：img/sprites/<キャラID>/ に sprite.json と idle.png / run.png / happy.png / sit.png を
//   置くと、ホーム画面の上をキャラが動き回ります（tools/make-sprites.ps1 で作れます）。
//   スプライトがないキャラは、仮アイコンを表示します。

const KANZO_SVG =
  '<svg viewBox="0 0 100 100" aria-hidden="true">' +
  '<path d="M12 52 C8 28 40 20 62 26 C82 31 94 40 89 55 C85 68 62 72 46 79 C30 86 15 72 12 52Z" fill="#c45a40"/>' +
  '<path d="M22 44 C28 32 44 29 56 31" stroke="#e98a6f" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>' +
  '<circle cx="42" cy="48" r="5" fill="#2b1a14"/><circle cx="62" cy="48" r="5" fill="#2b1a14"/>' +
  '<circle cx="43.5" cy="46.5" r="1.6" fill="#fff"/><circle cx="63.5" cy="46.5" r="1.6" fill="#fff"/>' +
  '<path d="M44 59 Q52 66 60 59" stroke="#2b1a14" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
  '<circle cx="35" cy="57" r="4" fill="#ff9c8a" opacity=".8"/><circle cx="69" cy="57" r="4" fill="#ff9c8a" opacity=".8"/>' +
  '</svg>';

const CHARS = {
  kanzo: {
    name: "肝臓くん", role: "体の健康担当", icon: KANZO_SVG, color: "#ffb39e",
    catch: "沈黙の臓器、ついにしゃべる。",
    desc: "キミのお腹の右上で、年中無休・24時間営業。趣味は解毒、夢は有給休暇。最近の悩みは「脂肪がつきやすい体質」。",
    likes: "休肝日・しじみ汁", dislikes: "残業（＝深酒）",
    hello: "よろしくね！ボクの有給休暇、キミにかかってるよ！",
    greet: "今日はどうする？ボクを休ませてくれるとうれしいな。",
    chat: [
      "ボク、今日もせっせと働いてるよ。",
      "飲まない夜は、ボクの細胞がひと休みできるんだ。",
      "お水、こまめに飲んでる？",
      "記録はいつでも大丈夫。夜でも朝でもOKだよ。",
      "今日のごはん、なに食べた？",
      "ボクは文句を言わない臓器だけど、休みはうれしいんだ。",
    ],
  },
  zenimaru: {
    name: "ゼニ丸", role: "お金担当", icon: "🐷", color: "#ffc2d6",
    catch: "1円を笑う者は、ワイが笑う。",
    desc: "大阪出身、自称・敏腕ファイナンシャルブタ。キミの飲み代を電卓片手に24時間監視中。お腹の中身は見せられまへん。",
    likes: "黒字・特売シール", dislikes: "二次会・深夜タクシー",
    hello: "毎度！今日からあんさんの財布、わてが守りまっせ！",
    greet: "さて、今日の帳簿はどないなりますかな？",
    chat: [
      "わての電卓、今日も準備万端でっせ。",
      "コンビニの前、素通りできたら一勝ですわ。",
      "今月の黒字、どこまで伸ばせますかな？",
      "記録はつけたもん勝ち。帳簿は正直がいちばんや。",
      "浮いたお金で何買うか、考えるだけで楽しいでんな。",
      "毎度！今日もええ一日にしまひょ。",
    ],
  },
  hinata: {
    name: "ひなた", role: "睡眠担当", icon: "🌻", color: "#ffe680",
    catch: "先輩のこと、全力で推してます！",
    desc: "元気だけが取り柄の後輩。睡眠オタクで、寝る前の深呼吸を布教中。応援うちわを常に持ち歩いているらしい。",
    likes: "お昼寝・朝日・先輩", dislikes: "夜ふかし・寝不足の先輩",
    hello: "やったー！先輩の相棒、全力でがんばります！",
    greet: "先輩、今日はどうします？応援してますよ！",
    chat: [
      "先輩、今日もおつかれさまです！",
      "昨日はよく眠れました？",
      "夜はあったかいお茶もおすすめですよ〜。",
      "記録、いつでも待ってますね！",
      "寝る前のスマホは、ほどほどにですよ！",
      "えへへ、先輩と話せてうれしいです！",
    ],
  },
  mio: {
    name: "りん", role: "美容担当", icon: "🌙", color: "#c9c2ff",
    catch: "…別に、あなたのために言ってるんじゃないわ。",
    desc: "クールで毒舌、でも面倒見は最強のお姉さん。美肌の秘訣は早寝と水。あなたのむくみには、たぶん誰より先に気づく。",
    likes: "炭酸水・ハーブティー", dislikes: "むくみ・塩辛いおつまみ",
    hello: "…私を選ぶなんて、見る目あるじゃない。",
    greet: "今日はどうするの？…決めるのはあなたよ。",
    chat: [
      "…なに見てるのよ。",
      "炭酸水、冷やしておくといいわよ。",
      "早く寝るのが、いちばんの美容法なの。",
      "記録、忘れないようにね。…別に催促じゃないわ。",
      "今日も一日、おつかれさま。",
      "顔色、悪くないわね。その調子よ。",
    ],
  },
  aoi: {
    name: "そう", role: "体力担当", icon: "⚽", color: "#9fd8ff",
    catch: "休むのも、トレーニングのうちっす！",
    desc: "スポーツ万能の爽やか後輩。筋肉と肝臓、どっちも大事にしたい派。褒めるときは全力、落ち込んだときも全力で励ます。",
    likes: "朝ラン・鶏むね肉", dislikes: "二日酔いの朝",
    hello: "よろしくっす！一緒にベストコンディション目指しましょう！",
    greet: "今日の作戦、どうします？",
    chat: [
      "今日も一日、おつかれっした！",
      "体、ちょっと伸ばしてみません？気持ちいいっすよ。",
      "水分補給、大事っすよ！",
      "記録はいつでもOKっす。続けるのが勝ちっす！",
      "明日の朝、軽く散歩とかどうっすか？",
      "コンディション、いい感じっすか？",
    ],
  },
};

// ---- 保存まわり（使えない環境でも落ちないように） ----
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("kyukanbi." + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("kyukanbi." + key, JSON.stringify(value)); } catch (e) {}
  },
};

let SERIFU = {};
let records = store.get("records", {});           // { "2026-10-19": "kyukan" | "drank" }
let settings = Object.assign({ char: null, goal: 2, price: 1000, sound: true, scale: "std" }, store.get("settings", {}));
// 飲んだ日の量（任意）：{ "2026-10-19": "s" | "m" | "l" }  s＝ちょっと / m＝ふつう / l＝たくさん
let amounts = store.get("amounts", {});

// お酒の量の目安（1杯＝ビール中ジョッキ／350ml缶、アルコール約14g）。「控えめ」はおよそ半分
const AMOUNT_LABELS = { s: "ちょっと", m: "ふつう", l: "たくさん" };
const AMOUNT_GUIDE = {
  std: { name: "標準", s: "ビール2杯くらいまで", m: "ビール3〜4杯", l: "ビール5杯以上" },
  low: { name: "控えめ", s: "ビール1杯くらいまで", m: "ビール2杯くらい", l: "ビール3杯以上" },
};

// ---- ポイント（交換所で使う） ----
const POINTS_PER_RECORD = 1000;   // 1回記録するともらえるポイント（休肝日でも飲んだ日でも同じ）
// 「記録した当日と前日の分だけポイントをもらえる」ルール。
// テスト中は不具合を見つけやすいように切っておき、完成直前に true にする。
const POINTS_RECENT_ONLY = false;
let points = store.get("points", 0);
let awarded = store.get("awarded", null);          // { "2026-10-19": true }  ポイントをもらった日（1日1回だけ）
let owned = store.get("owned", ["bg:default"]);    // 交換したもの
let equip = Object.assign({ bg: "default", prop: null, pet: null }, store.get("equip", {}));
let todayMsg = store.get("todayMsg", null);
let calMonth = null;
let sheetDate = null;
const lastPicked = {};

// ---- 日付 ----
// 夜中の飲酒を前の日として数えるため、朝4時までは「前日」扱いにする
function logicalToday() {
  const d = new Date(Date.now() - 4 * 3600 * 1000);
  d.setHours(0, 0, 0, 0);
  return d;
}
function dateKey(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function weekStart(d) {               // 月曜はじまり
  const s = new Date(d);
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
  return s;
}
const WD = ["日", "月", "火", "水", "木", "金", "土"];
function labelOf(d) { return (d.getMonth() + 1) + "月" + d.getDate() + "日（" + WD[d.getDay()] + "）"; }

// ---- 集計 ----
function countBetween(from, to, status) {
  let n = 0;
  const d = new Date(from);
  while (d <= to) {
    if (records[dateKey(d)] === status) n++;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

function compute() {
  const today = logicalToday();
  const tk = dateKey(today);

  // 今日まだ記録していなければ、昨日までの連続で数える
  let streak = 0;
  const d = new Date(today);
  if (!records[tk]) d.setDate(d.getDate() - 1);
  while (records[dateKey(d)]) { streak++; d.setDate(d.getDate() - 1); }

  return {
    streak,
    weekKyu: countBetween(weekStart(today), today, "kyukan"),
    monthKyu: countBetween(new Date(today.getFullYear(), today.getMonth(), 1), today, "kyukan"),
  };
}

// ---- セリフ ----
function pickLine(charId, status) {
  const list = (SERIFU[charId] && SERIFU[charId][status]) || [];
  if (!list.length) return status === "kyukan" ? "飲まなかったね、えらい！" : "記録してくれてありがとう！";
  const k = charId + status;
  let i;
  do { i = Math.floor(Math.random() * list.length); } while (list.length > 1 && i === lastPicked[k]);
  lastPicked[k] = i;
  return list[i];
}

// ---- ドット絵の背景（時間帯で 朝・昼・夕方・夜 に変わる） ----
const PX = 4;        // 背景の1ドット = 画面の4px
const GROUND = 9;    // 地面の高さ（ドット）。キャラはこの上に立つ
const SCENES = {
  morning: { sky: ["#7cc8ff", "#b9e6ff", "#ffe7b0"], far: "#86bfa8", near: "#58a476", grass: "#79d06b", grassHi: "#a6e88a",
             dirt: "#9a6a44", dirtLo: "#7a5034", trunk: "#7a4a2c", leaf: "#3f9a55", leafHi: "#6cc46a", house: "#e8d9c0", roof: "#c4564a",
             window: "#7aa0c8", cloud: "#ffffff", body: "sun", bodyColor: "#fff3a6", bodyY: 0.55 },
  day:     { sky: ["#3f9cff", "#74bdff", "#c4e8ff"], far: "#78b39c", near: "#4c9a6a", grass: "#6cc66a", grassHi: "#9ee283",
             dirt: "#8f5f3d", dirtLo: "#6f472d", trunk: "#734528", leaf: "#368f4c", leafHi: "#62bd62", house: "#f2e6d0", roof: "#d0604f",
             window: "#7aa0c8", cloud: "#ffffff", body: "sun", bodyColor: "#fff7c2", bodyY: 0.22 },
  evening: { sky: ["#3a2a6e", "#c4507a", "#ffb062"], far: "#6c3f6e", near: "#4b2f5c", grass: "#5d8a4e", grassHi: "#86ad62",
             dirt: "#6b4433", dirtLo: "#523326", trunk: "#4e2f22", leaf: "#2f5b40", leafHi: "#4c7f52", house: "#7a5a72", roof: "#5a3550",
             window: "#ffd66b", cloud: "#ffc9a8", body: "sun", bodyColor: "#ffd27a", bodyY: 0.72 },
  night:   { sky: ["#0b0a2a", "#1f1756", "#3a2a7a"], far: "#2a2458", near: "#1d1a44", grass: "#2f5d4c", grassHi: "#46806a",
             dirt: "#3d2c3e", dirtLo: "#2c2030", trunk: "#2e2030", leaf: "#1f3f3a", leafHi: "#2f5d52", house: "#2c2650", roof: "#211c3e",
             window: "#ffd66b", cloud: "#4a3f80", body: "moon", bodyColor: "#fff6d6", bodyY: 0.22, stars: true },
};

function periodNow() {
  const h = new Date().getHours();
  if (h >= 5 && h < 10) return "morning";
  if (h >= 10 && h < 16) return "day";
  if (h >= 16 && h < 19) return "evening";
  return "night";
}
function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
function mix(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }
function rgb(c) { return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; }
function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

const scene = { key: "", ctx: null, bg: null, cols: 0, rows: 0, ground: 0, period: "day", theme: "default",
                clouds: [], stars: [], parts: [], shoot: null, nextShoot: 0, flakes: [], fireworks: [], nextFirework: 0, pet: null };

// 夜に固定される背景（夜景・オーロラ・月面・花火）
const NIGHT_THEMES = ["fireworks", "city", "aurora", "moon"];

function disc(c, cx, cy, r, color) {
  c.fillStyle = color;
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    if (x * x + y * y <= r * r + r * 0.6) c.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
  }
}
function lighten(color, t) { return rgb(mix(hex(color), [255, 255, 255], t)); }

// 背景のテーマ（交換所で手に入る）。色をテーマに合わせて少し変える
function themedPalette(period, theme) {
  const P = Object.assign({}, SCENES[period]);
  const night = period === "night";
  if (theme === "sakura") {
    P.leaf = night ? "#a8607e" : "#f29bbd";
    P.leafHi = night ? "#c98aa3" : "#ffd0e0";
  } else if (theme === "momiji") {
    P.leaf = night ? "#8a3a2a" : "#e2572b";
    P.leafHi = night ? "#a8603a" : "#f59a3c";
    P.far = night ? "#4a2a40" : period === "evening" ? "#8a4a5a" : "#d08a5a";
    P.near = night ? "#3a2236" : period === "evening" ? "#6e3a4a" : "#b8603a";
  } else if (theme === "snow") {
    P.grass = night ? "#c9d3ea" : "#eef3fb";
    P.grassHi = night ? "#e2e8f6" : "#ffffff";
    P.dirt = night ? "#9aa6c4" : "#d9e2f0";
    P.dirtLo = night ? "#8592b2" : "#c4cfe2";
    P.far = lighten(P.far, night ? 0.25 : 0.55);
    P.near = lighten(P.near, night ? 0.3 : 0.6);
  } else if (theme === "beach") {
    P.grass = night ? "#8a7a62" : "#f2d9a0";
    P.grassHi = night ? "#a39278" : "#fff0c4";
    P.dirt = night ? "#6e604c" : "#e3bf7c";
    P.dirtLo = night ? "#5c5040" : "#caa263";
    P.sea = night ? ["#1d2a66", "#28387a"] : period === "evening" ? ["#5a4a8e", "#7a5f9c"] : ["#2f8fd8", "#5fb3ee"];
  } else if (theme === "lake") {
    P.sea = night ? ["#1f3060", "#2a4078"] : period === "evening" ? ["#6a5a9a", "#8a72a8"] : ["#3aa0c8", "#7cc8e6"];
  } else if (theme === "city") {
    P.grass = "#4a4660"; P.grassHi = "#6a6584"; P.dirt = "#3a3650"; P.dirtLo = "#2e2a42";
  } else if (theme === "aurora") {
    P.sky = ["#05101e", "#0d2236", "#1a3448"];
    P.far = "#1c3040"; P.near = "#14242f";
    P.grass = "#c9d8e6"; P.grassHi = "#e6f0f8"; P.dirt = "#8fa2b6"; P.dirtLo = "#7a8ea2";
  } else if (theme === "castle") {   // 昼と朝は、少しピンクがかったやさしい空
    if (period === "day" || period === "morning") P.sky = ["#7aa8ff", "#b8ccff", "#ffd8ec"];
  } else if (theme === "moon") {
    P.sky = ["#020208", "#06061a", "#0e0e28"];
    P.grass = "#a7a3b4"; P.grassHi = "#c8c4d4"; P.dirt = "#8a8698"; P.dirtLo = "#6e6a7e";
  }
  return P;
}

// 背景の動かない部分（空・山や海・家・地面・木）を描く。サムネイル（交換所の見本）にも使う
function drawBackground(c, cols, rows, period, theme, rnd) {
  const P = themedPalette(period, theme), gt = rows - GROUND;

  // 空：グラデーションを、ドット絵らしく段々＋ちらし模様で
  const s0 = hex(P.sky[0]), s1 = hex(P.sky[1]), s2 = hex(P.sky[2]);
  const LV = 10, levels = [];
  for (let i = 0; i < LV; i++) { const t = i / (LV - 1); levels.push(rgb(t < 0.5 ? mix(s0, s1, t * 2) : mix(s1, s2, (t - 0.5) * 2))); }
  const bayer = [0.125, 0.625, 0.875, 0.375];
  for (let y = 0; y < gt; y++) {
    const v = (y / (gt - 1)) * (LV - 1), lo = Math.floor(v), fr = v - lo;
    for (let x = 0; x < cols; x++) {
      c.fillStyle = levels[Math.min(LV - 1, fr > bayer[(y & 1) * 2 + (x & 1)] ? lo + 1 : lo)];
      c.fillRect(x, y, 1, 1);
    }
  }

  // 太陽・月（月面では、空に地球）
  const bx = Math.round(cols * 0.8), by = Math.round(gt * P.bodyY);
  if (theme === "moon") {
    disc(c, bx, by, 6, "#2f6fd8");
    c.fillStyle = "#4caf50";
    [[-2, -2], [-1, -2], [-2, -1], [-1, -1], [0, -1], [2, 1], [3, 1], [2, 2], [1, 3], [-3, 2]].forEach(([dx, dy]) => c.fillRect(bx + dx, by + dy, 1, 1));
    c.fillStyle = "#ffffff"; c.fillRect(bx - 4, by + 1, 2, 1); c.fillRect(bx + 1, by - 4, 2, 1);
  } else {
    c.globalAlpha = P.body === "sun" ? 0.25 : 0.18; disc(c, bx, by, 8, P.bodyColor); c.globalAlpha = 1;
    disc(c, bx, by, 5, P.bodyColor);
    if (P.body === "moon") {
      c.fillStyle = "#e6dcb8";
      c.fillRect(bx - 2, by - 1, 2, 2); c.fillRect(bx + 2, by + 2, 1, 1); c.fillRect(bx + 1, by - 3, 1, 1);
    }
  }

  // 虹（雨上がりの空）
  if (theme === "rainbow") {
    const colors = ["#ff6b6b", "#ffa94d", "#ffe066", "#69db7c", "#4dabf7", "#9775fa"];
    const cx = Math.round(cols * 0.42), cy = gt + 4, r0 = Math.round(Math.min(cols * 0.42, gt * 0.95));
    c.globalAlpha = 0.75;
    colors.forEach((col, i) => {
      c.fillStyle = col;
      const r = r0 - i * 2;
      for (let x = -r; x <= r; x++) {
        const y = Math.round(Math.sqrt(Math.max(0, r * r - x * x)));
        c.fillRect(cx + x, cy - y, 1, 2);
      }
    });
    c.globalAlpha = 1;
  }

  const nearY = (x) => Math.round(gt - (5 + 3 * Math.sin(x * 0.11 + 2.5) + 1.5 * Math.sin(x * 0.29)));
  const drawHills = () => {
    for (let x = 0; x < cols; x++) {
      const far = Math.round(gt - (12 + 4 * Math.sin(x * 0.07 + 1) + 2 * Math.sin(x * 0.19)));
      c.fillStyle = P.far; c.fillRect(x, far, 1, gt - far);
    }
    for (let x = 0; x < cols; x++) { c.fillStyle = P.near; c.fillRect(x, nearY(x), 1, gt - nearY(x)); }
  };
  const drawHouses = () => {
    // 丘の上の小さな家（夜は窓に明かり、雪の日は屋根に雪）
    [[0.58, 0], [0.68, 1]].forEach(([fx, k]) => {
      const hx = Math.round(cols * fx), base = nearY(hx), hw = 6 + k, hh = 4;
      c.fillStyle = P.house; c.fillRect(hx, base - hh, hw, hh);
      c.fillStyle = P.roof;
      for (let i = 0; i < 3; i++) c.fillRect(hx - 1 + i, base - hh - 1 - i, hw + 2 - i * 2, 1);
      if (theme === "snow") { c.fillStyle = "#ffffff"; c.fillRect(hx, base - hh - 3, hw, 1); c.fillRect(hx - 1, base - hh - 1, 2, 1); }
      c.fillStyle = P.window; c.fillRect(hx + 1, base - hh + 1, 2, 2);
      if (k) c.fillRect(hx + 4, base - hh + 1, 2, 2);
    });
  };

  if (theme === "beach") {
    for (let y = gt - 9; y < gt; y++) { c.fillStyle = y < gt - 5 ? P.sea[0] : P.sea[1]; c.fillRect(0, y, cols, 1); }
  } else if (theme === "lake") {
    drawHills();
    for (let y = gt - 6; y < gt; y++) { c.fillStyle = y < gt - 3 ? P.sea[0] : P.sea[1]; c.fillRect(0, y, cols, 1); }
    // 小さなボート
    const bx2 = Math.round(cols * 0.6);
    c.fillStyle = "#8a5a2f"; c.fillRect(bx2, gt - 4, 6, 1); c.fillRect(bx2 + 1, gt - 3, 4, 1);
    c.fillStyle = "#ffffff"; c.fillRect(bx2 + 3, gt - 8, 1, 4); c.fillRect(bx2 + 1, gt - 7, 2, 2);
  } else if (theme === "city") {
    // ビルのシルエットと、明かりのついた窓
    let x = 0;
    while (x < cols) {
      const w = 5 + Math.floor(rnd() * 6), h = 8 + Math.floor(rnd() * Math.max(6, gt * 0.45));
      c.fillStyle = rnd() < 0.5 ? "#231e3e" : "#2c2650";
      c.fillRect(x, gt - h, w, h);
      for (let wy = gt - h + 2; wy < gt - 1; wy += 2) for (let wx = x + 1; wx < x + w - 1; wx += 2) {
        if (rnd() < 0.45) { c.fillStyle = rnd() < 0.8 ? "#ffd66b" : "#9fd8ff"; c.fillRect(wx, wy, 1, 1); }
      }
      x += w + (rnd() < 0.3 ? 1 : 0);
    }
  } else if (theme === "moon") {
    // 遠くのクレーターの丘
    for (let x2 = 0; x2 < cols; x2++) {
      const h = Math.round(3 + 2 * Math.sin(x2 * 0.09) + Math.sin(x2 * 0.31));
      c.fillStyle = "#6e6a7e"; c.fillRect(x2, gt - h, 1, h);
    }
  } else {
    drawHills();
    if (theme === "castle") drawCastle(c, Math.round(cols * 0.36), gt, gt >= 30 ? 1 : 0.5, period);
    else if (theme !== "aurora") drawHouses();
  }

  // 地面
  for (let x = 0; x < cols; x++) {
    c.fillStyle = P.grassHi; c.fillRect(x, gt, 1, 1);
    c.fillStyle = P.grass; c.fillRect(x, gt + 1, 1, 2);
    c.fillStyle = P.dirt; c.fillRect(x, gt + 3, 1, rows - gt - 3);
    if (rnd() < 0.18) { c.fillStyle = P.dirtLo; c.fillRect(x, gt + 4 + Math.floor(rnd() * (rows - gt - 5)), 1, 1); }
    if (rnd() < 0.25 && !["beach", "city", "moon"].includes(theme)) { c.fillStyle = P.grass; c.fillRect(x, gt - 1, 1, 1); }
    if (rnd() < 0.06) { c.fillStyle = P.grass; c.fillRect(x, gt + 3, 1, 1); }
  }
  if (theme === "city") {   // 道路の白線
    c.fillStyle = "#cfcbe0";
    for (let x = 2; x < cols; x += 6) c.fillRect(x, gt + 5, 3, 1);
  }
  if (theme === "moon") {   // クレーター
    for (let i = 0; i < cols / 12; i++) {
      const x = Math.floor(rnd() * cols), y = gt + 2 + Math.floor(rnd() * (rows - gt - 4));
      c.fillStyle = "#6e6a7e"; c.fillRect(x, y, 3, 1);
      c.fillStyle = "#c8c4d4"; c.fillRect(x, y + 1, 3, 1);
    }
  }
  if (theme === "rainbow") {   // 雨上がりの水たまり
    c.fillStyle = "#9fd8ff";
    for (let i = 0; i < 3; i++) c.fillRect(Math.floor(cols * (0.25 + i * 0.22)), gt + 4 + i % 2, 5, 1);
  }
  // 草花（夜以外。雪・海・街・月ではなし）
  if (period !== "night" && !["snow", "beach", "city", "moon"].includes(theme)) {
    const fl = ["#ff7aa8", "#ffe66b", "#ffffff", "#b48cff"];
    for (let i = 0; i < Math.round(cols / 14); i++) {
      c.fillStyle = fl[i % fl.length];
      c.fillRect(Math.floor(rnd() * cols), gt - 1, 1, 1);
    }
  }
  // ひまわり畑：地面に沿ってひまわりを並べる
  if (theme === "himawari") {
    for (let x = 18; x < cols - 4; x += 6 + Math.floor(rnd() * 3)) {
      const h = 4 + Math.floor(rnd() * 3);
      c.fillStyle = period === "night" ? "#2f5d3a" : "#3f9a55"; c.fillRect(x, gt - h, 1, h);
      c.fillRect(x + 1, gt - 2, 1, 1);
      c.fillStyle = period === "night" ? "#b8962e" : "#ffcc33";
      c.fillRect(x - 1, gt - h - 2, 3, 3);
      c.fillStyle = "#7a4a1f"; c.fillRect(x, gt - h - 1, 1, 1);
    }
  }

  // 左の木（海辺ではヤシの木、街と月面ではなし）
  if (theme === "beach") {
    c.fillStyle = P.trunk;
    for (let i = 0; i < 14; i++) c.fillRect(8 + Math.round(Math.sin(i / 5) * 2), gt - i, 2, 1);
    const tx = 10, ty = gt - 15;
    c.fillStyle = P.leaf;
    [[-6, 2], [-5, 1], [-4, 0], [-3, 0], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, 0], [3, 0], [4, 1], [5, 2], [6, 3],
     [-3, 1], [-4, 2], [3, 1], [4, 2], [0, 0], [-1, 0], [1, 0]].forEach(([dx, dy]) => c.fillRect(tx + dx, ty + dy, 1, 1));
    c.fillStyle = P.leafHi;
    [[-2, -1], [-1, -2], [0, -2], [1, -2], [2, -1]].forEach(([dx, dy]) => c.fillRect(tx + dx, ty + dy, 1, 1));
  } else if (theme !== "city" && theme !== "moon") {
    c.fillStyle = P.trunk; c.fillRect(7, gt - 11, 3, 11);
    disc(c, 8, gt - 16, 7, theme === "aurora" ? "#1f3a40" : P.leaf);
    c.fillStyle = theme === "snow" || theme === "aurora" ? "#ffffff" : P.leafHi;
    for (let y = -5; y <= 1; y++) for (let x = -5; x <= 1; x++) {
      if (x * x + y * y <= 12) c.fillRect(6 + x, gt - 17 + y, 1, 1);
    }
  }
  // 右の茂み（桜・紅葉では小さな木）
  if (theme === "sakura" || theme === "momiji") {
    c.fillStyle = P.trunk; c.fillRect(cols - 9, gt - 7, 2, 7);
    disc(c, cols - 8, gt - 10, 5, P.leaf);
    disc(c, cols - 9, gt - 11, 2, P.leafHi);
  } else if (!["beach", "city", "moon", "lake"].includes(theme)) {
    disc(c, cols - 8, gt, 4, theme === "aurora" ? "#1f3a40" : P.leaf);
    disc(c, cols - 11, gt, 3, theme === "snow" || theme === "aurora" ? "#ffffff" : P.leafHi);
  }
}

// おとぎの城：丘の上に、白い壁ととんがり屋根のお城（s：大きさ。見本では半分）
function drawCastle(c, cx, base, s, period) {
  const night = period === "night", dark = night || period === "evening";
  const wall = night ? "#b8b0d8" : "#f6f0ff", shade = night ? "#8f86b8" : "#d8cff0";
  const roofA = night ? "#4a3f9a" : "#7a6ae8", roofB = night ? "#9a4a7a" : "#ff8ac2";
  const win = dark ? "#ffd66b" : "#6a8ac8", gold = "#ffd54a";
  const n = (v) => Math.max(1, Math.round(v * s));
  const rect = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  // とんがり屋根と、てっぺんの旗
  const roof = (x, top, w, h, col) => {
    for (let i = 0; i < h; i++) {
      const ww = Math.max(1, Math.round((w + 2) * (1 - i / h)));
      rect(x + Math.floor((w - ww) / 2), top - 1 - i, ww, 1, col);
    }
    const px = x + Math.floor(w / 2);
    rect(px, top - h - n(3), 1, n(3), "#8a7a6a");
    rect(px + 1, top - h - n(3), n(2), 1, gold);
  };
  const tower = (x, w, h, col) => {
    const top = base - h;
    rect(x, top, w, h, wall);
    rect(x + w - 1, top, 1, h, shade);
    rect(x + Math.floor(w / 2), top + n(3), 1, n(2), win);
    roof(x, top, w, n(6), col);
  };
  const ww = n(24), wh = n(10), wx = cx - Math.floor(ww / 2);
  tower(wx - n(3), n(5), n(15), roofB);              // 左の塔
  tower(wx + ww - n(2), n(5), n(15), roofB);         // 右の塔
  // 城壁（上にギザギザ）
  rect(wx, base - wh, ww, wh, wall);
  rect(wx, base - wh, ww, 1, shade);
  for (let x = 0; x < ww; x += 2) rect(wx + x, base - wh - 1, 1, 1, wall);
  // 門と窓
  const gw = n(4);
  rect(cx - Math.floor(gw / 2), base - n(5), gw, n(5), "#6a4a3a");
  rect(cx - Math.floor(gw / 2) + 1, base - n(6), Math.max(1, gw - 2), 1, "#6a4a3a");
  for (let i = 0; i < 4; i++) rect(wx + n(3) + Math.round(i * (ww - n(6)) / 3), base - n(7), 1, n(2), win);
  // まん中の高い塔
  const kw = n(8), kh = n(19), kx = cx - Math.floor(kw / 2), ktop = base - kh;
  rect(kx, ktop, kw, kh - wh, wall);
  rect(kx + kw - 1, ktop, 1, kh - wh, shade);
  rect(kx + n(2), ktop + n(3), 1, n(2), win);
  rect(kx + kw - n(3), ktop + n(3), 1, n(2), win);
  roof(kx, ktop, kw, n(8), roofA);
}

// 背景の準備（大きさ・時間帯・テーマが変わったときだけ描き直す）
function buildScene() {
  const stage = $("stage");
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return false;
  const theme = equip.bg || "default";
  const period = NIGHT_THEMES.includes(theme) ? "night" : periodNow();
  const cols = Math.ceil(w / PX), rows = Math.ceil(h / PX);
  const key = cols + "x" + rows + period + theme;
  if (key === scene.key) return true;
  Object.assign(scene, { key, cols, rows, period, theme, ground: rows - GROUND, flakes: [], fireworks: [] });
  const rnd = seeded(cols * 7 + rows);
  const cv = $("scene");
  cv.width = cols; cv.height = rows;
  scene.ctx = cv.getContext("2d");
  const off = document.createElement("canvas");
  off.width = cols; off.height = rows;
  drawBackground(off.getContext("2d"), cols, rows, period, theme, rnd);
  scene.bg = off;

  const P = SCENES[period], gt = scene.ground;
  // 雲と星（動くもの）
  scene.clouds = ["city", "moon", "aurora"].includes(theme) ? [] : [0, 1, 2].map(() => ({
    x: rnd() * cols, y: 3 + Math.floor(rnd() * gt * 0.32), w: 9 + Math.floor(rnd() * 8), speed: 0.5 + rnd() * 0.9,
  }));
  scene.stars = P.stars
    ? Array.from({ length: Math.round(cols * (theme === "moon" ? 0.8 : 0.4)) }, () => ({
        x: Math.floor(rnd() * cols), y: Math.floor(rnd() * gt * (theme === "moon" ? 0.85 : 0.6)), sp: 0.8 + rnd() * 2, ph: rnd() * 6.3,
      }))
    : [];
  // 舞うもの：桜の花びら・紅葉・雪
  if (theme === "sakura" || theme === "snow" || theme === "momiji") {
    const n = theme === "snow" ? Math.round(cols * 0.45) : Math.round(cols * 0.15);
    const colors = theme === "snow" ? ["#ffffff"] : theme === "sakura" ? ["#ffc2d6", "#ffe0ea"] : ["#e2572b", "#f59a3c", "#ffcc33"];
    scene.flakes = Array.from({ length: n }, () => ({
      x: rnd() * cols, y: rnd() * rows, vy: theme === "snow" ? 4 + rnd() * 6 : 3 + rnd() * 3,
      vx: theme === "snow" ? -1 + rnd() * 2 : 3 + rnd() * 4, ph: rnd() * 6.3, c: colors[Math.floor(rnd() * colors.length)],
    }));
  }
  return true;
}

function drawCloud(c, x, y, w) {
  x = Math.round(x);
  c.fillRect(x, y, w, 3);
  c.fillRect(x + 2, y - 2, Math.round(w * 0.4), 2);
  c.fillRect(x + Math.round(w * 0.45), y - 3, Math.round(w * 0.35), 3);
  c.fillRect(x + 1, y + 3, w - 2, 1);
}

function drawScene(now, dt) {
  if (!buildScene()) return;
  const c = scene.ctx, P = SCENES[scene.period], t = now / 1000, theme = scene.theme;
  c.drawImage(scene.bg, 0, 0);

  // オーロラ：空の上のほうで、緑と紫の光のカーテンがゆらめく
  if (theme === "aurora") {
    for (let x = 0; x < scene.cols; x++) {
      const base = 6 + Math.sin(x * 0.12 + t * 0.6) * 3 + Math.sin(x * 0.05 - t * 0.3) * 4;
      const len = 5 + Math.round(3 + 3 * Math.sin(x * 0.2 + t));
      for (let i = 0; i < len; i++) {
        c.globalAlpha = 0.35 * (1 - i / len);
        c.fillStyle = i < len * 0.4 && Math.sin(x * 0.3 + t) > 0.3 ? "#b48cff" : "#5ef0a8";
        c.fillRect(x, Math.round(base + i), 1, 1);
      }
    }
    c.globalAlpha = 1;
  }

  // おとぎの城：空のあちこちで、金色のきらきらがまたたく
  if (theme === "castle") {
    const band = Math.max(4, Math.floor(scene.ground * 0.55));
    for (let i = 0; i < 14; i++) {
      const b = Math.sin(t * 1.6 + i * 1.9);
      if (b < 0.5) continue;
      const x = (i * 53 + 7) % scene.cols, y = 3 + ((i * 29) % band);
      c.fillStyle = i % 3 ? "#ffe680" : "#ffffff";
      c.fillRect(x, y, 1, 1);
      if (b > 0.85) {
        c.fillStyle = "rgba(255,230,128,.7)";
        c.fillRect(x - 1, y, 1, 1); c.fillRect(x + 1, y, 1, 1);
        c.fillRect(x, y - 1, 1, 1); c.fillRect(x, y + 1, 1, 1);
      }
    }
  }

  if (P.stars) {
    scene.stars.forEach((s) => {
      const b = Math.sin(t * s.sp + s.ph);
      if (b < -0.3) return;
      c.fillStyle = b > 0.7 ? "#ffffff" : "#a99ff0";
      c.fillRect(s.x, s.y, 1, 1);
      if (b > 0.95) {
        c.fillStyle = "rgba(255,255,255,.55)";
        c.fillRect(s.x - 1, s.y, 1, 1); c.fillRect(s.x + 1, s.y, 1, 1);
        c.fillRect(s.x, s.y - 1, 1, 1); c.fillRect(s.x, s.y + 1, 1, 1);
      }
    });
    // ときどき流れ星
    if (!scene.shoot && now > scene.nextShoot) {
      if (scene.nextShoot) scene.shoot = { x: scene.cols * (0.35 + Math.random() * 0.55), y: 2 + Math.random() * 8, life: 0 };
      scene.nextShoot = now + 10000 + Math.random() * 15000;
    }
    if (scene.shoot) {
      const s = scene.shoot;
      s.life += dt * 40;
      for (let i = 0; i < 6; i++) {
        c.fillStyle = "rgba(255,255,255," + (1 - i / 6) + ")";
        c.fillRect(Math.round(s.x - s.life + i), Math.round(s.y + s.life * 0.5 - i * 0.5), 1, 1);
      }
      if (s.life > 22) scene.shoot = null;
    }
  }

  // 花火（花火の夜のテーマ）
  if (theme === "fireworks") {
    if (now > scene.nextFirework) {
      const cx = scene.cols * (0.2 + Math.random() * 0.6), cy = 6 + Math.random() * scene.ground * 0.35;
      const colors = ["#ffd54a", "#ff6fa8", "#7ae0ff", "#a8ff8a", "#ffffff", "#ff9f5a"];
      const col = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2, sp = 9 + Math.random() * 4;
        scene.fireworks.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.3 + Math.random() * 0.4, c: col });
      }
      scene.nextFirework = now + 1200 + Math.random() * 1800;
    }
    scene.fireworks = scene.fireworks.filter((p) => p.life > 0);
    scene.fireworks.forEach((p) => {
      p.vx *= 0.96; p.vy = p.vy * 0.96 + 4 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      c.globalAlpha = Math.min(1, p.life * 1.5);
      c.fillStyle = p.c;
      c.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
    });
    c.globalAlpha = 1;
  }

  c.fillStyle = P.cloud;
  c.globalAlpha = P.stars ? 0.5 : 0.92;
  scene.clouds.forEach((cl) => {
    const span = scene.cols + cl.w + 10;
    drawCloud(c, ((cl.x + t * cl.speed) % span) - cl.w - 5, cl.y, cl.w);
  });
  c.globalAlpha = 1;

  // 海・湖のきらめき
  if (theme === "beach" || theme === "lake") {
    c.fillStyle = "rgba(255,255,255,.7)";
    const top = theme === "beach" ? 8 : 5, span = theme === "beach" ? 7 : 5;
    for (let i = 0; i < scene.cols / 6; i++) {
      const x = Math.round((i * 6 + t * (theme === "beach" ? 3 : 1.2) + (i % 3) * 2) % scene.cols);
      const y = scene.ground - top + ((i * 3) % span);
      if (Math.sin(t * 2 + i) > 0.2) c.fillRect(x, y, 2, 1);
    }
  }
  // 夜景：窓の明かりがときどきまたたく
  if (theme === "city") {
    c.fillStyle = "#ffd66b";
    for (let i = 0; i < 6; i++) {
      const x = Math.round((i * 37 + 11) % scene.cols), y = scene.ground - 4 - ((i * 13) % 10);
      if (Math.sin(t * (0.7 + i * 0.3) + i) > 0.4) c.fillRect(x, y, 1, 1);
    }
  }

  // 置いた小物
  if (equip.prop) drawProp(c, equip.prop, Math.round(scene.cols * 0.7), scene.ground, now, scene.period);
  // 動物
  if (equip.pet) updatePet(c, equip.pet, now, dt);

  // 舞うもの（花びら・紅葉・雪）
  if (scene.flakes.length) {
    scene.flakes.forEach((f) => {
      f.y += f.vy * dt;
      f.x += (f.vx + Math.sin(t * 1.5 + f.ph) * 2) * dt;
      if (f.y > scene.rows) { f.y = -2; f.x = Math.random() * scene.cols; }
      if (f.x > scene.cols) f.x -= scene.cols;
      if (f.x < 0) f.x += scene.cols;
      c.fillStyle = f.c;
      c.fillRect(Math.round(f.x), Math.round(f.y), 1, 1);
    });
  }

  // 紙吹雪（ドット）
  scene.parts = scene.parts.filter((p) => p.life > 0 && p.y < scene.rows);
  scene.parts.forEach((p) => {
    p.vy += 38 * dt; p.vx *= 0.99;
    p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    if (p.life < 0.4 && Math.floor(now / 80) % 2) return;   // 消える直前はチカチカ
    c.fillStyle = p.c;
    c.fillRect(Math.round(p.x), Math.round(p.y), p.w, 1);
  });
}

// ---- 交換所の品物 ----
// cat：bg＝背景 / prop＝ステージの小物 / pet＝背景で動く動物。key は見た目を描くときの名前
const SHOP = [
  { cat: "bg",   key: "default",   name: "いつもの丘",   price: 0,     desc: "最初から持っている、いつもの景色" },
  { cat: "bg",   key: "rainbow",   name: "虹の空",       price: 6000,  desc: "雨上がりの空に大きな虹" },
  { cat: "bg",   key: "himawari",  name: "ひまわり畑",   price: 7000,  desc: "地面いっぱいにひまわりが咲く" },
  { cat: "bg",   key: "sakura",    name: "桜の公園",     price: 8000,  desc: "桜の木と、舞い散る花びら" },
  { cat: "bg",   key: "momiji",    name: "紅葉の山",     price: 8000,  desc: "赤や黄色の葉がひらひら" },
  { cat: "bg",   key: "lake",      name: "湖のほとり",   price: 9000,  desc: "静かな湖と小さなボート" },
  { cat: "bg",   key: "beach",     name: "海辺",         price: 10000,  desc: "きらきら光る海と、ヤシの木" },
  { cat: "bg",   key: "city",      name: "街の夜景",     price: 10000,  desc: "ビルの窓に明かりがともる" },
  { cat: "bg",   key: "snow",      name: "雪景色",       price: 11000,  desc: "しんしんと雪が降る" },
  { cat: "bg",   key: "moon",      name: "月面",         price: 12000, desc: "空に地球が浮かぶ" },
  { cat: "bg",   key: "aurora",    name: "オーロラ",     price: 13000, desc: "夜空にゆらめく光のカーテン" },
  { cat: "bg",   key: "fireworks", name: "花火の夜",     price: 14000, desc: "いつでも夜空に花火があがる" },
  { cat: "bg",   key: "castle",    name: "おとぎの城",   price: 30000, desc: "丘の上にお城。空にきらきらが光る", premium: true },
  { cat: "prop", key: "bench",     name: "ベンチ",       price: 2000,  desc: "ひと休みにちょうどいい" },
  { cat: "prop", key: "birdhouse", name: "巣箱",         price: 2000,  desc: "木でできた小鳥のおうち" },
  { cat: "prop", key: "swing",     name: "ブランコ",     price: 5000,  desc: "風でゆらゆらゆれる" },
  { cat: "prop", key: "koinobori", name: "こいのぼり",   price: 6000,  desc: "3匹が風に泳ぐ" },
  { cat: "prop", key: "windmill",  name: "風車",         price: 6000,  desc: "羽根がくるくる回る" },
  { cat: "prop", key: "xmastree",  name: "クリスマスツリー", price: 7000, desc: "電球がかわるがわる光る" },
  { cat: "prop", key: "balloon",   name: "気球",         price: 9000, desc: "空をゆっくり行ったり来たり" },
  { cat: "prop", key: "cactus",    name: "サボテン",     price: 2000,  desc: "小さな花が咲いた鉢植え" },
  { cat: "prop", key: "post",      name: "ポスト",       price: 3000,  desc: "赤い郵便ポスト" },
  { cat: "prop", key: "flowers",   name: "花だん",       price: 3000,  desc: "色とりどりの小さな花" },
  { cat: "prop", key: "streetlight", name: "街灯",       price: 4000,  desc: "夜になると道を照らす" },
  { cat: "prop", key: "lantern",   name: "ちょうちん",   price: 4000,  desc: "夜になるとあかりがともる" },
  { cat: "prop", key: "pumpkin",   name: "かぼちゃ",     price: 4000,  desc: "夜は中がぼんやり光る" },
  { cat: "prop", key: "snowman",   name: "雪だるま",     price: 5000,  desc: "赤いマフラーがおしゃれ" },
  { cat: "prop", key: "campfire",  name: "たき火",       price: 5000,  desc: "ぱちぱち燃える小さな火" },
  { cat: "prop", key: "tent",      name: "テント",       price: 7000,  desc: "キャンプ気分で" },
  { cat: "prop", key: "fountain",  name: "噴水",         price: 8000,  desc: "水がしぶきをあげる" },
  { cat: "prop", key: "ferris",    name: "観覧車",       price: 20000, desc: "ゆっくり回る。夜は電飾が光る", premium: true },
  { cat: "pet",  key: "butterfly", name: "ちょうちょ",   price: 3000,  desc: "ひらひら飛びまわる（昼）" },
  { cat: "pet",  key: "turtle",    name: "カメ",         price: 3000,  desc: "とってもゆっくり歩く" },
  { cat: "pet",  key: "hedgehog",  name: "ハリネズミ",   price: 4000,  desc: "ちょこちょこ歩く" },
  { cat: "pet",  key: "chicks",    name: "ひよこ",       price: 5000,  desc: "3羽で一列にならんで歩く" },
  { cat: "pet",  key: "squirrel",  name: "リス",         price: 5000,  desc: "すばやく走っては、立ち止まる" },
  { cat: "pet",  key: "penguin",   name: "ペンギン",     price: 7000,  desc: "よちよち歩く" },
  { cat: "pet",  key: "owl",       name: "ふくろう",     price: 8000,  desc: "木の上にとまる。夜は目をさます" },
  { cat: "pet",  key: "bird",      name: "小鳥",         price: 4000,  desc: "ときどき空を横切る（昼）" },
  { cat: "pet",  key: "dog",       name: "いぬ",         price: 6000,  desc: "とことこ歩いて、ときどきおすわり" },
  { cat: "pet",  key: "cat",       name: "ねこ",         price: 6000,  desc: "のんびり歩いて、まばたきする" },
  { cat: "pet",  key: "rabbit",    name: "うさぎ",       price: 7000,  desc: "ぴょんぴょん跳ねる" },
  { cat: "pet",  key: "firefly",   name: "ほたる",       price: 8000,  desc: "夕方と夜に、ふわふわ光る" },
  { cat: "pet",  key: "peacock",   name: "クジャク",     price: 20000, desc: "ゆったり歩き、ときどき羽を広げる", premium: true },
];
const shopId = (it) => it.cat + ":" + it.key;

// ドット絵（文字1つが1マス。「.」は透明）
const PROP_ART = {
  bench: { pal: { W: "#c98b4f", w: "#8a5a2f", k: "#4a3a3a" }, frames: [[
    "WWWWWWWWWWWWWW", "wwwwwwwwwwwwww", ".w..........w.", "WWWWWWWWWWWWWW",
    "wwwwwwwwwwwwww", ".k..........k.", ".k..........k.", ".k..........k.",
  ]] },
  birdhouse: { pal: { r: "#d0604f", w: "#f2e6d0", k: "#3a2a2a", p: "#8a5a2f" }, frames: [[
    "...r...", "..rrr..", ".rrrrr.", "rrrrrrr", ".wwkww.", ".wwwww.", ".wwwww.",
    "...p...", "...p...", "...p...", "...p...", "...p...", ".ppppp.",
  ]] },
  cactus: { pal: { g: "#4caf50", G: "#7fd17f", f: "#ff7aa8", p: "#c8703f", P: "#a3552c" }, frames: [[
    "...f...", "...gg..", "g..gG..", "gG.gg.g", ".gggggg", "...gg..", "...gg..", ".ppppp.", ".pPPPp.", "..ppp..",
  ]] },
  post: { pal: { r: "#e8443a", R: "#ff7a6b", k: "#3a2a2a", w: "#ffffff" }, frames: [[
    ".rrrr.", "rRrrrr", "rkkkkr", "rrrrrr", "rrwwrr", "rrrrrr", "rrrrrr", "..kk..", "..kk..", ".kkkk.",
  ]] },
  flowers: { pal: { r: "#ff6b8a", y: "#ffd54a", p: "#b48cff", g: "#3f9a55", b: "#9a6a44", B: "#7a5034" }, frames: [[
    ".r...y...p..", "rrr.yyy.ppp.", ".g...g...g..", ".g.g.g.g.g..", "bbbbbbbbbbbb", "BBBBBBBBBBBB",
  ]] },
  streetlight: { pal: { k: "#4a4a5a", y: "#ffe9a0" }, glow: "#ffe9a0", glowY: 1, glowR: 7, frames: [[
    "kkkkk", "kyyyk", ".kkk.", "..k..", "..k..", "..k..", "..k..", "..k..", "..k..", "..k..",
    "..k..", "..k..", "..k..", "..k..", ".kkk.", "kkkkk",
  ]] },
  lantern: { pal: { r: "#e8503a", R: "#ffb36b", k: "#3a2a2a", p: "#6b4a3a" }, glow: "#ffb36b", glowY: 4, frames: [[
    "..kkk..", ".rrrrr.", "rRRRRRr", "rrrrrrr", "rRRRRRr", "rrrrrrr", ".rrrrr.", "..kkk..",
    "...p...", "...p...", "...p...", "...p...", "...p...", ".ppppp.",
  ]] },
  pumpkin: { pal: { o: "#ff8c1a", O: "#ffad4d", k: "#5a2a00", g: "#3f9a55" }, glow: "#ffd54a", glowY: 4, frames: [[
    "....g....", "...gg....", ".ooOoOoo.", "ookoOokoo", "oOoooooOo", "ookkkkkoo", ".ooOoOoo.",
  ]] },
  snowman: { pal: { w: "#ffffff", s: "#d9e2f0", k: "#2a2a3a", o: "#ff8c1a", r: "#e8443a" }, frames: [[
    "...kkk...", "..kkkkk..", "...www...", "..wkwkw..", "..wwoww..", "...wws...", "..rrrrr..",
    ".wwwwwww.", "wwwwwkwws", "wwwwwkwws", ".wwwwwss.",
  ]] },
  campfire: { pal: { f: "#ff7a2f", F: "#ffb347", Y: "#fff1a8", l: "#8a5a2f", L: "#5e3b1f", s: "#9a9a9a" }, glow: "#ff9a4a", glowY: 3, fps: 5, frames: [[
    "....f.....", "...fFf....", "..fFYFf...", "..fFYYFf..", "...fFFf...", ".lLlLlLl..", "LlLlLlLlL.", "s.s.s.s.s.",
  ], [
    ".....f....", "....fFf...", "...fFYFf..", "..fFYYFf..", "...fFFf...", ".lLlLlLl..", "LlLlLlLlL.", "s.s.s.s.s.",
  ]] },
  tent: { pal: { t: "#e8b04a", T: "#f5cf7a", k: "#5a3a20" }, frames: [[
    "......k......", ".....ttt.....", "....ttTtt....", "...ttTTTtt...", "..ttTTkTTtt..",
    ".ttTTTkTTTtt.", "ttTTTTkTTTTtt", "ttTTTkkkTTTtt", "ttTTkkkkkTTtt",
  ]] },
  fountain: { pal: { s: "#b8b2c8", S: "#d8d3e4", b: "#7cc8ff", w: "#e6f6ff" }, fps: 4, frames: [[
    ".....w......", "....bwb.....", "...b.b.b....", "..b..b..b...", ".....b......", ".....b......",
    "..SSSSSSSS..", ".sbbbbbbbbs.", "ssssssssssss",
  ], [
    "............", ".....w......", "....bwb.....", "..b..b..b...", ".b...b...b..", ".....b......",
    "..SSSSSSSS..", ".sbwbbbwbbs.", "ssssssssssss",
  ]] },
};

// 動物のドット絵（右向き。左へ進むときは左右反転して描く）
const PET_ART = {
  dog: { pal: { b: "#c98b4f", d: "#8a5a2f", k: "#2a1a10", n: "#3a2a20" }, frames: [[
    "........dd.", ".......bbbb", "d......bkbn", ".bbbbbbbbb.", ".bbbbbbbb..", ".b.b...b.b.",
  ], [
    "........dd.", ".......bbbb", ".d.....bkbn", ".bbbbbbbbb.", ".bbbbbbbb..", "..bb...bb..",
  ]], sit: [
    "........dd.", ".......bbbb", "d......bkbn", "..bbbbbbbb.", ".bbbbbbbb..", ".bbbb..b.b.",
  ] },
  cat: { pal: { k: "#e8954a", K: "#fff1de", e: "#2a2a3a" }, frames: [[   // 茶トラ（夜の背景でも見えるように明るい色）
    ".......k.k", ".......kkk", "k......kek", ".k.kkkkkkk", "..kKKkkkk.", "..k.k..k.k",
  ], [
    ".......k.k", ".......kkk", "k......kek", ".k.kkkkkkk", "..kKKkkkk.", "...kk...kk",
  ]], blink: [
    ".......k.k", ".......kkk", "k......kkk", ".k.kkkkkkk", "..kKKkkkk.", "..k.k..k.k",
  ] },
  rabbit: { pal: { w: "#ffffff", s: "#e6e0f0", p: "#ffb3c8", k: "#4a3a3a" }, frames: [[
    "....w.w.", "....p.p.", "...wwww.", "..wwwkw.", "wwwwwwws", ".wwwwws.", ".w...ws.",
  ]] },
  bird: { pal: { k: "#3a3550" }, frames: [[
    "k...k", ".kkk.", "..k..",
  ], [
    ".....", "kkkkk", "..k..",
  ]] },
  turtle: { pal: { g: "#4c9a5a", G: "#7cc47c", s: "#c8d88a", e: "#2a2a2a" }, frames: [[
    "...gggg...", "..gGgGgg..", ".gGgGgGgss", ".gggggggse", "..s..s....",
  ], [
    "...gggg...", "..gGgGgg..", ".gGgGgGgss", ".gggggggse", "...s..s...",
  ]] },
  hedgehog: { pal: { k: "#6b4a3a", K: "#8a6a50", b: "#e8c8a0", e: "#2a1a10", f: "#c8a080" }, frames: [[
    ".kKkKk...", "kKkKkKkb.", "kkKkKkbeb", "kKkKkkbbe", ".f..f.f..",
  ], [
    ".kKkKk...", "kKkKkKkb.", "kkKkKkbeb", "kKkKkkbbe", "..f.f..f.",
  ]] },
  squirrel: { pal: { t: "#d8843a", k: "#a85a2a", e: "#1a1010", w: "#f5dcc0" }, frames: [[
    "tt.......", "ttt...kk.", "ttt..kkkk", ".tt.kkkek", "..tkkwkk.", "..kkkkk..", "..k.k.k..",
  ], [
    "tt.......", "ttt...kk.", "ttt..kkkk", ".tt.kkkek", "..tkkwkk.", "..kkkkk..", "...k.k.k.",
  ]] },
  penguin: { pal: { k: "#2a2a3a", w: "#ffffff", o: "#ffa83a", e: "#000000" }, frames: [[
    "..kkk..", ".kkwek.", ".kkkwwo", "kkkwww.", "kkkwww.", "kkkwww.", ".kkwww.", "..kww..", ".oo.oo.",
  ], [
    "..kkk..", ".kkwek.", ".kkkwwo", "kkkwww.", "kkkwww.", "kkkwww.", ".kkwww.", "..kww..", "..oo.o.",
  ]] },
  chicks: { pal: { y: "#ffe066", Y: "#fff3a8", o: "#ff9a2a", e: "#2a2a2a" }, frames: [[
    ".yyy.", "yyyeo", "yYyyy", ".yyy.", ".o.o.",
  ], [
    ".yyy.", "yyyeo", "yYyyy", ".yyy.", "..o.o",
  ]] },
  owl: { pal: { b: "#8a6a4a", B: "#d8b888", w: "#ffffff", e: "#2a2a2a", o: "#ffa83a", k: "#5a4030" }, frames: [[
    "b.....b", "bbbbbbb", "bwwbwwb", "bwebweb", "bbbobbb", "bBBBBBb", "bBbBbBb", ".oo.oo.",
  ]], sleep: [
    "b.....b", "bbbbbbb", "bbbbbbb", "bkkbkkb", "bbbobbb", "bBBBBBb", "bBbBbBb", ".oo.oo.",
  ] },
  // クジャク：ふだんは長い尾を引いて歩く（羽を広げた姿は drawPeacockFan で描く）
  peacock: { pal: { b: "#2e6fd6", B: "#5fa8ff", c: "#2e6fd6", k: "#1a1a2a", o: "#e8a03a", g: "#2f9a6a", G: "#6fd08a", l: "#8a6a4a" }, frames: [[
    "..........c..", ".........bbb.", ".........bkbo", "..........bb.", "GgGg.....bb..",
    ".gGgGgbbbBb..", "..gGgbbbBBb..", "....gbbbbb...", "......l..l...",
  ], [
    "..........c..", ".........bbb.", ".........bkbo", "..........bb.", "GgGg.....bb..",
    ".gGgGgbbbBb..", "..gGgbbbBBb..", "....gbbbbb...", ".......ll....",
  ]] },
  butterfly: { pal: { p: "#ff8ac2", y: "#ffd54a", b: "#8ad0ff", k: "#3a3550" }, frames: [[
    "pp.pp", "ppkpp", ".p.p.",
  ], [
    "..k..", ".pkp.", "..k..",
  ]] },
};

function drawBitmap(c, rows, pal, x, y, flip) {
  const w = rows[0].length;
  rows.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      const col = pal[row[dx]];
      if (!col) continue;
      c.fillStyle = col;
      c.fillRect(x + (flip ? w - 1 - dx : dx), y + dy, 1, 1);
    }
  });
}

// 小物を地面に置く（cx：中心のドット位置、groundY：地面の高さ）
function drawProp(c, key, cx, groundY, now, period) {
  if (CUSTOM_PROPS[key]) return CUSTOM_PROPS[key](c, cx, groundY, now / 1000, period);
  const art = PROP_ART[key];
  if (!art) return;
  let f = 0;
  if (art.fps) f = Math.floor((now / 1000) * art.fps) % art.frames.length;
  const rows = art.frames[f], w = rows[0].length, h = rows.length;
  const x = Math.round(cx - w / 2), y = groundY - h + 1;
  const dark = period === "night" || period === "evening";
  if (art.glow && dark) {
    c.globalAlpha = 0.18 + 0.05 * Math.sin(now / 160);
    disc(c, cx, y + art.glowY, art.glowR || 6, art.glow);
    c.globalAlpha = 1;
  }
  // かぼちゃは、夜は目と口が光る
  const pal = key === "pumpkin" && dark ? Object.assign({}, art.pal, { k: "#ffd54a" }) : art.pal;
  drawBitmap(c, rows, pal, x, y);
}

// 動きのある小物（プログラムで1マスずつ描く）
const CUSTOM_PROPS = {
  // 風車：羽根がゆっくり回る
  windmill(c, cx, gy, t) {
    c.fillStyle = "#e8dcc8"; c.fillRect(cx - 2, gy - 13, 5, 14);
    c.fillStyle = "#c8b8a0"; c.fillRect(cx - 3, gy - 2, 7, 3);
    c.fillStyle = "#d0604f"; c.fillRect(cx - 3, gy - 15, 7, 2); c.fillRect(cx - 2, gy - 16, 5, 1);
    c.fillStyle = "#5a4030"; c.fillRect(cx, gy - 4, 1, 3);
    const hx = cx, hy = gy - 12;
    for (let k = 0; k < 4; k++) {
      const a = t * 1.2 + (k * Math.PI) / 2;
      for (let r = 1; r <= 7; r++) {
        c.fillStyle = r > 2 ? "#ffffff" : "#8a6a4a";
        c.fillRect(Math.round(hx + Math.cos(a) * r), Math.round(hy + Math.sin(a) * r), 1, 1);
        if (r > 2) { c.fillStyle = "#d8d0c4"; c.fillRect(Math.round(hx + Math.cos(a) * r + Math.cos(a + 1.57)), Math.round(hy + Math.sin(a) * r + Math.sin(a + 1.57)), 1, 1); }
      }
    }
    c.fillStyle = "#5a4030"; c.fillRect(hx, hy, 1, 1);
  },
  // クリスマスツリー：電球がかわるがわる光る
  xmastree(c, cx, gy, t) {
    const rows = [
      ".....y.....", "....ggg....", "...gglgg...", "..ggggglg..", "....ggg....", "...glggg...",
      "..ggggglg..", ".gglgggggg.", "...ggggg...", "..lgggglg..", ".gggglgggg.", "ggglgggglgg",
      "....bbb....", "...rrrrr...", "...rrrrr...",
    ];
    const lights = ["#ff5c5c", "#ffd54a", "#7ae0ff", "#ff8ac2"];
    let n = 0;
    const x0 = Math.round(cx - 5), y0 = gy - rows.length + 1;
    rows.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        const ch = row[dx];
        if (ch === ".") continue;
        if (ch === "l") { c.fillStyle = lights[(n++ + Math.floor(t * 2)) % lights.length]; }
        else c.fillStyle = { g: "#2f8f4a", y: "#ffd54a", b: "#8a5a2f", r: "#d0604f" }[ch];
        c.fillRect(x0 + dx, y0 + dy, 1, 1);
      }
    });
  },
  // こいのぼり：3匹が風にゆれる
  koinobori(c, cx, gy, t) {
    c.fillStyle = "#8a6a4a"; c.fillRect(cx - 4, gy - 22, 1, 23);
    c.fillStyle = "#ffd54a"; c.fillRect(cx - 5, gy - 23, 3, 1);
    [["#3a3a4a", 0], ["#e8443a", 1], ["#3a8ad8", 2]].forEach(([col, i]) => {
      const y = gy - 20 + i * 5;
      for (let x = 0; x < 9 - i; x++) {
        const wy = Math.round(Math.sin(t * 4 - x * 0.6) * (x / 6));
        c.fillStyle = col;
        c.fillRect(cx - 3 + x, y + wy, 1, 3);
        if (x === 1) { c.fillStyle = "#ffffff"; c.fillRect(cx - 3 + x, y + wy, 1, 1); }
      }
    });
  },
  // ブランコ：板がゆっくりゆれる
  swing(c, cx, gy, t) {
    c.fillStyle = "#8a5a2f";
    for (let i = 0; i < 12; i++) { c.fillRect(cx - 7 + Math.floor(i / 3), gy - i, 1, 1); c.fillRect(cx + 7 - Math.floor(i / 3), gy - i, 1, 1); }
    c.fillRect(cx - 4, gy - 12, 9, 1);
    const sw = Math.sin(t * 1.6) * 2.5;
    c.fillStyle = "#c8c0d8";
    for (let r = 1; r <= 7; r++) {
      const ox = Math.round((sw * r) / 7);
      c.fillRect(cx - 2 + ox, gy - 12 + r, 1, 1);
      c.fillRect(cx + 2 + ox, gy - 12 + r, 1, 1);
    }
    c.fillStyle = "#e8954a"; c.fillRect(cx - 3 + Math.round(sw), gy - 4, 7, 1);
  },
  // 観覧車：ゆっくり回り、ゴンドラはいつも下向き。夕方と夜は外側の電飾が色を変えて光る
  ferris(c, cx, gy, t, period) {
    const R = 10, hx = cx, hy = gy - 13, dark = period === "night" || period === "evening";
    const a0 = t * 0.25;
    // 支柱（A字の脚）
    c.fillStyle = "#8a8098";
    for (let i = 0; i <= 13; i++) {
      const dx = Math.round((i / 13) * 5);
      c.fillRect(hx - dx, hy + i, 1, 1); c.fillRect(hx + dx, hy + i, 1, 1);
    }
    c.fillRect(hx - 6, gy, 13, 1);
    // スポーク
    c.fillStyle = "#c8c0d8";
    for (let k = 0; k < 8; k++) {
      const a = a0 + (k * Math.PI) / 4;
      for (let r = 1; r < R; r++) c.fillRect(Math.round(hx + Math.cos(a) * r), Math.round(hy + Math.sin(a) * r), 1, 1);
    }
    // 外わく（夜は電飾）
    const lights = ["#ff6fa8", "#ffd54a", "#7ae0ff", "#a8ff8a"];
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      c.fillStyle = dark ? lights[(i + Math.floor(t * 4)) % lights.length] : "#e8e2f2";
      c.fillRect(Math.round(hx + Math.cos(a) * R), Math.round(hy + Math.sin(a) * R), 1, 1);
    }
    // ゴンドラ
    const cols = ["#ff6b6b", "#ffd54a", "#4dabf7", "#69db7c"];
    for (let k = 0; k < 8; k++) {
      const a = a0 + (k * Math.PI) / 4;
      const gx = Math.round(hx + Math.cos(a) * R), gyy = Math.round(hy + Math.sin(a) * R);
      c.fillStyle = cols[k % cols.length];
      c.fillRect(gx - 1, gyy + 1, 3, 2);
      c.fillStyle = dark ? "#fff1a8" : "#ffffff";
      c.fillRect(gx, gyy + 1, 1, 1);
    }
    c.fillStyle = "#5a5068"; c.fillRect(hx, hy, 1, 1);
  },
  // 気球：空の上のほうを、ゆっくり行ったり来たりする
  balloon(c, cx, gy, t) {
    const rows = [
      "..ryryr..", ".ryryryr.", "ryryryryr", "ryryryryr", "ryryryryr", ".ryryryr.", "..ryryr..",
      "...k.k...", "...k.k...", "...bbb...", "...bbb...",
    ];
    const W = c.canvas.width;   // 交換所の見本でも使えるように、描く先の幅を基準にする
    const x = Math.round(W * 0.5 + Math.sin(t * 0.08) * W * 0.35) - 4;
    const y = Math.round(6 + Math.sin(t * 0.7) * 2);
    drawBitmap(c, rows, { r: "#ff6b6b", y: "#ffe066", k: "#5a4a3a", b: "#a0703a" }, x, y);
  },
};

// ---- 背景で動く動物 ----
function updatePet(c, key, now, dt) {
  const gt = scene.ground, cols = scene.cols, t = now / 1000;
  if (!scene.pet || scene.pet.key !== key) {
    scene.pet = { key, x: cols * 0.3, dir: 1, mode: "idle", until: now + 1500, list: [] };
    if (key === "firefly") scene.pet.list = Array.from({ length: 9 }, (_, i) => ({ x: Math.random() * cols, y: gt - 3 - Math.random() * 14, ph: i * 1.7 }));
    if (key === "butterfly") scene.pet.list = [0, 1].map((i) => ({ x: cols * (0.3 + i * 0.3), y: gt - 10, tx: cols * 0.5, ty: gt - 10, c: i ? "#8ad0ff" : "#ff8ac2" }));
    if (key === "bird") scene.pet.list = [];
  }
  const pet = scene.pet;

  if (key === "firefly") {   // 夕方と夜だけ光る
    if (scene.period !== "night" && scene.period !== "evening") return;
    pet.list.forEach((f) => {
      f.x += Math.sin(t * 0.7 + f.ph) * 3 * dt;
      f.y += Math.cos(t * 0.9 + f.ph) * 2 * dt;
      const b = 0.5 + 0.5 * Math.sin(t * 2 + f.ph);
      c.globalAlpha = 0.25 * b; c.fillStyle = "#d8ff7a"; c.fillRect(Math.round(f.x) - 1, Math.round(f.y) - 1, 3, 3);
      c.globalAlpha = 0.6 + 0.4 * b; c.fillStyle = "#f4ffb0"; c.fillRect(Math.round(f.x), Math.round(f.y), 1, 1);
    });
    c.globalAlpha = 1;
    return;
  }

  if (key === "butterfly") {   // 昼間だけ、ひらひら飛ぶ
    if (scene.period === "night") return;
    const art = PET_ART.butterfly;
    pet.list.forEach((b) => {
      if (Math.hypot(b.tx - b.x, b.ty - b.y) < 2) { b.tx = 6 + Math.random() * (cols - 12); b.ty = gt - 6 - Math.random() * 18; }
      const ang = Math.atan2(b.ty - b.y, b.tx - b.x);
      b.x += Math.cos(ang) * 6 * dt;
      b.y += Math.sin(ang) * 6 * dt + Math.sin(t * 6 + b.x) * 4 * dt;
      const f = Math.floor(t * 8 + b.x) % 2;
      drawBitmap(c, art.frames[f], Object.assign({}, art.pal, { p: b.c }), Math.round(b.x) - 2, Math.round(b.y) - 1);
    });
    return;
  }

  if (key === "bird") {   // 昼間、ときどき3羽で空を横切る
    if (!pet.list.length && (scene.period === "night")) return;
    if (!pet.list.length && now > pet.until) {
      const dir = Math.random() < 0.5 ? 1 : -1, y = 6 + Math.random() * gt * 0.3;
      pet.list = [0, 1, 2].map((i) => ({ x: dir > 0 ? -6 - i * 7 : cols + 6 + i * 7, y: y + i * 2 - (i === 1 ? 3 : 0), dir, ph: i }));
    }
    const art = PET_ART.bird;
    pet.list.forEach((b) => {
      b.x += b.dir * 14 * dt;
      const f = Math.floor(t * 6 + b.ph) % 2;
      drawBitmap(c, art.frames[f], art.pal, Math.round(b.x), Math.round(b.y + Math.sin(t * 3 + b.ph) * 1.2), b.dir < 0);
    });
    if (pet.list.length && pet.list.every((b) => b.x < -30 || b.x > cols + 30)) { pet.list = []; pet.until = now + 6000 + Math.random() * 9000; }
    return;
  }

  if (key === "owl") {   // 木の上にとまっている。夜は目をあけてまばたき、昼はねむっている
    const art = PET_ART.owl;
    const awake = scene.period === "night" || scene.period === "evening";
    let rows = art.frames[0];
    if (!awake || now % 4200 < 160) rows = art.sleep;
    let x = 5, y = gt - 29;
    if (scene.theme === "beach") { x = 7; y = gt - 24; }
    if (scene.theme === "city" || scene.theme === "moon") { x = 12; y = gt - 7; }
    drawBitmap(c, rows, art.pal, x, y);
    return;
  }

  // 地面を歩く動物
  const art = PET_ART[key], spec = WALKERS[key];
  if (pet.mode === "walk") {
    pet.x += pet.dir * spec.speed * dt;
    if ((pet.dir > 0 && pet.x >= pet.tx) || (pet.dir < 0 && pet.x <= pet.tx)) {
      pet.mode = "idle";
      pet.until = now + (spec.pause ? spec.pause[0] + Math.random() * spec.pause[1] : 2000 + Math.random() * 4000);
    }
  } else if (now > pet.until) {
    pet.mode = "walk";
    pet.tx = 18 + Math.random() * (cols - 36);
    if (spec.hopShort) pet.tx = Math.min(cols - 18, Math.max(18, pet.x + (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 25)));
    pet.dir = pet.tx > pet.x ? 1 : -1;
  }
  const w = art.frames[0][0].length, h = art.frames[0].length;
  let rows = art.frames[0], lift = 0, sway = 0;
  if (pet.mode === "walk") {
    if (spec.hop) lift = Math.round(Math.abs(Math.sin(t * 7)) * 3);
    else rows = art.frames[Math.floor(t * (spec.fps || 6)) % art.frames.length];
    if (spec.waddle) sway = Math.round(Math.sin(t * 8));
  } else {
    if (key === "dog" && now % 6000 > 2500) rows = art.sit;
    if (key === "cat" && now % 3800 < 150) rows = art.blink;
  }
  // クジャクは立ち止まっているあいだ、ときどき羽を広げる
  if (key === "peacock" && pet.mode !== "walk" && now % 8000 > 4000) {
    const x0 = Math.round(pet.x - w / 2);
    drawPeacock(c, x0, gt - h + 1, pet.dir < 0, true);
    return;
  }
  const count = spec.count || 1;
  for (let i = 0; i < count; i++) {   // ひよこは3羽で一列に並んで歩く
    const x = pet.x - pet.dir * i * (w + 2);
    const bob = count > 1 && pet.mode === "walk" ? Math.round(Math.abs(Math.sin(t * 9 + i)) * 1) : 0;
    drawBitmap(c, rows, art.pal, Math.round(x - w / 2) + sway, gt - h + 1 - lift - bob, pet.dir < 0);
  }
}

// クジャクを描く。fan のときは、尾のかわりに目玉もようの羽を半円に広げる
function drawPeacock(c, x0, y0, flip, fan) {
  const art = PET_ART.peacock;
  if (!fan) return drawBitmap(c, art.frames[0], art.pal, x0, y0, flip);
  const w = art.frames[0][0].length;
  const fx = x0 + (flip ? w - 1 - 7 : 7), fy = y0 + 6, R = 9;
  for (let dy = -R; dy <= 0; dy++) for (let dx = -R; dx <= R; dx++) {
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r > R + 0.3) continue;
    c.fillStyle = r > 7.5 ? "#2f9a6a" : r > 4.5 ? "#6fd08a" : "#4fb88a";
    c.fillRect(fx + dx, fy + dy, 1, 1);
  }
  // 目玉もよう
  for (let i = 0; i <= 6; i++) {
    const a = Math.PI + (i / 6) * Math.PI;
    const ex = Math.round(fx + Math.cos(a) * 7), ey = Math.round(fy + Math.sin(a) * 7);
    c.fillStyle = "#ffd54a"; c.fillRect(ex, ey, 1, 1);
    const ix = Math.round(fx + Math.cos(a) * 4), iy = Math.round(fy + Math.sin(a) * 4);
    if (i % 2 === 0) { c.fillStyle = "#2e6fd6"; c.fillRect(ix, iy, 1, 1); }
  }
  drawBitmap(c, art.frames[0], Object.assign({}, art.pal, { g: null, G: null }), x0, y0, flip);
}

// 地面を歩く動物の速さや歩き方
const WALKERS = {
  dog:      { speed: 9 },
  cat:      { speed: 5 },
  rabbit:   { speed: 11, hop: true },
  turtle:   { speed: 1.5, fps: 2 },
  hedgehog: { speed: 4, fps: 4 },
  squirrel: { speed: 20, fps: 10, pause: [500, 1500], hopShort: true },
  penguin:  { speed: 4, fps: 4, waddle: true },
  chicks:   { speed: 6, fps: 8, count: 3 },
  peacock:  { speed: 4, fps: 3, pause: [5000, 4000] },
};

// キャラの位置から紙吹雪を出す
function spawnConfetti(big) {
  const stage = $("stage");
  let cx = stage.clientWidth / 2, cy = stage.clientHeight - 110;
  if (actor.meta) { cx = actor.x + spriteW() / 2; cy = stage.clientHeight - GROUND * PX - actor.meta.frameH * SPRITE_SCALE * 0.8; }
  const colors = ["#ffd54a", "#ff6fa8", "#5ee0c1", "#7aa8ff", "#ffffff", "#ff9f5a"];
  for (let i = 0; i < (big ? 90 : 45); i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, sp = 25 + Math.random() * 45;
    scene.parts.push({
      x: cx / PX, y: cy / PX, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      w: Math.random() < 0.3 ? 2 : 1, c: colors[i % colors.length], life: 1.4 + Math.random() * 1.2,
    });
  }
}

// ステージ上部に出るお祝いの文字（順番に表示）
const bannerQueue = [];
let bannerBusy = false;
function showBanner(text, sub) {
  bannerQueue.push([text, sub]);
  if (!bannerBusy) nextBanner();
}
function nextBanner() {
  const el = $("banner");
  const b = bannerQueue.shift();
  if (!b) { bannerBusy = false; el.classList.add("hidden"); return; }
  bannerBusy = true;
  el.textContent = b[0];
  if (b[1]) { const s = document.createElement("small"); s.textContent = b[1]; el.append(s); }
  el.classList.remove("hidden");
  el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
  setTimeout(nextBanner, 2400);
}

// ---- ドット絵キャラ（スプライト） ----
const SPRITE_SCALE = 0.68;   // 書き出したコマを画面に出すときの倍率
// 動きごとに、どのシートの何コマ目を、どの速さで出すか。
// そのシートがまだないキャラは fallback の動きで代用する。
//   シートA：idle（待機）/ run（走る）/ happy（バンザイ）/ sit（座る）
//   シートB：walk（歩く）/ surprise（びっくり・振り向く）/ cheer（励ます）/ wave（手を振る）
// 待機は正面の1コマだけにして、体を少し上下させて呼吸しているように見せる
// （まばたきのコマはキャラによって横を向いて描かれているので、待機には使わない）
const ANIMS = {
  idle:     { sheet: "idle",     fps: 1,   frames: [0] },
  look:     { sheet: "idle",     fps: 3,   frames: [0, 1, 2, 2, 2, 2, 2, 1, 0] },
  stroll:   { sheet: "run",      fps: 5,   frames: [0, 1, 2, 3] },
  dash:     { sheet: "run",      fps: 12,  frames: [0, 1, 2, 3] },
  happy:    { sheet: "happy",    fps: 7,   frames: [0, 1, 2, 3] },
  sit:      { sheet: "sit",      fps: 2,   frames: [0, 0, 0, 1, 1, 0] },
  sleep:    { sheet: "sit",      fps: 1.2, frames: [2, 3] },
  walk:     { sheet: "walk",     fps: 6,   frames: [0, 1, 2, 3], fallback: "stroll" },
  surprise: { sheet: "surprise", fps: 4,   frames: [0, 1, 1, 1, 2, 3, 3, 3], fallback: "look" },
  cheer:    { sheet: "cheer",    fps: 4,   frames: [0, 1, 2, 3], fallback: "sit" },
  wave:     { sheet: "wave",     fps: 5,   frames: [0, 1, 2, 3], fallback: "happy" },
};
function resolveAnim(name) {
  let a = ANIMS[name];
  while (a && !actor.meta.anims[a.sheet]) a = a.fallback ? ANIMS[a.fallback] : null;
  return a || ANIMS.idle;
}
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const spriteCache = {};      // キャラID -> Promise（sprite.json の中身、なければ null）

// スプライトを作り直したら数字を上げる（スマホに残った古い絵と、新しい sprite.json が混ざらないように）
const SPRITE_VERSION = 2;
function spriteSrc(id, anim) { return "img/sprites/" + id + "/" + anim + ".png?v=" + SPRITE_VERSION; }
function loadSprite(id) {
  if (!spriteCache[id]) {
    spriteCache[id] = fetch("img/sprites/" + id + "/sprite.json?v=" + SPRITE_VERSION)
      .then((r) => (r.ok ? r.json() : null))
      .then((meta) => {
        // 先に読み込んで手元に持っておく（動きを切り替えるたびに読み直さないように）
        if (meta) meta.images = Object.keys(meta.anims).map((a) => { const im = new Image(); im.src = spriteSrc(id, a); return im; });
        return meta;
      })
      .catch(() => null);
  }
  return spriteCache[id];
}

const actor = { id: null, meta: null, x: 0, dir: 1, anim: "idle", animStart: 0, mode: "idle", last: "",
                until: 0, target: 0, speed: 0, sleepAt: 0, emoteUntil: 0 };

function spriteW() { return actor.meta.frameW * SPRITE_SCALE; }

function setAnim(name) {
  const a = resolveAnim(name);
  const sheet = a.sheet;
  actor.anim = name;
  actor.animDef = a;
  actor.animStart = performance.now();
  const n = actor.meta.anims[sheet];
  const w = spriteW(), h = actor.meta.frameH * SPRITE_SCALE;
  const img = $("sprite-img");
  img.style.width = w + "px";
  img.style.height = h + "px";
  img.style.backgroundImage = "url(" + spriteSrc(actor.id, sheet) + ")";
  img.style.backgroundSize = n * w + "px " + h + "px";
}

// キャラの頭の上の小さなふきだし（♪・！・Zz・ドンマイ など）は出さないことにした。
// 呼び出し側はそのままにして、ここで常に隠す。
function emote() {
  $("emote").classList.add("hidden");
  actor.emoteUntil = 0;
}

// ひとりで過ごすときの動き。時間帯で選ばれやすさが変わる（夜はよく座って眠る）
function nextAction() {
  const night = periodNow() === "night";
  const pool = reduceMotion
    ? [["idle", 3], ["look", 2], ["rest", 1]]
    : [["idle", 5], ["walk", 4], ["dash", night ? 0 : 0.5], ["look", 1.5], ["rest", night ? 4 : 1],
       ["hop", night ? 0.2 : 0.4], ["surprise", 0.3], ["wave", night ? 0.2 : 0.4]];
  const usable = pool.filter(([n]) => n === "idle" || n !== actor.last);
  let r = Math.random() * usable.reduce((s, [, w]) => s + w, 0);
  for (const [name, w] of usable) { if ((r -= w) < 0) return startAction(name); }
  startAction("idle");
}

function startAction(name) {
  const now = performance.now();
  const maxX = Math.max(0, $("stage").clientWidth - spriteW());
  actor.mode = name;
  actor.last = name;
  $("sprite").classList.remove("hop", "breathe");
  $("sprite").classList.toggle("breathe", name === "idle");
  if (now > actor.emoteUntil) emote(null);
  switch (name) {
    case "idle":
      setAnim("idle"); actor.until = now + 3000 + Math.random() * 3500; break;
    case "walk": {
      setAnim("walk"); actor.speed = 28;
      let t = Math.random() * maxX;
      if (Math.abs(t - actor.x) < 70) t = actor.x > maxX / 2 ? actor.x - 100 : actor.x + 100;
      actor.target = Math.min(Math.max(t, 0), maxX);
      break;
    }
    case "dash":
      setAnim("dash"); actor.speed = 110;
      actor.target = actor.x > maxX / 2 ? Math.random() * maxX * 0.2 : maxX * (0.8 + Math.random() * 0.2);
      emote("！", 700);
      break;
    case "look":   // その場でちょっと横を見る（向きは変えない）
      setAnim("look"); actor.until = now + 3000;
      break;
    case "rest":
      setAnim("sit"); actor.until = now + 6000 + Math.random() * 4000; actor.sleepAt = now + 2500;
      break;
    case "hop":
      setAnim("happy"); actor.until = now + 1500;
      if (!reduceMotion) $("sprite").classList.add("hop");
      emote("♪", 1500);
      break;
    case "surprise":   // びっくりして、振り向く（絵の中で振り向くので、向きの反転はしない）
      setAnim("surprise"); actor.until = now + 2000;
      emote("！？", 1000);
      break;
    case "wave":       // こちらに手を振る
      setAnim("wave"); actor.until = now + 2000;
      if (Math.random() < 0.5) emote("♪", 1500);
      break;
  }
  if (actor.speed && (name === "walk" || name === "dash")) actor.dir = actor.target > actor.x ? 1 : -1;
}

// 記録したときやタップしたときのリアクション
//   celebrate＝飛びはねて喜ぶ / tap＝跳ねるか手を振る / calm＝やさしく励ます / greet＝あいさつに手を振る
function react(kind) {
  if (!actor.meta) return;
  const now = performance.now();
  $("sprite").classList.remove("hop", "breathe");
  actor.mode = "react";
  if (kind === "calm") {
    actor.until = now + 4000;
    setAnim("cheer"); emote("ドンマイ", 2500);
    return;
  }
  if (kind === "greet" || (kind === "tap" && Math.random() < 0.5)) {
    actor.until = now + 2200;
    setAnim("wave"); emote(kind === "greet" ? "やあ" : "♪", 1600);
    return;
  }
  actor.until = now + (kind === "celebrate" ? 3600 : 1300);
  setAnim("happy");
  if (!reduceMotion) $("sprite").classList.add("hop");
  emote(kind === "celebrate" ? "♥" : "！", kind === "celebrate" ? 3000 : 900);
}

function updateSprite(now, dt) {
  if (!actor.meta) return;
  const maxX = Math.max(0, $("stage").clientWidth - spriteW());

  if (actor.mode === "walk" || actor.mode === "dash") {
    actor.x += actor.dir * actor.speed * dt;
    if ((actor.dir > 0 && actor.x >= actor.target) || (actor.dir < 0 && actor.x <= actor.target)) {
      actor.x = actor.target;
      startAction("idle");
    }
  } else if (now > actor.until) {
    if (actor.mode === "react") startAction("idle"); else nextAction();
  }
  if (actor.mode === "rest" && actor.sleepAt && now > actor.sleepAt) {
    actor.sleepAt = 0; setAnim("sleep"); emote("Zz", actor.until - now);
  }
  if (actor.emoteUntil && now > actor.emoteUntil) emote(null);
  actor.x = Math.min(Math.max(actor.x, 0), maxX);

  const a = actor.animDef;
  const step = Math.floor(((now - actor.animStart) / 1000) * a.fps) % a.frames.length;
  const frame = a.frames[step] % actor.meta.anims[a.sheet];
  const img = $("sprite-img");
  img.style.backgroundPosition = -frame * spriteW() + "px 0";
  // 絵は右向きが基本。左向きに描かれた動き（sprite.json の faces）は逆に反転する
  const faces = Number((actor.meta.faces && actor.meta.faces[a.sheet]) || 1);
  img.style.transform = actor.dir * faces < 0 ? "scaleX(-1)" : "none";
  $("sprite").style.transform = "translateX(" + actor.x + "px)";
}

// 相棒が変わったら、そのキャラのスプライトを読み込んで登場させる
function mountSprite(id) {
  if (actor.id === id) return;
  actor.id = id;
  actor.meta = null;
  loadSprite(id).then((meta) => {
    if (actor.id !== id) return;
    actor.meta = meta;
    $("sprite").classList.toggle("hidden", !meta);
    $("avatar").classList.toggle("hidden", !!meta);
    if (!meta) { setAvatar($("avatar"), id); return; }
    actor.x = Math.max(0, ($("stage").clientWidth - spriteW()) / 2);
    actor.dir = 1;
    react("greet");   // 登場したら、まず手を振ってあいさつ
  });
}

// 背景とキャラを毎フレーム描く（ホーム画面が見えているときだけ）
function startLoop() {
  let prev = performance.now();
  const frame = (now) => {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    if ($("view-home").classList.contains("active") && document.visibilityState === "visible") {
      drawScene(now, dt);
      updateSprite(now, dt);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// ---- 効果音（WebAudioで合成） ----
let actx = null;
function wakeAudio() {
  if (!settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
  } catch (e) {}
}
function tone(freqs, dur, type, gap) {
  if (!settings.sound || !actx) return;
  try {
    const t0 = actx.currentTime;
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      const st = t0 + i * gap;
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.22, st + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, st + dur + 0.25);
      o.connect(g).connect(actx.destination);
      o.start(st); o.stop(st + dur + 0.3);
    });
  } catch (e) {}
}
const SFX = {
  kyukan:  () => tone([523, 659, 784, 1047, 1319], 0.16, "triangle", 0.09),
  drank:   () => tone([523, 659], 0.14, "sine", 0.12),
  partner: () => tone([659, 880, 1175], 0.16, "sine", 0.1),
  mission: () => tone([523, 784, 1047, 1568], 0.2, "triangle", 0.11),
  charge:  () => tone([196, 247, 294, 392, 494, 587, 784, 988], 0.1, "sawtooth", 0.14),
  reveal:  () => { tone([523, 659, 784, 1047], 0.9, "triangle", 0.015); tone([1319, 1568, 2093], 0.5, "sine", 0.12); },
};
function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

// ---- 相棒が決まったときの「召喚」演出 ----
// 光が集まる（ため）→ 白くはじける → キャラが登場して、名前・キャッチコピーが出る
const summonState = { open: false, phase: "", timers: [], parts: [], ctx: null, color: "#ffffff", frameTimer: 0, onClose: null, ready: false };

function summon(id, onClose) {
  const c = CHARS[id], el = $("summon"), st = summonState;
  closeSummon(true);
  Object.assign(st, { open: true, ready: false, onClose, color: c.color, parts: [], id });
  el.style.setProperty("--c", c.color);
  $("summon-role").textContent = c.role;
  $("summon-name").textContent = c.name;
  $("summon-catch").textContent = "";
  $("summon-hello").textContent = "";

  // 登場するキャラの絵（スプライトがあれば手を振る動き、なければ仮アイコン）
  const fig = $("summon-figure");
  fig.innerHTML = "";
  loadSprite(id).then((meta) => {
    if (!st.open) return;
    if (!meta) {
      const av = document.createElement("div");
      av.className = "avatar summon-avatar";
      setAvatar(av, id);
      fig.append(av);
      return;
    }
    const sheet = meta.anims.wave ? "wave" : meta.anims.happy ? "happy" : "idle";
    const n = meta.anims[sheet], k = 1.25, w = meta.frameW * k, h = meta.frameH * k;
    const sp = document.createElement("div");
    sp.className = "summon-sprite";
    Object.assign(sp.style, {
      width: w + "px", height: h + "px",
      backgroundImage: "url(" + spriteSrc(id, sheet) + ")", backgroundSize: n * w + "px " + h + "px",
    });
    fig.append(sp);
    let f = 0;
    st.frameTimer = setInterval(() => { f = (f + 1) % n; sp.style.backgroundPosition = -f * w + "px 0"; }, 200);
  });

  const cv = $("summon-fx"), dpr = window.devicePixelRatio || 1;
  cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr;
  st.ctx = cv.getContext("2d");
  st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  el.classList.remove("hidden");
  setPhase("charge");
  SFX.charge();
  buzz(20);
  st.timers.push(setTimeout(() => setPhase("flash"), reduceMotion ? 200 : 1500));
  st.timers.push(setTimeout(revealSummon, reduceMotion ? 300 : 1750));
  let last = performance.now();
  const loop = (now) => {
    if (!st.open) return;
    drawSummonFx(Math.min(0.05, (now - last) / 1000));
    last = now;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function setPhase(p) {
  summonState.phase = p;
  $("summon").className = "summon phase-" + p;
}

function revealSummon() {
  const st = summonState;
  if (!st.open || st.phase === "reveal") return;
  st.timers.forEach(clearTimeout);
  st.timers = [];
  setPhase("reveal");
  SFX.reveal();
  buzz([30, 40, 60]);
  // はじける光
  const W = window.innerWidth, H = window.innerHeight;
  for (let i = 0; i < 180; i++) {
    const a = Math.random() * Math.PI * 2, sp = 200 + Math.random() * 650;
    st.parts.push({ x: W / 2, y: H * 0.4, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.8 + Math.random() * 0.9,
                    size: 2 + Math.random() * 3, c: i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? st.color : "#ffd54a", drag: 0.9 });
  }
  // キャッチコピーを1文字ずつ
  const c = CHARS[st.id];
  const text = "「" + c.catch + "」";
  let i = 0;
  const type = setInterval(() => {
    i++;
    $("summon-catch").textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(type);
      $("summon-hello").textContent = c.hello;
    }
  }, 55);
  st.timers.push(type);
  st.timers.push(setTimeout(() => { st.ready = true; }, 900));
}

function drawSummonFx(dt) {
  const st = summonState, ctx = st.ctx;
  const W = window.innerWidth, H = window.innerHeight, cx = W / 2, cy = H * 0.4;
  ctx.clearRect(0, 0, W, H);
  if (st.phase === "charge") {
    // 周りから中心へ集まる光
    for (let i = 0; i < 5; i++) {
      const a = Math.random() * Math.PI * 2, r = 160 + Math.random() * 140;
      st.parts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, tx: cx, ty: cy, life: 1, size: 1.5 + Math.random() * 2.5,
                      c: Math.random() < 0.5 ? "#ffffff" : st.color, pull: 3 + Math.random() * 2 });
    }
  } else if (st.phase === "reveal" && Math.random() < 0.5) {
    // 舞い上がるきらきら
    st.parts.push({ x: Math.random() * W, y: H + 10, vx: (Math.random() - 0.5) * 20, vy: -(40 + Math.random() * 70), life: 4,
                    size: 1.5 + Math.random() * 2.5, c: Math.random() < 0.5 ? "#ffffff" : st.color, drag: 1, twinkle: true });
  }
  st.parts = st.parts.filter((p) => p.life > 0);
  st.parts.forEach((p) => {
    if (p.pull) {
      p.x += (p.tx - p.x) * p.pull * dt; p.y += (p.ty - p.y) * p.pull * dt;
      if (Math.hypot(p.tx - p.x, p.ty - p.y) < 8) p.life = 0;
    } else {
      p.vx *= p.drag; p.vy *= p.drag;
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    }
    ctx.globalAlpha = p.twinkle ? 0.4 + 0.6 * Math.abs(Math.sin(p.life * 6)) : Math.min(1, p.life * 2);
    ctx.fillStyle = p.c;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

function closeSummon(silent) {
  const st = summonState;
  if (!st.open) return;
  st.open = false;
  st.timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
  st.timers = [];
  clearInterval(st.frameTimer);
  $("summon").className = "summon hidden";
  if (!silent && st.onClose) st.onClose();
}

// ---- 描画 ----
const $ = (id) => document.getElementById(id);

// 下のタブのアイコン：ステージに合わせた12×12のドット絵（# が塗るマス）
const PIXEL_ICONS = {
  home: [
    ".....##.....",
    "....####....",
    "...######...",
    "..########..",
    ".##########.",
    "############",
    ".##########.",
    ".####..####.",
    ".####..####.",
    ".####..####.",
    ".####..####.",
    "............",
  ],
  cal: [
    "..#......#..",
    "############",
    "############",
    "#..........#",
    "#.##.##.##.#",
    "#.##.##.##.#",
    "#..........#",
    "#.##.##.##.#",
    "#.##.##.##.#",
    "#..........#",
    "############",
    "............",
  ],
  shop: [
    "...##..##...",
    "..#..##..#..",
    "...##..##...",
    "############",
    "#####..#####",
    "############",
    ".####..####.",
    ".####..####.",
    ".####..####.",
    ".####..####.",
    ".##########.",
    "............",
  ],
  gear: [
    ".....##.....",
    "..#..##..#..",
    ".##########.",
    "..########..",
    "..###..###..",
    "####....####",
    "####....####",
    "..###..###..",
    "..########..",
    ".##########.",
    "..#..##..#..",
    ".....##.....",
  ],
};
function pixelIconSvg(rows) {
  let rects = "";
  rows.forEach((row, y) => {
    // 横につながったマスは1本の長方形にまとめる
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "#") continue;
      let w = 1;
      while (row[x + w] === "#") w++;
      rects += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="1"/>';
      x += w - 1;
    }
  });
  return '<svg viewBox="0 0 12 12" width="24" height="24" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">' + rects + "</svg>";
}
function drawTabIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = pixelIconSvg(PIXEL_ICONS[el.dataset.icon]); });
}

function setAvatar(el, charId) {
  const c = CHARS[charId];
  el.style.setProperty("--av", c.color);
  el.innerHTML = c.icon; // 中身はこのファイル内の固定値のみ
}

// キャラ表示（スプライトがあれば動くドット絵、なければ仮アイコン）
function renderStage() {
  if (!actor.meta) setAvatar($("avatar"), settings.char);
  mountSprite(settings.char);
  $("char-name").textContent = CHARS[settings.char].name;
}

function renderHome(animate) {
  const today = logicalToday();
  const key = dateKey(today);
  const status = records[key];
  const c = CHARS[settings.char];
  const s = compute();

  $("today-label").textContent = labelOf(today);
  $("streak-num").textContent = s.streak;
  renderStage();

  let text;
  if (!status) {
    text = c.greet;
  } else if (todayMsg && todayMsg.date === key && todayMsg.char === settings.char && todayMsg.status === status) {
    text = todayMsg.text;
  } else {
    text = pickLine(settings.char, status);
    todayMsg = { date: key, char: settings.char, status, text };
    store.set("todayMsg", todayMsg);
  }
  $("bubble-text").textContent = text;

  if (animate) {
    const b = $("bubble"), a = $("avatar");
    b.classList.remove("pop"); a.classList.remove("jump");
    void b.offsetWidth;
    b.classList.add("pop"); a.classList.add("jump");
  }

  $("btn-kyukan").classList.toggle("selected", status === "kyukan");
  $("btn-drank").classList.toggle("selected", status === "drank");
  $("btn-kyukan").classList.toggle("dim", status === "drank");
  $("btn-drank").classList.toggle("dim", status === "kyukan");
  const lateNight = new Date().getHours() < 4;   // 朝4時までは前の日として数える
  $("today-status").textContent = status
    ? "今日の記録はバッチリ！（もう一方を押すと変更できます）"
    : lateNight ? "朝4時までは、前の日（" + labelOf(today) + "）の記録になります" : "今日の記録はまだです";
  renderAmount(key, status);

  const goal = settings.goal;
  $("st-week").textContent = s.weekKyu;
  $("st-week-goal").textContent = "/" + goal + "日";
  $("st-week-fill").style.width = Math.min(100, Math.round((s.weekKyu / goal) * 100)) + "%";
  $("stat-week").classList.toggle("clear", s.weekKyu >= goal);
  $("st-month").textContent = s.monthKyu;
  $("st-money").textContent = (s.monthKyu * settings.price).toLocaleString("ja-JP");
}

// ---- 飲んだ日の量（任意の3択） ----
// 「飲んだよ」を押した日にだけ出す。選ばなくてもよく、あとから変えたり、もう一度押して取り消したりできる
function renderAmount(key, status) {
  const box = $("amount");
  box.classList.toggle("hidden", status !== "drank");
  box.querySelectorAll("[data-amt]").forEach((b) => {
    const on = amounts[key] === b.dataset.amt;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", String(on));
  });
}
function setAmount(key, amt) {
  if (amounts[key] === amt) delete amounts[key];   // 同じものをもう一度押すと取り消し
  else amounts[key] = amt;
  store.set("amounts", amounts);
}
function openGuide() {
  const g = AMOUNT_GUIDE[settings.scale] || AMOUNT_GUIDE.std;
  $("guide-scale").textContent = g.name;
  const tb = $("guide-levels");
  tb.innerHTML = "";
  ["s", "m", "l"].forEach((k) => {
    const tr = document.createElement("tr");
    const a = document.createElement("td"); a.textContent = AMOUNT_LABELS[k];
    const b = document.createElement("td"); b.textContent = g[k];
    tr.append(a, b);
    tb.append(tr);
  });
  $("guide-sheet").classList.remove("hidden");
}

// ---- ふきだしのセリフを一定時間ごとに変える ----
// 記録前は「あいさつ＋ひとこと」、記録後はその日の記録（休肝日／飲んだ日）に合ったセリフから選ぶ
const CHAT_INTERVAL = 17000;   // 17秒ごと
let chatTimer = 0;
function chatPool() {
  const st = records[dateKey(logicalToday())];
  const c = CHARS[settings.char];
  if (st) return (SERIFU[settings.char] && SERIFU[settings.char][st]) || [c.greet];
  return [c.greet].concat(c.chat || []);
}
function rotateLine() {
  if (!$("view-home").classList.contains("active") || document.visibilityState !== "visible" || summonState.open) return;
  const pool = chatPool(), now = $("bubble-text").textContent;
  if (pool.length < 2) return;
  let t = now;
  for (let n = 0; n < 10 && t === now; n++) t = pool[Math.floor(Math.random() * pool.length)];
  $("bubble-text").textContent = t;
  const b = $("bubble");
  b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
}
// 記録したときやタップしたときは、出たばかりのセリフを次の切り替えまでしっかり見せる
function resetChatter() {
  clearInterval(chatTimer);
  chatTimer = setInterval(rotateLine, CHAT_INTERVAL);
}

function recordToday(status) {
  resetChatter();
  wakeAudio();
  const key = dateKey(logicalToday());
  const prev = records[key];

  if (prev === status) {                 // 同じボタンをもう一度：別のセリフを出す
    todayMsg = null;
    renderHome(true);
    react(status === "kyukan" ? "tap" : "calm");
    return;
  }
  const before = compute();
  records[key] = status;
  store.set("records", records);
  if (status === "kyukan" && amounts[key]) { delete amounts[key]; store.set("amounts", amounts); }   // 休肝日に直したら量は消す
  awardPoints(key);
  const after = compute();
  renderHome(true);

  // お祝いは、キャラのいるステージの中だけで完結させる
  if (status === "kyukan") {
    react("celebrate");
    spawnConfetti(true);
    SFX.kyukan();
    buzz(30);
    showBanner("休肝日達成！", CHARS[settings.char].name + "も大よろこび");
  } else {
    react("calm");
    SFX.drank();
  }
  if (before.weekKyu < settings.goal && after.weekKyu >= settings.goal) {
    showBanner("今週の目標クリア！", after.weekKyu + " / " + settings.goal + "日");
    setTimeout(() => { spawnConfetti(true); SFX.mission(); }, 2400);
  }
}

function renderCalendar() {
  const today = logicalToday();
  if (!calMonth) calMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  $("cal-title").textContent = y + "年" + (m + 1) + "月";

  const grid = $("cal-grid");
  grid.innerHTML = "";
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7;
  for (let i = 0; i < lead; i++) {
    const e = document.createElement("div");
    e.className = "cal-cell empty";
    grid.appendChild(e);
  }
  const days = new Date(y, m + 1, 0).getDate();
  let k = 0, dr = 0, none = 0;
  for (let day = 1; day <= days; day++) {
    const d = new Date(y, m, day);
    const key = dateKey(d);
    const st = records[key];
    const btn = document.createElement("button");
    btn.className = "cal-cell";
    btn.textContent = day;
    if (st) btn.classList.add(st);
    // 飲んだ量を選んだ日は、日付の下に小さな点（ちょっと1つ・ふつう2つ・たくさん3つ）
    if (st === "drank" && amounts[key]) {
      const dots = document.createElement("span");
      dots.className = "amt-dots";
      dots.textContent = "•".repeat({ s: 1, m: 2, l: 3 }[amounts[key]]);
      btn.append(dots);
      btn.setAttribute("aria-label", day + "日 飲んだ（" + AMOUNT_LABELS[amounts[key]] + "）");
    }
    if (key === dateKey(today)) btn.classList.add("today");
    if (d > today) {
      btn.classList.add("future");
      btn.disabled = true;
    } else {
      if (st === "kyukan") k++; else if (st === "drank") dr++; else none++;
      btn.addEventListener("click", () => openSheet(d));
    }
    grid.appendChild(btn);
  }
  $("cal-summary").textContent = "休肝日 " + k + "日 ／ 飲んだ日 " + dr + "日" + (none ? " ／ 未記録 " + none + "日" : "");

  const isThisMonth = y === today.getFullYear() && m === today.getMonth();
  $("cal-next").disabled = isThisMonth;
  $("cal-next").style.visibility = isThisMonth ? "hidden" : "visible";
  renderChart();
}

function openSheet(d) {
  sheetDate = d;
  $("sheet-title").textContent = labelOf(d) + " の記録";
  renderSheet();
  $("sheet").classList.remove("hidden");
}
// シートの中身：いまの記録に印をつけ、「飲んだ」の日は量の3択を出す
function renderSheet() {
  if (!sheetDate) return;
  const key = dateKey(sheetDate), st = records[key];
  $("sheet").querySelectorAll("[data-set=kyukan], [data-set=drank]").forEach((b) => {
    b.classList.toggle("selected", b.dataset.set === st);
    b.classList.toggle("dim", !!st && b.dataset.set !== st);
  });
  $("sheet-amount").classList.toggle("hidden", st !== "drank");
  $("sheet-amount").querySelectorAll("[data-samt]").forEach((b) => {
    const on = amounts[key] === b.dataset.samt;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", String(on));
  });
}
function closeSheet() { $("sheet").classList.add("hidden"); sheetDate = null; }

// キャラの顔アイコン：ドット絵の待機の1コマ目から、上半身を丸く切り抜いて見せる
// （スプライトがないキャラは仮アイコン）
function portrait(id, size) {
  const el = document.createElement("span");
  el.className = "portrait";
  el.style.setProperty("--av", CHARS[id].color);
  el.style.width = el.style.height = size + "px";
  loadSprite(id).then((meta) => {
    if (!meta || !meta.anims.idle) {
      const av = document.createElement("span");
      av.className = "avatar portrait-fallback";
      setAvatar(av, id);
      el.append(av);
      return;
    }
    // 待機の1コマ目で、絵のある範囲を調べて、頭から胸あたりが丸に収まるように切り抜く
    const img = meta.images[Object.keys(meta.anims).indexOf("idle")];
    const draw = () => {
      const crop = portraitCrop(id, img, meta);
      const dpr = window.devicePixelRatio || 1;
      const cv = document.createElement("canvas");
      cv.className = "portrait-img";
      cv.width = cv.height = Math.round(size * dpr);
      const ctx = cv.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, crop.x, crop.y, crop.s, crop.s, 0, 0, cv.width, cv.height);
      el.append(cv);
    };
    if (img.complete && img.naturalWidth) draw(); else img.addEventListener("load", draw, { once: true });
  });
  return el;
}

const cropCache = {};
function portraitCrop(id, img, meta) {
  if (cropCache[id]) return cropCache[id];
  const fw = meta.frameW, fh = meta.frameH;
  const cv = document.createElement("canvas");
  cv.width = fw; cv.height = fh;
  const ctx = cv.getContext("2d");
  ctx.drawImage(img, 0, 0, fw, fh, 0, 0, fw, fh);
  const a = ctx.getImageData(0, 0, fw, fh).data;
  let minX = fw, maxX = 0, minY = fh, maxY = 0;
  for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) {
    if (a[(y * fw + x) * 4 + 3] > 40) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX) return { x: 0, y: 0, s: Math.min(fw, fh) };
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  // 人のキャラは頭〜胸（高さの6割）、マスコットは全身が入る大きさ
  const s = Math.round(Math.max(cw, ch * 0.62) * 1.12);
  const crop = { x: Math.round(minX + cw / 2 - s / 2), y: Math.round(minY - s * 0.06), s };
  cropCache[id] = crop;
  return crop;
}

// 紹介文（名前・担当・キャッチコピー・説明・好き/苦手）
function profileBody(id) {
  const c = CHARS[id];
  const body = document.createElement("div");
  body.className = "pf-body";
  const head = document.createElement("div");
  head.className = "pf-head";
  const nm = document.createElement("b"); nm.textContent = c.name;
  const rl = document.createElement("span"); rl.className = "pf-role"; rl.textContent = c.role;
  head.append(nm, rl);
  const ct = document.createElement("p"); ct.className = "pf-catch"; ct.textContent = "「" + c.catch + "」";
  const ds = document.createElement("p"); ds.className = "pf-desc"; ds.textContent = c.desc;
  const tags = document.createElement("div"); tags.className = "pf-tags";
  const lk = document.createElement("span"); lk.textContent = "好き：" + c.likes;
  const dl = document.createElement("span"); dl.textContent = "苦手：" + c.dislikes;
  tags.append(lk, dl);
  body.append(head, ct, ds, tags);
  return body;
}

// 相棒を並べる順番（ひなた・りん・そう・肝臓くん・ゼニ丸）
const CHAR_ORDER = ["hinata", "mio", "aoi", "kanzo", "zenimaru"];

// 初回の相棒選び：紹介カードを並べて、タップで決定
function renderProfiles(containerId, onPick) {
  const box = $(containerId);
  box.innerHTML = "";
  CHAR_ORDER.forEach((id) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "profile";
    card.style.setProperty("--av", CHARS[id].color);
    card.append(portrait(id, 64), profileBody(id));
    card.addEventListener("click", () => onPick(id));
    box.appendChild(card);
  });
}

// 設定の相棒：上の顔アイコンで見たいキャラを選び、紹介を読んでから「相棒にする」
let partnerFocus = null;
function renderPartner() {
  if (!partnerFocus) partnerFocus = settings.char;
  const picker = $("partner-picker");
  picker.innerHTML = "";
  CHAR_ORDER.forEach((id) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pick" + (id === partnerFocus ? " focus" : "") + (id === settings.char ? " current" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(id === partnerFocus));
    b.style.setProperty("--av", CHARS[id].color);
    const name = document.createElement("span");
    name.className = "pick-name";
    name.textContent = CHARS[id].name;
    b.append(portrait(id, 52), name);
    b.addEventListener("click", () => { partnerFocus = id; renderPartner(); });
    picker.append(b);
  });

  const detail = $("partner-detail");
  detail.innerHTML = "";
  detail.style.setProperty("--av", CHARS[partnerFocus].color);
  detail.append(portrait(partnerFocus, 84), profileBody(partnerFocus));

  const btn = $("btn-partner");
  const isCurrent = partnerFocus === settings.char;
  btn.disabled = isCurrent;
  btn.textContent = isCurrent ? "いまの相棒です" : CHARS[partnerFocus].name + "を相棒にする";
}

function renderSettings() {
  partnerFocus = settings.char;
  renderPartner();
  $("set-goal").value = String(settings.goal);
  $("set-scale").value = settings.scale === "low" ? "low" : "std";
  $("set-price").value = settings.price;
  $("set-sound").checked = !!settings.sound;
  $("import-box").classList.add("hidden");
}

// ---- 比較グラフ（記録をはじめた日から今日まで、週ごと／月ごとの休肝日と飲んだ日） ----
let chartUnit = store.get("chartUnit", "month");
const TABLE_ROWS = 36;   // 「数字で見る」に出す期間の数（直近36か月／36週）

function firstRecordKey() {
  const keys = Object.keys(records).sort();
  return keys.length ? keys[0] : null;
}

function periodStats(unit) {
  const fk = firstRecordKey();
  if (!fk) return [];
  const today = logicalToday(), tk = dateKey(today);
  const [fy, fm, fd] = fk.split("-").map(Number);
  let start = unit === "week" ? weekStart(new Date(fy, fm - 1, fd)) : new Date(fy, fm - 1, 1);
  const out = [];
  while (start <= today) {
    const end = unit === "week"
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
      : new Date(start.getFullYear(), start.getMonth() + 1, 0);
    let k = 0, d = 0, counted = 0;
    const amt = { s: 0, m: 0, l: 0, u: 0 };   // 飲んだ日の量の内訳（u＝量は未選択）
    for (const day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const key = dateKey(day);
      if (key > tk) break;
      if (key < fk) continue;   // 記録をはじめる前の日は数えない
      counted++;
      if (records[key] === "kyukan") k++;
      else if (records[key] === "drank") { d++; amt[amounts[key] || "u"]++; }
    }
    const y = start.getFullYear(), m = start.getMonth() + 1;
    out.push({
      label: unit === "week" ? m + "/" + start.getDate() : m + "月",
      sub: unit === "month" && (m === 1 || !out.length) ? y + "年" : "",
      full: unit === "week"
        ? y + "年" + m + "/" + start.getDate() + "〜" + (end.getMonth() + 1) + "/" + end.getDate()
        : y + "年" + m + "月",
      kyukan: k, drank: d, none: counted - k - d, current: end >= today, amt,
    });
    start = unit === "week"
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
      : new Date(start.getFullYear(), start.getMonth() + 1, 1);
  }
  return out;
}

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
// 上の角だけ丸い棒
function barPath(x, y, w, h, r) {
  if (h <= 0) return "";
  r = Math.min(r, h, w / 2);
  return "M" + x + "," + (y + h) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y +
         "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + "V" + (y + h) + "Z";
}

function renderChart() {
  const unit = chartUnit === "week" ? "week" : "month";
  document.querySelectorAll(".chart-panel .seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.unit === unit)));
  const data = periodStats(unit);
  const box = $("chart"), tip = $("chart-tip");
  tip.classList.add("hidden");
  box.innerHTML = "";
  $("chart-th").textContent = unit === "week" ? "週" : "月";
  $("chart-table-title").textContent = "数字で見る（直近" + TABLE_ROWS + (unit === "week" ? "週）" : "か月）");

  const fk = firstRecordKey();
  if (!fk) {
    $("chart-range").textContent = "";
    const empty = document.createElement("p");
    empty.className = "chart-empty";
    empty.textContent = "記録をつけると、ここに" + (unit === "week" ? "週" : "月") + "ごとのグラフが出ます。";
    box.append(empty);
    $("chart-tbody").innerHTML = "";
    $("chart-amt").innerHTML = "";
    return;
  }
  const [fy, fm, fd] = fk.split("-").map(Number);
  $("chart-range").textContent = fy + "/" + fm + "/" + fd + " から";

  // 目盛り：週は0〜7日、月は10日きざみ
  const maxV = Math.max(1, ...data.map((d) => Math.max(d.kyukan, d.drank)));
  const top = unit === "week" ? 7 : Math.max(10, Math.ceil(maxV / 10) * 10);
  const ticks = unit === "week" ? [0, 7] : [0, top / 2, top];

  // 期間が多いときは横にスクロール（最新が見える位置から始める）
  const AXIS_W = 28, H = 196;
  const pad = { t: 14, b: 34 };
  const plotH = H - pad.t - pad.b;
  const avail = Math.max(240, (box.clientWidth || 320) - AXIS_W);
  const minSlot = unit === "week" ? 40 : 46;
  const slot = Math.max(minSlot, avail / Math.max(data.length, 1));
  const W = Math.max(avail, slot * data.length);
  const yOf = (v) => pad.t + plotH - (v / top) * plotH;

  const axis = svgEl("svg", { width: AXIS_W, height: H, class: "chart-axis", "aria-hidden": "true" });
  ticks.forEach((v) => {
    const t = svgEl("text", { x: AXIS_W - 6, y: yOf(v) + 4, class: "tick", "text-anchor": "end" });
    t.textContent = v;
    axis.append(t);
  });

  const svg = svgEl("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img",
                             "aria-label": (unit === "week" ? "週" : "月") + "ごとの、休肝日と飲んだ日の日数" });
  ticks.forEach((v) => {
    svg.append(svgEl("line", { x1: 0, x2: W, y1: yOf(v), y2: yOf(v), class: v === 0 ? "axis" : "grid" }));
  });

  const bw = Math.min(14, slot * 0.3), gap = 2;
  const panel = box.closest(".chart-panel");
  data.forEach((d, i) => {
    const cx = slot * i + slot / 2;
    const g = svgEl("g", { class: "period" + (d.current ? " current" : "") });
    [["kyukan", d.kyukan, cx - gap / 2 - bw], ["drank", d.drank, cx + gap / 2]].forEach(([cls, v, x]) => {
      const y = yOf(v);
      if (v > 0) g.append(svgEl("path", { d: barPath(x, y, bw, pad.t + plotH - y, 4), class: "bar " + cls }));
    });
    const lab = svgEl("text", { x: cx, y: H - 18, class: "tick period-label", "text-anchor": "middle" });
    lab.textContent = d.label;
    g.append(lab);
    if (d.sub) {
      const sub = svgEl("text", { x: cx, y: H - 4, class: "tick sub", "text-anchor": "middle" });
      sub.textContent = d.sub;
      g.append(sub);
    }
    // 当たり判定は棒より広く（期間ごとの縦の帯）
    const hit = svgEl("rect", { x: slot * i, y: 0, width: slot, height: H, class: "hit" });
    const show = () => {
      svg.querySelectorAll(".period").forEach((p) => p.classList.remove("hover"));
      g.classList.add("hover");
      tip.innerHTML = "";
      const b = document.createElement("b"); b.textContent = d.full;
      const r1 = document.createElement("span"); r1.innerHTML = '<i class="key kyukan"></i>';
      r1.append("休肝日 " + d.kyukan + "日");
      const r2 = document.createElement("span"); r2.innerHTML = '<i class="key drank"></i>';
      r2.append("飲んだ日 " + d.drank + "日");
      tip.append(b, r1, r2);
      if (d.none) { const r3 = document.createElement("span"); r3.className = "tip-muted"; r3.textContent = "未記録 " + d.none + "日"; tip.append(r3); }
      tip.classList.remove("hidden");
      const pr = panel.getBoundingClientRect(), hr = hit.getBoundingClientRect();
      const left = hr.left - pr.left + hr.width / 2 - 90;
      tip.style.left = Math.min(Math.max(8, left), pr.width - 188) + "px";
      tip.style.top = (box.offsetTop + 6) + "px";
    };
    hit.addEventListener("pointerenter", show);
    hit.addEventListener("click", show);
    g.append(hit);
    svg.append(g);
  });
  svg.addEventListener("pointerleave", () => {
    tip.classList.add("hidden");
    svg.querySelectorAll(".period").forEach((p) => p.classList.remove("hover"));
  });

  const wrap = document.createElement("div");
  wrap.className = "chart-wrap";
  const scroll = document.createElement("div");
  scroll.className = "chart-scroll";
  scroll.append(svg);
  scroll.addEventListener("scroll", () => tip.classList.add("hidden"));
  wrap.append(axis, scroll);
  box.append(wrap);
  scroll.scrollLeft = scroll.scrollWidth;

  // 表（数字で見る）：新しい順に、直近36か月／36週
  const tb = $("chart-tbody");
  tb.innerHTML = "";
  data.slice(-TABLE_ROWS).reverse().forEach((d) => {
    const tr = document.createElement("tr");
    // 期間は「年」を小さく上に、その下に「10月」「10/12〜」
    const th = document.createElement("td");
    th.className = "period-cell";
    const yr = document.createElement("small");
    yr.textContent = d.full.split("年")[0] + "年";
    th.append(yr, d.label + (unit === "week" ? "〜" : ""));
    tr.append(th);
    [d.kyukan, d.drank, d.none].forEach((v) => {
      const td = document.createElement("td"); td.textContent = v + "日"; tr.append(td);
    });
    tb.append(tr);
    // 記録があれば、すぐ下の行に「休肝日＋飲んだ量」の内訳（色の帯＋数字）を出す
    if (d.kyukan || d.drank) {
      tr.classList.add("has-amt");
      const sub = document.createElement("tr");
      sub.className = "amt-row";
      const td = document.createElement("td");
      td.colSpan = 4;
      const bar = document.createElement("div");
      bar.className = "amt-bar";
      const chips = document.createElement("div");
      chips.className = "amt-chips";
      [["kyukan", "休肝日", d.kyukan]].concat(["s", "m", "l", "u"].map((k) => ["amt-" + k, k === "u" ? "未選択" : AMT_NAMES[k], d.amt[k]])).forEach(([cls, name, n]) => {
        if (n) {
          const seg = document.createElement("i");
          seg.className = cls;
          seg.style.flexGrow = n;
          bar.append(seg);
        }
        const c = document.createElement("span");
        if (!n) c.className = "zero";
        c.innerHTML = '<i class="key ' + cls + '"></i>' + name + " <b>" + n + "</b>";
        chips.append(c);
      });
      td.append(bar, chips);
      sub.append(td);
      tb.append(sub);
    }
  });

  renderAmountChart(unit, data);
}

// 飲んだ日の量：期間ごとに1本の棒を、下から「たくさん・ふつう・ちょっと・量は未選択」で積み上げる
const AMT_ORDER = ["l", "m", "s", "u"];
const AMT_NAMES = { s: "ちょっと", m: "ふつう", l: "たくさん", u: "量は未選択" };
function renderAmountChart(unit, data) {
  const box = $("chart-amt"), tip = $("chart-tip");
  box.innerHTML = "";
  if (!data.some((d) => d.drank > 0)) {
    const empty = document.createElement("p");
    empty.className = "chart-empty small";
    empty.textContent = "「飲んだよ」の日に量を選ぶと、ここで比べられます。";
    box.append(empty);
    return;
  }
  const maxV = Math.max(1, ...data.map((d) => d.drank));
  const top = unit === "week" ? 7 : Math.max(10, Math.ceil(maxV / 10) * 10);
  const ticks = unit === "week" ? [0, 7] : [0, top / 2, top];
  const AXIS_W = 28, H = 170, pad = { t: 12, b: 26 }, plotH = H - pad.t - pad.b;
  const avail = Math.max(240, (box.clientWidth || 320) - AXIS_W);
  const slot = Math.max(unit === "week" ? 40 : 46, avail / Math.max(data.length, 1));
  const W = Math.max(avail, slot * data.length);
  const yOf = (v) => pad.t + plotH - (v / top) * plotH;

  const axis = svgEl("svg", { width: AXIS_W, height: H, class: "chart-axis", "aria-hidden": "true" });
  ticks.forEach((v) => {
    const t = svgEl("text", { x: AXIS_W - 6, y: yOf(v) + 4, class: "tick", "text-anchor": "end" });
    t.textContent = v;
    axis.append(t);
  });
  const svg = svgEl("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img",
                             "aria-label": (unit === "week" ? "週" : "月") + "ごとの、飲んだ日の量の内訳" });
  ticks.forEach((v) => svg.append(svgEl("line", { x1: 0, x2: W, y1: yOf(v), y2: yOf(v), class: v === 0 ? "axis" : "grid" })));

  const bw = Math.min(18, slot * 0.4), gap = 2;
  const panel = box.closest(".chart-panel");
  data.forEach((d, i) => {
    const cx = slot * i + slot / 2;
    const g = svgEl("g", { class: "period" + (d.current ? " current" : "") });
    let acc = 0;
    const segs = AMT_ORDER.filter((k) => d.amt[k] > 0);
    segs.forEach((k, j) => {
      const y0 = yOf(acc), y1 = yOf(acc + d.amt[k]);
      const h = y0 - y1 - (j > 0 ? gap : 0);   // 重ねた区切りに2pxのすき間
      if (h > 0) {
        const last = j === segs.length - 1;
        g.append(svgEl("path", {
          d: last ? barPath(cx - bw / 2, y1, bw, h, 4) : "M" + (cx - bw / 2) + "," + (y1 + h) + "V" + y1 + "H" + (cx + bw / 2) + "V" + (y1 + h) + "Z",
          class: "bar amt-" + k,
        }));
      }
      acc += d.amt[k];
    });
    const lab = svgEl("text", { x: cx, y: H - 8, class: "tick period-label", "text-anchor": "middle" });
    lab.textContent = d.label;
    g.append(lab);
    const hit = svgEl("rect", { x: slot * i, y: 0, width: slot, height: H, class: "hit" });
    const show = () => {
      svg.querySelectorAll(".period").forEach((p) => p.classList.remove("hover"));
      g.classList.add("hover");
      tip.innerHTML = "";
      const b = document.createElement("b"); b.textContent = d.full + "（飲んだ日 " + d.drank + "日）";
      tip.append(b);
      ["s", "m", "l", "u"].forEach((k) => {
        if (!d.amt[k]) return;
        const r = document.createElement("span"); r.innerHTML = '<i class="key amt-' + k + '"></i>';
        r.append(AMT_NAMES[k] + " " + d.amt[k] + "日");
        tip.append(r);
      });
      if (!d.drank) { const r = document.createElement("span"); r.className = "tip-muted"; r.textContent = "飲んだ日はありません"; tip.append(r); }
      tip.classList.remove("hidden");
      const pr = panel.getBoundingClientRect(), hr = hit.getBoundingClientRect();
      tip.style.left = Math.min(Math.max(8, hr.left - pr.left + hr.width / 2 - 90), pr.width - 188) + "px";
      tip.style.top = (box.getBoundingClientRect().top - pr.top + 6) + "px";
    };
    hit.addEventListener("pointerenter", show);
    hit.addEventListener("click", show);
    g.append(hit);
    svg.append(g);
  });
  svg.addEventListener("pointerleave", () => {
    tip.classList.add("hidden");
    svg.querySelectorAll(".period").forEach((p) => p.classList.remove("hover"));
  });
  const wrap = document.createElement("div");
  wrap.className = "chart-wrap";
  const scroll = document.createElement("div");
  scroll.className = "chart-scroll";
  scroll.append(svg);
  scroll.addEventListener("scroll", () => tip.classList.add("hidden"));
  wrap.append(axis, scroll);
  box.append(wrap);
  scroll.scrollLeft = scroll.scrollWidth;
  // 上の「休肝日・飲んだ日」のグラフと横スクロールをそろえる
  const main = document.querySelector("#chart .chart-scroll");
  if (main) {
    const link = (from, to) => from.addEventListener("scroll", () => {
      if (Math.abs(to.scrollLeft - from.scrollLeft) > 1) to.scrollLeft = from.scrollLeft;
    });
    link(main, scroll);
    link(scroll, main);
  }
}

// ---- ポイントのやりとり ----
function isRecentDay(key) {
  const t = logicalToday(), y = new Date(t);
  y.setDate(y.getDate() - 1);
  return key === dateKey(t) || key === dateKey(y);
}
// その日に初めて記録したときだけポイントを渡す（記録を直したり消してつけ直しても、もらえるのは1回）
function awardPoints(key, ignoreRule) {
  if (awarded[key]) return 0;
  if (POINTS_RECENT_ONLY && !ignoreRule && !isRecentDay(key)) return 0;
  awarded[key] = true;
  points += POINTS_PER_RECORD;
  store.set("awarded", awarded);
  store.set("points", points);
  renderPoints(!ignoreRule);   // 過去の記録をまとめて数えるときは「+1,000」を出さない
  return POINTS_PER_RECORD;
}
const fmt = (n) => n.toLocaleString("ja-JP");
function renderPoints(gained) {
  $("pt-num").textContent = fmt(points);
  $("shop-points").textContent = fmt(points);
  if (gained) {
    const pop = document.createElement("span");
    pop.className = "pt-pop";
    pop.textContent = "+" + fmt(POINTS_PER_RECORD);
    $("wallet-chip").append(pop);
    setTimeout(() => pop.remove(), 1600);
  }
}

// ---- 交換所 ----
let shopCat = "bg";
function isEquipped(it) { return it.cat === "bg" ? (equip.bg || "default") === it.key : equip[it.cat] === it.key; }

// 品物の見本（背景はその景色の縮小版、小物と飾りはドット絵）
function shopThumb(it) {
  const cv = document.createElement("canvas");
  cv.className = "thumb";
  const ctx = cv.getContext("2d");
  if (it.cat === "bg") {
    cv.width = 48; cv.height = 28;
    const period = it.key === "fireworks" ? "night" : "day";
    drawBackground(ctx, 48, 28, period, it.key, seeded(7));
    if (it.key === "fireworks") {
      [["#ffd54a", 14, 6], ["#ff6fa8", 32, 9]].forEach(([col, x, y]) => {
        ctx.fillStyle = col;
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          ctx.fillRect(Math.round(x + Math.cos(a) * 3), Math.round(y + Math.sin(a) * 3), 1, 1);
        }
      });
    }
  } else {
    if (it.key === "firefly") {   // ほたる：夜の草むらに光の点
      cv.width = 48; cv.height = 28;
      ctx.fillStyle = "#1f1756"; ctx.fillRect(0, 0, 48, 28);
      ctx.fillStyle = "#2f5d4c"; ctx.fillRect(0, 22, 48, 6);
      [[8, 14], [17, 9], [25, 17], [33, 11], [40, 16], [13, 19]].forEach(([x, y]) => {
        ctx.fillStyle = "rgba(216,255,122,.35)"; ctx.fillRect(x - 1, y - 1, 3, 3);
        ctx.fillStyle = "#f4ffb0"; ctx.fillRect(x, y, 1, 1);
      });
      return cv;
    }
    // 小物と動物：まず1マス＝1pxで下書きして、絵のある範囲を切り出し、
    // ドット1つの大きさをそろえて（小物は3倍、動物は6倍）真ん中に置く。
    // 箱に合わせて伸ばすと、細長い物だけドットが小さくなって不ぞろいに見えるため
    const raw = document.createElement("canvas");
    raw.width = 64; raw.height = 40;
    const rc = raw.getContext("2d");
    if (CUSTOM_PROPS[it.key]) CUSTOM_PROPS[it.key](rc, 32, 38, 1.3, "day");
    else if (it.key === "peacock") drawPeacock(rc, 26, 30, false, true);   // 見本は羽を広げた姿
    else {
      const art = it.cat === "prop" ? PROP_ART[it.key] : PET_ART[it.key];
      const rows = art.frames[0], n = it.key === "chicks" ? 3 : 1;   // ひよこは3羽で並べる
      for (let i = 0; i < n; i++) drawBitmap(rc, rows, art.pal, 4 + i * (rows[0].length + 2), 38 - rows.length);
    }
    const box = opaqueBox(rc, 64, 40);
    const W = 144, H = 84;   // 背景のサムネと同じ 48:28
    cv.width = W; cv.height = H;
    ctx.imageSmoothingEnabled = false;
    const s = Math.max(1, Math.min(it.cat === "prop" ? 3 : 6, Math.floor(Math.min((W - 16) / box.w, (H - 8) / box.h))));
    const dw = box.w * s, dh = box.h * s;
    ctx.drawImage(raw, box.x, box.y, box.w, box.h, Math.round((W - dw) / 2), Math.round((H - dh) / 2), dw, dh);
  }
  return cv;
}

// 絵が描かれている範囲（透明でないところ）を調べる
function opaqueBox(c, w, h) {
  const d = c.getImageData(0, 0, w, h).data;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (d[(y * w + x) * 4 + 3] > 0) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  if (maxX < 0) return { x: 0, y: 0, w, h };
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

// 「持ちもの」：交換したものの中から、背景・小物・動物をそれぞれ1つずつ選んで使う
const SLOT_NAMES = { bg: "背景", prop: "小物", pet: "動物" };
function renderMine() {
  const grid = $("shop-grid");
  grid.className = "mine";
  grid.innerHTML = "";
  ["bg", "prop", "pet"].forEach((cat) => {
    const sec = document.createElement("section");
    sec.className = "slot";
    const h = document.createElement("h3");
    h.textContent = SLOT_NAMES[cat];
    sec.append(h);
    const row = document.createElement("div");
    row.className = "slot-row";
    const mine = SHOP.filter((it) => it.cat === cat && (it.price === 0 || owned.includes(shopId(it))));
    const choices = cat === "bg" ? mine : [null].concat(mine);   // 小物と飾りは「なし」も選べる
    choices.forEach((it) => {
      const on = it ? isEquipped(it) : !equip[cat];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice" + (on ? " on" : "");
      b.setAttribute("aria-pressed", String(on));
      if (it) b.append(shopThumb(it));
      else { const none = document.createElement("span"); none.className = "thumb none"; none.textContent = "なし"; b.append(none); }
      const name = document.createElement("span");
      name.className = "choice-name";
      name.textContent = it ? it.name : "つけない";
      b.append(name);
      b.addEventListener("click", () => {
        if (on) return;
        if (it) equipItem(it, true);
        else { equip[cat] = null; store.set("equip", equip); renderShop(); toast(SLOT_NAMES[cat] + "を外しました"); }
      });
      row.append(b);
    });
    if (cat !== "bg" && !mine.length) {
      const empty = document.createElement("p");
      empty.className = "note";
      empty.textContent = "まだ持っていません。交換所で交換するとここに並びます。";
      sec.append(row, empty);
    } else sec.append(row);
    grid.append(sec);
  });
}

function renderShop() {
  renderPoints(false);
  document.querySelectorAll(".shop-seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === shopCat)));
  if (shopCat === "mine") return renderMine();
  const grid = $("shop-grid");
  grid.className = "shop-grid";
  grid.innerHTML = "";
  SHOP.filter((it) => it.cat === shopCat).forEach((it) => {
    const id = shopId(it), have = owned.includes(id) || it.price === 0, on = isEquipped(it);
    const card = document.createElement("article");
    card.className = "item" + (on ? " on" : "") + (have ? " have" : "") + (it.premium ? " premium" : "");
    const name = document.createElement("b"); name.textContent = it.name;
    const desc = document.createElement("span"); desc.className = "item-desc"; desc.textContent = it.desc;
    const btn = document.createElement("button");
    btn.type = "button";
    if (!have) {
      const short = it.price - points;
      btn.className = "primary";
      btn.disabled = short > 0;
      btn.textContent = short > 0 ? "あと " + fmt(short) + "pt" : fmt(it.price) + "pt で交換";
      btn.addEventListener("click", () => buyItem(it));
    } else if (on) {
      btn.className = "secondary";
      btn.textContent = it.cat === "bg" ? "使用中" : "外す";
      btn.disabled = it.cat === "bg";
      btn.addEventListener("click", () => equipItem(it, false));
    } else {
      btn.className = "secondary";
      btn.textContent = "使う";
      btn.addEventListener("click", () => equipItem(it, true));
    }
    const head = document.createElement("div");
    head.className = "item-head";
    head.append(name);
    if (on) { const tag = document.createElement("span"); tag.className = "item-tag"; tag.textContent = "使用中"; head.append(tag); }
    else if (have) { const tag = document.createElement("span"); tag.className = "item-tag owned"; tag.textContent = "交換ずみ"; head.append(tag); }
    else if (it.premium) { const tag = document.createElement("span"); tag.className = "item-tag premium"; tag.textContent = "特別"; head.append(tag); }
    card.append(shopThumb(it), head, desc, btn);
    grid.append(card);
  });
}

// アプリの中に出す確認画面（ブラウザの確認ウィンドウは、アプリの中や一部のブラウザで出ないことがあるため）
function askConfirm(text, yesLabel, thumb) {
  return new Promise((resolve) => {
    const box = $("ask");
    $("ask-text").textContent = text;
    $("ask-yes").textContent = yesLabel;
    $("ask-thumb").innerHTML = "";
    if (thumb) $("ask-thumb").append(thumb);
    $("ask-thumb").classList.toggle("hidden", !thumb);
    box.classList.remove("hidden");
    const done = (ok) => {
      box.classList.add("hidden");
      $("ask-yes").onclick = $("ask-no").onclick = box.onclick = null;
      resolve(ok);
    };
    $("ask-yes").onclick = () => done(true);
    $("ask-no").onclick = () => done(false);
    box.onclick = (e) => { if (e.target === box) done(false); };
  });
}

async function buyItem(it) {
  if (points < it.price) return;
  const ok = await askConfirm("「" + it.name + "」を " + fmt(it.price) + " ポイントで交換しますか？\n（のこり " + fmt(points - it.price) + " ポイント）", "交換する", shopThumb(it));
  if (!ok || points < it.price || owned.includes(shopId(it))) return;
  points -= it.price;
  owned.push(shopId(it));
  store.set("points", points);
  store.set("owned", owned);
  equipItem(it, true, true);
  SFX.mission();
  toast("「" + it.name + "」と交換しました！さっそく使っています（「持ちもの」で切りかえられます）");
}

function equipItem(it, on, silent) {
  if (it.cat === "bg") equip.bg = it.key;
  else equip[it.cat] = on ? it.key : null;
  store.set("equip", equip);
  scene.key = "";   // 背景を描き直す
  scene.pet = null;
  renderShop();
  if (!silent) toast(on ? "「" + it.name + "」を使っています" : "「" + it.name + "」を外しました");
}

// 品ぞろえを変えたときの引っ越し：
//   頭の飾り（なくなった）→ 使ったポイントを返す / 小物の「ねこ」→ 動物の「ねこ」に移す
const RETIRED_PRICES = { "hat:ribbon": 4000, "hat:straw": 7000, "hat:usamimi": 8000, "hat:santa": 9000, "hat:crown": 12000 };
function migrateShop() {
  let refund = 0;
  owned = owned.filter((id) => {
    if (RETIRED_PRICES[id]) { refund += RETIRED_PRICES[id]; return false; }
    return true;
  }).map((id) => (id === "prop:cat" ? "pet:cat" : id));
  if (equip.prop === "cat") { equip.prop = null; equip.pet = "cat"; }
  delete equip.hat;
  owned = owned.filter((id, i) => owned.indexOf(id) === i && SHOP.some((it) => shopId(it) === id));
  if (refund) {
    points += refund;
    store.set("points", points);
    setTimeout(() => toast("頭の飾りがなくなったので、" + fmt(refund) + "ポイントを返しました"), 1500);
  }
  store.set("owned", owned);
  store.set("equip", equip);
}

// ---- バックアップ ----
function exportData() {
  return JSON.stringify({ app: "kyukanbi", v: 1, savedAt: new Date().toISOString(), records, amounts, settings, points, awarded, owned, equip });
}
function importData(text) {
  let d;
  try { d = JSON.parse(text.trim()); } catch (e) { return "読み込めませんでした。コピーした文字をそのまま貼り付けてください。"; }
  if (!d || d.app !== "kyukanbi" || typeof d.records !== "object") return "休肝日ノートの記録ではないようです。";
  const clean = {};
  for (const k in d.records) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(k) && (d.records[k] === "kyukan" || d.records[k] === "drank")) clean[k] = d.records[k];
  }
  records = clean;
  store.set("records", records);
  amounts = {};
  if (d.amounts && typeof d.amounts === "object") {
    for (const k in d.amounts) if (clean[k] === "drank" && ["s", "m", "l"].includes(d.amounts[k])) amounts[k] = d.amounts[k];
  }
  store.set("amounts", amounts);
  if (d.settings && CHARS[d.settings.char]) {
    settings = Object.assign(settings, {
      char: d.settings.char,
      goal: Math.min(7, Math.max(1, Number(d.settings.goal) || 2)),
      price: Math.max(0, Number(d.settings.price) || 0),
      sound: d.settings.sound !== false,
      scale: d.settings.scale === "low" ? "low" : "std",
    });
    saveSettings();
  }
  // ポイントと交換したもの（古いバックアップには入っていないので、そのときは今のまま）
  if (typeof d.points === "number" && d.points >= 0) { points = Math.floor(d.points); store.set("points", points); }
  if (d.awarded && typeof d.awarded === "object") { awarded = d.awarded; store.set("awarded", awarded); }
  if (Array.isArray(d.owned)) {
    owned = d.owned.filter((id) => SHOP.some((it) => shopId(it) === id));
    store.set("owned", owned);
  }
  if (d.equip && typeof d.equip === "object") {
    const ok = (cat, key) => key && SHOP.some((it) => it.cat === cat && it.key === key && (it.price === 0 || owned.includes(shopId(it))));
    equip = { bg: ok("bg", d.equip.bg) ? d.equip.bg : "default", prop: ok("prop", d.equip.prop) ? d.equip.prop : null, pet: ok("pet", d.equip.pet) ? d.equip.pet : null };
    store.set("equip", equip);
    scene.key = "";
  }
  todayMsg = null;
  store.set("todayMsg", null);
  renderPoints(false);
  return "";
}

function saveSettings() { store.set("settings", settings); }

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  // 下からシートが出ているときは、ボタンに重ならないよう画面の上に出す
  t.classList.toggle("top", !!document.querySelector(".sheet-wrap:not(.hidden)"));
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 2400);
}

function showView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  if (name === "home") { renderHome(false); resetChatter(); }
  if (name === "cal") renderCalendar();
  if (name === "settings") renderSettings();
  if (name === "shop") renderShop();
  window.scrollTo(0, 0);
}

// ---- イベント ----
function bind() {
  // 召喚演出：ため中にタップすると登場まで飛ばす。登場後のタップで閉じる
  $("summon").addEventListener("click", () => {
    if (summonState.phase !== "reveal") revealSummon();
    else if (summonState.ready) closeSummon(false);
  });

  $("btn-kyukan").addEventListener("click", () => recordToday("kyukan"));
  $("btn-drank").addEventListener("click", () => recordToday("drank"));

  // キャラをタップすると、飛びはねてひとこと話す
  $("sprite").addEventListener("click", () => {
    const status = records[dateKey(logicalToday())];
    $("bubble-text").textContent = status ? pickLine(settings.char, status) : CHARS[settings.char].greet;
    const b = $("bubble");
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    react("tap");
    resetChatter();
  });

  document.querySelectorAll(".tabbar button").forEach((b) =>
    b.addEventListener("click", () => showView(b.dataset.view)));

  $("cal-prev").addEventListener("click", () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1); renderCalendar();
  });
  $("cal-next").addEventListener("click", () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1); renderCalendar();
  });

  $("sheet").addEventListener("click", (e) => {
    if (e.target === $("sheet")) return closeSheet();
    if (!sheetDate) return;
    const key = dateKey(sheetDate);
    if (e.target.closest("[data-help]")) return openGuide();
    // 量の3択
    const amt = e.target.closest("[data-samt]");
    if (amt) {
      setAmount(key, amt.dataset.samt);
      renderSheet();
      renderCalendar();
      return;
    }
    const act = e.target.closest("[data-set]");
    if (!act) return;
    const v = act.dataset.set;
    if (v === "close") return closeSheet();
    const prev = records[key];
    if (v === "kyukan" || v === "drank") records[key] = v;
    if (v === "clear") delete records[key];
    if ((v === "kyukan" || v === "clear") && amounts[key]) { delete amounts[key]; store.set("amounts", amounts); }
    store.set("records", records);
    if (key === dateKey(logicalToday())) todayMsg = null;
    if (v !== "clear" && prev !== v) {
      const got = awardPoints(key);
      toast(CHARS[settings.char].name + "「" + pickLine(settings.char, v) + "」" + (got ? "　＋" + fmt(got) + "ポイント" : ""));
    }
    renderCalendar();
    // 「飲んだ」を選んだときは、そのまま量を選べるようにシートを開いたままにする
    if (v === "drank") renderSheet(); else closeSheet();
  });

  // 交換所の種類（背景／小物／動物／持ちもの）を切り替える
  document.querySelectorAll(".shop-seg button").forEach((b) => b.addEventListener("click", () => {
    shopCat = b.dataset.cat;
    renderShop();
  }));

  $("set-goal").addEventListener("change", (e) => { settings.goal = Number(e.target.value); saveSettings(); });
  $("set-scale").addEventListener("change", (e) => { settings.scale = e.target.value === "low" ? "low" : "std"; saveSettings(); });

  // 飲んだ量の3択と、目安の画面
  document.querySelectorAll("#amount [data-amt]").forEach((b) => b.addEventListener("click", () => {
    const key = dateKey(logicalToday());
    setAmount(key, b.dataset.amt);
    renderAmount(key, records[key]);
  }));
  $("amount-help").addEventListener("click", openGuide);
  $("guide-close").addEventListener("click", () => $("guide-sheet").classList.add("hidden"));
  $("guide-sheet").addEventListener("click", (e) => { if (e.target === $("guide-sheet")) $("guide-sheet").classList.add("hidden"); });
  $("set-price").addEventListener("change", (e) => {
    settings.price = Math.max(0, Math.round(Number(e.target.value) || 0)); saveSettings(); e.target.value = settings.price;
  });
  $("set-sound").addEventListener("change", (e) => {
    settings.sound = e.target.checked; saveSettings();
    if (settings.sound) { wakeAudio(); SFX.partner(); }
  });

  // 相棒を変える
  $("btn-partner").addEventListener("click", () => {
    if (!partnerFocus || partnerFocus === settings.char) return;
    wakeAudio();
    settings.char = partnerFocus; saveSettings();
    renderPartner();
    summon(settings.char, () => showView("home"));   // 召喚が終わったら、ホームで新しい相棒が手を振る
  });

  // バックアップ：記録を文字にしてコピー / 貼り付けて戻す
  $("btn-export").addEventListener("click", () => {
    const text = exportData();
    const fallback = () => {
      $("import-box").classList.remove("hidden");
      $("import-text").value = text;
      $("import-text").select();
      toast("文字を選択しました。長押しして「コピー」を選んでください");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast("記録をコピーしました。メモなどに貼って残してください"), fallback);
    } else fallback();
  });
  $("btn-import-open").addEventListener("click", () => {
    $("import-box").classList.toggle("hidden");
    $("import-text").value = "";
    $("import-text").focus();
  });
  $("btn-import").addEventListener("click", async () => {
    const text = $("import-text").value;
    if (!text.trim()) return toast("コピーした記録を貼り付けてください");
    if (!(await askConfirm("いまの記録を、貼り付けた内容に置きかえます。よろしいですか？", "置きかえる"))) return;
    const err = importData(text);
    if (err) return toast(err);
    $("import-box").classList.add("hidden");
    renderSettings();
    toast("記録を戻しました（" + Object.keys(records).length + "日分）");
  });

  // グラフの単位（週／月）を切り替える
  document.querySelectorAll(".chart-panel .seg button").forEach((b) => b.addEventListener("click", () => {
    chartUnit = b.dataset.unit;
    store.set("chartUnit", chartUnit);
    renderChart();
  }));

  // 画面の幅が変わったら、グラフを描き直す
  window.addEventListener("resize", () => { if ($("view-cal").classList.contains("active")) renderChart(); });
}

function startOnboarding() {
  $("onboard").classList.remove("hidden");
  renderProfiles("char-grid-onboard", (id) => {
    wakeAudio();
    settings.char = id; saveSettings();
    $("onboard").classList.add("hidden");
    renderHome(false);
    summon(id, () => react("greet"));
  });
}

// ---- 起動 ----
async function init() {
  try {
    const res = await fetch("data/serifu.json");
    SERIFU = await res.json();
  } catch (e) {
    console.warn("セリフを読み込めませんでした", e);
  }
  drawTabIcons();
  // ポイントの仕組みができる前につけた記録にも、1回だけポイントを渡す
  if (!awarded) {
    awarded = {};
    Object.keys(records).forEach((k) => awardPoints(k, true));
    store.set("awarded", awarded);
  }
  migrateShop();
  renderPoints(false);
  bind();
  if (!settings.char || !CHARS[settings.char]) {
    settings.char = null;
    startOnboarding();          // 選択前は何も選ばれていない状態で表示
    settings.char = "kanzo";    // 背後のホーム画面用の仮キャラ（保存はしない）
  }
  renderHome(false);
  startLoop();
  resetChatter();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

// 日付が変わったあとにアプリへ戻ってきたとき、表示を更新する
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && $("view-home").classList.contains("active")) {
    renderHome(false);
    react("greet");   // アプリに戻ってきたら手を振る
  }
});

init();
