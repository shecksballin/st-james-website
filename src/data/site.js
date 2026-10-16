// Everything the St James site says about itself, in one place.

export const SITE = {
  name: 'St James',
  tagline: 'Bar + Club',
  city: 'Geelong',
  email: 'hello@stjamesnightclub.com.au',
  managerEmail: 'manager@stjamesnightclub.com.au',
  address: 'First Floor, 5 & 11A James St, Geelong, Vic 3220',
  mapsUrl: 'https://maps.google.com/?q=5+James+St,+Geelong,+Vic+3220',
  instagram: 'https://www.instagram.com/stjamesnightclub/',
  heroVideoId: 'Nd-eh12ufL4',
  heroVideoLoopEnd: 14,
  established: 'Geelong CBD',
};

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Join The Team', to: '/apply' },
  { label: 'Nightlife Photos', to: '/photos' },
  { label: 'Contact', to: '/#contact' },
];

export const HOURS = [
  { day: 'Wednesday', time: '10pm – 7am' },
  { day: 'Friday', time: '10pm – 7am' },
  { day: 'Saturday', time: '10pm – 7am' },
  { day: 'Public Holiday Eves', time: '10pm – 7am' },
];

export const CARDS = [
  {
    title: 'Weekly Club Photos',
    blurb: 'Every Wednesday, Friday and Saturday, shot on the floor. Find yourself in the albums.',
    img: '/assets/card-weekly-photos.jpg',
    to: '/photos',
    cta: 'Browse albums',
  },
  {
    title: 'Join The Team',
    blurb: 'Bar and door staff wanted. Tell us what you can do and we will be in touch.',
    img: '/assets/card-join-the-team.jpg',
    to: '/apply',
    cta: 'Apply now',
  },
  {
    title: "Frequently Asked Q's",
    blurb: 'Dress code, ID, entry, lost property and function bookings — answered.',
    img: '/assets/card-faqs.jpg',
    to: '/faqs',
    cta: 'Read the FAQs',
  },
];

export const ABOUT = {
  heading: 'About St James',
  paragraphs: [
    'Providing Geelong with three nights of entertainment across two dance floors, with two bars, St James is situated in the heart of the CBD.',
    "You can find our DJ's spinning RnB, Party, Top 40, Minimal and Tech-House across our dance floors every Wednesday, Friday and Saturday night.",
    "Our venue has hosted some of Australia's premier DJs such as Will Sparks, Joel Fletcher, Mash'd N Kutcher and Orkestrated to name a few. With private function spaces and an open air balcony, St James provides a great space to have your next event.",
  ],
  stats: [
    { value: '2', label: 'Dance floors' },
    { value: '2', label: 'Bars' },
    { value: '3', label: 'Nights a week' },
    { value: '10pm–7am', label: 'Doors to close' },
  ],
  genres: ['RnB', 'Party', 'Top 40', 'Minimal', 'Tech-House'],
  headliners: ['Will Sparks', 'Joel Fletcher', "Mash'd N Kutcher", 'Orkestrated'],
};

export const FAQS = [
  {
    q: 'What are your opening hours?',
    a: 'We are open Wednesday, Friday and Saturday nights, plus public holiday eves, from 10pm through to 7am.',
  },
  {
    q: 'Where exactly are you?',
    a: 'First Floor, 5 & 11A James St, right in the heart of the Geelong CBD. Head up the stairs — you will hear us before you see us.',
  },
  {
    q: 'What is the dress code?',
    a: 'Smart casual. No high-vis, no steel caps, no offensive prints. Management reserves the right to refuse entry.',
  },
  {
    q: 'What ID do you accept?',
    a: 'Valid photo ID only — Australian drivers licence, passport, or a Keypass / Proof of Age card. Digital licences are accepted. 18+ at all times.',
  },
  {
    q: 'Can I book a function or private space?',
    a: `Yes. We have private function spaces and an open air balcony. Email ${'hello@stjamesnightclub.com.au'} with your date, headcount and the vibe you are after.`,
  },
  {
    q: 'Where do the club photos end up?',
    a: 'In the Nightlife Photos albums, usually within a few days of the night. They are free to download and tag.',
  },
  {
    q: 'I left something behind — now what?',
    a: 'Email us with a description and the night you were in. Lost property is held behind the main bar for 14 days.',
  },
  {
    q: 'Are you hiring?',
    a: 'Often. Bar and door staff applications go through the Join The Team form, and we keep them on file.',
  },
];

export const FOOTER_NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Nightlife Photos', to: '/photos' },
  { label: 'Join The Team', to: '/apply' },
  { label: "FAQ's", to: '/faqs' },
];
