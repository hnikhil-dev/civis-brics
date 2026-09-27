// lib/jurisdictions.js

/**
 * N-Tier Hierarchical Administrative Jurisdictions across BRICS Member Nations
 * Supports dynamic geographical navigation: Nation -> Province -> District -> Sectors/Wards
 */
export const BRICS_JURISDICTIONS = [
  {
    countryCode: 'IND',
    name: 'India (Bharat)',
    flag: '🇮🇳',
    defaultCurrency: 'INR',
    center: [18.510, 73.905],
    zoom: 12,
    description: 'Pilot Zone: Pune Metropolitan Region Infrastructure Corridor',
    provinces: [
      {
        id: 'IND-MH',
        name: 'Maharashtra State',
        districts: [
          {
            id: 'IND-MH-PUN',
            name: 'Pune South-East Urban District',
            center: [18.510, 73.905],
            zoom: 12,
            sectors: [
              { id: 1, name: 'Ward 1 - Koregaon Park Extension', center: [18.536, 73.893], equity: 4.8, color: '#16a34a' },
              { id: 2, name: 'Ward 2 - Hadapsar Industrial Zone', center: [18.508, 73.926], equity: 5.9, color: '#d97706' },
              { id: 3, name: 'Ward 3 - Wanowrie Central', center: [18.488, 73.896], equity: 6.7, color: '#ea580c' },
              { id: 4, name: 'Ward 4 - Kondhwa Khurd', center: [18.479, 73.890], equity: 8.5, color: '#dc2626' },
              { id: 5, name: 'Ward 5 - Mundhwa Junction', center: [18.538, 73.915], equity: 6.8, color: '#dc2626' }
            ]
          }
        ]
      }
    ]
  },
  {
    countryCode: 'BRA',
    name: 'Brazil (Brasil)',
    flag: '🇧🇷',
    defaultCurrency: 'BRL',
    center: [-23.5505, -46.6333],
    zoom: 12,
    description: 'Pilot Zone: São Paulo Eastern Metropolitan Transit & Sanitation Basin',
    provinces: [
      {
        id: 'BRA-SP',
        name: 'São Paulo State',
        districts: [
          {
            id: 'BRA-SP-MUN',
            name: 'São Paulo East Metropolitan Subprefecture',
            center: [-23.5505, -46.6333],
            zoom: 12,
            sectors: [
              { id: 101, name: 'Setor 1 - Mooca Centro', center: [-23.555, -46.602], equity: 4.2, color: '#16a34a' },
              { id: 102, name: 'Setor 2 - Tatuapé Leste', center: [-23.540, -46.577], equity: 5.1, color: '#d97706' },
              { id: 103, name: 'Setor 3 - Penha de França', center: [-23.528, -46.545], equity: 6.5, color: '#ea580c' },
              { id: 104, name: 'Setor 4 - Itaquera Zona Leste', center: [-23.541, -46.456], equity: 7.9, color: '#dc2626' },
              { id: 105, name: 'Setor 5 - São Mateus Periferia', center: [-23.606, -46.478], equity: 8.3, color: '#dc2626' }
            ]
          }
        ]
      }
    ]
  },
  {
    countryCode: 'ZAF',
    name: 'South Africa',
    flag: '🇿🇦',
    defaultCurrency: 'ZAR',
    center: [-26.2041, 28.0473],
    zoom: 12,
    description: 'Pilot Zone: City of Johannesburg Region F Water & Energy Sector',
    provinces: [
      {
        id: 'ZAF-GT',
        name: 'Gauteng Province',
        districts: [
          {
            id: 'ZAF-GT-JHB',
            name: 'City of Johannesburg Metropolitan Region',
            center: [-26.2041, 28.0473],
            zoom: 12,
            sectors: [
              { id: 201, name: 'Ward 201 - Sandton Financial Zone', center: [-26.107, 28.053], equity: 3.5, color: '#16a34a' },
              { id: 202, name: 'Ward 202 - Rosebank Commercial', center: [-26.146, 28.042], equity: 4.1, color: '#16a34a' },
              { id: 203, name: 'Ward 203 - Braamfontein University Corridor', center: [-26.192, 28.034], equity: 6.2, color: '#ea580c' },
              { id: 204, name: 'Ward 204 - Alexandra Urban Renewal Area', center: [-26.103, 28.094], equity: 8.9, color: '#dc2626' },
              { id: 205, name: 'Ward 205 - Soweto Central Infrastructure Hub', center: [-26.267, 27.858], equity: 7.8, color: '#dc2626' }
            ]
          }
        ]
      }
    ]
  },
  {
    countryCode: 'CHN',
    name: 'China',
    flag: '🇨🇳',
    defaultCurrency: 'CNY',
    center: [23.1291, 113.2644],
    zoom: 12,
    description: 'Pilot Zone: Greater Bay Area Digital Logistics & Clean Water Network',
    provinces: [
      {
        id: 'CHN-GD',
        name: 'Guangdong Province',
        districts: [
          {
            id: 'CHN-GD-GZ',
            name: 'Guangzhou Urban Development District',
            center: [23.1291, 113.2644],
            zoom: 12,
            sectors: [
              { id: 301, name: 'Tianhe District Digital Core', center: [23.136, 113.361], equity: 3.8, color: '#16a34a' },
              { id: 302, name: 'Yuexiu Heritage & Transit Hub', center: [23.129, 113.264], equity: 4.5, color: '#16a34a' },
              { id: 303, name: 'Haizhu Green Island Corridor', center: [23.093, 113.317], equity: 5.8, color: '#d97706' },
              { id: 304, name: 'Baiyun Northern Industrial Extension', center: [23.272, 113.273], equity: 7.2, color: '#ea580c' },
              { id: 305, name: 'Huangpu New Logistics & Science City', center: [23.179, 113.483], equity: 6.4, color: '#d97706' }
            ]
          }
        ]
      }
    ]
  },
  {
    countryCode: 'RUS',
    name: 'Russia',
    flag: '🇷🇺',
    defaultCurrency: 'RUB',
    center: [55.7558, 37.6173],
    zoom: 12,
    description: 'Pilot Zone: Central Federal Okrug Thermal & Transportation Grid',
    provinces: [
      {
        id: 'RUS-MOW',
        name: 'Moscow Federal City',
        districts: [
          {
            id: 'RUS-MOW-CEN',
            name: 'Central Administrative District',
            center: [55.7558, 37.6173],
            zoom: 12,
            sectors: [
              { id: 401, name: 'Tverskoy Central District', center: [55.768, 37.604], equity: 3.2, color: '#16a34a' },
              { id: 402, name: 'Basmanny Innovation District', center: [55.766, 37.669], equity: 4.9, color: '#16a34a' },
              { id: 403, name: 'Tagansky Transit Sector', center: [55.741, 37.654], equity: 5.8, color: '#d97706' },
              { id: 404, name: 'Lefortovo Industrial Renovation Zone', center: [55.758, 37.702], equity: 7.4, color: '#ea580c' },
              { id: 405, name: 'Danilovsky Thermal Upgrade Corridor', center: [55.707, 37.632], equity: 7.6, color: '#dc2626' }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Returns jurisdiction object by country code
 */
export function getJurisdiction(countryCode = 'IND') {
  return BRICS_JURISDICTIONS.find(j => j.countryCode === countryCode) || BRICS_JURISDICTIONS[0];
}

/**
 * Returns dynamic coordinates lookup map for a given country code
 */
export function getJurisdictionCoordinatesMap(countryCode = 'IND') {
  const jur = getJurisdiction(countryCode);
  const district = jur.provinces[0]?.districts[0];
  if (!district || !district.sectors) return {};

  return Object.fromEntries(
    district.sectors.map(s => [s.id, { center: s.center, color: s.color, name: s.name }])
  );
}
