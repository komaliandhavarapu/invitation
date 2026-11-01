/* EDIT THIS FILE FOR EACH CUSTOMER. Keep image files inside assets/photos/. */
window.WEDDING_CONFIG = {
  theme: "rose", // rose | royal | sage | temple-gold
  couple: { bride: "Sita", groom: "Ram", display: "Ram & Sita" },
  invitation: {
    intro: "With the blessings of our families, we invite you to join us as we begin our forever.",
    closing: "Your presence will make our celebration complete. We look forward to celebrating with you.",
    signature: "With love and blessings"
  },
  parents: { bride: ["Mr. Suresh Sharma", "Mrs. Meena Suresh"], groom: ["Mr.Ram" , "Mrs. Leela"] },
  wedding: { date: "2026-12-15", time: "6:45 AM", muhurthamLabel: "Muhurtham", calendarCaption: "A day written in our hearts" },
  events: [
    { name: "Haldi", date: "14 December 2026", time: "10:00 AM", icon: "🪔", note: "A morning filled with colour and blessings" },
    { name: "Mehendi", date: "14 December 2026", time: "4:00 PM", icon: "🌿", note: "An evening of music and celebration" },
    { name: "Muhurtham", date: "15 December 2026", time: "6:45 AM", icon: "🔥", note: "The beginning of our forever" },
    { name: "Reception", date: "15 December 2026", time: "7:00 PM", icon: "✨", note: "Celebrate with us" }
  ],
  venue: { name: "Sri Lakshmi Narasimha Swamy Temple", address: "Temple Road, Your City, Andhra Pradesh", mapUrl: "https://maps.google.com/?q=Sri+Lakshmi+Narasimha+Swamy+Temple" },
  photos: {
    divineOpening: "assets/photos/opening-ritual.mp4",
    ramSita: "assets/photos/indian-couple.jpg",
    temple: "assets/photos/indian-temple.jpg",
    moments: [
      { src: "assets/photos/indian-bride.jpg", caption: "A moment before forever" },
      { src: "assets/photos/indian-couple.jpg", caption: "Together, always" },
      { src: "assets/photos/indian-ceremony.jpg", caption: "A sacred beginning" },
      { src: "assets/photos/kalash.jpg", caption: "A sacred blessing" }
    ]
  },
  music: "assets/music/wedding-song.mp3"
};
