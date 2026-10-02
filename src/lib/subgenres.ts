/**
 * Sub-genre badge detection from TMDB keywords and tags.
 * Labels use clean typography (no emoji glyphs) to ensure 100% vector-crisp Resvg rendering.
 */

export interface SubGenreRule {
  key: string
  keywords: string[]
  labels: Record<string, string>
}

const SUB_GENRES: SubGenreRule[] = [
  {
    key: "timetravel",
    keywords: ["time travel", "time loop", "time machine", "wormhole", "time manipulation"],
    labels: { it: "Viaggi nel Tempo", en: "Time Travel", fr: "Voyage temporel", de: "Zeitreise", es: "Viajes en el tiempo", he: "מסע בזמן", pl: "Podróż w czasie", ar: "سفر عبر الزمن", tr: "Zaman Yolculuğu", nl: "Tijdreizen", sv: "Tidsresor", ro: "Călătorii în timp", cs: "Cestování v čase", pt: "Viagem no tempo", ja: "タイムトラベル", ko: "시간 여행" },
  },
  {
    key: "cyberpunk",
    // NOTE: "dystopia/dystopian/virtual reality/artificial intelligence
    // they caused false positives on non-cyberpunk movies (e.g. The Handmaid's Tale,
    // Her, Ready Player One). Cyberpunk is distinctive enough from its core terms.
    keywords: ["cyberpunk", "android", "cybernetics"],
    labels: { it: "Cyberpunk", en: "Cyberpunk", fr: "Cyberpunk", de: "Cyberpunk", es: "Cyberpunk", he: "סייברפאנק", pl: "Cyberpunk", ar: "سايبربانك", tr: "Siberpunk", nl: "Cyberpunk", sv: "Cyberpunk", ro: "Cyberpunk", cs: "Cyberpunk", pt: "Cyberpunk", ja: "サイバーパンク", ko: "사이버펑크" },
  },

  {
    key: "whodunit",
    // NOTE: "detective" and "investigation" removed — they are too broad and
    // triggered false positives on generic police procedurals.
    keywords: ["whodunit", "murder mystery", "private investigator", "sleuth"],
    labels: { it: "Giallo", en: "Whodunit", fr: "Whodunit", de: "Whodunit", es: "Whodunit", he: "מי הרוצח", pl: "Tajemnica", ar: "من القاتل؟", tr: "Katil Kim?", nl: "Wie is de moordenaar?", sv: "Mördare?", ro: "Mister", cs: "Záhada", pt: "Mistério", ja: "ミステリー", ko: "미스터리" },
  },
  {
    key: "heist",
    keywords: ["heist", "bank robbery", "caper", "robbery", "master thief"],
    labels: { it: "Film di Rapina", en: "Heist", fr: "Film de braquage", de: "Heist", es: "Robos", he: "סרט שוד", pl: "Film z napadu", ar: "أفلام سرقة", tr: "Soygun Filmi", nl: "Overvalfilm", sv: "Rånfilm", ro: "Film de jaf", cs: "Loupežný film", pt: "Filme de assalto", ja: "強盗映画", ko: "강도 영화" },
  },
  {
    key: "zombie",
    // NOTE: "infected" removed — medical/virus outbreak keywords would falsely
    // trigger the zombie badge on non-zombie contagion thrillers.
    keywords: ["zombie", "zombies", "undead", "apocalypse zombie"],
    labels: { it: "Film di Zombie", en: "Zombie", fr: "Film de zombies", de: "Zombie", es: "Zombis", he: "זומבים", pl: "Film zombie", ar: "زومبي", tr: "Zombi", nl: "Zombie", sv: "Zombie", ro: "Film de zombie", cs: "Zombie", pt: "Filme de zumbis", ja: "ゾンビ映画", ko: "좀비 영화" },
  },
  {
    key: "vampire",
    keywords: ["vampire", "vampires", "dracula", "blood drinker"],
    labels: { it: "Vampiri", en: "Vampires", fr: "Vampires", de: "Vampire", es: "Vampiros", he: "ערפדים", pl: "Wampiry", ar: "مصاصو دماء", tr: "Vampirler", nl: "Vampieren", sv: "Vampyrer", ro: "Vampiri", cs: "Upíři", pt: "Vampiros", ja: "吸血鬼", ko: "뱀파이어" },
  },
  {
    key: "paranormal",
    keywords: ["haunted house", "ghost", "demonic possession", "exorcism", "poltergeist", "supernatural horror", "paranormal"],
    labels: { it: "Paranormale", en: "Paranormal", fr: "Paranormal", de: "Paranormal", es: "Paranormal", he: "על-טבעי", pl: "Paranormalne", ar: "خوارق", tr: "Paranormal", nl: "Paranormaal", sv: "Paranormalt", ro: "Paranormal", cs: "Paranormální", pt: "Paranormal", ja: "パラノーマル", ko: "초자연" },
  },
  {
    key: "kaiju",
    keywords: ["kaiju", "giant monster", "godzilla", "king kong"],
    labels: { it: "Kaiju & Mostri", en: "Kaiju & Monsters", fr: "Kaiju", de: "Kaiju", es: "Kaiju", he: "קאיג'ו ומפלצות", pl: "Kaiju i potwory", ar: "كايجو ووحوش", tr: "Kaiju ve Canavarlar", nl: "Kaiju & monsters", sv: "Kaiju & monster", ro: "Kaiju și monștri", cs: "Kaiju a monstra", pt: "Kaiju e monstros", ja: "怪獣＆モンスター", ko: "괴수 & 몬스터" },
  },
  {
    key: "postapocalyptic",
    // NOTE: "survival horror" removed — it is a video-game genre tag that appears
    // on non-post-apocalyptic survival horror games/movies (e.g. The Descent).
    keywords: ["post-apocalyptic", "wasteland", "nuclear winter"],
    labels: { it: "Post-Apocalittico", en: "Post-Apocalyptic", fr: "Post-apocalyptique", de: "Postapokalyptisch", es: "Postapocalíptico", he: "פוסט-אפוקליפטי", pl: "Postapokaliptyczny", ar: "ما بعد الكارثة", tr: "Kıyamet Sonrası", nl: "Post-apocalyptisch", sv: "Postapokalyptisk", ro: "Post-apocaliptic", cs: "Postapokalyptický", pt: "Pós-apocalíptico", ja: "ポストアポカリプス", ko: "포스트 아포칼립스" },
  },
  {
    key: "foundfootage",
    keywords: ["found footage", "mockumentary", "handheld camera"],
    // NOTE: "mockumentary" can appear on comedy mockumentaries (This Is Spinal Tap),
    // but these rarely overlap with TMDB horror keywords. Acceptable low risk.
    labels: { it: "Found Footage", en: "Found Footage", fr: "Found Footage", de: "Found Footage", es: "Metraje encontrado", he: "Found Footage", pl: "Found Footage", ar: "لقطات مكتشفة", tr: "Bulunmuş Görüntü", nl: "Found footage", sv: "Found footage", ro: "Filmări găsite", cs: "Nalezené záběry", pt: "Filmagem encontrada", ja: "ファウンド・フッテージ", ko: "파운드 푸트리지" },
  },
  {
    key: "noir",
    keywords: ["neo-noir", "film noir", "hardboiled", "femme fatale"],
    labels: { it: "Film Noir", en: "Film Noir", fr: "Film Noir", de: "Film Noir", es: "Cine Negro", he: "Film Noir", pl: "Film noir", ar: "نوار", tr: "Kara Film", nl: "Film noir", sv: "Noir", ro: "Film noir", cs: "Film noir", pt: "Filme noir", ja: "フィルムノワール", ko: "필름 누아르" },
  },
  {
    key: "spaghettiwestern",
    keywords: ["spaghetti western", "gunslinger", "wild west"],
    labels: { it: "Spaghetti Western", en: "Western", fr: "Western", de: "Western", es: "Western", he: "מערבון", pl: "Spaghetti Western", ar: "ويسترن سباغيتي", tr: "Spagetti Western", nl: "Spaghetti western", sv: "Spaghettiwestern", ro: "Western spaghetti", cs: "Spaghetti western", pt: "Velho Oeste spaghetti", ja: "スパゲッティ・ウエスタン", ko: "스파게티 웨스턴" },
  },
  {
    key: "martialarts",
    keywords: ["martial arts", "kung fu", "karate", "samurai", "ninja"],
    labels: { it: "Arti Marziali", en: "Martial Arts", fr: "Arts martiaux", de: "Kampfsport", es: "Artes marciales", he: "אומנויות לחימה", pl: "Sztuki walki", ar: "فنون قتالية", tr: "Dövüş Sanatları", nl: "Vechtkunst", sv: "Kampsport", ro: "Arte marțiale", cs: "Bojové umění", pt: "Artes marciais", ja: "アクション", ko: "무술" },
  },
  {
    key: "spaceopera",
    // NOTE: "space travel", "alien invasion", and "spacecraft" removed — they
    // flagged hard sci-fi (The Martian, Interstellar) and alien-invasion action
    // as space opera. Core terms are sufficient for Star Wars / Mandalorian / Trek.
    keywords: ["space opera", "space western", "intergalactic"],
    labels: { it: "Space Opera", en: "Space Opera", fr: "Space Opera", de: "Space Opera", es: "Space Opera", he: "אופרת חלל", pl: "Space opera", ar: "أوبرا فضائية", tr: "Uzay Operası", nl: "Space opera", sv: "Space opera", ro: "Space opera", cs: "Space opera", pt: "Ópera espacial", ja: "スペースオペラ", ko: "스페이스 오페라" },
  },
]

function matchKeywordPattern(keyword: string, kwPattern: string): boolean {
  // Word-boundary matching for all patterns prevents substring false
  // positives (e.g. "ghost" matching "ghostbusters").
  const escaped = kwPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`\\b${escaped}\\b`, "i")
  return regex.test(keyword)
}

export function getSubGenreLabel(keywords: string[], locale = "it"): string | null {
  if (!keywords || !keywords.length) return null
  const normalized = keywords.map((k) => k.toLowerCase().trim())
  for (const sub of SUB_GENRES) {
    if (sub.keywords.some((kwPattern) => normalized.some((nk) => matchKeywordPattern(nk, kwPattern)))) {
      const lang = (locale || "it").slice(0, 2)
      // it/en/fr/de/es/he/pl/ar/ro have all 14 label variants; the rest keep the Italian fallback.
      return sub.labels[lang] || sub.labels.it
    }
  }
  return null
}
