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
let settings = Object.assign({ char: null, goal: 2, price: 1000, sound: true }, store.get("settings", {}));
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

const scene = { key: "", ctx: null, bg: null, cols: 0, rows: 0, ground: 0, period: "day", clouds: [], stars: [], parts: [], shoot: null, nextShoot: 0 };

function disc(c, cx, cy, r, color) {
  c.fillStyle = color;
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    if (x * x + y * y <= r * r + r * 0.6) c.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
  }
}

// 動かない部分（空・山・家・地面・木）を一度だけ描いておく
function buildScene() {
  const stage = $("stage");
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return false;
  const cols = Math.ceil(w / PX), rows = Math.ceil(h / PX), period = periodNow();
  const key = cols + "x" + rows + period;
  if (key === scene.key) return true;
  Object.assign(scene, { key, cols, rows, period, ground: rows - GROUND });
  const P = SCENES[period], gt = scene.ground, rnd = seeded(cols * 7 + rows);
  const cv = $("scene");
  cv.width = cols; cv.height = rows;
  scene.ctx = cv.getContext("2d");
  const off = document.createElement("canvas");
  off.width = cols; off.height = rows;
  const c = off.getContext("2d");

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
  // 太陽・月
  const bx = Math.round(cols * 0.8), by = Math.round(gt * P.bodyY);
  if (P.body === "sun") {
    c.globalAlpha = 0.25; disc(c, bx, by, 8, P.bodyColor); c.globalAlpha = 1;
    disc(c, bx, by, 5, P.bodyColor);
  } else {
    c.globalAlpha = 0.18; disc(c, bx, by, 8, P.bodyColor); c.globalAlpha = 1;
    disc(c, bx, by, 5, P.bodyColor);
    c.fillStyle = "#e6dcb8";
    c.fillRect(bx - 2, by - 1, 2, 2); c.fillRect(bx + 2, by + 2, 1, 1); c.fillRect(bx + 1, by - 3, 1, 1);
  }
  // 遠くの山・近くの丘
  for (let x = 0; x < cols; x++) {
    const far = Math.round(gt - (12 + 4 * Math.sin(x * 0.07 + 1) + 2 * Math.sin(x * 0.19)));
    c.fillStyle = P.far; c.fillRect(x, far, 1, gt - far);
  }
  for (let x = 0; x < cols; x++) {
    const near = Math.round(gt - (5 + 3 * Math.sin(x * 0.11 + 2.5) + 1.5 * Math.sin(x * 0.29)));
    c.fillStyle = P.near; c.fillRect(x, near, 1, gt - near);
  }
  // 丘の上の小さな家（夜は窓に明かり）
  [[0.58, 0], [0.68, 1]].forEach(([fx, k]) => {
    const hx = Math.round(cols * fx), base = Math.round(gt - (5 + 3 * Math.sin(hx * 0.11 + 2.5) + 1.5 * Math.sin(hx * 0.29)));
    const hw = 6 + k, hh = 4;
    c.fillStyle = P.house; c.fillRect(hx, base - hh, hw, hh);
    c.fillStyle = P.roof;
    for (let i = 0; i < 3; i++) c.fillRect(hx - 1 + i, base - hh - 1 - i, hw + 2 - i * 2, 1);
    c.fillStyle = P.window; c.fillRect(hx + 1, base - hh + 1, 2, 2);
    if (k) c.fillRect(hx + 4, base - hh + 1, 2, 2);
  });
  // 地面
  for (let x = 0; x < cols; x++) {
    c.fillStyle = P.grassHi; c.fillRect(x, gt, 1, 1);
    c.fillStyle = P.grass; c.fillRect(x, gt + 1, 1, 2);
    c.fillStyle = P.dirt; c.fillRect(x, gt + 3, 1, rows - gt - 3);
    if (rnd() < 0.18) { c.fillStyle = P.dirtLo; c.fillRect(x, gt + 4 + Math.floor(rnd() * (rows - gt - 5)), 1, 1); }
    if (rnd() < 0.25) { c.fillStyle = P.grass; c.fillRect(x, gt - 1, 1, 1); }
    if (rnd() < 0.06) { c.fillStyle = P.grass; c.fillRect(x, gt + 3, 1, 1); }
  }
  // 草花（夜以外）
  if (period !== "night") {
    const fl = ["#ff7aa8", "#ffe66b", "#ffffff", "#b48cff"];
    for (let i = 0; i < Math.round(cols / 14); i++) {
      c.fillStyle = fl[i % fl.length];
      c.fillRect(Math.floor(rnd() * cols), gt - 1, 1, 1);
    }
  }
  // 左の木と、右の茂み
  c.fillStyle = P.trunk; c.fillRect(7, gt - 11, 3, 11);
  disc(c, 8, gt - 16, 7, P.leaf);
  c.fillStyle = P.leafHi;
  for (let y = -5; y <= 1; y++) for (let x = -5; x <= 1; x++) {
    if (x * x + y * y <= 12) c.fillRect(6 + x, gt - 17 + y, 1, 1);
  }
  disc(c, cols - 8, gt, 4, P.leaf);
  disc(c, cols - 11, gt, 3, P.leafHi);
  scene.bg = off;

  // 雲と星（動くもの）
  scene.clouds = [0, 1, 2].map((i) => ({
    x: rnd() * cols, y: 3 + Math.floor(rnd() * gt * 0.32), w: 9 + Math.floor(rnd() * 8), speed: 0.5 + rnd() * 0.9,
  }));
  scene.stars = P.stars
    ? Array.from({ length: Math.round(cols * 0.4) }, () => ({
        x: Math.floor(rnd() * cols), y: Math.floor(rnd() * gt * 0.6), sp: 0.8 + rnd() * 2, ph: rnd() * 6.3,
      }))
    : [];
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
  const c = scene.ctx, P = SCENES[scene.period], t = now / 1000;
  c.drawImage(scene.bg, 0, 0);

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

  c.fillStyle = P.cloud;
  c.globalAlpha = P.stars ? 0.5 : 0.92;
  scene.clouds.forEach((cl) => {
    const span = scene.cols + cl.w + 10;
    drawCloud(c, ((cl.x + t * cl.speed) % span) - cl.w - 5, cl.y, cl.w);
  });
  c.globalAlpha = 1;

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

function spriteSrc(id, anim) { return "img/sprites/" + id + "/" + anim + ".png"; }
function loadSprite(id) {
  if (!spriteCache[id]) {
    spriteCache[id] = fetch("img/sprites/" + id + "/sprite.json")
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

  const goal = settings.goal;
  $("st-week").textContent = s.weekKyu;
  $("st-week-goal").textContent = "/" + goal + "日";
  $("st-week-fill").style.width = Math.min(100, Math.round((s.weekKyu / goal) * 100)) + "%";
  $("stat-week").classList.toggle("clear", s.weekKyu >= goal);
  $("st-month").textContent = s.monthKyu;
  $("st-money").textContent = (s.monthKyu * settings.price).toLocaleString("ja-JP");
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
  $("sheet").classList.remove("hidden");
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

// 初回の相棒選び：紹介カードを並べて、タップで決定
function renderProfiles(containerId, onPick) {
  const box = $(containerId);
  box.innerHTML = "";
  Object.keys(CHARS).forEach((id) => {
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
  Object.keys(CHARS).forEach((id) => {
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
    for (const day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const key = dateKey(day);
      if (key > tk) break;
      if (key < fk) continue;   // 記録をはじめる前の日は数えない
      counted++;
      if (records[key] === "kyukan") k++; else if (records[key] === "drank") d++;
    }
    const y = start.getFullYear(), m = start.getMonth() + 1;
    out.push({
      label: unit === "week" ? m + "/" + start.getDate() : m + "月",
      sub: unit === "month" && (m === 1 || !out.length) ? y + "年" : "",
      full: unit === "week"
        ? y + "年" + m + "/" + start.getDate() + "〜" + (end.getMonth() + 1) + "/" + end.getDate()
        : y + "年" + m + "月",
      kyukan: k, drank: d, none: counted - k - d, current: end >= today,
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
  document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.unit === unit)));
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
    [d.full, d.kyukan + "日", d.drank + "日", d.none + "日"].forEach((v) => {
      const td = document.createElement("td"); td.textContent = v; tr.append(td);
    });
    tb.append(tr);
  });
}

// ---- バックアップ ----
function exportData() {
  return JSON.stringify({ app: "kyukanbi", v: 1, savedAt: new Date().toISOString(), records, settings });
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
  if (d.settings && CHARS[d.settings.char]) {
    settings = Object.assign(settings, {
      char: d.settings.char,
      goal: Math.min(7, Math.max(1, Number(d.settings.goal) || 2)),
      price: Math.max(0, Number(d.settings.price) || 0),
      sound: d.settings.sound !== false,
    });
    saveSettings();
  }
  todayMsg = null;
  store.set("todayMsg", null);
  return "";
}

function saveSettings() { store.set("settings", settings); }

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
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
    const act = e.target.closest("[data-set]");
    if (!act || !sheetDate) return;
    const key = dateKey(sheetDate);
    const v = act.dataset.set;
    if (v === "kyukan" || v === "drank") records[key] = v;
    if (v === "clear") delete records[key];
    if (v !== "close") {
      store.set("records", records);
      if (key === dateKey(logicalToday())) todayMsg = null;
      if (v !== "clear") toast(CHARS[settings.char].name + "「" + pickLine(settings.char, v) + "」");
    }
    closeSheet();
    renderCalendar();
  });

  $("set-goal").addEventListener("change", (e) => { settings.goal = Number(e.target.value); saveSettings(); });
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
  $("btn-import").addEventListener("click", () => {
    const text = $("import-text").value;
    if (!text.trim()) return toast("コピーした記録を貼り付けてください");
    if (!confirm("いまの記録を、貼り付けた内容に置きかえます。よろしいですか？")) return;
    const err = importData(text);
    if (err) return toast(err);
    $("import-box").classList.add("hidden");
    renderSettings();
    toast("記録を戻しました（" + Object.keys(records).length + "日分）");
  });

  // グラフの単位（週／月）を切り替える
  document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => {
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
