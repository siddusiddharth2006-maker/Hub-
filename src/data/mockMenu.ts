import { MenuItem, Category, Coupon } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items', nameTamil: 'அனைத்தும்', icon: '✨' },
  { id: 'specials', name: "Today's Specials", nameTamil: 'இன்றைய சிறப்பு', icon: '🔥' },
  { id: 'pizza', name: 'Artisan Pizza', nameTamil: 'பீட்சா', icon: '🍕' },
  { id: 'burger', name: 'Gourmet Burgers', nameTamil: 'பர்கர்', icon: '🍔' },
  { id: 'sandwich', name: 'Club Sandwiches', nameTamil: 'சாண்ட்விச்', icon: '🥪' },
  { id: 'coffee', name: 'Specialty Coffee', nameTamil: 'காபி', icon: '☕' },
  { id: 'tea', name: 'Artisanal Teas', nameTamil: 'டீ', icon: '🫖' },
  { id: 'milkshake', name: 'Thick Milkshakes', nameTamil: 'மில்க்சேக்', icon: '🥤' },
  { id: 'mojito', name: 'Refresher Mojitos', nameTamil: 'மோஜிட்டோ', icon: '🍹' },
  { id: 'desserts', name: 'Decadent Desserts', nameTamil: 'இனிப்புகள்', icon: '🍰' },
  { id: 'fries', name: 'Loaded Fries', nameTamil: 'பிரெஞ்ச் பிரைஸ்', icon: '🍟' },
  { id: 'chinese', name: 'Asian & Chinese', nameTamil: 'சீன உணவுகள்', icon: '🥢' },
  { id: 'pasta', name: 'Italian Pasta', nameTamil: 'பாஸ்தா', icon: '🍝' },
  { id: 'rice', name: 'Special Rice', nameTamil: 'சாதம்', icon: '🍚' },
  { id: 'combos', name: 'Combo Meals', nameTamil: 'கம்போ மீல்ஸ்', icon: '🍱' },
  { id: 'icecream', name: 'Gelato & Sundae', nameTamil: 'ஐஸ்கிரீம்', icon: '🍨' },
];

export const MOCK_MENU: MenuItem[] = [
  // Pizza
  {
    id: 'pizza-1',
    name: 'Truffle Mushroom Glaze Pizza',
    nameTamil: 'டிரஃபிள் மஷ்ரூம் பீட்சா',
    description: 'Fresh wood-fired sourdough crust layered with black truffle pesto, wild roasted mushrooms, fresh fior di latte mozzarella, and topped with wild arugula.',
    descriptionTamil: 'வூட்-ஃபயர்டு சோர்டோ கிரஸ்ட், பிளாக் டிரஃபிள் பெஸ்டோ, வறுத்த காளான்கள் மற்றும் மொஸரெல்லா சீஸ்.',
    price: 480,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80'
    ],
    vegType: 'veg',
    spiceLevel: 1,
    calories: 780,
    prepTime: '15-18 min',
    rating: 4.9,
    reviewsCount: 142,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['Sourdough Crust', 'Black Truffle Oil', 'Wild Mushrooms', 'Fior Di Latte Mozzarella', 'Arugula'],
    addons: [
      { id: 'add-cheese', name: 'Extra Mozzarella Burrata', price: 90 },
      { id: 'add-jalapeno', name: 'Pickled Jalapenos', price: 40 },
      { id: 'add-dip', name: 'Garlic Butter Dip', price: 35 }
    ]
  },
  {
    id: 'pizza-2',
    name: 'Smoked Chicken & BBQ Fiery Pizza',
    nameTamil: 'ஸ்மோக்டு சிக்கன் பிபிஃக்யூ பீட்சா',
    description: 'Hickory-smoked chicken breast infused with tangy house BBQ glaze, roasted bell peppers, caramelized red onions, and aged cheddar blend.',
    descriptionTamil: 'ஸ்மோக்டு சிக்கன், பிரத்யேக பிபிஃக்யூ சாஸ், வறுத்த குடைமிளகாய் மற்றும் சீஸ்.',
    price: 520,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80'
    ],
    vegType: 'non-veg',
    spiceLevel: 2,
    calories: 890,
    prepTime: '15-20 min',
    rating: 4.8,
    reviewsCount: 198,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Smoked Chicken', 'House BBQ Glaze', 'Caramelized Onion', 'Cheddar & Mozzarella', 'Bell Peppers'],
    addons: [
      { id: 'add-bacon', name: 'Crispy Bacon Bits', price: 110 },
      { id: 'add-cheese', name: 'Double Cheese Burst', price: 100 }
    ]
  },

  // Burger
  {
    id: 'burger-1',
    name: 'The Monster Double Smash Burger',
    nameTamil: 'மாண்ஸ்டர் டபுள் ஸ்மாஷ் பர்கர்',
    description: 'Two crispy-edged smashed prime patties, melted double American cheddar, caramelized shallots, house secret sauce served inside a toasted artisanal brioche bun.',
    descriptionTamil: 'இரண்டு பிரீமியம் சாஸ் ஸ்மாஷ் பட்டிகள், மெல்டட் அமெரிக்கன் சீஸ் மற்றும் பிரத்யேக சாஸ்.',
    price: 440,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
    ],
    vegType: 'non-veg',
    spiceLevel: 2,
    calories: 940,
    prepTime: '12-15 min',
    rating: 4.95,
    reviewsCount: 310,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['Prime Meat Patty', 'Brioche Bun', 'American Cheddar', 'Caramelized Shallots', 'Secret Secret Sauce'],
    addons: [
      { id: 'add-patty', name: 'Extra Smash Patty', price: 130 },
      { id: 'add-egg', name: 'Sunny Side Up Egg', price: 45 },
      { id: 'add-fries', name: 'Side of Truffle Fries', price: 90 }
    ]
  },
  {
    id: 'burger-2',
    name: 'Crispy Paneer Supreme Burger',
    nameTamil: 'கிரிஸ்ப்பி பனீர் சுப்ரீம் பர்கர்',
    description: 'Crispy fried cottage cheese slab crusted in panko breadcrumbs, topped with spicy sriracha mayo, iceberg lettuce, and dill pickles in a sesame bun.',
    descriptionTamil: 'மொறுமொறுப்பான பனீர் பாட்டி, ஸ்ரீராச்சா மேயோ, லெட்டூஸ் மற்றும் பிக்கிள்ஸ்.',
    price: 360,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 3,
    calories: 720,
    prepTime: '12-15 min',
    rating: 4.7,
    reviewsCount: 115,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Panko Paneer Slab', 'Sriracha Mayo', 'Iceberg Lettuce', 'Dill Pickles', 'Sesame Bun'],
    addons: [
      { id: 'add-cheese-slice', name: 'Extra Cheese Slice', price: 35 },
      { id: 'add-jalapeno', name: 'Jalapeno Poppers (3pcs)', price: 80 }
    ]
  },

  // Sandwich
  {
    id: 'sandwich-1',
    name: 'Hub House Signature Club Sandwich',
    nameTamil: 'ஹப் ஹவுஸ் சிக்னேச்சர் கிளப் சாண்ட்விச்',
    description: 'Triple-decker toasted sourdough stuffed with herb-grilled chicken, smoked ham, fried egg, ripe tomatoes, crisp lettuce, and honey mustard.',
    descriptionTamil: 'மூன்று அடுக்கு சாண்ட்விச், கிரில்டு சிக்கன், முட்டை, தக்காளி மற்றும் ஹனி மாஸ்டர்ட் சாஸ்.',
    price: 380,
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    vegType: 'non-veg',
    spiceLevel: 1,
    calories: 680,
    prepTime: '10-14 min',
    rating: 4.85,
    reviewsCount: 164,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Toasted Sourdough', 'Grilled Chicken', 'Smoked Ham', 'Fried Egg', 'Honey Mustard'],
    addons: [
      { id: 'add-avocado', name: 'Fresh Avocado Slices', price: 80 },
      { id: 'add-cheese', name: 'Melted Cheddar', price: 40 }
    ]
  },
  {
    id: 'sandwich-2',
    name: 'Pesto Avocado & Burrata Focaccia',
    nameTamil: 'பெஸ்டோ அவகாடோ ஃபோகாசியா சாண்ட்விச்',
    description: 'Freshly baked rosemary focaccia, creamy Italian burrata cheese, sliced hass avocado, house basil pesto, and balsamic glaze drizzle.',
    descriptionTamil: 'ரோஸ்மேரி ஃபோகாசியா ரொட்டி, கிரீமி புர்ராட்டா சீஸ், அவகாடோ மற்றும் பேசில் பெஸ்டோ சாஸ்.',
    price: 390,
    category: 'sandwich',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 0,
    calories: 590,
    prepTime: '10-12 min',
    rating: 4.9,
    reviewsCount: 88,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: false,
    ingredients: ['Rosemary Focaccia', 'Burrata Cheese', 'Hass Avocado', 'Fresh Basil Pesto', 'Balsamic Glaze'],
    addons: [
      { id: 'add-sun-dried', name: 'Sun-dried Tomatoes', price: 50 }
    ]
  },

  // Coffee
  {
    id: 'coffee-1',
    name: 'Spanish Sea Salt Caramel Latte',
    nameTamil: 'ஸ்பானிஷ் சீ சால்ட் கேரமல் லேட்டே',
    description: 'Single-origin double espresso shot poured over velvety steamed milk, infused with buttery house caramel and a touch of sea salt.',
    descriptionTamil: 'டபுள் எஸ்பிரெஸ்ஸோ, வெல்வெட்டி மில்க், கேரமல் மற்றும் சீ சால்ட் சுவை.',
    price: 240,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 0,
    calories: 220,
    prepTime: '5-8 min',
    rating: 4.98,
    reviewsCount: 420,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['Double Espresso', 'Steamed Milk', 'Sea Salt Caramel', 'Microfoam Glass'],
    addons: [
      { id: 'add-oat-milk', name: 'Oat Milk Swap', price: 50 },
      { id: 'add-espresso-shot', name: 'Extra Espresso Shot', price: 60 },
      { id: 'add-whipped-cream', name: 'Vanilla Whipped Cream', price: 40 }
    ]
  },
  {
    id: 'coffee-2',
    name: 'Affogato al Caffe with Vanilla Bean Ice Cream',
    nameTamil: 'அஃபோகாட்டோ வித் வெண்ணிலா ஐஸ்கிரீம்',
    description: 'A scoop of artisanal Madagascar vanilla bean gelato drowned in a piping hot shot of freshly pulled dark roast espresso.',
    descriptionTamil: 'பிரீமியம் வெண்ணிலா ஐஸ்கிரீம் மற்றும் சூடான அடர்ந்த எஸ்பிரெஸ்ஸோ சாட்.',
    price: 210,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 0,
    calories: 280,
    prepTime: '4-6 min',
    rating: 4.88,
    reviewsCount: 130,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Madagascar Vanilla Gelato', 'Fresh Espresso Shot', 'Dark Chocolate Shavings'],
    addons: [
      { id: 'add-hazelnut', name: 'Hazelnut Syrup Drizzle', price: 35 }
    ]
  },

  // Milkshake
  {
    id: 'shake-1',
    name: 'Belgian Dark Chocolate Fudge Shake',
    nameTamil: 'பெல்ஜியன் டார்க் சாக்லேட் மில்க்சேக்',
    description: 'Rich 70% Belgian dark chocolate blended with whole milk, chocolate ice cream, topped with whipped cream, cocoa nibs, and chocolate drizzle.',
    descriptionTamil: '70% பெல்ஜியன் டார்க் சாக்லேட், பிரீமியம் ஐஸ்கிரீம் மற்றும் சாக்லேட் சிப்ஸ்.',
    price: 280,
    category: 'milkshake',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 0,
    calories: 520,
    prepTime: '6-9 min',
    rating: 4.92,
    reviewsCount: 290,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['70% Belgian Dark Chocolate', 'Whole Milk', 'Cocoa Nibs', 'Whipped Cream'],
    addons: [
      { id: 'add-brownie', name: 'Crumbled Brownie Top', price: 60 },
      { id: 'add-scoop', name: 'Extra Ice Cream Scoop', price: 50 }
    ]
  },

  // Mojito
  {
    id: 'mojito-1',
    name: 'Wild Blueberry & Mint Botanical Mojito',
    nameTamil: 'ப்ளூபெர்ரி மிண்ட் மோஜிட்டோ',
    description: 'Muddled fresh blueberries, crisp garden mint leaves, lime juice, sparkling soda water, and cane sugar served over crushed ice.',
    descriptionTamil: 'பிரெஷ் ப்ளூபெர்ரி, புதினா இலைகள், எலுமிச்சை சாறு மற்றும் சோடா.',
    price: 220,
    category: 'mojito',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 0,
    calories: 140,
    prepTime: '5 min',
    rating: 4.87,
    reviewsCount: 180,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Wild Blueberries', 'Garden Mint', 'Fresh Lime', 'Sparkling Soda', 'Crushed Ice'],
    addons: [
      { id: 'add-chia', name: 'Chia Seeds Boost', price: 30 }
    ]
  },

  // Desserts
  {
    id: 'dessert-1',
    name: 'Classic Molten Lava Chocolate Cake',
    nameTamil: 'சாக்லேட் லாவா கேக்',
    description: 'Warm chocolate cake with a gooey flowing center of melted couverture dark chocolate, paired with a scoop of Madagascar vanilla bean gelato.',
    descriptionTamil: 'சூடான சாக்லேட் கேக், உருகும் சாக்லேட் மையம் மற்றும் வெண்ணிலா ஐஸ்கிரீம்.',
    price: 290,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 0,
    calories: 480,
    prepTime: '10-12 min',
    rating: 4.96,
    reviewsCount: 350,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['Couverture Dark Chocolate', 'Vanilla Gelato', 'Berry Reduction', 'Powdered Sugar'],
    addons: [
      { id: 'add-berries', name: 'Fresh Raspberry Compote', price: 65 }
    ]
  },

  // Loaded Fries
  {
    id: 'fries-1',
    name: 'Truffle Parmesan Loaded Skinny Fries',
    nameTamil: 'டிரஃபிள் பார்மிசன் பிரெஞ்ச் பிரைஸ்',
    description: 'Golden crispy skinny potato fries tossed in Italian black truffle oil, aged grated parmesan cheese, fresh parsley, and truffle aioli.',
    descriptionTamil: 'மொறுமொறுப்பான பிரைஸ், டிரஃபிள் ஆயில், பார்மிசன் சீஸ் மற்றும் பிரத்யேக சாஸ்.',
    price: 260,
    category: 'fries',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 1,
    calories: 510,
    prepTime: '8-10 min',
    rating: 4.91,
    reviewsCount: 220,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['Skinny Russet Potato Fries', 'Truffle Oil', 'Aged Parmesan', 'Fresh Herbs', 'Truffle Aioli'],
    addons: [
      { id: 'add-cheese-sauce', name: 'Liquid Cheddar Cheese Dip', price: 50 },
      { id: 'add-jalapeno', name: 'Crispy Jalapenos', price: 40 }
    ]
  },

  // Chinese
  {
    id: 'chinese-1',
    name: 'Schezwan Chilli Garlic Dragon Chicken',
    nameTamil: 'செஷ்வான் டிராகன் சிக்கன்',
    description: 'Crispy wok-tossed chicken strips coated in spicy Schezwan glaze, garlic, bell peppers, spring onions, and roasted sesame seeds.',
    descriptionTamil: 'மொறுமொறுப்பான சிக்கன் துண்டுகள், காரசாரமான செஷ்வான் சாஸ் மற்றும் பூண்டு சுவை.',
    price: 380,
    category: 'chinese',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    vegType: 'non-veg',
    spiceLevel: 4,
    calories: 620,
    prepTime: '12-15 min',
    rating: 4.88,
    reviewsCount: 205,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Boneless Chicken', 'Schezwan Chilli Paste', 'Garlic Bits', 'Bell Pepper', 'Spring Onion'],
    addons: [
      { id: 'add-fried-rice', name: 'Side Fried Rice Portion', price: 110 }
    ]
  },

  // Pasta
  {
    id: 'pasta-1',
    name: 'Creamy Truffle Alfredo Penne Pasta',
    nameTamil: 'கிரீமி டிரஃபிள் பென்னே பாஸ்தா',
    description: 'Al dente penne pasta tossed in rich garlic parmesan cream sauce, infused with truffle oil, sautéed wild mushrooms, and fresh basil.',
    descriptionTamil: 'பென்னே பாஸ்தா, பூண்டு பார்மிசன் கிரீம் சாஸ், காளான்கள் மற்றும் பேசில்.',
    price: 410,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 1,
    calories: 740,
    prepTime: '14-16 min',
    rating: 4.93,
    reviewsCount: 175,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['Italian Penne', 'Garlic Heavy Cream', 'Parmesan', 'Truffle Essence', 'Mushrooms'],
    addons: [
      { id: 'add-chicken-strip', name: 'Grilled Herb Chicken Strips', price: 90 },
      { id: 'add-garlic-bread', name: 'Garlic Bread Toast (2pcs)', price: 60 }
    ]
  },

  // Rice
  {
    id: 'rice-1',
    name: 'Hub House Special Fried Rice Bowl',
    nameTamil: 'ஹப் ஹவுஸ் ஸ்பெஷல் ஃப்ரைடு ரைஸ்',
    description: 'Fragrant jasmine rice wok-tossed with fresh crunchy veggies, scrambled egg, tender chicken bites, and aromatic sesame garlic soy sauce.',
    descriptionTamil: 'ஜாஸ்மின் ரைஸ், காய்கறிகள், முட்டை, சிக்கன் துண்டுகள் மற்றும் சோயா சாஸ்.',
    price: 360,
    category: 'rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    vegType: 'non-veg',
    spiceLevel: 2,
    calories: 690,
    prepTime: '12-14 min',
    rating: 4.82,
    reviewsCount: 140,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Jasmine Rice', 'Chicken Bites', 'Scrambled Egg', 'Mixed Veggies', 'Sesame Oil'],
    addons: [
      { id: 'add-manchurian', name: 'Chilli Chicken Gravy Bowl', price: 120 }
    ]
  },

  // Combos
  {
    id: 'combo-1',
    name: 'Ultimate Cafe Combo Meal',
    nameTamil: 'அல்டிமேட் கேஃபே கம்போ மீல்',
    description: '1 Gourmet Cheeseburger + 1 Portion Truffle Parmesan Fries + 1 Chilled Blueberry Mojito or Caramel Latte.',
    descriptionTamil: '1 பர்கர் + 1 பிரெஞ்ச் பிரைஸ் + 1 சில்லென மோஜிட்டோ அல்லது காபி கம்போ.',
    price: 690,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=800&q=80',
    vegType: 'non-veg',
    spiceLevel: 2,
    calories: 1250,
    prepTime: '15 min',
    rating: 4.97,
    reviewsCount: 380,
    isAvailable: true,
    isChefSpecial: true,
    isPopular: true,
    ingredients: ['Choice of Burger', 'Loaded Truffle Fries', 'Choice of Drink'],
    addons: [
      { id: 'add-lava-cake', name: 'Add Lava Cake Dessert', price: 150 }
    ]
  },

  // Ice Cream
  {
    id: 'icecream-1',
    name: 'Triple Berry Nutella Gelato Sundae',
    nameTamil: 'டிரைபிள் பெர்ரி நட்டெல்லா ஐஸ்கிரீம்',
    description: 'Layers of hazelnut gelato, fresh strawberries, warm Nutella drizzle, crushed caramelized pecans, and whipped cream.',
    descriptionTamil: 'ஹேசல்நட் ஐஸ்கிரீம், ஸ்ட்ராபெர்ரி, சூடான நட்டெல்லா சாஸ் மற்றும் பிகான் நட்ஸ்.',
    price: 270,
    category: 'icecream',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    vegType: 'veg',
    spiceLevel: 0,
    calories: 460,
    prepTime: '5 min',
    rating: 4.9,
    reviewsCount: 160,
    isAvailable: true,
    isChefSpecial: false,
    isPopular: true,
    ingredients: ['Hazelnut Gelato', 'Warm Nutella', 'Fresh Berries', 'Pecan Crunch'],
    addons: []
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'HUB20',
    discountPercent: 20,
    maxDiscount: 200,
    minOrder: 400,
    description: '20% OFF on orders above ₹400'
  },
  {
    code: 'WELCOME50',
    discountPercent: 50,
    maxDiscount: 150,
    minOrder: 300,
    description: '50% OFF for first table scan'
  },
  {
    code: 'CAFEGIFT',
    discountPercent: 15,
    maxDiscount: 100,
    minOrder: 250,
    description: '15% OFF on coffee & desserts'
  }
];
