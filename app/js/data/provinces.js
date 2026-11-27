// 24 flagship Indonesian provinces (BPS 2024) + all-38-province HDI tier summary
// + stylized archipelago vector geometry in a 960x390 geographic frame (94E–142E, 6.5N–11.5S).

export const HDI_TIERS_38_2024 = {
  totalProvinces: 38,
  nationalHdi: 75.02,
  tiers: [
    { label: 'Very High (80+)', count: 2, tone: '#167874' },
    { label: 'High (70.0–79.9)', count: 30, tone: '#2B9B8F' },
    { label: 'Medium (60.0–69.9)', count: 5, tone: '#D99B26' },
    { label: 'Low (<60)', count: 1, tone: '#D94E28' },
  ],
  note: 'Highland Papua (54.43) is the sole Low-tier province yet posted Indonesia’s fastest percentage HDI growth in 2024.',
  source: 'BPS IPM Report (2024)',
};

export const REGION_COLORS = {
  'Java': '#D94E28',
  'Sumatra': '#167874',
  'Kalimantan': '#D99B26',
  'Sulawesi': '#3B82B6',
  'Bali & Nusa Tenggara': '#9B59B6',
  'Maluku & Papua': '#2E9F6F',
};

// Muted surrounding landmass silhouettes (non-flagship provinces + small islands)
// so all six major island groups read unmistakably as the Indonesian Archipelago.
export const ISLAND_BACKDROPS = [
  // West Sumatra, Jambi, Bengkulu & Bangka-Belitung corridor
  'M108,144 L132,162 L152,174 L178,186 L160,214 L136,198 L112,172 Z',
  'M222,190 L236,186 L242,202 L226,204 Z',
  'M246,196 L258,195 L260,208 L248,208 Z',
  // Central & North Kalimantan backdrop
  'M386,158 L442,158 L446,192 L430,212 L396,204 L378,186 Z',
  'M444,70 L488,78 L496,102 L462,106 L440,94 Z',
  // Gorontalo, West Sulawesi & Southeast Sulawesi
  'M544,126 L576,126 L574,136 L544,138 Z',
  'M504,174 L520,174 L522,196 L506,194 Z',
  'M552,192 L578,194 L592,226 L574,236 L556,214 Z',
  // Maluku (Buru, Seram, Ambon, Tanimbar)
  'M644,202 L666,200 L668,214 L646,215 Z',
  'M676,196 L724,198 L726,212 L678,212 Z',
  'M720,276 L736,272 L738,290 L722,292 Z',
  // Bird's Head (Southwest/West Papua), Central Papua & South Papua
  'M738,154 L782,152 L794,174 L778,194 L750,188 L734,170 Z',
  'M788,186 L836,198 L836,232 L796,226 L782,204 Z',
  'M840,242 L918,248 L924,296 L888,308 L856,282 L836,258 Z',
];

export const PROVINCES = [
  {
    id: 'aceh', name: 'Aceh', shortName: 'Aceh', region: 'Sumatra', capital: 'Banda Aceh', tz: 'WIB',
    popM: 5.6, grdpB: 15.3, grdpPerCap: 2730, hdi: 75.36, poverty: 14.23, literacy: 98.5, unemp: 5.75, lifeExp: 73.1,
    tag: 'Western Gateway', source: 'BPS (2024)',
    path: 'M24,22 L62,36 L82,66 L64,84 L38,66 L20,40 Z', cx: 52, cy: 52,
  },
  {
    id: 'north-sumatra', name: 'North Sumatra', shortName: 'N. Sumatra', region: 'Sumatra', capital: 'Medan', tz: 'WIB',
    popM: 15.6, grdpB: 72.1, grdpPerCap: 4620, hdi: 75.76, poverty: 7.99, literacy: 99.2, unemp: 5.60, lifeExp: 73.7,
    tag: 'Sumatra Economic Anchor', source: 'BPS (2024)',
    path: 'M64,84 L82,66 L112,86 L124,116 L104,136 L78,112 Z', cx: 96, cy: 102,
  },
  {
    id: 'riau', name: 'Riau', shortName: 'Riau', region: 'Sumatra', capital: 'Pekanbaru', tz: 'WIB',
    popM: 6.7, grdpB: 69.0, grdpPerCap: 10300, hdi: 75.67, poverty: 6.67, literacy: 99.3, unemp: 3.70, lifeExp: 74.4,
    tag: 'Energy & Palm Corridor', source: 'BPS (2024)',
    path: 'M124,116 L158,116 L178,140 L166,164 L132,162 L108,144 Z', cx: 144, cy: 142,
  },
  {
    id: 'riau-islands', name: 'Riau Islands', shortName: 'Riau Isl.', region: 'Sumatra', capital: 'Tanjungpinang', tz: 'WIB',
    popM: 2.13, grdpB: 21.2, grdpPerCap: 9950, hdi: 79.89, poverty: 5.37, literacy: 99.1, unemp: 6.94, lifeExp: 74.9,
    tag: 'Strait Industrial Hub', source: 'BPS (2024)',
    path: 'M184,114 L208,110 L216,128 L194,136 L180,126 Z', cx: 198, cy: 123,
  },
  {
    id: 'south-sumatra', name: 'South Sumatra', shortName: 'S. Sumatra', region: 'Sumatra', capital: 'Palembang', tz: 'WIB',
    popM: 8.8, grdpB: 42.0, grdpPerCap: 4770, hdi: 73.84, poverty: 10.97, literacy: 98.8, unemp: 3.86, lifeExp: 74.0,
    tag: 'Coal & Agri Basin', source: 'BPS (2024)',
    path: 'M178,186 L212,190 L220,218 L196,232 L166,222 L160,214 Z', cx: 191, cy: 209,
  },
  {
    id: 'lampung', name: 'Lampung', shortName: 'Lampung', region: 'Sumatra', capital: 'Bandar Lampung', tz: 'WIB',
    popM: 9.4, grdpB: 30.0, grdpPerCap: 3190, hdi: 73.13, poverty: 10.69, literacy: 97.6, unemp: 4.19, lifeExp: 74.1,
    tag: 'Sunda Strait Crossing', source: 'BPS (2024)',
    path: 'M196,232 L222,226 L228,256 L208,262 L192,248 Z', cx: 210, cy: 245,
  },
  {
    id: 'banten', name: 'Banten', shortName: 'Banten', region: 'Java', capital: 'Serang', tz: 'WIB',
    popM: 12.4, grdpB: 55.1, grdpPerCap: 4440, hdi: 76.35, poverty: 5.84, literacy: 98.0, unemp: 6.68, lifeExp: 74.1,
    tag: 'West Java Industrial Gate', source: 'BPS (2024)',
    path: 'M222,268 L244,268 L246,288 L220,286 Z', cx: 234, cy: 278,
  },
  {
    id: 'jakarta', name: 'DKI Jakarta', shortName: 'DKI Jakarta', region: 'Java', capital: 'Jakarta', tz: 'WIB',
    popM: 10.7, grdpB: 232.0, grdpPerCap: 21680, hdi: 84.15, poverty: 4.30, literacy: 99.8, unemp: 6.21, lifeExp: 75.8,
    tag: 'National Capital · #1 GRDP/Cap', source: 'BPS (2024)',
    path: 'M244,264 L264,264 L264,278 L244,278 Z', cx: 254, cy: 271,
  },
  {
    id: 'west-java', name: 'West Java', shortName: 'W. Java', region: 'Java', capital: 'Bandung', tz: 'WIB',
    popM: 50.3, grdpB: 178.4, grdpPerCap: 3545, hdi: 74.92, poverty: 7.08, literacy: 98.7, unemp: 6.75, lifeExp: 74.2,
    tag: 'Most Populous (50.3M)', source: 'BPS (2024)',
    path: 'M246,278 L264,278 L264,268 L294,272 L292,296 L246,292 Z', cx: 272, cy: 284,
  },
  {
    id: 'central-java', name: 'Central Java', shortName: 'C. Java', region: 'Java', capital: 'Semarang', tz: 'WIB',
    popM: 37.9, grdpB: 114.2, grdpPerCap: 3015, hdi: 73.87, poverty: 9.58, literacy: 94.6, unemp: 4.78, lifeExp: 74.9,
    tag: 'Heartland Manufacturing', source: 'BPS (2024)',
    path: 'M294,272 L344,276 L342,300 L318,298 L314,288 L292,296 Z', cx: 319, cy: 284,
  },
  {
    id: 'yogyakarta', name: 'DI Yogyakarta', shortName: 'Yogyakarta', region: 'Java', capital: 'Yogyakarta', tz: 'WIB',
    popM: 3.8, grdpB: 12.3, grdpPerCap: 3240, hdi: 81.62, poverty: 10.83, literacy: 96.1, unemp: 3.48, lifeExp: 75.2,
    tag: 'Very High HDI (81.62)', source: 'BPS (2024)',
    path: 'M304,290 L324,292 L322,306 L302,304 Z', cx: 313, cy: 298,
  },
  {
    id: 'east-java', name: 'East Java', shortName: 'E. Java', region: 'Java', capital: 'Surabaya', tz: 'WIB',
    popM: 41.8, grdpB: 199.1, grdpPerCap: 4760, hdi: 75.35, poverty: 9.56, literacy: 93.8, unemp: 4.19, lifeExp: 74.9,
    tag: '#2 Provincial Economy', source: 'BPS (2024)',
    path: 'M344,276 L402,282 L404,306 L342,302 Z', cx: 373, cy: 292,
  },
  {
    id: 'west-kalimantan', name: 'West Kalimantan', shortName: 'W. Kalimantan', region: 'Kalimantan', capital: 'Pontianak', tz: 'WIB',
    popM: 5.59, grdpB: 18.1, grdpPerCap: 3240, hdi: 72.09, poverty: 6.32, literacy: 94.8, unemp: 4.86, lifeExp: 73.7,
    tag: 'Equatorial Crossing', source: 'BPS (2024)',
    path: 'M316,112 L372,114 L390,148 L378,186 L340,184 L314,154 Z', cx: 352, cy: 150,
  },
  {
    id: 'east-kalimantan', name: 'East Kalimantan', shortName: 'E. Kalimantan', region: 'Kalimantan', capital: 'Samarinda', tz: 'WITA',
    popM: 4.0, grdpB: 54.0, grdpPerCap: 13500, hdi: 78.79, poverty: 6.11, literacy: 99.1, unemp: 5.14, lifeExp: 74.7,
    tag: 'New Capital IKN (Nusantara)', source: 'BPS (2024)',
    path: 'M438,104 L496,102 L490,142 L476,174 L444,174 L434,136 Z', cx: 465, cy: 138,
  },
  {
    id: 'south-kalimantan', name: 'South Kalimantan', shortName: 'S. Kalimantan', region: 'Kalimantan', capital: 'Banjarbaru', tz: 'WITA',
    popM: 4.3, grdpB: 18.2, grdpPerCap: 4230, hdi: 75.19, poverty: 4.61, literacy: 98.7, unemp: 4.20, lifeExp: 74.1,
    tag: 'Low Poverty (4.61%)', source: 'BPS (2024)',
    path: 'M444,174 L476,174 L470,214 L434,212 L442,192 Z', cx: 456, cy: 194,
  },
  {
    id: 'north-sulawesi', name: 'North Sulawesi', shortName: 'N. Sulawesi', region: 'Sulawesi', capital: 'Manado', tz: 'WITA',
    popM: 2.7, grdpB: 11.8, grdpPerCap: 4370, hdi: 75.68, poverty: 7.25, literacy: 99.8, unemp: 5.85, lifeExp: 74.3,
    tag: '99.8% Literacy · Pacific Rim', source: 'BPS (2024)',
    path: 'M576,124 L616,104 L624,116 L584,138 Z', cx: 601, cy: 120,
  },
  {
    id: 'central-sulawesi', name: 'Central Sulawesi', shortName: 'C. Sulawesi', region: 'Sulawesi', capital: 'Palu', tz: 'WITA',
    popM: 3.12, grdpB: 22.4, grdpPerCap: 7180, hdi: 72.82, poverty: 11.77, literacy: 98.2, unemp: 2.94, lifeExp: 70.6,
    tag: 'Nickel Downstreaming Hub', source: 'BPS (2024)',
    path: 'M520,136 L544,136 L546,158 L596,154 L592,168 L552,190 L520,178 Z', cx: 546, cy: 164,
  },
  {
    id: 'south-sulawesi', name: 'South Sulawesi', shortName: 'S. Sulawesi', region: 'Sulawesi', capital: 'Makassar', tz: 'WITA',
    popM: 9.5, grdpB: 44.0, grdpPerCap: 4630, hdi: 75.18, poverty: 8.06, literacy: 93.4, unemp: 4.19, lifeExp: 73.9,
    tag: 'Eastern Trade Hub', source: 'BPS (2024)',
    path: 'M514,194 L548,186 L552,222 L532,248 L510,244 Z', cx: 530, cy: 218,
  },
  {
    id: 'bali', name: 'Bali', shortName: 'Bali', region: 'Bali & Nusa Tenggara', capital: 'Denpasar', tz: 'WITA',
    popM: 4.4, grdpB: 18.8, grdpPerCap: 4270, hdi: 78.60, poverty: 3.80, literacy: 96.1, unemp: 1.79, lifeExp: 75.1,
    tag: 'Lowest Poverty Nationally (3.80%)', source: 'BPS (2024)',
    path: 'M412,296 L436,296 L436,314 L412,312 Z', cx: 424, cy: 305,
  },
  {
    id: 'ntb', name: 'West Nusa Tenggara', shortName: 'NTB', region: 'Bali & Nusa Tenggara', capital: 'Mataram', tz: 'WITA',
    popM: 5.6, grdpB: 11.5, grdpPerCap: 2050, hdi: 73.10, poverty: 12.91, literacy: 89.2, unemp: 2.73, lifeExp: 72.1,
    tag: 'Lombok & Sumbawa Corridor', source: 'BPS (2024)',
    path: 'M444,300 L504,302 L502,318 L444,316 Z', cx: 474, cy: 309,
  },
  {
    id: 'ntt', name: 'East Nusa Tenggara', shortName: 'NTT', region: 'Bali & Nusa Tenggara', capital: 'Kupang', tz: 'WITA',
    popM: 5.55, grdpB: 12.2, grdpPerCap: 2200, hdi: 69.89, poverty: 19.02, literacy: 94.6, unemp: 3.17, lifeExp: 71.9,
    tag: 'Archipelagic Frontier', source: 'BPS (2024)',
    path: 'M514,304 L586,300 L608,334 L568,352 L538,334 L512,318 Z', cx: 562, cy: 325,
  },
  {
    id: 'north-maluku', name: 'North Maluku', shortName: 'N. Maluku', region: 'Maluku & Papua', capital: 'Sofifi', tz: 'WIT',
    popM: 1.35, grdpB: 6.1, grdpPerCap: 4520, hdi: 72.52, poverty: 6.32, literacy: 98.7, unemp: 4.46, lifeExp: 71.1,
    tag: 'Fastest Mineral Processing Growth', source: 'BPS (2024)',
    path: 'M660,112 L684,104 L694,126 L680,140 L696,154 L676,166 L662,148 Z', cx: 676, cy: 136,
  },
  {
    id: 'papua', name: 'Papua (Province)', shortName: 'Papua', region: 'Maluku & Papua', capital: 'Jayapura', tz: 'WIT',
    popM: 1.1, grdpB: 5.4, grdpPerCap: 4910, hdi: 73.83, poverty: 18.09, literacy: 92.8, unemp: 6.48, lifeExp: 68.5,
    tag: 'Northern Pacific Coast', source: 'BPS (2024)',
    path: 'M826,174 L916,184 L922,216 L844,210 L824,196 Z', cx: 874, cy: 196,
  },
  {
    id: 'highland-papua', name: 'Highland Papua', shortName: 'Highland Papua', region: 'Maluku & Papua', capital: 'Wamena', tz: 'WIT',
    popM: 1.46, grdpB: 1.7, grdpPerCap: 1160, hdi: 54.43, poverty: 32.97, literacy: 64.8, unemp: 1.72, lifeExp: 67.3,
    tag: 'Fastest % HDI Gain · Central Range', source: 'BPS (2024)',
    path: 'M844,210 L922,216 L922,248 L840,242 Z', cx: 882, cy: 230,
  },
];

export const MAP_METRICS = [
  { key: 'grdpPerCap', label: 'GRDP / Capita', unit: 'USD', invert: false, format: (v) => '$' + Math.round(v).toLocaleString('en-US'), source: 'BPS Regional Accounts (2024)' },
  { key: 'hdi', label: 'HDI', unit: 'Index', invert: false, format: (v) => v.toFixed(2), source: 'BPS IPM (2024)' },
  { key: 'poverty', label: 'Poverty Rate', unit: '%', invert: true, format: (v) => v.toFixed(2) + '%', source: 'BPS SUSENAS (2024)' },
  { key: 'unemp', label: 'Unemployment', unit: '%', invert: true, format: (v) => v.toFixed(2) + '%', source: 'BPS SAKERNAS (2024)' },
  { key: 'popM', label: 'Population', unit: 'M', invert: false, format: (v) => v.toFixed(1) + 'M', source: 'BPS Population (2024)' },
  { key: 'lifeExp', label: 'Life Expectancy', unit: 'yrs', invert: false, format: (v) => v.toFixed(1) + ' yrs', source: 'BPS (2024)' },
];

export function getProvinceById(id) {
  return PROVINCES.find((p) => p.id === id) || PROVINCES[0];
}
