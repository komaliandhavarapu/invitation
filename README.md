# OpenWithLove — Hindu Wedding Invitation

A mobile-friendly, vertically scrolling Hindu wedding invitation inspired by the supplied references. It uses real wedding and temple photography with cinematic crop, color grading and slow camera movement rather than illustrated people. The page sequence is:

1. A cinematic opening video shows the bride and groom's hands meeting; **Tap to Begin** plays the clip and continues to the couple.
2. A traditional couple illustration and the couple's names.
3. Blessings and names of both sets of parents.
4. The supplied floral Muhurtam invitation artwork, with the wedding date, time, ceremony photo and invitation message.
5. Wedding events with their dates and times.
6. Temple artwork, venue details and a Google Maps link.
7. A swipeable moments gallery; use touch gestures or arrows to browse and tap an image to view it larger.
8. A live countdown and closing message with the couple's names.

## Customer personalization

Edit `config.js` to set:
- `theme`: `rose` (blush pink, rose and gold), `royal` (ivory, royal blue and gold), `sage` (sage, ivory and gold), or `temple-gold` (cream, antique gold and maroon)
- `couple`: bride, groom and display names
- `parents`: both family names
- `wedding`: date (`YYYY-MM-DD`), time, muhurtham title and calendar caption
- `events`: event names, dates, times, icons and notes
- `venue`: venue name, address and Google Maps URL
- `photos`: paths to the customer's images
- `music`: path to the song file

The muhurtham screen and countdown both use `wedding.date` and `wedding.time`. The time can be entered in a format such as `6:45 AM`.

## Photos

The invitation includes locally stored sample photos and an opening clip so they work without third-party media requests at runtime. Replace them with the couple's own media in `assets/photos/` and update the paths in `config.js` before publishing.
Replace `assets/photos/opening-ritual.mp4` with the couple's own muted opening clip to personalize the intro video.
The Muhurtam artwork is `assets/photos/muhurtham-invitation.png`; update it as well if the couple's names, date, or time change in `config.js`.
Each invitation page uses a different, softly shadowed local photo as its background atmosphere. To personalize these background images, update the `.atmosphere-*` and `.floral-paper::after` image paths in `style.css`.

The sample photographs were sourced from Unsplash and are made available under the [Unsplash License](https://unsplash.com/license):

- [Opening hands](https://images.unsplash.com/photo-1520854221256-17451cc331bf)
- [Indian wedding couple](https://images.unsplash.com/photo-1722952934708-749c22eb2e58)
- [Indian bride portrait](https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9)
- [Traditional henna wedding hands](https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8)
- [South Indian temple](https://images.unsplash.com/photo-1705723116788-d11fa6e3f415)
- [Wedding ceremony](https://images.unsplash.com/photo-1587271636175-90d58cdad458)
- [Puja kalash](https://images.unsplash.com/photo-1606293926075-69a00dbfde81)

## Music

Put the customer's audio file at `assets/music/wedding-song.mp3` or change `music` in `config.js`. Background music starts when visitors tap **Tap to Begin**; the fixed music button can pause or resume it afterward.

## Run locally

Open `index.html` in a modern browser. For deployment, upload the whole folder to GitHub Pages or Vercel. Keep customer photos and private content out of a public source repository unless the customer has agreed.
