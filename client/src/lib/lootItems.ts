// Types for loot system
export interface LootItem {
  id: string;
  name: string;
  type: 'food' | 'clothing' | 'toy' | 'accessory' | 'rainbow';
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare';
  description: string;
}

export interface CollectedItem extends LootItem {
  count: number;
  firstCollectedAt: string;
}

// List of items a 4-year-old would enjoy
export const lootItems: LootItem[] = [
  // Food items
  {
    id: "cake",
    name: "Birthday Cake",
    type: "food",
    emoji: "🎂",
    rarity: "uncommon",
    description: "A delicious birthday cake with colorful frosting!"
  },
  {
    id: "ice-cream",
    name: "Ice Cream Cone",
    type: "food",
    emoji: "🍦",
    rarity: "common",
    description: "A yummy vanilla ice cream cone with sprinkles!"
  },
  {
    id: "cookie",
    name: "Chocolate Chip Cookie",
    type: "food",
    emoji: "🍪",
    rarity: "common",
    description: "A warm, freshly baked chocolate chip cookie!"
  },
  {
    id: "candy",
    name: "Rainbow Lollipop",
    type: "food",
    emoji: "🍭",
    rarity: "common",
    description: "A swirly rainbow lollipop with magical flavors!"
  },
  {
    id: "cupcake",
    name: "Sparkly Cupcake",
    type: "food",
    emoji: "🧁",
    rarity: "common",
    description: "A cupcake with sparkly frosting that never melts!"
  },
  {
    id: "donut",
    name: "Sprinkle Donut",
    type: "food",
    emoji: "🍩",
    rarity: "common",
    description: "A pink frosted donut covered in colorful sprinkles!"
  },
  {
    id: "pizza",
    name: "Pizza Slice",
    type: "food",
    emoji: "🍕",
    rarity: "common",
    description: "A cheesy slice of pizza that's always the perfect temperature!"
  },
  {
    id: "watermelon",
    name: "Juicy Watermelon",
    type: "food",
    emoji: "🍉",
    rarity: "common",
    description: "A slice of juicy watermelon, perfect for hot days!"
  },
  {
    id: "strawberry",
    name: "Giant Strawberry",
    type: "food",
    emoji: "🍓",
    rarity: "common",
    description: "The sweetest, juiciest strawberry you've ever tasted!"
  },
  {
    id: "chocolate",
    name: "Magic Chocolate Bar",
    type: "food",
    emoji: "🍫",
    rarity: "uncommon",
    description: "A chocolate bar that never runs out!"
  },
  
  // Clothing items
  {
    id: "crown",
    name: "Royal Crown",
    type: "clothing",
    emoji: "👑",
    rarity: "rare",
    description: "A shiny golden crown fit for unicorn royalty!"
  },
  {
    id: "tutu",
    name: "Fluffy Tutu",
    type: "clothing",
    emoji: "👗",
    rarity: "uncommon",
    description: "A pink fluffy tutu that makes dancing extra special!"
  },
  {
    id: "boots",
    name: "Rainbow Boots",
    type: "clothing",
    emoji: "👢",
    rarity: "uncommon",
    description: "Magical boots that create tiny rainbows with each step!"
  },
  {
    id: "cape",
    name: "Superhero Cape",
    type: "clothing",
    emoji: "🦸‍♀️",
    rarity: "uncommon",
    description: "A flowing superhero cape that makes you feel brave and strong!"
  },
  {
    id: "hat",
    name: "Unicorn Party Hat",
    type: "clothing",
    emoji: "🎩",
    rarity: "common",
    description: "A sparkly party hat with a tiny unicorn on top!"
  },
  {
    id: "mittens",
    name: "Fluffy Mittens",
    type: "clothing",
    emoji: "🧤",
    rarity: "common",
    description: "Super soft mittens that keep your hands cozy and warm!"
  },
  {
    id: "socks",
    name: "Mismatched Socks",
    type: "clothing",
    emoji: "🧦",
    rarity: "common",
    description: "Fun, colorful socks that never match - on purpose!"
  },
  {
    id: "scarf",
    name: "Magical Scarf",
    type: "clothing",
    emoji: "🧣",
    rarity: "uncommon",
    description: "A scarf that changes colors with your mood!"
  },
  {
    id: "sunglasses",
    name: "Star Sunglasses",
    type: "clothing",
    emoji: "🕶️",
    rarity: "uncommon",
    description: "Sunglasses with star-shaped lenses that make everything sparkle!"
  },
  {
    id: "gloves",
    name: "Princess Gloves",
    type: "clothing",
    emoji: "🧤",
    rarity: "uncommon",
    description: "Elegant gloves that make you feel like royalty!"
  },
  
  // Toys
  {
    id: "teddy",
    name: "Cuddly Teddy Bear",
    type: "toy",
    emoji: "🧸",
    rarity: "common",
    description: "A super soft teddy bear that gives the best hugs!"
  },
  {
    id: "ball",
    name: "Bouncy Ball",
    type: "toy",
    emoji: "🏀",
    rarity: "common",
    description: "A colorful ball that bounces higher than the clouds!"
  },
  {
    id: "blocks",
    name: "Building Blocks",
    type: "toy",
    emoji: "🧱",
    rarity: "common",
    description: "Magical blocks that can build anything you imagine!"
  },
  {
    id: "doll",
    name: "Fairy Doll",
    type: "toy",
    emoji: "🧚‍♀️",
    rarity: "uncommon",
    description: "A fairy doll with glittery wings that really flutter!"
  },
  {
    id: "train",
    name: "Choo-Choo Train",
    type: "toy",
    emoji: "🚂",
    rarity: "common",
    description: "A colorful train that makes real train sounds!"
  },
  {
    id: "drum",
    name: "Magic Drum",
    type: "toy",
    emoji: "🥁",
    rarity: "uncommon",
    description: "A drum that makes different animal sounds when you tap it!"
  },
  {
    id: "bubbles",
    name: "Never-Ending Bubbles",
    type: "toy",
    emoji: "🫧",
    rarity: "common",
    description: "Bubbles that don't pop until you say the magic word!"
  },
  {
    id: "kite",
    name: "Dragon Kite",
    type: "toy",
    emoji: "🪁",
    rarity: "uncommon",
    description: "A kite shaped like a dragon that roars in the wind!"
  },
  {
    id: "car",
    name: "Zoom-Zoom Car",
    type: "toy",
    emoji: "🚗",
    rarity: "common",
    description: "A toy car that zooms around all by itself!"
  },
  {
    id: "robot",
    name: "Friendly Robot",
    type: "toy",
    emoji: "🤖",
    rarity: "rare",
    description: "A tiny robot friend who dances and tells jokes!"
  },
  
  // Accessories
  {
    id: "wand",
    name: "Magic Wand",
    type: "accessory",
    emoji: "✨",
    rarity: "rare",
    description: "A sparkly wand that grants tiny wishes!"
  },
  {
    id: "necklace",
    name: "Friendship Necklace",
    type: "accessory",
    emoji: "📿",
    rarity: "uncommon",
    description: "A colorful beaded necklace that glows in the dark!"
  },
  {
    id: "tiara",
    name: "Sparkly Tiara",
    type: "accessory",
    emoji: "👑",
    rarity: "uncommon",
    description: "A tiara that makes you feel like a princess!"
  },
  {
    id: "bracelet",
    name: "Charm Bracelet",
    type: "accessory",
    emoji: "💎",
    rarity: "uncommon",
    description: "A bracelet with tiny charms that jingle when you move!"
  },
  {
    id: "backpack",
    name: "Adventure Backpack",
    type: "accessory",
    emoji: "🎒",
    rarity: "uncommon",
    description: "A magical backpack that's bigger on the inside!"
  },
  
  // Rainbow items
  {
    id: "rainbow-cloud",
    name: "Rainbow Cloud",
    type: "rainbow",
    emoji: "🌈",
    rarity: "rare",
    description: "A fluffy cloud that follows you and makes tiny rainbows!"
  },
  {
    id: "rainbow-brush",
    name: "Rainbow Paintbrush",
    type: "rainbow",
    emoji: "🖌️",
    rarity: "uncommon",
    description: "A paintbrush that paints with real rainbow colors!"
  },
  {
    id: "rainbow-balloon",
    name: "Rainbow Balloon",
    type: "rainbow",
    emoji: "🎈",
    rarity: "common",
    description: "A balloon that changes rainbow colors and never pops!"
  },
  {
    id: "rainbow-star",
    name: "Twinkle Rainbow Star",
    type: "rainbow",
    emoji: "⭐",
    rarity: "rare",
    description: "A star that twinkles in all colors of the rainbow!"
  },
  {
    id: "rainbow-umbrella",
    name: "Magic Rainbow Umbrella",
    type: "rainbow",
    emoji: "☂️",
    rarity: "uncommon",
    description: "An umbrella that makes rainbows instead of keeping rain away!"
  },
  {
    id: "rainbow-pony",
    name: "Tiny Rainbow Pony",
    type: "rainbow",
    emoji: "🦄",
    rarity: "rare",
    description: "A tiny pony friend with a rainbow mane and tail!"
  },
  {
    id: "rainbow-flower",
    name: "Rainbow Flower",
    type: "rainbow",
    emoji: "🌸",
    rarity: "uncommon",
    description: "A magical flower with petals in all rainbow colors!"
  },
  {
    id: "rainbow-gem",
    name: "Rainbow Gemstone",
    type: "rainbow",
    emoji: "💎",
    rarity: "rare",
    description: "A precious gem that sparkles with rainbow light!"
  },
  {
    id: "rainbow-book",
    name: "Rainbow Storybook",
    type: "rainbow",
    emoji: "📚",
    rarity: "uncommon",
    description: "A book of stories where all the pictures are rainbow-colored!"
  },
  {
    id: "rainbow-shoes",
    name: "Rainbow Light-up Shoes",
    type: "rainbow",
    emoji: "👟",
    rarity: "uncommon",
    description: "Shoes that light up in rainbow colors with each step!"
  }
];

// Function to get a random loot item with rarity weighting
export function getRandomLootItem(): LootItem {
  // Assign probability weights to different rarities
  const rarityWeights = {
    common: 0.6,    // 60% chance
    uncommon: 0.35, // 35% chance
    rare: 0.05      // 5% chance
  };
  
  // Determine which rarity bucket to pick from
  const rarityRoll = Math.random();
  let selectedRarity: 'common' | 'uncommon' | 'rare';
  
  if (rarityRoll < rarityWeights.common) {
    selectedRarity = 'common';
  } else if (rarityRoll < rarityWeights.common + rarityWeights.uncommon) {
    selectedRarity = 'uncommon';
  } else {
    selectedRarity = 'rare';
  }
  
  // Filter items by the selected rarity
  const itemsOfSelectedRarity = lootItems.filter(item => item.rarity === selectedRarity);
  
  // Pick a random item from the filtered list
  const randomIndex = Math.floor(Math.random() * itemsOfSelectedRarity.length);
  return itemsOfSelectedRarity[randomIndex];
}