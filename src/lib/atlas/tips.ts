export type DailyTip = {
  id: string;
  title: string;
  body: string;
  kids: boolean;
};

export const DAILY_TIPS: DailyTip[] = [
  { id: "chickens", title: "Chickens everywhere", body: "There are more chickens on Earth than people. China keeps the most.", kids: true },
  { id: "bananas", title: "Banana champion", body: "India grows more bananas than any other country — tens of millions of tonnes a year.", kids: true },
  { id: "cows", title: "Cow country", body: "Brazil has the largest cattle herd on the map.", kids: true },
  { id: "frogs", title: "Frog capital", body: "Brazil is home to hundreds of amphibian species found almost nowhere else.", kids: true },
  { id: "birds", title: "Island birds", body: "Indonesia holds the most endemic bird species — birds that live mainly there.", kids: true },
  { id: "cocoa", title: "Chocolate beans", body: "Most of the world’s cocoa is grown in West Africa, especially Ivory Coast.", kids: true },
  { id: "rice", title: "Rice bowl", body: "India and China grow the lion’s share of the world’s rice.", kids: true },
  { id: "forest", title: "Green cover", body: "Some countries are more than nine-tenths forest. Gabon is one of them.", kids: true },
  { id: "globe", title: "Spin to learn", body: "The globe is an orthographic view of Earth. Drag to turn it; pinch or scroll to zoom.", kids: true },
  { id: "equal-earth", title: "A fairer map", body: "The flat atlas uses the Equal Earth projection so countries keep truer relative size.", kids: false },
  { id: "ppp", title: "What GDP per person means", body: "GDP per capita here is PPP — it adjusts for what money actually buys in each country.", kids: false },
  { id: "endemic", title: "Endemic means local", body: "An endemic species lives mainly in one place. High counts light up Australia and tropical islands.", kids: true },
];

export function tipForToday(kids: boolean, date = new Date()): DailyTip {
  const pool = kids ? DAILY_TIPS.filter((t) => t.kids) : DAILY_TIPS;
  const start = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const day = Math.floor(start / 86_400_000);
  const tip = pool[Math.abs(day) % pool.length];
  return tip ?? DAILY_TIPS[0];
}

export function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
