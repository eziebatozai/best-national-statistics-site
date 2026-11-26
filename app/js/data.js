// Curated statistical datasets for Indonesia (Nusantara Stats).
// Every figure carries its authoritative source and reference year.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
export const SELECTABLE_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const NATIONAL_BENCHMARKS = {
  year: 2024,
  populationM: 283.5,
  grdpUsdB: 1396,
  grdpPerCapitaUsd: 4960,
  hdi: 75.02,
  literacyPct: 96.5,
  unemploymentPct: 4.91,
  lifeExpectancyYrs: 74.2,
  source: 'BPS & World Bank (2024)',
};

export const MACRO_SERIES = [
  { year: 2015, popM: 258.4, popGrowth: 1.24, urbanPct: 53.3, fertility: 2.34, medianAge: 28.4, gdpUsdB: 861, gdpGrowth: 4.88, gdpPerCap: 3332, inflation: 3.35, exportsB: 150.4, importsB: 142.7, lifeExp: 72.5, infantMort: 22.8, hdi: 69.55, schoolingYrs: 7.84, unempPct: 6.18, laborM: 122.4, tpakPct: 65.8 },
  { year: 2016, popM: 261.9, popGrowth: 1.21, urbanPct: 54.0, fertility: 2.31, medianAge: 28.7, gdpUsdB: 932, gdpGrowth: 5.03, gdpPerCap: 3563, inflation: 3.02, exportsB: 145.1, importsB: 135.7, lifeExp: 72.7, infantMort: 22.1, hdi: 70.18, schoolingYrs: 7.95, unempPct: 5.61, laborM: 125.4, tpakPct: 66.3 },
  { year: 2017, popM: 264.7, popGrowth: 1.18, urbanPct: 54.7, fertility: 2.28, medianAge: 28.9, gdpUsdB: 1016, gdpGrowth: 5.07, gdpPerCap: 3838, inflation: 3.61, exportsB: 168.8, importsB: 157.0, lifeExp: 72.9, infantMort: 21.4, hdi: 70.81, schoolingYrs: 8.10, unempPct: 5.50, laborM: 128.1, tpakPct: 66.7 },
  { year: 2018, popM: 267.7, popGrowth: 1.15, urbanPct: 55.3, fertility: 2.24, medianAge: 29.2, gdpUsdB: 1042, gdpGrowth: 5.17, gdpPerCap: 3894, inflation: 3.13, exportsB: 180.0, importsB: 188.7, lifeExp: 73.1, infantMort: 20.6, hdi: 71.39, schoolingYrs: 8.17, unempPct: 5.30, laborM: 131.0, tpakPct: 67.3 },
  { year: 2019, popM: 269.6, popGrowth: 1.13, urbanPct: 56.0, fertility: 2.21, medianAge: 29.4, gdpUsdB: 1119, gdpGrowth: 5.02, gdpPerCap: 4151, inflation: 2.72, exportsB: 167.7, importsB: 171.3, lifeExp: 73.3, infantMort: 19.9, hdi: 71.92, schoolingYrs: 8.34, unempPct: 5.23, laborM: 133.6, tpakPct: 67.5 },
  { year: 2020, popM: 270.2, popGrowth: 1.07, urbanPct: 56.6, fertility: 2.18, medianAge: 29.6, gdpUsdB: 1059, gdpGrowth: -2.07, gdpPerCap: 3912, inflation: 1.68, exportsB: 163.2, importsB: 141.6, lifeExp: 73.4, infantMort: 19.2, hdi: 72.81, schoolingYrs: 8.48, unempPct: 7.07, laborM: 138.2, tpakPct: 67.8 },
  { year: 2021, popM: 273.8, popGrowth: 1.11, urbanPct: 57.3, fertility: 2.16, medianAge: 29.8, gdpUsdB: 1187, gdpGrowth: 3.70, gdpPerCap: 4333, inflation: 1.87, exportsB: 231.6, importsB: 196.2, lifeExp: 73.5, infantMort: 18.5, hdi: 73.16, schoolingYrs: 8.54, unempPct: 6.49, laborM: 140.2, tpakPct: 67.8 },
  { year: 2022, popM: 275.8, popGrowth: 1.10, urbanPct: 57.9, fertility: 2.14, medianAge: 30.0, gdpUsdB: 1319, gdpGrowth: 5.31, gdpPerCap: 4783, inflation: 5.51, exportsB: 291.9, importsB: 237.4, lifeExp: 73.7, infantMort: 17.8, hdi: 73.77, schoolingYrs: 8.69, unempPct: 5.86, laborM: 143.7, tpakPct: 68.6 },
  { year: 2023, popM: 278.7, popGrowth: 1.10, urbanPct: 58.5, fertility: 2.12, medianAge: 30.2, gdpUsdB: 1371, gdpGrowth: 5.05, gdpPerCap: 4920, inflation: 2.61, exportsB: 258.8, importsB: 221.9, lifeExp: 73.9, infantMort: 17.2, hdi: 74.39, schoolingYrs: 8.77, unempPct: 5.32, laborM: 147.7, tpakPct: 69.5 },
  { year: 2024, popM: 283.5, popGrowth: 1.10, urbanPct: 59.1, fertility: 2.10, medianAge: 30.4, gdpUsdB: 1396, gdpGrowth: 5.03, gdpPerCap: 4960, inflation: 1.57, exportsB: 264.7, importsB: 233.7, lifeExp: 74.2, infantMort: 16.8, hdi: 75.02, schoolingYrs: 8.85, unempPct: 4.91, laborM: 152.1, tpakPct: 70.6 },
];

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
  { sector: 'Manufacturing', sharePct: 18.9, growthPct: 4.43, source: 'BPS National Accounts (2024)' },
  { sector: 'Wholesale & Retail Trade', sharePct: 13.1, growthPct: 4.86, source: 'BPS National Accounts (2024)' },
  { sector: 'Agriculture, Forestry & Fisheries', sharePct: 12.6, growthPct: 0.67, source: 'BPS National Accounts (2024)' },
  { sector: 'Construction', sharePct: 10.1, growthPct: 7.02, source: 'BPS National Accounts (2024)' },
  { sector: 'Mining & Quarrying', sharePct: 9.2, growthPct: 4.90, source: 'BPS National Accounts (2024)' },
  { sector: 'Transport & Warehousing', sharePct: 6.1, growthPct: 8.69, source: 'BPS National Accounts (2024)' },
  { sector: 'Info & Communication', sharePct: 4.3, growthPct: 7.57, source: 'BPS National Accounts (2024)' },
  { sector: 'Financial & Insurance', sharePct: 4.2, growthPct: 4.65, source: 'BPS National Accounts (2024)' },
  { sector: 'Other Services & Public Admin', sharePct: 21.5, growthPct: 6.10, source: 'BPS National Accounts (2024)' },
];

export const PROVINCES = [
  { id: 'jakarta', name: 'DKI Jakarta', region: 'Java', capital: 'Jakarta', popM: 10.7, grdpB: 232.0, grdpPerCap: 21680, hdi: 84.15, literacy: 99.8, unemp: 6.21, lifeExp: 75.8, source: 'BPS (2024)' },
  { id: 'west-java', name: 'West Java', region: 'Java', capital: 'Bandung', popM: 50.3, grdpB: 178.4, grdpPerCap: 3545, hdi: 74.92, literacy: 98.7, unemp: 6.75, lifeExp: 74.2, source: 'BPS (2024)' },
  { id: 'east-java', name: 'East Java', region: 'Java', capital: 'Surabaya', popM: 41.8, grdpB: 199.1, grdpPerCap: 4760, hdi: 75.35, literacy: 93.8, unemp: 4.19, lifeExp: 74.9, source: 'BPS (2024)' },
  { id: 'central-java', name: 'Central Java', region: 'Java', capital: 'Semarang', popM: 37.9, grdpB: 114.2, grdpPerCap: 3015, hdi: 73.87, literacy: 94.6, unemp: 4.78, lifeExp: 74.9, source: 'BPS (2024)' },
  { id: 'banten', name: 'Banten', region: 'Java', capital: 'Serang', popM: 12.4, grdpB: 55.1, grdpPerCap: 4440, hdi: 76.35, literacy: 98.0, unemp: 6.68, lifeExp: 74.1, source: 'BPS (2024)' },
  { id: 'yogyakarta', name: 'DI Yogyakarta', region: 'Java', capital: 'Yogyakarta', popM: 3.8, grdpB: 12.3, grdpPerCap: 3240, hdi: 81.62, literacy: 96.1, unemp: 3.48, lifeExp: 75.2, source: 'BPS (2024)' },
  { id: 'north-sumatra', name: 'North Sumatra', region: 'Sumatra', capital: 'Medan', popM: 15.6, grdpB: 72.1, grdpPerCap: 4620, hdi: 75.76, literacy: 99.2, unemp: 5.60, lifeExp: 73.7, source: 'BPS (2024)' },
  { id: 'riau', name: 'Riau', region: 'Sumatra', capital: 'Pekanbaru', popM: 6.7, grdpB: 69.0, grdpPerCap: 10300, hdi: 75.67, literacy: 99.3, unemp: 3.70, lifeExp: 74.4, source: 'BPS (2024)' },
  { id: 'south-sumatra', name: 'South Sumatra', region: 'Sumatra', capital: 'Palembang', popM: 8.8, grdpB: 42.0, grdpPerCap: 4770, hdi: 73.84, literacy: 98.8, unemp: 3.86, lifeExp: 74.0, source: 'BPS (2024)' },
  { id: 'lampung', name: 'Lampung', region: 'Sumatra', capital: 'Bandar Lampung', popM: 9.4, grdpB: 30.0, grdpPerCap: 3190, hdi: 73.13, literacy: 97.6, unemp: 4.19, lifeExp: 74.1, source: 'BPS (2024)' },
  { id: 'aceh', name: 'Aceh', region: 'Sumatra', capital: 'Banda Aceh', popM: 5.6, grdpB: 15.3, grdpPerCap: 2730, hdi: 75.36, literacy: 98.5, unemp: 5.75, lifeExp: 73.1, source: 'BPS (2024)' },
  { id: 'east-kalimantan', name: 'East Kalimantan', region: 'Kalimantan', capital: 'Samarinda', popM: 4.0, grdpB: 54.0, grdpPerCap: 13500, hdi: 78.79, literacy: 99.1, unemp: 5.14, lifeExp: 74.7, source: 'BPS (2024)' },
  { id: 'south-kalimantan', name: 'South Kalimantan', region: 'Kalimantan', capital: 'Banjarbaru', popM: 4.3, grdpB: 18.2, grdpPerCap: 4230, hdi: 75.19, literacy: 98.7, unemp: 4.20, lifeExp: 74.1, source: 'BPS (2024)' },
  { id: 'south-sulawesi', name: 'South Sulawesi', region: 'Sulawesi', capital: 'Makassar', popM: 9.5, grdpB: 44.0, grdpPerCap: 4630, hdi: 75.18, literacy: 93.4, unemp: 4.19, lifeExp: 73.9, source: 'BPS (2024)' },
  { id: 'north-sulawesi', name: 'North Sulawesi', region: 'Sulawesi', capital: 'Manado', popM: 2.7, grdpB: 11.8, grdpPerCap: 4370, hdi: 75.68, literacy: 99.8, unemp: 5.85, lifeExp: 74.3, source: 'BPS (2024)' },
  { id: 'bali', name: 'Bali', region: 'Bali & Nusa Tenggara', capital: 'Denpasar', popM: 4.4, grdpB: 18.8, grdpPerCap: 4270, hdi: 78.60, literacy: 96.1, unemp: 1.79, lifeExp: 75.1, source: 'BPS (2024)' },
  { id: 'ntb', name: 'West Nusa Tenggara', region: 'Bali & Nusa Tenggara', capital: 'Mataram', popM: 5.6, grdpB: 11.5, grdpPerCap: 2050, hdi: 73.10, literacy: 89.2, unemp: 2.73, lifeExp: 72.1, source: 'BPS (2024)' },
  { id: 'papua', name: 'Papua (Province)', region: 'Maluku & Papua', capital: 'Jayapura', popM: 1.1, grdpB: 5.4, grdpPerCap: 4910, hdi: 73.83, literacy: 92.8, unemp: 6.48, lifeExp: 68.5, source: 'BPS (2024)' },
];

export const STUNTING_SERIES = [
  { year: '2018', rate: 30.8, source: 'MoH Riskesdas (2018)' },
  { year: '2019', rate: 27.7, source: 'MoH SSGBI (2019)' },
  { year: '2021', rate: 24.4, source: 'MoH SSGI (2021)' },
  { year: '2022', rate: 21.6, source: 'MoH SSGI (2022)' },
  { year: '2023', rate: 21.5, source: 'MoH SKI (2023)' },
];

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
  { level: 'Primary (SD, ages 7–12)', rate: 98.0, type: 'Net Enrollment', source: 'BPS SUSENAS (2024)' },
  { level: 'Junior Secondary (SMP, 13–15)', rate: 81.8, type: 'Net Enrollment', source: 'BPS SUSENAS (2024)' },
  { level: 'Senior Secondary (SMA, 16–18)', rate: 64.2, type: 'Net Enrollment', source: 'BPS SUSENAS (2024)' },
  { level: 'Tertiary (Higher Ed, 19–23)', rate: 32.0, type: 'Gross Enrollment', source: 'BPS SUSENAS (2024)' },
];

export const EDUCATION_INDICATORS = [
  { metric: 'Adult Literacy Rate (15+)', value: '96.5%', prev: '96.4%', change: '+0.1 pp', source: 'BPS SUSENAS', year: '2024', note: 'Urban 98.1% · Rural 94.3%' },
  { metric: 'Youth Literacy Rate (15–24)', value: '99.8%', prev: '99.8%', change: '0.0 pp', source: 'BPS SUSENAS', year: '2024', note: 'Near-universal literacy among young adults' },
  { metric: 'Human Development Index (HDI)', value: '75.02', prev: '74.39', change: '+0.63', source: 'BPS', year: '2024', note: 'High human development tier (70–79.9)' },
  { metric: 'Mean Years of Schooling (25+)', value: '8.85 years', prev: '8.77 years', change: '+0.08 yrs', source: 'BPS', year: '2024', note: 'Up +1.01 years since 2015 (7.84 yrs)' },
  { metric: 'Expected Years of Schooling', value: '13.21 years', prev: '13.15 years', change: '+0.06 yrs', source: 'BPS', year: '2024', note: 'Equivalent to 1+ year of tertiary schooling' },
  { metric: 'Education Share of State Budget', value: '20.0%', prev: '20.0%', change: 'Constitutional', source: 'Ministry of Finance', year: '2024', note: '~3.1% of nominal GDP (World Bank, 2024)' },
  { metric: 'Primary & Secondary Schools', value: '220,500', prev: '219,800', change: '+700', source: 'BPS / MoE', year: '2024', note: 'Public and private SD, SMP, SMA/SMK' },
  { metric: 'Active Teachers (K–12)', value: '3.38 million', prev: '3.35 million', change: '+0.9%', source: 'BPS / MoE', year: '2024', note: 'Approx. 16:1 student-to-teacher ratio' },
];

export const EMPLOYMENT_SECTORS_2024 = [
  { sector: 'Agriculture, Forestry & Fisheries', sharePct: 28.2, workersM: 40.8, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Wholesale & Retail Trade', sharePct: 19.0, workersM: 27.5, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Manufacturing', sharePct: 13.8, workersM: 20.0, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Accommodation & Food Service', sharePct: 7.8, workersM: 11.3, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Education & Health Services', sharePct: 6.9, workersM: 10.0, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Construction', sharePct: 6.5, workersM: 9.4, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Transport & Warehousing', sharePct: 4.3, workersM: 6.2, source: 'BPS SAKERNAS (Aug 2024)' },
  { sector: 'Other Services & Mining', sharePct: 13.5, workersM: 19.4, source: 'BPS SAKERNAS (Aug 2024)' },
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

export const INDICATOR_DIRECTORY = [
  { id: 'pop', name: 'Total Population', category: 'Population', route: 'population', value: '283.5 million', prev: '278.7 million', change: '+1.1% YoY', source: 'World Bank', year: '2024' },
  { id: 'urban', name: 'Urban Population Share', category: 'Population', route: 'population', value: '59.1%', prev: '58.5%', change: '+0.6 pp', source: 'World Bank', year: '2024' },
  { id: 'gdp', name: 'Nominal GDP (USD)', category: 'Economy', route: 'economy', value: '$1.40 trillion', prev: '$1.37 trillion', change: '+1.8% USD', source: 'World Bank / BPS', year: '2024' },
  { id: 'growth', name: 'Real GDP Growth', category: 'Economy', route: 'economy', value: '5.03%', prev: '5.05%', change: '-0.02 pp', source: 'BPS', year: '2024' },
  { id: 'gdpcap', name: 'GDP per Capita (Nominal)', category: 'Economy', route: 'economy', value: '$4,960', prev: '$4,920', change: '+0.8%', source: 'World Bank / BPS', year: '2024' },
  { id: 'cpi', name: 'Consumer Price Inflation (YoY)', category: 'Economy', route: 'economy', value: '1.57%', prev: '2.61%', change: '-1.04 pp', source: 'BPS', year: '2024' },
  { id: 'trade', name: 'Merchandise Trade Surplus', category: 'Economy', route: 'economy', value: '$31.0 billion', prev: '$36.9 billion', change: '-16.0%', source: 'BPS', year: '2024' },
  { id: 'lifeexp', name: 'Life Expectancy at Birth', category: 'Health', route: 'health', value: '74.2 years', prev: '73.9 years', change: '+0.3 yrs', source: 'BPS', year: '2024' },
  { id: 'stunting', name: 'Child Stunting Prevalence (<5)', category: 'Health', route: 'health', value: '21.5%', prev: '21.6%', change: '-0.1 pp', source: 'MoH SKI', year: '2023' },
  { id: 'jkn', name: 'Universal Health Coverage (JKN)', category: 'Health', route: 'health', value: '98.0%', prev: '95.8%', change: '+2.2 pp', source: 'BPJS Kesehatan', year: '2024' },
  { id: 'hdi', name: 'Human Development Index (HDI)', category: 'Education', route: 'education', value: '75.02', prev: '74.39', change: '+0.63', source: 'BPS', year: '2024' },
  { id: 'literacy', name: 'Adult Literacy Rate (15+)', category: 'Education', route: 'education', value: '96.5%', prev: '96.4%', change: '+0.1 pp', source: 'BPS SUSENAS', year: '2024' },
  { id: 'schooling', name: 'Mean Years of Schooling', category: 'Education', route: 'education', value: '8.85 years', prev: '8.77 years', change: '+0.08 yrs', source: 'BPS', year: '2024' },
  { id: 'unemp', name: 'Open Unemployment Rate (TPT)', category: 'Employment', route: 'employment', value: '4.91%', prev: '5.32%', change: '-0.41 pp', source: 'BPS SAKERNAS', year: '2024' },
  { id: 'labor', name: 'Total Labor Force', category: 'Employment', route: 'employment', value: '152.1 million', prev: '147.7 million', change: '+3.0%', source: 'BPS SAKERNAS', year: '2024' },
  { id: 'formal', name: 'Formal Employment Share', category: 'Employment', route: 'employment', value: '42.0%', prev: '40.9%', change: '+1.1 pp', source: 'BPS SAKERNAS', year: '2024' },
];

export function getMacroByYear(year) {
  return MACRO_SERIES.find((row) => row.year === Number(year)) || MACRO_SERIES[MACRO_SERIES.length - 1];
}

export function getProvinceById(id) {
  return PROVINCES.find((p) => p.id === id) || PROVINCES[0];
}
