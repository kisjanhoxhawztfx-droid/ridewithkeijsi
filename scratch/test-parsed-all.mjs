import { parseMotorcycleCaption } from "../src/lib/motorcycleParser.ts";

const testCaptions = [
  `📞 069 775 8970\n\nHonda Integra 700\n2014\n68,000 km\n700 cc + 51 hp\n4,700 €\n\n#ridewithkeijsi #shitet #motorr`,
  `📞 +355 69 723 6989\n\nKawasaki ER-6N\n2014\n23,000 km\n649 cc + 35 kW (në leje qarkullimi)\n5,000€\n\n#ridewithkeijsi #shitet #motorr`,
  `BMW R 1300 GS Adventure\n❌SHITUR❌\n\n#ridewithkeijsi #shitur #motorr`,
  `+355 69 530 4711\n\nYamaha DragStar 650\n2006\n17,000 km\n650cc + 40 hp\n4,000€\n\n#ridewithkeijsi #shitet #motorr`,
  `❌BOOOOOOM❌\n\n#ridewithkeijsi #shitet #motorr`,
  `Kujdes 🏍️\n\n#ridewithkeijsi #shitet #motorr`,
];

testCaptions.forEach((c, i) => {
  const p = parseMotorcycleCaption(c);
  console.log(`\n--- Test ${i + 1} ---`);
  console.log("Title:", p.title);
  console.log("Price:", p.price);
  console.log("Phone:", p.phone);
  console.log("Year:", p.year);
  console.log("Engine:", p.engine);
  console.log("Mileage:", p.mileage);
});
