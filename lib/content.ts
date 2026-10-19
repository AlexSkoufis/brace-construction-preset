// ─────────────────────────────────────────────────────────────────────────────
//  PRESET CONFIG — Brace Construction Group, a FICTIONAL general contractor.
//  All names, figures, certifications, clients and quotes are demo content.
//  Photos: assets-src/<key>.jpg → `npm run images` → reference by key below.
//  Colours & type: tokens at the top of app/globals.css; fonts in app/layout.tsx.
// ─────────────────────────────────────────────────────────────────────────────

export type ImageKey =
  | 'hero' | 'formwork' | 'columns' | 'site' | 'sparks' | 'welder' | 'welderdark' | 'plans'
  | 'excavators' | 'mining' | 'timber' | 'scaffold' | 'office' | 'tower' | 'balconies'
  | 'curved' | 'glass' | 'campus' | 'brick';

export const company = {
  name: 'Brace',
  full: 'Brace Construction Group',
  line: 'General contractor · Design & build · Infrastructure',
  founded: 1987,
  hq: 'Rotterdam, NL',
  offices: [
    { city: 'Rotterdam', role: 'Head office', address: 'Kade 14, 3011 Rotterdam' },
    { city: 'Hamburg', role: 'Northern Europe', address: 'Hafenstraße 88, 20359 Hamburg' },
    { city: 'Warsaw', role: 'Central Europe', address: 'ul. Prosta 51, 00-838 Warsaw' },
  ],
  phone: '+31 10 000 0000',
  phoneHref: 'tel:+31100000000',
  email: 'projects@brace.example',
  // Day count for the live safety counter starts from this date.
  lastIncident: '2023-03-24',
  credit: { label: 'Core Concepts Design', href: 'https://coreconcepts.design' },
  disclaimer: 'Brace Construction Group is a fictional company created as a design concept. Projects, figures, certifications and quotes are illustrative.',
};

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Safety', href: '#safety' },
  { label: 'Careers', href: '#footer' },
];

export const hero = {
  kicker: `Est. ${1987} · Rotterdam · Hamburg · Warsaw`,
  words: ['Built', 'to last.'],
  lede: 'General contracting, design & build and civil works for owners who can’t afford surprises — delivered on programme, on budget, and home safe every night.',
  primary: 'Get an estimate',
  secondary: 'See our projects',
};

export const stats = [
  { value: 612, label: 'Projects delivered', suffix: '' },
  { value: 23, label: 'Active sites today', suffix: '' },
  { value: 97, label: 'Handed over on time', suffix: '%' },
  { value: 4.1, label: 'Million m² built', suffix: '', decimals: 1 },
];

export const services = [
  {
    no: '01',
    title: 'General contracting',
    text: 'Single point of responsibility from mobilisation to handover. Our own site teams, our own safety system, and a programme we publish weekly.',
    points: ['Commercial & mixed-use', 'Healthcare & education', 'Fixed-price or cost-plus', 'BIM coordination (LOD 400)'],
    image: 'formwork' as ImageKey,
  },
  {
    no: '02',
    title: 'Design & build',
    text: 'One contract, one team. We bring architects and engineers in-house early so cost, carbon and buildability are designed in — not value-engineered out.',
    points: ['Early contractor involvement', 'Target-cost contracts', 'Whole-life carbon modelling', 'Planning & permits'],
    image: 'plans' as ImageKey,
  },
  {
    no: '03',
    title: 'Civil & infrastructure',
    text: 'Bridges, quays, roads and utilities for municipalities and ports — built around live traffic, tides and neighbours.',
    points: ['Earthworks & foundations', 'Bridges & quay walls', 'Utilities & drainage', 'Traffic management'],
    image: 'excavators' as ImageKey,
  },
  {
    no: '04',
    title: 'Steel & structures',
    text: 'In-house steel fabrication and erection. Faster frames, fewer interfaces, and welds we sign our name to.',
    points: ['Fabrication yard, 8,000 t / year', 'Composite & hybrid frames', 'Certified welding (EN 1090 EXC3)', 'Crane planning'],
    image: 'sparks' as ImageKey,
  },
  {
    no: '05',
    title: 'Renovation & retrofit',
    text: 'Deep retrofits of occupied buildings: new façades, new services and lower energy bills — while the lights stay on.',
    points: ['Façade replacement', 'Energy retrofits', 'Occupied-building phasing', 'Heritage works'],
    image: 'scaffold' as ImageKey,
  },
];

export const blueprint = {
  label: 'From drawing to delivery',
  title: 'Every line',
  em: 'becomes load-bearing.',
  text: 'Drag across Harbour Point: the tender drawing on the left, the finished building on the right — 58 weeks apart, 2% under budget.',
  image: 'office' as ImageKey,
  project: 'Harbour Point Offices',
  specs: [
    { k: 'GFA', v: '24,600 m²' },
    { k: 'Floors', v: '9 + basement' },
    { k: 'Programme', v: '58 weeks' },
    { k: 'Rating', v: 'BREEAM Excellent' },
  ],
};

export type Sector = 'Commercial' | 'Residential' | 'Infrastructure' | 'Industrial';

export const projects: { name: string; sector: Sector; place: string; year: string; value: string; size: string; image: ImageKey }[] = [
  { name: 'Northgate Campus', sector: 'Commercial', place: 'Warsaw', year: '2023', value: '€120M', size: '48,000 m²', image: 'campus' },
  { name: 'Green Loft Tower', sector: 'Residential', place: 'Hamburg', year: '2024', value: '€91M', size: '31,000 m²', image: 'tower' },
  { name: 'Kade Quay Wall', sector: 'Infrastructure', place: 'Rotterdam', year: '2024', value: '€42M', size: '1.2 km', image: 'columns' },
  { name: 'Linden Apartments', sector: 'Residential', place: 'Utrecht', year: '2023', value: '€37M', size: '184 homes', image: 'balconies' },
  { name: 'Ridge Logistics Hub', sector: 'Industrial', place: 'Duisburg', year: '2022', value: '€54M', size: '62,000 m²', image: 'site' },
  { name: 'Harbour Point Offices', sector: 'Commercial', place: 'Rotterdam', year: '2025', value: '€68M', size: '24,600 m²', image: 'office' },
  { name: 'Arc Tower Retrofit', sector: 'Commercial', place: 'Hamburg', year: '2022', value: '€29M', size: '18,500 m²', image: 'curved' },
  { name: 'Quarry Access Works', sector: 'Industrial', place: 'Silesia', year: '2021', value: '€18M', size: '6.4 km', image: 'mining' },
];

export const sectors: ('All' | Sector)[] = ['All', 'Commercial', 'Residential', 'Infrastructure', 'Industrial'];

// Process as a programme (Gantt). Weeks are illustrative for a ~20,000 m² building.
export const programme = {
  label: 'Process',
  title: 'A programme',
  em: 'you can read.',
  text: 'We publish the programme every Monday. This is what a typical 64-week office build looks like — scroll to move the “today” line.',
  weeks: 64,
  phases: [
    { name: 'Pre-construction', from: 0, to: 8, note: 'Surveys, cost plan, logistics' },
    { name: 'Permits & procurement', from: 4, to: 14, note: 'Long-lead items ordered' },
    { name: 'Groundworks', from: 10, to: 20, note: 'Piling, basement, drainage' },
    { name: 'Structure', from: 18, to: 38, note: 'Concrete core, steel frame' },
    { name: 'Envelope', from: 32, to: 46, note: 'Façade, roof, weather-tight' },
    { name: 'MEP & fit-out', from: 40, to: 58, note: 'Services, finishes, lifts' },
    { name: 'Commissioning', from: 55, to: 62, note: 'Testing, snagging, training' },
    { name: 'Handover', from: 62, to: 64, note: 'Keys, manuals, aftercare' },
  ],
};

export const safety = {
  label: 'Safety & sustainability',
  title: 'Home safe',
  em: 'every night.',
  text: 'Every worker on every Brace site goes home the way they came in. We count the days — publicly — and so does everyone who works for us.',
  certs: [
    { code: 'ISO 45001', name: 'Occupational health & safety' },
    { code: 'ISO 9001', name: 'Quality management' },
    { code: 'ISO 14001', name: 'Environmental management' },
    { code: 'EN 1090', name: 'Steel execution class EXC3' },
  ],
  green: [
    { v: '38%', k: 'Less embodied carbon vs. 2019 baseline' },
    { v: '92%', k: 'Site waste diverted from landfill' },
    { v: '100%', k: 'Renewable power on active sites' },
  ],
  stripe: ['Safety first', 'Quality always', 'On programme', 'On budget', 'Home safe'],
};

export const testimonial = {
  quote: 'Brace told us the bad news early, fixed it without drama, and handed over two weeks ahead of programme. We’ve awarded them the next three phases.',
  who: 'Maarten de Wit',
  role: 'Development Director, Kadeport Real Estate (fictional)',
};

export const clients = ['Kadeport', 'NORTHWIND', 'Linden & Co.', 'Havenstad', 'VOLTA ENERGY', 'Meridian Health', 'Ostrava Rail', 'CityWorks'];

// Estimator: indicative €/m² by type and finish (demo numbers).
export const estimator = {
  label: 'Get an estimate',
  title: 'Ballpark in',
  em: 'sixty seconds.',
  types: [
    { id: 'office', name: 'Office / commercial', rate: 2100, weeksPer1k: 2.2, image: 'glass' as ImageKey },
    { id: 'residential', name: 'Residential', rate: 1850, weeksPer1k: 2.0, image: 'balconies' as ImageKey },
    { id: 'industrial', name: 'Industrial / logistics', rate: 950, weeksPer1k: 0.9, image: 'site' as ImageKey },
    { id: 'retrofit', name: 'Renovation / retrofit', rate: 1300, weeksPer1k: 1.6, image: 'scaffold' as ImageKey },
  ],
  finishes: [
    { id: 'standard', name: 'Standard', factor: 1 },
    { id: 'premium', name: 'Premium', factor: 1.22 },
    { id: 'landmark', name: 'Landmark', factor: 1.55 },
  ],
  thanks: 'Thanks — this is a demo form, nothing was sent. A real site would route this to the pre-construction team.',
};
