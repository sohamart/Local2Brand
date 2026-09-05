export const COUNTRIES = [
  'India',
  'Bangladesh',
  'United Arab Emirates',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'Germany',
  'Other'
];

export const COUNTRY_LOCATIONS = {
  'India': {
    'West Bengal': [
      'Kolkata', 'Howrah', 'Hooghly', 'North 24 Parganas', 'South 24 Parganas',
      'Purba Bardhaman', 'Paschim Bardhaman', 'Darjeeling', 'Kalimpong', 'Jalpaiguri',
      'Alipurduar', 'Cooch Behar', 'Malda', 'Uttar Dinajpur', 'Dakshin Dinajpur',
      'Murshidabad', 'Nadia', 'Birbhum', 'Bankura', 'Purulia', 'Purba Medinipur',
      'Paschim Medinipur', 'Jhargram', 'Other'
    ],
    'Maharashtra': [
      'Mumbai City', 'Mumbai Suburban', 'Thane', 'Pune', 'Nagpur', 'Nashik',
      'Aurangabad (Chhatrapati Sambhajinagar)', 'Solapur', 'Kolhapur', 'Amravati',
      'Navi Mumbai', 'Palghar', 'Raigad', 'Satara', 'Sangli', 'Ahmednagar', 'Nanded', 'Other'
    ],
    'Delhi': [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi', 'Other'
    ],
    'Karnataka': [
      'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru (Dakshina Kannada)',
      'Hubballi-Dharwad', 'Belagavi', 'Kalaburagi', 'Ballari', 'Tumakuru', 'Udupi',
      'Shivamogga', 'Davangere', 'Hassan', 'Bidar', 'Other'
    ],
    'Tamil Nadu': [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
      'Erode', 'Vellore', 'Thoothukudi', 'Kanchipuram', 'Chengalpattu', 'Tiruppur',
      'Thanjavur', 'Dindigul', 'Cuddalore', 'Other'
    ],
    'Uttar Pradesh': [
      'Lucknow', 'Kanpur Nagar', 'Varanasi', 'Prayagraj (Allahabad)', 'Agra',
      'Noida (Gautam Buddha Nagar)', 'Ghaziabad', 'Meerut', 'Bareilly', 'Aligarh',
      'Gorakhpur', 'Mathura', 'Ayodhya', 'Moradabad', 'Saharanpur', 'Jhansi', 'Other'
    ],
    'Gujarat': [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
      'Gandhinagar', 'Junagadh', 'Anand', 'Bharuch', 'Navsari', 'Valsad', 'Mehsana', 'Other'
    ],
    'Telangana': [
      'Hyderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Warangal Urban', 'Nizamabad',
      'Khammam', 'Karimnagar', 'Mahbubnagar', 'Nalgonda', 'Siddipet', 'Other'
    ],
    'Kerala': [
      'Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam',
      'Palakkad', 'Kannur', 'Alappuzha', 'Kottayam', 'Malappuram', 'Idukki', 'Wayanad', 'Kasaragod', 'Pathanamthitta', 'Other'
    ],
    'Rajasthan': [
      'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar',
      'Bhilwara', 'Sikar', 'Bharatpur', 'Pali', 'Sri Ganganagar', 'Other'
    ],
    'Andhra Pradesh': [
      'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 'Kurnool',
      'Nellore', 'Kakinada', 'Rajahmundry', 'Kadapa', 'Anantapur', 'Eluru', 'Other'
    ],
    'Madhya Pradesh': [
      'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa',
      'Satna', 'Ratlam', 'Chhindwara', 'Dewas', 'Other'
    ],
    'Bihar': [
      'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia',
      'Begusarai', 'Arrah (Bhojpur)', 'Katihar', 'Munger', 'Chhapra', 'Other'
    ],
    'Punjab': [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'SAS Nagar (Mohali)',
      'Bathinda', 'Hoshiarpur', 'Pathankot', 'Moga', 'Other'
    ],
    'Haryana': [
      'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar',
      'Sonipat', 'Panchkula', 'Rohtak', 'Yamunanagar', 'Kurukshetra', 'Other'
    ],
    'Odisha': [
      'Bhubaneswar (Khurda)', 'Cuttack', 'Rourkela (Sundargarh)', 'Puri',
      'Sambalpur', 'Balasore', 'Berhampur (Ganjam)', 'Bhadrak', 'Baripada (Mayurbhanj)', 'Other'
    ],
    'Assam': [
      'Guwahati (Kamrup Metro)', 'Dibrugarh', 'Silchar (Cachar)', 'Jorhat',
      'Nagaon', 'Tinsukia', 'Tezpur (Sonitpur)', 'Bongaigaon', 'Other'
    ],
    'Jharkhand': [
      'Ranchi', 'Jamshedpur (East Singhbhum)', 'Dhanbad', 'Bokaro',
      'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Other'
    ],
    'Chhattisgarh': [
      'Raipur', 'Bhilai (Durg)', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur', 'Other'
    ],
    'Uttarakhand': [
      'Dehradun', 'Haridwar', 'Nainital (Haldwani)', 'Udham Singh Nagar (Rudrapur)',
      'Rishikesh', 'Roorkee', 'Almora', 'Other'
    ],
    'Goa': ['North Goa (Panaji / Mapusa)', 'South Goa (Margao / Vasco)', 'Other'],
    'Himachal Pradesh': ['Shimla', 'Kangra (Dharamshala)', 'Mandi', 'Solan', 'Kullu (Manali)', 'Una', 'Other'],
    'Tripura': ['Agartala (West Tripura)', 'Gomati', 'Unakoti', 'Dhalai', 'Other'],
    'Meghalaya': ['East Khasi Hills (Shillong)', 'West Garo Hills', 'Ri-Bhoi', 'Other'],
    'Manipur': ['Imphal West', 'Imphal East', 'Churachandpur', 'Thoubal', 'Other'],
    'Nagaland': ['Dimapur', 'Kohima', 'Mokokchung', 'Tuensang', 'Other'],
    'Arunachal Pradesh': ['Papum Pare (Itanagar)', 'Changlang', 'West Kameng', 'Other'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Other'],
    'Sikkim': ['Gangtok (East Sikkim)', 'Namchi (South Sikkim)', 'Gyalshing', 'Mangan', 'Other'],
    'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
    'Chandigarh': ['Chandigarh Urban', 'Chandigarh Central'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Other'],
    'Ladakh': ['Leh', 'Kargil', 'Other'],
    'Andaman and Nicobar Islands': ['Port Blair (South Andaman)', 'North & Middle Andaman', 'Nicobar'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
    'Lakshadweep': ['Kavaratti', 'Agatti', 'Minicoy']
  },

  'Bangladesh': {
    'Dhaka Division': [
      'Dhaka (North & South)', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur',
      'Manikganj', 'Munshiganj', 'Narsingdi', 'Gopalganj', 'Kishoreganj',
      'Madaripur', 'Rajbari', 'Shariatpur', 'Other'
    ],
    'Chattogram (Chittagong) Division': [
      'Chattogram City', 'Cox\'s Bazar', 'Cumilla (Comilla)', 'Noakhali', 'Feni',
      'Brahmanbaria', 'Chandpur', 'Lakshmipur', 'Rangamati', 'Khagrachhari', 'Bandarban', 'Other'
    ],
    'Sylhet Division': [
      'Sylhet Sadar', 'Moulvibazar', 'Habiganj', 'Sunamganj', 'Sreemangal', 'Beanibazar', 'Other'
    ],
    'Rajshahi Division': [
      'Rajshahi City', 'Bogura (Bogra)', 'Pabna', 'Sirajganj', 'Naogaon',
      'Natore', 'Chapai Nawabganj', 'Joypurhat', 'Other'
    ],
    'Khulna Division': [
      'Khulna City', 'Jashore (Jessore)', 'Kushtia', 'Satkhira', 'Jhenaidah',
      'Chuadanga', 'Bagerhat', 'Magura', 'Meherpur', 'Narail', 'Other'
    ],
    'Barishal (Barisal) Division': [
      'Barishal City', 'Bhola', 'Patuakhali', 'Pirojpur', 'Jhalokati', 'Barguna', 'Kuakata', 'Other'
    ],
    'Rangpur Division': [
      'Rangpur City', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Nilphamari',
      'Lalmonirhat', 'Thakurgaon', 'Panchagarh', 'Other'
    ],
    'Mymensingh Division': [
      'Mymensingh City', 'Jamalpur', 'Netrokona', 'Sherpur', 'Other'
    ]
  },

  'United Arab Emirates': {
    'Dubai': [
      'Downtown Dubai / Burj Khalifa', 'Dubai Marina / JBR', 'Business Bay',
      'Deira / Gold Souk', 'Bur Dubai / Al Fahidi', 'Palm Jumeirah', 'Jumeirah Lakes Towers (JLT)',
      'Al Barsha', 'Dubai Silicon Oasis (DSO)', 'Dubai Hills Estate', 'Mirdif', 'Al Quoz', 'Other'
    ],
    'Abu Dhabi': [
      'Abu Dhabi City / Corniche', 'Al Reem Island', 'Yas Island', 'Saadiyat Island',
      'Khalifa City', 'Al Ain', 'Al Dhafra / Western Region', 'Mussafah Industrial', 'Other'
    ],
    'Sharjah': [
      'Al Majaz / Waterfront', 'Al Nahda', 'Muwaileh Commercial', 'University City',
      'Al Qasimia', 'Khor Fakkan', 'Kalba', 'Other'
    ],
    'Ajman': ['Ajman Downtown', 'Al Nuaimia', 'Al Rashidiya', 'Ajman Free Zone', 'Other'],
    'Ras Al Khaimah': ['Al Hamra Village', 'Al Nakheel', 'Mina Al Arab', 'RAK City', 'Other'],
    'Fujairah': ['Fujairah City', 'Dibba Al-Fujairah', 'Al Aqah', 'Other'],
    'Umm Al Quwain': ['UAQ City', 'Al Salamah', 'Old Town', 'Other']
  },

  'United States': {
    'California': [
      'Los Angeles County', 'San Francisco / Bay Area', 'San Diego County', 'Orange County (Irvine/Anaheim)',
      'Santa Clara County (Silicon Valley)', 'Alameda County (Oakland)', 'Sacramento County',
      'Contra Costa County', 'Riverside County', 'San Bernardino County', 'Fresno County', 'Other'
    ],
    'New York': [
      'New York City (Manhattan)', 'Brooklyn (Kings County)', 'Queens', 'The Bronx',
      'Staten Island (Richmond)', 'Nassau County (Long Island)', 'Suffolk County',
      'Westchester County', 'Erie County (Buffalo)', 'Monroe County (Rochester)', 'Albany', 'Other'
    ],
    'Texas': [
      'Harris County (Houston)', 'Dallas County', 'Travis County (Austin)', 'Bexar County (San Antonio)',
      'Tarrant County (Fort Worth)', 'Collin County (Plano/Frisco)', 'Denton County', 'El Paso County', 'Other'
    ],
    'Florida': [
      'Miami-Dade County', 'Broward County (Fort Lauderdale)', 'Palm Beach County',
      'Orange County (Orlando)', 'Hillsborough County (Tampa)', 'Duval County (Jacksonville)', 'Pinellas County', 'Other'
    ],
    'Washington': ['King County (Seattle)', 'Pierce County (Tacoma)', 'Snohomish County (Everett)', 'Spokane County', 'Other'],
    'Illinois': ['Cook County (Chicago)', 'DuPage County', 'Lake County', 'Will County', 'Kane County', 'Other'],
    'Massachusetts': ['Suffolk County (Boston)', 'Middlesex County (Cambridge)', 'Norfolk County', 'Essex County', 'Other'],
    'New Jersey': ['Bergen County', 'Hudson County (Jersey City)', 'Essex County (Newark)', 'Middlesex County', 'Other'],
    'Georgia': ['Fulton County (Atlanta)', 'Gwinnett County', 'Cobb County', 'DeKalb County', 'Other'],
    'North Carolina': ['Mecklenburg County (Charlotte)', 'Wake County (Raleigh)', 'Durham County', 'Guilford County', 'Other'],
    'Pennsylvania': ['Philadelphia County', 'Allegheny County (Pittsburgh)', 'Montgomery County', 'Bucks County', 'Other'],
    'Virginia': ['Fairfax County', 'Virginia Beach', 'Loudoun County', 'Richmond City', 'Arlington County', 'Other'],
    'Ohio': ['Franklin County (Columbus)', 'Cuyahoga County (Cleveland)', 'Hamilton County (Cincinnati)', 'Other'],
    'Michigan': ['Wayne County (Detroit)', 'Oakland County', 'Macomb County', 'Kent County (Grand Rapids)', 'Other'],
    'Colorado': ['Denver County', 'El Paso County (Colorado Springs)', 'Arapahoe County', 'Boulder County', 'Other'],
    'Arizona': ['Maricopa County (Phoenix)', 'Pima County (Tucson)', 'Pinal County', 'Other'],
    'Washington DC': ['District of Columbia (DC Metro)'],
    'Other US State': ['Other City / County']
  },

  'United Kingdom': {
    'England - Greater London': [
      'City of London', 'City of Westminster', 'Camden', 'Kensington and Chelsea',
      'Islington', 'Hackney', 'Tower Hamlets (Canary Wharf)', 'Southwark', 'Lambeth',
      'Greenwich', 'Hammersmith and Fulham', 'Wandsworth', 'Barnet', 'Ealing', 'Croydon', 'Bromley', 'Other'
    ],
    'England - North West': [
      'Greater Manchester (Manchester/Salford)', 'Merseyside (Liverpool)', 'Cheshire', 'Lancashire', 'Cumbria', 'Other'
    ],
    'England - West Midlands': [
      'West Midlands (Birmingham/Coventry/Wolverhampton)', 'Warwickshire', 'Staffordshire', 'Worcestershire', 'Other'
    ],
    'England - Yorkshire and the Humber': [
      'West Yorkshire (Leeds/Bradford)', 'South Yorkshire (Sheffield)', 'North Yorkshire (York)', 'East Riding', 'Other'
    ],
    'England - South East': [
      'Surrey', 'Kent', 'Hampshire (Southampton/Portsmouth)', 'Berkshire (Reading)', 'Oxfordshire', 'Buckinghamshire', 'Brighton and Hove', 'Other'
    ],
    'England - South West': [
      'City of Bristol', 'Devon (Exeter/Plymouth)', 'Cornwall', 'Gloucestershire', 'Somerset', 'Wiltshire', 'Dorset', 'Other'
    ],
    'Scotland': [
      'City of Edinburgh', 'Glasgow City', 'Aberdeen City', 'Dundee City', 'Highland (Inverness)', 'Fife', 'Other'
    ],
    'Wales': [
      'Cardiff (Caerdydd)', 'Swansea (Abertawe)', 'Newport (Casnewydd)', 'Gwynedd', 'Wrexham', 'Other'
    ],
    'Northern Ireland': [
      'Belfast', 'Derry / Londonderry', 'Lisburn and Castlereagh', 'Newry and Mourne', 'Antrim and Newtownabbey', 'Other'
    ]
  },

  'Canada': {
    'Ontario': [
      'City of Toronto', 'Peel Region (Mississauga/Brampton)', 'York Region (Markham/Vaughan)',
      'City of Ottawa', 'Halton Region (Oakville/Burlington)', 'Durham Region (Oshawa/Pickering)',
      'Waterloo Region (Kitchener/Waterloo)', 'City of Hamilton', 'London (Middlesex)', 'Niagara Region', 'Windsor', 'Other'
    ],
    'British Columbia': [
      'Metro Vancouver (Vancouver/Burnaby/Richmond/Surrey)', 'Capital Regional District (Victoria)',
      'Kelowna (Central Okanagan)', 'Fraser Valley (Abbotsford)', 'Nanaimo', 'Kamloops', 'Prince George', 'Other'
    ],
    'Quebec': [
      'Montréal Island', 'Laval', 'Québec City (Capitale-Nationale)', 'Montérégie (Longueuil)',
      'Gatineau (Outaouais)', 'Laurentides', 'Lanaudière', 'Estrie (Sherbrooke)', 'Other'
    ],
    'Alberta': [
      'Calgary Metropolitan Region', 'Edmonton Metropolitan Region', 'Red Deer', 'Lethbridge', 'Wood Buffalo (Fort McMurray)', 'Other'
    ],
    'Manitoba': ['Winnipeg Capital Region', 'Brandon', 'Steinbach', 'Portage la Prairie', 'Other'],
    'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Other'],
    'Nova Scotia': ['Halifax Regional Municipality', 'Cape Breton', 'Lunenburg', 'Kings County', 'Other'],
    'New Brunswick': ['Moncton (Westmorland)', 'Saint John', 'Fredericton (York)', 'Other'],
    'Other Canadian Province': ['Other City / Municipality']
  },

  'Australia': {
    'New South Wales': [
      'Greater Sydney (City/Parramatta/North Sydney)', 'Inner West / Eastern Suburbs',
      'Western Sydney (Blacktown/Penrith)', 'Northern Beaches', 'Newcastle / Hunter',
      'Wollongong / Illawarra', 'Central Coast (Gosford)', 'Byron Bay / Northern Rivers', 'Other'
    ],
    'Victoria': [
      'Greater Melbourne (City/Southbank/Docklands)', 'Inner South / Bayside (St Kilda)',
      'Eastern Suburbs (Box Hill/Monash)', 'Western Suburbs (Werribee)', 'Geelong', 'Ballarat', 'Bendigo', 'Other'
    ],
    'Queensland': [
      'Brisbane City', 'Gold Coast', 'Sunshine Coast', 'Moreton Bay', 'Cairns', 'Townsville', 'Toowoomba', 'Other'
    ],
    'Western Australia': [
      'Perth Metropolitan (City/Fremantle/Joondalup)', 'Mandurah (Peel)', 'Bunbury (South West)', 'Other'
    ],
    'South Australia': [
      'Adelaide Central', 'Adelaide Hills', 'Barossa', 'Fleurieu Peninsula', 'Mount Gambier', 'Other'
    ],
    'Tasmania': ['Hobart Metropolitan', 'Launceston', 'Devonport', 'Burnie', 'Other'],
    'Australian Capital Territory': ['Canberra Central', 'Belconnen', 'Tuggeranong', 'Gungahlin', 'Woden Valley'],
    'Northern Territory': ['Darwin', 'Palmerston', 'Alice Springs', 'Other']
  },

  'Singapore': {
    'Central Region': [
      'Downtown Core / Marina Bay', 'Orchard / River Valley', 'Bukit Merah / Harbourfront',
      'Queenstown', 'Geylang', 'Novena', 'Kallang', 'Toa Payoh', 'Other'
    ],
    'East Region': [
      'Tampines', 'Bedok', 'Pasir Ris', 'Changi', 'Paya Lebar', 'Other'
    ],
    'North Region': [
      'Woodlands', 'Yishun', 'Sembawang', 'Lim Chu Kang', 'Other'
    ],
    'North-East Region': [
      'Hougang', 'Sengkang', 'Punggol', 'Ang Mo Kio', 'Serangoon', 'Other'
    ],
    'West Region': [
      'Jurong East', 'Jurong West', 'Clementi', 'Bukit Batok', 'Bukit Panjang', 'Choa Chu Kang', 'Tuas', 'Other'
    ]
  },

  'Germany': {
    'Bavaria (Bayern)': [
      'Munich (München)', 'Nuremberg (Nürnberg)', 'Augsburg', 'Regensburg', 'Ingolstadt', 'Würzburg', 'Erlangen', 'Bamberg', 'Other'
    ],
    'Berlin': [
      'Mitte', 'Charlottenburg-Wilmersdorf', 'Friedrichshain-Kreuzberg', 'Pankow', 'Neukölln', 'Tempelhof-Schöneberg', 'Other'
    ],
    'Baden-Württemberg': [
      'Stuttgart', 'Karlsruhe', 'Mannheim', 'Freiburg im Breisgau', 'Heidelberg', 'Ulm', 'Heilbronn', 'Pforzheim', 'Other'
    ],
    'North Rhine-Westphalia (NRW)': [
      'Cologne (Köln)', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Aachen', 'Other'
    ],
    'Hesse (Hessen)': [
      'Frankfurt am Main', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach am Main', 'Hanau', 'Giessen', 'Other'
    ],
    'Hamburg': [
      'Hamburg-Mitte', 'Altona', 'Eimsbüttel', 'Hamburg-Nord', 'Wandsbek', 'Bergedorf', 'Harburg'
    ],
    'Saxony (Sachsen)': [
      'Leipzig', 'Dresden', 'Chemnitz', 'Zwickau', 'Plauen', 'Other'
    ],
    'Lower Saxony (Niedersachsen)': [
      'Hanover (Hannover)', 'Braunschweig', 'Oldenburg', 'Osnabrück', 'Wolfsburg', 'Göttingen', 'Other'
    ],
    'Other German Federal State': ['Other City / District']
  },

  'Other': {
    'Global / International': [
      'Capital City / Financial Hub', 'Metropolitan City', 'Regional Hub', 'Coastal City', 'Other'
    ]
  }
};

// Backward-compatibility export
export const INDIAN_STATES_AND_DISTRICTS = COUNTRY_LOCATIONS['India'];

// Helper to get states list for any country
export const getStatesForCountry = (countryName) => {
  const countryKey = countryName || 'India';
  const data = COUNTRY_LOCATIONS[countryKey] || COUNTRY_LOCATIONS['India'];
  return Object.keys(data);
};

// Helper to get districts list for a country and state
export const getDistrictsForState = (countryName, stateName) => {
  const countryKey = countryName || 'India';
  const data = COUNTRY_LOCATIONS[countryKey] || COUNTRY_LOCATIONS['India'];
  if (!stateName || !data[stateName]) return [];
  return data[stateName];
};

