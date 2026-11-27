// Lean national datasets loaded on first paint (2015–2024 verified public series).
// Every figure cites its authoritative agency and survey year.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const NATIONAL_BENCHMARKS = {
  year: 2024,
  populationM: 283.5,
  grdpUsdB: 1396,
  grdpPerCapitaUsd: 4960,
  gdpGrowthPct: 5.03,
  inflationPct: 1.57,
  tradeSurplusB: 31.0,
  hdi: 75.02,
  povertyPct: 8.57,
  povertyMarPct: 9.03,
  literacyPct: 96.5,
  unemploymentPct: 4.91,
  lifeExpectancyYrs: 74.2,
  source: 'BPS & World Bank (2024)',
};

export const MACRO_SERIES = [
  { year: 2015, popM: 258.4, popGrowth: 1.24, urbanPct: 53.3, fertility: 2.34, medianAge: 28.4, gdpUsdB: 861, gdpGrowth: 4.88, gdpPerCap: 3332, inflation: 3.35, exportsB: 150.4, importsB: 142.7, tradeBalB: 7.7, povertyPct: 11.13, povertyM: 28.51, lifeExp: 72.5, infantMort: 22.8, hdi: 69.55, schoolingYrs: 7.84, unempPct: 6.18, laborM: 122.4, tpakPct: 65.8 },
  { year: 2016, popM: 261.9, popGrowth: 1.21, urbanPct: 54.0, fertility: 2.31, medianAge: 28.7, gdpUsdB: 932, gdpGrowth: 5.03, gdpPerCap: 3563, inflation: 3.02, exportsB: 145.1, importsB: 135.7, tradeBalB: 9.4, povertyPct: 10.70, povertyM: 27.76, lifeExp: 72.7, infantMort: 22.1, hdi: 70.18, schoolingYrs: 7.95, unempPct: 5.61, laborM: 125.4, tpakPct: 66.3 },
  { year: 2017, popM: 264.7, popGrowth: 1.18, urbanPct: 54.7, fertility: 2.28, medianAge: 28.9, gdpUsdB: 1016, gdpGrowth: 5.07, gdpPerCap: 3838, inflation: 3.61, exportsB: 168.8, importsB: 157.0, tradeBalB: 11.8, povertyPct: 10.12, povertyM: 26.58, lifeExp: 72.9, infantMort: 21.4, hdi: 70.81, schoolingYrs: 8.10, unempPct: 5.50, laborM: 128.1, tpakPct: 66.7 },
  { year: 2018, popM: 267.7, popGrowth: 1.15, urbanPct: 55.3, fertility: 2.24, medianAge: 29.2, gdpUsdB: 1042, gdpGrowth: 5.17, gdpPerCap: 3894, inflation: 3.13, exportsB: 180.0, importsB: 188.7, tradeBalB: -8.7, povertyPct: 9.66, povertyM: 25.67, lifeExp: 73.1, infantMort: 20.6, hdi: 71.39, schoolingYrs: 8.17, unempPct: 5.30, laborM: 131.0, tpakPct: 67.3 },
  { year: 2019, popM: 269.6, popGrowth: 1.13, urbanPct: 56.0, fertility: 2.21, medianAge: 29.4, gdpUsdB: 1119, gdpGrowth: 5.02, gdpPerCap: 4151, inflation: 2.72, exportsB: 167.7, importsB: 171.3, tradeBalB: -3.6, povertyPct: 9.22, povertyM: 24.79, lifeExp: 73.3, infantMort: 19.9, hdi: 71.92, schoolingYrs: 8.34, unempPct: 5.23, laborM: 133.6, tpakPct: 67.5 },
  { year: 2020, popM: 270.2, popGrowth: 1.07, urbanPct: 56.6, fertility: 2.18, medianAge: 29.6, gdpUsdB: 1059, gdpGrowth: -2.07, gdpPerCap: 3912, inflation: 1.68, exportsB: 163.2, importsB: 141.6, tradeBalB: 21.6, povertyPct: 10.19, povertyM: 27.55, lifeExp: 73.4, infantMort: 19.2, hdi: 72.81, schoolingYrs: 8.48, unempPct: 7.07, laborM: 138.2, tpakPct: 67.8 },
  { year: 2021, popM: 273.8, popGrowth: 1.11, urbanPct: 57.3, fertility: 2.16, medianAge: 29.8, gdpUsdB: 1187, gdpGrowth: 3.70, gdpPerCap: 4333, inflation: 1.87, exportsB: 231.6, importsB: 196.2, tradeBalB: 35.4, povertyPct: 9.71, povertyM: 26.50, lifeExp: 73.5, infantMort: 18.5, hdi: 73.16, schoolingYrs: 8.54, unempPct: 6.49, laborM: 140.2, tpakPct: 67.8 },
  { year: 2022, popM: 275.8, popGrowth: 1.10, urbanPct: 57.9, fertility: 2.14, medianAge: 30.0, gdpUsdB: 1319, gdpGrowth: 5.31, gdpPerCap: 4783, inflation: 5.51, exportsB: 291.9, importsB: 237.4, tradeBalB: 54.5, povertyPct: 9.57, povertyM: 26.36, lifeExp: 73.7, infantMort: 17.8, hdi: 73.77, schoolingYrs: 8.69, unempPct: 5.86, laborM: 143.7, tpakPct: 68.6 },
  { year: 2023, popM: 278.7, popGrowth: 1.10, urbanPct: 58.5, fertility: 2.12, medianAge: 30.2, gdpUsdB: 1371, gdpGrowth: 5.05, gdpPerCap: 4920, inflation: 2.61, exportsB: 258.8, importsB: 221.9, tradeBalB: 36.9, povertyPct: 9.36, povertyM: 25.89, lifeExp: 73.9, infantMort: 17.2, hdi: 74.39, schoolingYrs: 8.77, unempPct: 5.32, laborM: 147.7, tpakPct: 69.5 },
  { year: 2024, popM: 283.5, popGrowth: 1.10, urbanPct: 59.1, fertility: 2.10, medianAge: 30.4, gdpUsdB: 1396, gdpGrowth: 5.03, gdpPerCap: 4960, inflation: 1.57, exportsB: 264.7, importsB: 233.7, tradeBalB: 31.0, povertyPct: 8.57, povertyM: 24.06, lifeExp: 74.2, infantMort: 16.8, hdi: 75.02, schoolingYrs: 8.85, unempPct: 4.91, laborM: 152.1, tpakPct: 70.6 },
];

export const TURNING_POINTS = [
  {
    id: 'infra-baseline',
    shortLabel: '2015–19 Baseline',
    title: 'Infrastructure & Steady 5% Expansion',
    startYear: 2015,
    endYear: 2019,
    focusYear: 2019,
    badge: '5.03% Avg Growth · Poverty 9.22%',
    summary: 'Five consecutive years near 5% real GDP growth lifted nominal output past $1.12 trillion while cutting September poverty from 11.13% to 9.22% and moving HDI to 71.92.',
    takeaway: '2015–19: Real GDP averaged ~5.0% while poverty fell 1.91 pp to 9.22% (BPS).',
    keyMetric: 'gdpGrowth',
    source: 'BPS National Accounts & SUSENAS (2015–2019)',
  },
  {
    id: 'pandemic-shock',
    shortLabel: '2020 Shock',
    title: 'Pandemic Contraction & Labor Dislocation',
    startYear: 2020,
    endYear: 2020,
    focusYear: 2020,
    badge: '-2.07% GDP · 7.07% Unemployment',
    summary: 'COVID-19 triggered Indonesia’s first annual contraction since 1998 (-2.07%), pushing open unemployment up to 7.07% and briefly reversing poverty back above 10% (10.19%, 27.55M).',
    takeaway: '2020: GDP contracted -2.07%, unemployment peaked at 7.07%, poverty rose to 10.19% (BPS).',
    keyMetric: 'unempPct',
    source: 'BPS National Accounts, SAKERNAS & SUSENAS (2020)',
  },
  {
    id: 'export-boom',
    shortLabel: '2022 Export Boom',
    title: 'Commodity Downstreaming & Record Export Windfall',
    startYear: 2022,
    endYear: 2022,
    focusYear: 2022,
    badge: '$291.9B Exports · +$54.5B Surplus',
    summary: 'Nickel smelting expansion and global energy prices drove merchandise exports to an all-time peak of $291.9B and a $54.5B trade surplus, even as global fuel costs pushed CPI to 5.51%.',
    takeaway: '2022: Exports hit a record $291.9B (+$54.5B surplus) alongside 5.51% CPI inflation (BPS).',
    keyMetric: 'exportsB',
    source: 'BPS Foreign Trade & CPI Statistics (2022)',
  },
  {
    id: 'health-milestone',
    shortLabel: '2023 Health Push',
    title: 'Stunting Reduction & Near-Universal JKN Coverage',
    startYear: 2023,
    endYear: 2023,
    focusYear: 2023,
    badge: '21.5% Stunting (-9.3 pp) · 98% JKN',
    summary: 'Under-5 child stunting fell 9.3 percentage points from 30.8% in 2018 to 21.5% in 2023 as JKN national health insurance enrollment climbed toward 277 million citizens.',
    takeaway: '2023: Under-5 stunting dropped to 21.5% (-9.3 pp vs 2018) as JKN neared universal reach (MoH SKI).',
    keyMetric: 'hdi',
    source: 'Ministry of Health SKI (2023) & BPJS Kesehatan (2024)',
  },
  {
    id: 'single-digit-2024',
    shortLabel: '2024 Milestone',
    title: 'Historic Single-Digit Poverty Low & High HDI',
    startYear: 2024,
    endYear: 2024,
    focusYear: 2024,
    badge: '8.57% Poverty · 75.02 HDI · 4.91% TPT',
    summary: 'Growth held steady at 5.03% with 1.57% inflation while HDI crossed 75.02 across 38 provinces, open unemployment hit a decade low of 4.91%, and September poverty fell to a record 8.57%.',
    takeaway: '2024: Poverty hit a historic 8.57% low, HDI reached 75.02, and inflation cooled to 1.57% (BPS).',
    keyMetric: 'povertyPct',
    source: 'BPS SUSENAS Sep 2024, IPM & SAKERNAS (2024)',
  },
];

export const INDICATOR_DIRECTORY = [
  { id: 'pop', name: 'Total Population', category: 'Demographics', route: 'demographics', value: '283.5 million', prev: '278.7 million', change: '+1.10% YoY', source: 'World Bank / BPS', year: '2024' },
  { id: 'urban', name: 'Urban Population Share', category: 'Demographics', route: 'demographics', value: '59.1%', prev: '58.5%', change: '+0.6 pp', source: 'World Bank', year: '2024' },
  { id: 'tfr', name: 'Total Fertility Rate', category: 'Demographics', route: 'demographics', value: '2.10 births', prev: '2.12 births', change: '-0.02', source: 'BPS / World Bank', year: '2024' },
  { id: 'gdp', name: 'Nominal GDP (USD)', category: 'Economy', route: 'economy', value: '$1.40 trillion', prev: '$1.37 trillion', change: '+1.8% USD', source: 'World Bank / BPS', year: '2024' },
  { id: 'growth', name: 'Real GDP Growth', category: 'Economy', route: 'economy', value: '5.03%', prev: '5.05%', change: '-0.02 pp', source: 'BPS National Accounts', year: '2024' },
  { id: 'gdpcap', name: 'GDP per Capita (Nominal)', category: 'Economy', route: 'economy', value: '$4,960', prev: '$4,920', change: '+0.8%', source: 'World Bank / BPS', year: '2024' },
  { id: 'cpi', name: 'Consumer Price Inflation (CPI)', category: 'Economy', route: 'economy', value: '1.57%', prev: '2.61%', change: '-1.04 pp', source: 'BPS', year: '2024' },
  { id: 'trade', name: 'Merchandise Trade Surplus', category: 'Economy', route: 'economy', value: '+$31.0 billion', prev: '+$36.9 billion', change: '-16.0%', source: 'BPS Foreign Trade', year: '2024' },
  { id: 'poverty', name: 'National Poverty Rate (Sep)', category: 'Economy', route: 'turning-points', value: '8.57% (24.06M)', prev: '9.36% (25.89M)', change: '-0.79 pp', source: 'BPS SUSENAS', year: '2024' },
  { id: 'lifeexp', name: 'Life Expectancy at Birth', category: 'Health & Edu', route: 'social', value: '74.2 years', prev: '73.9 years', change: '+0.3 yrs', source: 'BPS', year: '2024' },
  { id: 'stunting', name: 'Child Stunting Prevalence (<5)', category: 'Health & Edu', route: 'social', value: '21.5%', prev: '21.6%', change: '-0.1 pp', source: 'MoH SKI', year: '2023' },
  { id: 'jkn', name: 'Universal Health Coverage (JKN)', category: 'Health & Edu', route: 'social', value: '98.0% (277M)', prev: '95.8%', change: '+2.2 pp', source: 'BPJS Kesehatan', year: '2024' },
  { id: 'hdi', name: 'Human Development Index (HDI)', category: 'Health & Edu', route: 'social', value: '75.02', prev: '74.39', change: '+0.63', source: 'BPS IPM', year: '2024' },
  { id: 'literacy', name: 'Adult Literacy Rate (15+)', category: 'Health & Edu', route: 'social', value: '96.5%', prev: '96.4%', change: '+0.1 pp', source: 'BPS SUSENAS', year: '2024' },
  { id: 'schooling', name: 'Mean Years of Schooling (25+)', category: 'Health & Edu', route: 'social', value: '8.85 years', prev: '8.77 years', change: '+0.08 yrs', source: 'BPS IPM', year: '2024' },
  { id: 'unemp', name: 'Open Unemployment Rate (TPT)', category: 'Labor', route: 'labor', value: '4.91%', prev: '5.32%', change: '-0.41 pp', source: 'BPS SAKERNAS', year: '2024' },
  { id: 'labor', name: 'Total Labor Force', category: 'Labor', route: 'labor', value: '152.1 million', prev: '147.7 million', change: '+3.0%', source: 'BPS SAKERNAS', year: '2024' },
  { id: 'formal', name: 'Formal Employment Share', category: 'Labor', route: 'labor', value: '42.0%', prev: '40.9%', change: '+1.1 pp', source: 'BPS SAKERNAS', year: '2024' },
];

export function getMacroByYear(year) {
  const num = Number(year);
  return MACRO_SERIES.find((row) => row.year === num) || MACRO_SERIES[MACRO_SERIES.length - 1];
}

export function getPrevMacroByYear(year) {
  const idx = MACRO_SERIES.findIndex((row) => row.year === Number(year));
  if (idx <= 0) return null;
  return MACRO_SERIES[idx - 1];
}

export function getSeriesRange(key) {
  const vals = MACRO_SERIES.map((r) => r[key]);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

export function getTurningPointForYear(year) {
  const y = Number(year);
  return TURNING_POINTS.find((tp) => y >= tp.startYear && y <= tp.endYear)
    || TURNING_POINTS.reduce((best, tp) => (Math.abs(tp.focusYear - y) < Math.abs(best.focusYear - y) ? tp : best), TURNING_POINTS[0]);
}
