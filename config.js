/* ============================================================
   BRANDGRAM CONFIG
   This is the ONLY file you need to edit to add your content.

   HOW IT WORKS
   ------------
   1. Drop your media into /content/<brand-slug>/  (create a folder per brand)
   2. Add a brand object to the `brands` array below
   3. Each brand gets its own "profile page" with:
        - stories  → shown as a tappable highlight bubble (full-screen viewer)
        - posts    → shown as the grid (photos or videos, opens in a lightbox)

   MEDIA TIPS
   ----------
   - Posts look best square-ish (1:1 or 4:5), stories vertical (9:16)
   - For video posts, add a `thumb` image so the grid loads fast
   - `type` is "image" or "video"
   ============================================================ */

const SITE_CONFIG = {
  profile: {
    username: "shawnomorton",
    name: "Shawn Morton",
    tagline: "A Human, From Earth",
    avatar: "content/profile.jpg",
    bio: [
      "📍 Currently: Costa Rica",
      "🎥 I create UGC and content for travel & lifestyle brands",
      "👇 Click on a Brand Below to See Our Work!"
    ],
    website: "shawnomortonphoto.com",
    websiteUrl: "https://yourwebsite.com",
    customStat: { value: "15", label: "countries" }
  },

  brands: [
    {
      slug: "maikekai",
      name: "Mai Ke Kai Surf House",
      handle: "maikekaisurf",
      logo: "content/maikekai/logo.jpg",
      cover: "content/maikekai/cover.jpg",
      location: "Tamarindo, Costa Rica",
      description: "Laid back surf house with amazing vibes!",
      deliverables: "3 reels · 8 photos",
      link: "https://maikekaisurf.com",
      stories: [
        { type: "video", src: "content/maikekai/story/story1.mp4" },
        { type: "video", src: "content/maikekai/story/story2.mp4" },
        { type: "video", src: "content/maikekai/story/story3.mp4" },
        { type: "video", src: "content/maikekai/story/story4.mp4" },
        { type: "video", src: "content/maikekai/story/story5.mp4" }
      ],
      posts: [
        {
          type: "video",
          src: "content/maikekai/post/mkk_cr_003/video1.mp4",
          thumb: "content/maikekai/post/mkk_cr_003/post3_thumb.jpg",
          caption: "Turns out the Mai Ke Kai surf house in \n Tamarindo has a lot more to offer than just amazing waves \n 😉 #costarica #surflife #solotraveling #hostellife \n #puravida"
        },

        {
          type: "image", // Post on June 30, 2026
          thumb: "content/maikekai/post/mkk_cr_002/carousel_thumb.jpg",
          images: [
          { type: "image", src: "content/maikekai/post/mkk_cr_002/photo1.jpg" },
    { type: "video", src: "content/maikekai/post/mkk_cr_002/video1.mp4" },
    { type: "image", src: "content/maikekai/post/mkk_cr_002/photo2.jpg" },
    { type: "image", src: "content/maikekai/post/mkk_cr_002/photo3.jpg" },
    { type: "image", src: "content/maikekai/post/mkk_cr_002/photo4.jpg" },
    { type: "image", src: "content/maikekai/post/mkk_cr_002/photo5.jpg" },
    { type: "image", src: "content/maikekai/post/mkk_cr_002/photo6.jpg" },
    { type: "image", src: "content/maikekai/post/mkk_cr_002/photo7.jpg" },
    { type: "image", src: "content/maikekai/post/mkk_cr_002/photo8.jpg" },
  ],
  caption: "More than just a place to stay 🌊🏄‍♂️ \n\n Mornings on the waves, afternoons exploring, sunsets \n with amazing people, and nights around the barbecue. \n That's the Mai Ke Kai experience. 🤙✨ \n\n Come for the surf, stay for the community. \n\n 📍 Tamarindo, Costa Rica \n\n #Tamarindo #CostaRica #HostelLife #SurfTrip #BeachLife "
},

        {
          type: "video",
          src: "content/maikekai/post/mkk_cr_001/post1.mp4",
          thumb: "content/maikekai/post/mkk_cr_001/post1_thumb.jpg",
          caption: "Need a rest day from surfing in Tamarindo? Say less! We're loading up the van to Playa Conchal 🌊 #costarica #tamarindo #puravida"
        }
      ]
    }
  ]
};