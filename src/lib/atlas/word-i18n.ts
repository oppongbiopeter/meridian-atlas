/** Kids picture-words in the main language of each country. Keys are ISO 639-1 (or fil). */
const I18N: Record<string, Record<string, string>> = {
  cattle: {
    en: "cow", es: "vaca", pt: "vaca", fr: "vache", de: "Kuh", it: "mucca", nl: "koe",
    ru: "корова", uk: "корова", pl: "krowa", tr: "inek", ar: "بقرة", he: "פרה", hi: "गाय",
    bn: "গাভী", ur: "گائے", zh: "牛", ja: "うし", ko: "소", th: "วัว", vi: "bò", id: "sapi",
    ms: "lembu", fil: "baka", sv: "ko", da: "ko", no: "ku", fi: "lehmä", el: "αγελάδα",
    cs: "kráva", sk: "krava", hu: "tehén", ro: "vacă", bg: "крава", hr: "krava", sr: "крава",
    fa: "گاو", sw: "ng'ombe",
  },
  chickens: {
    en: "chicken", es: "pollo", pt: "galinha", fr: "poulet", de: "Huhn", it: "gallina", nl: "kip",
    ru: "курица", uk: "курка", pl: "kura", tr: "tavuk", ar: "دجاجة", he: "תרנגולת", hi: "मुर्गी",
    bn: "মুরগি", ur: "مرغی", zh: "鸡", ja: "にわとり", ko: "닭", th: "ไก่", vi: "gà", id: "ayam",
    ms: "ayam", fil: "manok", sv: "höna", da: "høne", no: "høne", fi: "kana", el: "κότα",
    cs: "slepice", hu: "tyúk", ro: "găină", fa: "مرغ", sw: "kuku",
  },
  pigs: {
    en: "pig", es: "cerdo", pt: "porco", fr: "cochon", de: "Schwein", it: "maiale", nl: "varken",
    ru: "свинья", uk: "свиня", pl: "świnia", tr: "domuz", ar: "خنزير", he: "חזיר", hi: "सुअर",
    bn: "শুকর", zh: "猪", ja: "ぶた", ko: "돼지", th: "หมู", vi: "lợn", id: "babi",
    ms: "babi", fil: "baboy", sv: "gris", fi: "sika", el: "γουρούνι", cs: "prase", hu: "disznó",
    ro: "porc", fa: "خوک", sw: "nguruwe",
  },
  cereal: {
    en: "grain", es: "grano", pt: "grão", fr: "grain", de: "Getreide", it: "grano", nl: "graan",
    ru: "зерно", pl: "zboże", tr: "tahıl", ar: "حبوب", hi: "अनाज", zh: "谷物", ja: "穀物",
    ko: "곡식", th: "ธัญพืช", vi: "ngũ cốc", id: "gandum", fil: "butil", sv: "säd", el: "σιτάρι",
    fa: "غله", sw: "nafaka",
  },
  rice: {
    en: "rice", es: "arroz", pt: "arroz", fr: "riz", de: "Reis", it: "riso", nl: "rijst",
    ru: "рис", pl: "ryż", tr: "pirinç", ar: "أرز", hi: "चावल", bn: "চাল", ur: "چاول",
    zh: "米饭", ja: "ごはん", ko: "밥", th: "ข้าว", vi: "gạo", id: "nasi", ms: "nasi",
    fil: "kanin", sv: "ris", el: "ρύζι", fa: "برنج", sw: "mchele",
  },
  bananas: {
    en: "banana", es: "plátano", pt: "banana", fr: "banane", de: "Banane", it: "banana", nl: "banaan",
    ru: "банан", pl: "banan", tr: "muz", ar: "موزة", he: "בננה", hi: "केला", bn: "কলা",
    zh: "香蕉", ja: "バナナ", ko: "바나나", th: "กล้วย", vi: "chuối", id: "pisang",
    ms: "pisang", fil: "saging", sv: "banan", el: "μπανάνα", fa: "موز", sw: "ndizi",
  },
  cocoa: {
    en: "cocoa", es: "cacao", pt: "cacau", fr: "cacao", de: "Kakao", it: "cacao", nl: "cacao",
    ru: "какао", pl: "kakao", tr: "kakao", ar: "كاكاو", hi: "कोको", zh: "可可", ja: "カカオ",
    ko: "카카오", th: "โกโก้", vi: "ca cao", id: "kakao", fil: "kakaw", sw: "kakao",
  },
  fish: {
    en: "fish", es: "pez", pt: "peixe", fr: "poisson", de: "Fisch", it: "pesce", nl: "vis",
    ru: "рыба", uk: "риба", pl: "ryba", tr: "balık", ar: "سمكة", he: "דג", hi: "मछली",
    bn: "মাছ", ur: "مچھلی", zh: "鱼", ja: "さかな", ko: "물고기", th: "ปลา", vi: "cá",
    id: "ikan", ms: "ikan", fil: "isda", sv: "fisk", el: "ψάρι", fa: "ماهی", sw: "samaki",
  },
  farms: {
    en: "farm", es: "granja", pt: "fazenda", fr: "ferme", de: "Bauernhof", it: "fattoria", nl: "boerderij",
    ru: "ферма", pl: "farma", tr: "çiftlik", ar: "مزرعة", hi: "खेत", zh: "农场", ja: "のうじょう",
    ko: "농장", th: "ฟาร์ม", vi: "nông trại", id: "ladang", fil: "bukid", sv: "gård", sw: "shamba",
  },
  forest: {
    en: "tree", es: "árbol", pt: "árvore", fr: "arbre", de: "Baum", it: "albero", nl: "boom",
    ru: "дерево", uk: "дерево", pl: "drzewo", tr: "ağaç", ar: "شجرة", he: "עץ", hi: "पेड़",
    bn: "গাছ", zh: "树", ja: "き", ko: "나무", th: "ต้นไม้", vi: "cây", id: "pohon",
    ms: "pokok", fil: "puno", sv: "träd", el: "δέντρο", fa: "درخت", sw: "mti",
  },
  birds: {
    en: "bird", es: "pájaro", pt: "pássaro", fr: "oiseau", de: "Vogel", it: "uccello", nl: "vogel",
    ru: "птица", pl: "ptak", tr: "kuş", ar: "طائر", he: "ציפור", hi: "चिड़िया", bn: "পাখি",
    zh: "鸟", ja: "とり", ko: "새", th: "นก", vi: "chim", id: "burung", ms: "burung",
    fil: "ibon", sv: "fågel", el: "πουλί", fa: "پرنده", sw: "ndege",
  },
  mammals: {
    en: "mammal", es: "mamífero", pt: "mamífero", fr: "mammifère", de: "Säugetier", it: "mammifero",
    nl: "zoogdier", ru: "млекопитающее", pl: "ssak", tr: "memeli", ar: "حيوان ثديي", hi: "स्तनधारी",
    zh: "哺乳动物", ja: "ほにゅうるい", ko: "포유류", th: "สัตว์เลี้ยงลูกด้วยนม", vi: "thú",
    id: "mamalia", fil: "mamalya", sw: "mnyama",
  },
  frogs: {
    en: "frog", es: "rana", pt: "rã", fr: "grenouille", de: "Frosch", it: "rana", nl: "kikker",
    ru: "лягушка", pl: "żaba", tr: "kurbağa", ar: "ضفدع", he: "צפרדע", hi: "मेंढक",
    zh: "青蛙", ja: "かえる", ko: "개구리", th: "กบ", vi: "ếch", id: "katak",
    ms: "katak", fil: "palaka", sv: "groda", el: "βάτραχος", fa: "قورباغه", sw: "chura",
  },
  pop: {
    en: "people", es: "gente", pt: "pessoas", fr: "gens", de: "Leute", it: "gente", nl: "mensen",
    ru: "люди", uk: "люди", pl: "ludzie", tr: "insanlar", ar: "ناس", he: "אנשים", hi: "लोग",
    bn: "মানুষ", zh: "人们", ja: "ひと", ko: "사람들", th: "คน", vi: "người", id: "orang",
    ms: "orang", fil: "tao", sv: "folk", el: "άνθρωποι", fa: "مردم", sw: "watu",
  },
  life: {
    en: "years", es: "años", pt: "anos", fr: "années", de: "Jahre", it: "anni", nl: "jaren",
    ru: "годы", pl: "lata", tr: "yıllar", ar: "سنوات", hi: "साल", zh: "年", ja: "とし",
    ko: "해", th: "ปี", vi: "năm", id: "tahun", fil: "taon", sv: "år", el: "χρόνια",
    fa: "سال", sw: "miaka",
  },
};

export function localWord(metricOrWord: string, lang: string): string | null {
  const table = I18N[metricOrWord];
  if (!table) return null;
  return table[lang] ?? table[lang.split("-")[0] ?? ""] ?? null;
}
