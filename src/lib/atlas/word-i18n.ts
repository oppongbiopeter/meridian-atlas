/** Kids picture-words in the main language of each country. Keys are ISO 639-1 (or fil). */
const I18N: Record<string, Record<string, string>> = {
  cattle: {
    en: "cow", es: "vaca", pt: "vaca", fr: "vache", de: "Kuh", it: "mucca", nl: "koe",
    ru: "корова", uk: "корова", pl: "krowa", tr: "inek", ar: "بقرة", he: "פרה", hi: "गाय",
    bn: "গাভী", ur: "گائے", zh: "牛", ja: "うし", ko: "소", th: "วัว", vi: "bò", id: "sapi",
    ms: "lembu", fil: "baka", sv: "ko", da: "ko", no: "ku", fi: "lehmä", el: "αγελάδα",
    cs: "kráva", sk: "krava", hu: "tehén", ro: "vacă", bg: "крава", hr: "krava", sr: "крава",
    fa: "گاو", sw: "ng'ombe",
    sq: "lopë", bs: "krava", mk: "крава", so: "sac", ky: "уй", tg: "гов", tk: "sygyr", az: "inək", uz: "sigir", kk: "сиыр", ka: "ძროხა", hy: "կով", mn: "үхэр", am: "ላም", ne: "गाई", si: "එළදෙන", is: "kýr", sl: "krava", lt: "karvė", lv: "govs", et: "lehm", ca: "vaca", km: "គោ", lo: "ງົວ", my: "နွား", ti: "ላም", dz: "བ་",
  },
  chickens: {
    en: "chicken", es: "pollo", pt: "galinha", fr: "poulet", de: "Huhn", it: "gallina", nl: "kip",
    ru: "курица", uk: "курка", pl: "kura", tr: "tavuk", ar: "دجاجة", he: "תרנגולת", hi: "मुर्गी",
    bn: "মুরগি", ur: "مرغی", zh: "鸡", ja: "にわとり", ko: "닭", th: "ไก่", vi: "gà", id: "ayam",
    ms: "ayam", fil: "manok", sv: "höna", da: "høne", no: "høne", fi: "kana", el: "κότα",
    cs: "slepice", hu: "tyúk", ro: "găină", fa: "مرغ", sw: "kuku",
    sq: "pulë", bs: "kokoš", mk: "кокошка", so: "digaag", ky: "тоок", tg: "мурғ", tk: "towuk", az: "toyuq", uz: "tovuq", kk: "тауық", ka: "ქათამი", hy: "հավ", mn: "тахиа", am: "ዶሮ", ne: "कुखुरा", si: "කුකුළා", is: "hæna", sl: "kokoš", lt: "višta", lv: "vista", et: "kana", sk: "sliepka", hr: "kokoš", ca: "pollastre", bg: "кокошка", km: "មាន់", lo: "ໄກ່", my: "ကြက်", ti: "ደርሆ", dz: "བྱ་དེའུ",
  },
  pigs: {
    en: "pig", es: "cerdo", pt: "porco", fr: "cochon", de: "Schwein", it: "maiale", nl: "varken",
    ru: "свинья", uk: "свиня", pl: "świnia", tr: "domuz", ar: "خنزير", he: "חזיר", hi: "सुअर",
    bn: "শুকর", zh: "猪", ja: "ぶた", ko: "돼지", th: "หมู", vi: "lợn", id: "babi",
    ms: "babi", fil: "baboy", sv: "gris", fi: "sika", el: "γουρούνι", cs: "prase", hu: "disznó",
    ro: "porc", fa: "خوک", sw: "nguruwe",
    sq: "derr", bs: "svinja", mk: "свиња", so: "doofaar", ky: "чочко", tg: "хук", tk: "doňuz", az: "donuz", uz: "choʻchqa", kk: "шошқа", ka: "ღორი", hy: "խոզ", mn: "гахай", am: "አሳማ", ne: "सुँगुर", si: "ඌරා", is: "svín", sl: "prašič", lt: "kiaulė", lv: "cūka", et: "siga", sk: "prasa", hr: "svinja", ca: "porc", da: "gris", no: "gris", bg: "прасе", km: "ជ្រូក", lo: "ໝູ", my: "ဝက်", ti: "ሓሰማ", dz: "ཕག་པ་",
  },
  cereal: {
    en: "grain", es: "grano", pt: "grão", fr: "grain", de: "Getreide", it: "grano", nl: "graan",
    ru: "зерно", pl: "zboże", tr: "tahıl", ar: "حبوب", hi: "अनाज", zh: "谷物", ja: "穀物",
    ko: "곡식", th: "ธัญพืช", vi: "ngũ cốc", id: "gandum", fil: "butil", sv: "säd", el: "σιτάρι",
    fa: "غله", sw: "nafaka",
    sq: "drithë", bs: "žito", mk: "жито", so: "hadhuudh", ky: "дан", tg: "ғалла", tk: "däne", az: "taxıl", uz: "don", kk: "астық", ka: "მარცვლეული", hy: "հացահատիկ", mn: "үр тариа", am: "እህል", ne: "अन्न", si: "ධාන්‍ය", is: "korn", sl: "žito", lt: "grūdai", lv: "graudi", et: "vili", sk: "obilie", hr: "žito", ca: "gra", da: "korn", no: "korn", fi: "vilja", hu: "gabona", ro: "cereale", bg: "зърно", uk: "зерно", he: "דגן", km: "គ្រាប់ធញ្ញជាតិ", lo: "ເມັດພືດ", my: "ကောက်ပဲ", ti: "እኽሊ", dz: "འབྲུ་",
  },
  rice: {
    en: "rice", es: "arroz", pt: "arroz", fr: "riz", de: "Reis", it: "riso", nl: "rijst",
    ru: "рис", pl: "ryż", tr: "pirinç", ar: "أرز", hi: "चावल", bn: "চাল", ur: "چاول",
    zh: "米饭", ja: "ごはん", ko: "밥", th: "ข้าว", vi: "gạo", id: "nasi", ms: "nasi",
    fil: "kanin", sv: "ris", el: "ρύζι", fa: "برنج", sw: "mchele",
    sq: "oriz", bs: "riža", mk: "ориз", so: "bariis", ky: "күрүч", tg: "биринҷ", tk: "tüwi", az: "düyü", uz: "guruch", kk: "күріш", ka: "ბრინჯი", hy: "բրինձ", mn: "будаа", am: "ሩዝ", ne: "चामल", si: "සහල්", is: "hrísgrjón", sl: "riž", lt: "ryžiai", lv: "rīsi", et: "riis", sk: "ryža", hr: "riža", ca: "arròs", da: "ris", no: "ris", fi: "riisi", hu: "rizs", ro: "orez", bg: "ориз", uk: "рис", he: "אורז", km: "បាយ", lo: "ເຂົ້າ", my: "ဆန်", ti: "ሩዝ", dz: "འབྲས་", kl: "risi",
  },
  bananas: {
    en: "banana", es: "plátano", pt: "banana", fr: "banane", de: "Banane", it: "banana", nl: "banaan",
    ru: "банан", pl: "banan", tr: "muz", ar: "موزة", he: "בננה", hi: "केला", bn: "কলা",
    zh: "香蕉", ja: "バナナ", ko: "바나나", th: "กล้วย", vi: "chuối", id: "pisang",
    ms: "pisang", fil: "saging", sv: "banan", el: "μπανάνα", fa: "موز", sw: "ndizi",
    sq: "banane", bs: "banana", mk: "банана", so: "moos", ky: "банан", tg: "банан", tk: "banan", az: "banan", uz: "banan", kk: "банан", ka: "ბანანი", hy: "բանան", mn: "банан", am: "ሙዝ", ne: "केरा", si: "කෙසෙල්", is: "banani", sl: "banana", lt: "bananas", lv: "banāns", et: "banaan", sk: "banán", hr: "banana", ca: "plàtan", da: "banan", no: "banan", fi: "banaani", hu: "banán", ro: "banană", bg: "банан", uk: "банан", km: "ចេក", lo: "ກ້ວຍ", my: "ငှက်ပျော", ti: "ሙዝ", dz: "ཀེ་ར་", kl: "banani",
  },
  cocoa: {
    en: "cocoa", es: "cacao", pt: "cacau", fr: "cacao", de: "Kakao", it: "cacao", nl: "cacao",
    ru: "какао", pl: "kakao", tr: "kakao", ar: "كاكاو", hi: "कोको", zh: "可可", ja: "カカオ",
    ko: "카카오", th: "โกโก้", vi: "ca cao", id: "kakao", fil: "kakaw", sw: "kakao",
    sq: "kakao", bs: "kakao", mk: "какао", so: "koko", ky: "какао", tg: "какао", tk: "kakao", az: "kakao", uz: "kakao", kk: "какао", ka: "კაკაო", hy: "կակաո", mn: "какао", am: "ኮኮዋ", ne: "कोको", si: "කොකෝවා", is: "kakó", sl: "kakav", lt: "kakava", lv: "kakao", et: "kakao", sk: "kakao", hr: "kakao", ca: "cacau", da: "kakao", no: "kakao", fi: "kaakao", hu: "kakaó", ro: "cacao", bg: "какао", uk: "какао", he: "קקאו", km: "កាកាវ", lo: "ໂກໂກ້", my: "ကိုကိုး", ti: "ኮኮዋ", dz: "ཁ་ཁོ་",
  },
  fish: {
    en: "fish", es: "pez", pt: "peixe", fr: "poisson", de: "Fisch", it: "pesce", nl: "vis",
    ru: "рыба", uk: "риба", pl: "ryba", tr: "balık", ar: "سمكة", he: "דג", hi: "मछली",
    bn: "মাছ", ur: "مچھلی", zh: "鱼", ja: "さかな", ko: "물고기", th: "ปลา", vi: "cá",
    id: "ikan", ms: "ikan", fil: "isda", sv: "fisk", el: "ψάρι", fa: "ماهی", sw: "samaki",
    sq: "peshk", bs: "riba", mk: "риба", so: "kalluun", ky: "балык", tg: "моҳӣ", tk: "balyk", az: "balıq", uz: "baliq", kk: "балық", ka: "თევზი", hy: "ձուկ", mn: "загас", am: "ዓሳ", ne: "माछा", si: "මාළු", is: "fiskur", sl: "riba", lt: "žuvis", lv: "zivs", et: "kala", sk: "ryba", hr: "riba", ca: "peix", da: "fisk", no: "fisk", fi: "kala", hu: "hal", ro: "pește", bg: "риба", km: "ត្រី", lo: "ປາ", my: "ငါး", ti: "ዓሳ", dz: "ཉ་", kl: "aalisagaq",
  },
  farms: {
    en: "farm", es: "granja", pt: "fazenda", fr: "ferme", de: "Bauernhof", it: "fattoria", nl: "boerderij",
    ru: "ферма", pl: "farma", tr: "çiftlik", ar: "مزرعة", hi: "खेत", zh: "农场", ja: "のうじょう",
    ko: "농장", th: "ฟาร์ม", vi: "nông trại", id: "ladang", fil: "bukid", sv: "gård", sw: "shamba",
    sq: "fermë", bs: "farma", mk: "фарма", so: "beer", ky: "ферма", tg: "ферма", tk: "ferma", az: "ferma", uz: "ferma", kk: "ферма", ka: "ფერმა", hy: "ֆերմա", mn: "ферм", am: "እርሻ", ne: "खेत", si: "ගොවිපල", is: "bær", sl: "kmetija", lt: "ūkis", lv: "ferma", et: "talu", sk: "farma", hr: "farma", ca: "granja", da: "gård", no: "gård", fi: "maatila", hu: "farm", ro: "fermă", bg: "ферма", uk: "ферма", he: "חווה", km: "កសិដ្ឋាន", lo: "ຟາມ", my: "လယ်", ti: "ሕርሻ", dz: "ཞིང་",
  },
  forest: {
    en: "tree", es: "árbol", pt: "árvore", fr: "arbre", de: "Baum", it: "albero", nl: "boom",
    ru: "дерево", uk: "дерево", pl: "drzewo", tr: "ağaç", ar: "شجرة", he: "עץ", hi: "पेड़",
    bn: "গাছ", zh: "树", ja: "き", ko: "나무", th: "ต้นไม้", vi: "cây", id: "pohon",
    ms: "pokok", fil: "puno", sv: "träd", el: "δέντρο", fa: "درخت", sw: "mti",
    sq: "pemë", bs: "drvo", mk: "дрво", so: "geed", ky: "дарак", tg: "дарахт", tk: "agaç", az: "ağac", uz: "daraxt", kk: "ағаш", ka: "ხე", hy: "ծառ", mn: "мод", am: "ዛፍ", ne: "रुख", si: "ගස", is: "tré", sl: "drevo", lt: "medis", lv: "koks", et: "puu", sk: "strom", hr: "drvo", ca: "arbre", da: "træ", no: "tre", fi: "puu", hu: "fa", ro: "copac", bg: "дърво", km: "ដើមឈើ", lo: "ຕົ້ນໄມ້", my: "သစ်ပင်", ti: "ገረብ", dz: "ཤིང་", kl: "orpik",
  },
  birds: {
    en: "bird", es: "pájaro", pt: "pássaro", fr: "oiseau", de: "Vogel", it: "uccello", nl: "vogel",
    ru: "птица", pl: "ptak", tr: "kuş", ar: "طائر", he: "ציפור", hi: "चिड़िया", bn: "পাখি",
    zh: "鸟", ja: "とり", ko: "새", th: "นก", vi: "chim", id: "burung", ms: "burung",
    fil: "ibon", sv: "fågel", el: "πουλί", fa: "پرنده", sw: "ndege",
    sq: "zog", bs: "ptica", mk: "птица", so: "shimbir", ky: "куш", tg: "парранда", tk: "guş", az: "quş", uz: "qush", kk: "құс", ka: "ფრინველი", hy: "թռչուն", mn: "шувуу", am: "ወፍ", ne: "चरा", si: "කුරුල්ලා", is: "fugl", sl: "ptica", lt: "paukštis", lv: "putns", et: "lind", sk: "vták", hr: "ptica", ca: "ocell", da: "fugl", no: "fugl", fi: "lintu", hu: "madár", ro: "pasăre", bg: "птица", uk: "птах", km: "បក្សី", lo: "ນົກ", my: "ငှက်", ti: "ዑፍ", dz: "བྱ་", kl: "timmiaq",
  },
  mammals: {
    en: "mammal", es: "mamífero", pt: "mamífero", fr: "mammifère", de: "Säugetier", it: "mammifero",
    nl: "zoogdier", ru: "млекопитающее", pl: "ssak", tr: "memeli", ar: "حيوان ثديي", hi: "स्तनधारी",
    zh: "哺乳动物", ja: "ほにゅうるい", ko: "포유류", th: "สัตว์เลี้ยงลูกด้วยนม", vi: "thú",
    id: "mamalia", fil: "mamalya", sw: "mnyama",
    sq: "gjitar", bs: "sisar", mk: "цицач", so: "naasley", ky: "сүт эмүүчү", tg: "ширхӯр", tk: "süýdemdiriji", az: "məməli", uz: "sutemizuvchi", kk: "сүтқоректі", ka: "ძუძუმწოვარი", hy: "կաթնասուն", mn: "хөхтөн", am: "አጥቢ", ne: "स्तनधारी", si: "ක්ෂීරපායී", is: "spendýr", sl: "sesalec", lt: "žinduolis", lv: "zīdītājs", et: "imetaja", sk: "cicavec", hr: "sisavac", ca: "mamífer", da: "pattedyr", no: "pattedyr", fi: "nisäkäs", hu: "emlős", ro: "mamifer", bg: "бозайник", uk: "ссавець", he: "יונק", km: "ថនិកសត្វ", lo: "ສັດລ້ຽງລູກດ້ວຍນົມ", my: "နို့တိုက်သတ္တဝါ", ti: "እንስሳ", dz: "ནུ་འཐུང་སྲོག་ཆགས་",
  },
  frogs: {
    en: "frog", es: "rana", pt: "rã", fr: "grenouille", de: "Frosch", it: "rana", nl: "kikker",
    ru: "лягушка", pl: "żaba", tr: "kurbağa", ar: "ضفدع", he: "צפרדע", hi: "मेंढक",
    zh: "青蛙", ja: "かえる", ko: "개구리", th: "กบ", vi: "ếch", id: "katak",
    ms: "katak", fil: "palaka", sv: "groda", el: "βάτραχος", fa: "قورباغه", sw: "chura",
    sq: "bretkosë", bs: "žaba", mk: "жаба", so: "rah", ky: "бака", tg: "қурбоққа", tk: "gurbaga", az: "qurbağa", uz: "qurbaqa", kk: "бақа", ka: "ბაყაყი", hy: "գորտ", mn: "мэлхий", am: "እንቁራሪት", ne: "भ्यागुता", si: "මැඬියා", is: "froskur", sl: "žaba", lt: "varlė", lv: "varde", et: "konn", sk: "žaba", hr: "žaba", ca: "granota", da: "frø", no: "frosk", fi: "sammakko", hu: "béka", ro: "broască", bg: "жаба", uk: "жаба", km: "កង្កែប", lo: "ກົບ", my: "ဖား", ti: "እንቋቋሖ", dz: "སྦལ་པ་",
  },
  pop: {
    en: "people", es: "gente", pt: "pessoas", fr: "gens", de: "Leute", it: "gente", nl: "mensen",
    ru: "люди", uk: "люди", pl: "ludzie", tr: "insanlar", ar: "ناس", he: "אנשים", hi: "लोग",
    bn: "মানুষ", zh: "人们", ja: "ひと", ko: "사람들", th: "คน", vi: "người", id: "orang",
    ms: "orang", fil: "tao", sv: "folk", el: "άνθρωποι", fa: "مردم", sw: "watu",
    sq: "njerëz", bs: "ljudi", mk: "луѓе", so: "dad", ky: "адамдар", tg: "одамон", tk: "adamlar", az: "insanlar", uz: "odamlar", kk: "адамдар", ka: "ხალხი", hy: "մարդիկ", mn: "хүмүүс", am: "ሰዎች", ne: "मानिस", si: "මිනිස්සු", is: "fólk", sl: "ljudje", lt: "žmonės", lv: "cilvēki", et: "inimesed", sk: "ľudia", hr: "ljudi", ca: "gent", da: "mennesker", no: "mennesker", fi: "ihmiset", hu: "emberek", ro: "oameni", bg: "хора", km: "មនុស្ស", lo: "ຄົນ", my: "လူ", ti: "ሰባት", dz: "མི་", kl: "inuit",
  },
  life: {
    en: "years", es: "años", pt: "anos", fr: "années", de: "Jahre", it: "anni", nl: "jaren",
    ru: "годы", pl: "lata", tr: "yıllar", ar: "سنوات", hi: "साल", zh: "年", ja: "とし",
    ko: "해", th: "ปี", vi: "năm", id: "tahun", fil: "taon", sv: "år", el: "χρόνια",
    fa: "سال", sw: "miaka",
    sq: "vite", bs: "godine", mk: "години", so: "sano", ky: "жылдар", tg: "солҳо", tk: "ýyllar", az: "illər", uz: "yillar", kk: "жылдар", ka: "წლები", hy: "տարիներ", mn: "жил", am: "ዓመታት", ne: "वर्ष", si: "අවුරුදු", is: "ár", sl: "leta", lt: "metai", lv: "gadi", et: "aastad", sk: "roky", hr: "godine", ca: "anys", da: "år", no: "år", fi: "vuotta", hu: "évek", ro: "ani", bg: "години", uk: "роки", he: "שנים", km: "ឆ្នាំ", lo: "ປີ", my: "နှစ်", ti: "ዓመታት", dz: "ལོ་", kl: "ukioq",
  },
};

export function localWord(metricOrWord: string, lang: string): string | null {
  const table = I18N[metricOrWord];
  if (!table) return null;
  return table[lang] ?? table[lang.split("-")[0] ?? ""] ?? null;
}
