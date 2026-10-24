/*
  Fidgital World site settings. This is the only file you need to edit to change
  prices, dates, payment links, stock and tracking IDs. Every page reads from here.

  Leave a value as "" when you don't have it yet. The pages hide or soften whatever is empty
  (for example, no price shows "Join the list for the next batch" instead).
*/
window.FW_SITE = {
  // Where the lead form sends each sign-up (Google Sheet). Setup: docs/lead-form-setup.md
  leadEndpoint: "",

  // WhatsApp link shown after a waitlist sign-up, and set as Razorpay's "after payment" page.
  // Example: "https://wa.me/919999999999?text=Hi%20Fidgital%20World" or a group invite link.
  whatsappUrl: "",

  // The online game, where kit owners enter their code.
  playUrl: "https://play.fidgitalworld.com/",

  // Tracking. Paste the IDs to switch them on.
  ga4Id: "",      // Google Analytics 4, looks like "G-XXXXXXXXXX"
  clarityId: "",  // Microsoft Clarity (free heatmaps and recordings), looks like "abcd1234ef"

  // One entry per thing you sell. `status` decides what the button does:
  //   "open"     the form goes to the payment link
  //   "waitlist" the form saves the lead and offers WhatsApp (no payment yet)
  //   "preorder" like "open", with pre-order wording (kit only)
  //   "soldout"  the form saves the lead as a waitlist
  products: {
    "fun-with-ai": {
      name: "Fun with AI",
      status: "open",
      price: "",              // e.g. "₹1,499"
      priceOld: "",           // optional strike-through price, e.g. "₹2,499"
      nextBatch: "",          // e.g. "Sat 8 and Sun 9 Nov, 4 to 6 pm IST"
      seatsLeft: null,        // a number shows "Only N seats left", null hides it
      paymentUrl: "https://rzp.io/rzp/fidgital-world"
    },
    "learn-with-ai": {
      name: "Learn with AI",
      status: "waitlist",
      price: "",
      priceOld: "",
      nextBatch: "",
      seatsLeft: null,
      paymentUrl: ""
    },
    "play-kit": {
      name: "Fidgital Play kit",
      age: "",                // e.g. "Ages 6 to 10". Hidden while empty
      status: "open",         // switch to "preorder" when the first 10 are gone
      price: "",
      priceOld: "",
      nextBatch: "",          // for pre-orders: expected shipping, e.g. "Ships in December"
      seatsLeft: 10,          // kits left in stock
      paymentUrl: "",
      preorderUrl: ""         // Razorpay link for pre-orders (can be the same as paymentUrl)
    },
    "ai-course": {
      name: "AI Course (self-paced)",
      status: "waitlist",
      price: "",
      priceOld: "",
      nextBatch: "",
      seatsLeft: null,
      paymentUrl: ""
    }
  },

  // Real parent quotes only. The proof sections stay hidden while this list is empty.
  // { quote: "…", name: "Ritu S.", detail: "Mum of Aarav, 11" }
  testimonials: [],

  // Real numbers only, e.g. { value: "120+", label: "kids taught" }. Hidden while empty.
  stats: []
};
