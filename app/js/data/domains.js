// Secondary domain datasets loaded lazily only on non-cover routes.
// Every figure preserves verified BPS, World Bank, MoH, BPJS Kesehatan, and MoF data.

export const POPULATION_PYRAMID_2024 = [
  { group: '0–4', male: 4.1, female: 3.9 },
  { group: '5–9', male: 4.1, female: 3.9 },
  { group: '10–14', male: 4.1, female: 3.9 },
  { group: '15–19', male: 4.1, female: 3.9 },
  { group: '20–24', male: 4.1, female: 4.0 },
  { group: '25–29', male: 4.0, female: 3.9 },
  { group: '30–34', male: 3.9, female: 3.8 },
  { group: '35–39', male: 3.8, female: 3.7 },
  { group: '40–44', male: 3.6, female: 3.6 },
  { group: '45–49', male: 3.4, female: 3.4 },
  { group: '50–54', male: 3.0, female: 3.0 },
  { group: '55–59', male: 2.6, female: 2.6 },
  { group: '60–64', male: 2.1, female: 2.2 },
  { group: '65–69', male: 1.5, female: 1.7 },
  { group: '70+', male: 1.8, female: 2.2 },
];

export const ISLAND_REGIONS_2024 = [
  { region: 'Java', popShare: 56.1, gdpShare: 57.1, provinces: 6, source: 'BPS (2024)' },
  { region: 'Sumatra', popShare: 21.6, gdpShare: 22.1, provinces: 10, source: 'BPS (2024)' },
  { region: 'Sulawesi', popShare: 7.3, gdpShare: 7.1, provinces: 6, source: 'BPS (2024)' },
  { region: 'Kalimantan', popShare: 6.1, gdpShare: 8.2, provinces: 5, source: 'BPS (2024)' },
  { region: 'Bali & Nusa Tenggara', popShare: 5.5, gdpShare: 2.8, provinces: 3, source: 'BPS (2024)' },
  { region: 'Maluku & Papua', popShare: 3.4, gdpShare: 2.7, provinces: 8, source: 'BPS (2024)' },
];

export const GDP_SECTORS_2024 = [
  { sector: 'Manufacturing', short: 'Manufacturing', sharePct: 18.9, growthPct: 4.43, source: 'BPS National Accounts (2024)' },
  { sector: 'Wholesale & Retail Trade', short: 'Trade & Retail', sharePct: 13.1, growthPct: 4.86, source: 'BPS National Accounts (2024)' },
  { sector: 'Agriculture, Forestry & Fisheries', short: 'Agriculture', sharePct: 12.6, growthPct: 0.67, source: 'BPS National Accounts (2024)' },
  { sector: 'Construction', short: 'Construction', sharePct: 10.1, growthPct: 7.02, source: 'BPS National Accounts (2024)' },
  { sector: 'Mining & Quarrying', short: 'Mining', sharePct: 9.2, growthPct: 4.90, source: 'BPS National Accounts (2024)' },
  { sector: 'Transport & Warehousing', short: 'Transport', sharePct: 6.1, growthPct: 8.69, source: 'BPS National Accounts (2024)' },
  { sector: 'Info & Communication', short: 'Info & Comm', sharePct: 4.3, growthPct: 7.57, source: 'BPS National Accounts (2024)' },
  { sector: 'Financial & Insurance', short: 'Finance', sharePct: 4.2, growthPct: 4.65, source: 'BPS National Accounts (2024)' },
  { sector: 'Other Services & Public Admin', short: 'Other Services', sharePct: 21.5, growthPct: 6.10, source: 'BPS National Accounts (2024)' },
];

export const STUNTING_SERIES = [
  { year: '2018', rate: 30.8, source: 'MoH Riskesdas (2018)' },
  { year: '2019', rate: 27.7, source: 'MoH SSGBI (2019)' },
  { year: '2021', rate: 24.4, source: 'MoH SSGI (2021)' },
  { year: '2022', rate: 21.6, source: 'MoH SSGI (2022)' },
  { year: '2023', rate: 21.5, source: 'MoH SKI (2023)' },
];

export const STUNTING_TARGET_PCT = 14.0;

export const HEALTH_INDICATORS = [
  { metric: 'Life Expectancy at Birth', value: '74.2 years', prev: '73.9 years', change: '+0.3 yrs', source: 'BPS', year: '2024', note: 'National weighted average across 38 provinces' },
  { metric: 'JKN Universal Health Coverage', value: '98.0% (277M)', prev: '95.8%', change: '+2.2 pp', source: 'BPJS Kesehatan', year: '2024', note: 'Registered participants in national health insurance' },
  { metric: 'Child Stunting (Under-5)', value: '21.5%', prev: '21.6%', change: '-0.1 pp', source: 'MoH SKI', year: '2023', note: 'Down 9.3 percentage points since 2018 (30.8%)' },
  { metric: 'Infant Mortality Rate', value: '16.8 / 1,000', prev: '17.2 / 1,000', change: '-0.4', source: 'BPS / World Bank', year: '2024', note: 'Deaths under age 1 per 1,000 live births' },
  { metric: 'Under-5 Mortality Rate', value: '20.5 / 1,000', prev: '21.3 / 1,000', change: '-0.8', source: 'World Bank', year: '2023', note: 'Substantial reduction from 27.2 in 2015' },
  { metric: 'Improved Drinking Water Access', value: '92.6%', prev: '91.7%', change: '+0.9 pp', source: 'BPS SUSENAS', year: '2024', note: 'Share of households with improved drinking water' },
  { metric: 'Improved Sanitation Access', value: '83.6%', prev: '82.4%', change: '+1.2 pp', source: 'BPS SUSENAS', year: '2024', note: 'Share of households with proper sanitation' },
  { metric: 'Community Health Centers (Puskesmas)', value: '10,416 units', prev: '10,374 units', change: '+42', source: 'MoH / BPS', year: '2024', note: 'Primary public clinics across sub-districts' },
  { metric: 'Hospital Beds per 1,000 People', value: '1.4 beds', prev: '1.3 beds', change: '+0.1', source: 'MoH / World Bank', year: '2024', note: 'Across ~3,150 public and private hospitals' },
  { metric: 'Current Health Expenditure', value: '2.9% of GDP', prev: '3.0% of GDP', change: '-0.1 pp', source: 'World Bank', year: '2023', note: 'Public + private spending post-pandemic normalization' },
];

export const EDUCATION_ENROLLMENT_2024 = [
  { level: 'Primary (SD, ages 7–12)', short: 'Primary (SD)', rate: 98.0, type: 'Net Enrollment', source: 'BPS SUSENAS (2024)' },
  { level: 'Junior Secondary (SMP, 13–15)', short: 'Junior Sec. (SMP)', rate: 81.8, type: 'Net Enrollment', source: 'BPS SUSENAS (2024)' },
  { level: 'Senior Secondary (SMA, 16–18)', short: 'Senior Sec. (SMA)', rate: 64.2, type: 'Net Enrollment', source: 'BPS SUSENAS (2024)' },
  { level: 'Tertiary (Higher Ed, 19–23)', short: 'Tertiary (Gross)', rate: 32.0, type: 'Gross Enrollment', source: 'BPS SUSENAS (2024)' },
];

export const EDUCATION_INDICATORS = [
  { metric: 'Adult Literacy Rate (15+)', value: '96.5%', prev: '96.4%', change: '+0.1 pp', source: 'BPS SUSENAS', year: '2024', note: 'Urban 98.1% · Rural 94.3%' },
  { metric: 'Youth Literacy Rate (15–24)', value: '99.8%', prev: '99.8%', change: '0.0 pp', source: 'BPS SUSENAS', year: '2024', note: 'Near-universal literacy among young adults' },
  { metric: 'Human Development Index (HDI)', value: '75.02', prev: '74.39', change: '+0.63', source: 'BPS IPM', year: '2024', note: 'High human development tier (70.0–79.9)' },
  { metric: 'Mean Years of Schooling (25+)', value: '8.85 years', prev: '8.77 years', change: '+0.08 yrs', source: 'BPS IPM', year: '2024', note: 'Up +1.01 years since 2015 (7.84 yrs)' },
  { metric: 'Expected Years of Schooling', value: '13.21 years', prev: '13.15 years', change: '+0.06 yrs', source: 'BPS IPM', year: '2024', note: 'Equivalent to 1+ year of tertiary schooling' },
  { metric: 'Education Share of State Budget', value: '20.0%', prev: '20.0%', change: 'Constitutional', source: 'Ministry of Finance', year: '2024', note: '~3.1% of nominal GDP (World Bank, 2024)' },
  { metric: 'Primary & Secondary Schools', value: '220,500', prev: '219,800', change: '+700', source: 'BPS / MoE', year: '2024', note: 'Public and private SD, SMP, SMA/SMK' },
  { metric: 'Active Teachers (K–12)', value: '3.38 million', prev: '3.35 million', change: '+0.9%', source: 'BPS / MoE', year: '2024', note: 'Approx. 16:1 student-to-teacher ratio' },
];

export const EMPLOYMENT_SECTORS_2024 = [
  { sector: 'Agriculture, Forestry & Fisheries', short: 'Agriculture', sharePct: 28.2, workersM: 40.8, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Wholesale & Retail Trade', short: 'Trade & Retail', sharePct: 19.0, workersM: 27.5, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Manufacturing', short: 'Manufacturing', sharePct: 13.8, workersM: 20.0, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Accommodation & Food Service', short: 'Hospitality & Food', sharePct: 7.8, workersM: 11.3, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Education & Health Services', short: 'Education & Health', sharePct: 6.9, workersM: 10.0, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Construction', short: 'Construction', sharePct: 6.5, workersM: 9.4, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Transport & Warehousing', short: 'Transport', sharePct: 4.3, workersM: 6.2, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Other Services & Mining', short: 'Other & Mining', sharePct: 13.5, workersM: 19.4, source: 'BPS SAKERNAS (Aug 2024)' },
];

export const EMPLOYMENT_STRUCTURE_2024 = {
  formalPct: 42.0,
  informalPct: 58.0,
  maleParticipationPct: 84.7,
  femaleParticipationPct: 56.4,
  avgMonthlyWageIdrM: 3.27,
  avgMonthlyWageUsd: 207,
  employedM: 144.6,
  unemployedM: 7.47,
  source: 'BPS SAKERNAS (Aug 2024)',
};
