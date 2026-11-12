export const hubs = [
 ['Berlin',52.52,13.41,'Europe','#ff6655'],['Mumbai',19.08,72.88,'South Asia','#ffb548'],['Tokyo',35.68,139.69,'East Asia','#ff7999'],['Toronto',43.65,-79.38,'North America','#80c5ff'],
 ['London',51.51,-.13,'Europe','#bba7ff'],['Rotterdam',51.92,4.48,'Europe','#ff9364'],['Hamburg',53.55,9.99,'Europe','#9aeea4'],['Antwerp',51.22,4.40,'Europe','#f3d078'],['Paris',48.86,2.35,'Europe','#7ea8ff'],['Frankfurt',50.11,8.68,'Europe','#b8d9ff'],['Milan',45.46,9.19,'Europe','#a6ecbb'],['Madrid',40.42,-3.70,'Europe','#ff9068'],['Valencia',39.47,-.38,'Europe','#ffd570'],['Istanbul',41.01,28.98,'Europe','#f2a0ba'],['Athens',37.98,23.73,'Europe','#8dcfff'],
 ['Singapore',1.29,103.85,'Southeast Asia','#56e7cc'],['Dubai',25.20,55.27,'Middle East','#f3c375'],['Hong Kong',22.32,114.17,'East Asia','#ff8a77'],['Shanghai',31.23,121.47,'East Asia','#fa7168'],['Shenzhen',22.54,114.06,'East Asia','#b2e477'],['Ningbo',29.87,121.55,'East Asia','#78dcdf'],['Qingdao',36.07,120.38,'East Asia','#82a9ff'],['Busan',35.18,129.08,'East Asia','#bcaaff'],['Taipei',25.03,121.57,'East Asia','#ff9e7a'],['Kaohsiung',22.62,120.30,'East Asia','#b1da98'],['Osaka',34.69,135.50,'East Asia','#ffc57d'],['Hanoi',21.03,105.85,'Southeast Asia','#f6ce76'],['Ho Chi Minh City',10.82,106.63,'Southeast Asia','#f39174'],['Bangkok',13.76,100.50,'Southeast Asia','#c4adff'],['Port Klang',3.00,101.39,'Southeast Asia','#69dfb1'],['Jakarta',-6.21,106.85,'Southeast Asia','#f0a18d'],['Manila',14.60,120.98,'Southeast Asia','#7bc6fa'],['Colombo',6.93,79.86,'South Asia','#a3e188'],['Chennai',13.08,80.27,'South Asia','#f09fd6'],['Bengaluru',12.97,77.59,'South Asia','#a8e868'],['Delhi',28.61,77.21,'South Asia','#ff9e75'],['Mundra',22.84,69.72,'South Asia','#ecc881'],
 ['Nairobi',-1.29,36.82,'Africa','#9ce5b3'],['Jeddah',21.49,39.19,'Middle East','#a5e5bc'],['Doha',25.29,51.53,'Middle East','#ff9dad'],['Salalah',17.02,54.09,'Middle East','#b8d6fd'],['Port Said',31.27,32.30,'Africa','#ffd380'],['Tangier',35.76,-5.83,'Africa','#84dabc'],['Lagos',6.52,3.38,'Africa','#f2d27d'],['Mombasa',-4.04,39.67,'Africa','#86d4fc'],['Durban',-29.86,31.02,'Africa','#a4df9b'],['Cape Town',-33.92,18.42,'Africa','#b4a1ff'],
 ['New York',40.71,-74.01,'North America','#beadff'],['Los Angeles',34.05,-118.24,'North America','#ff997a'],['Seattle',47.61,-122.33,'North America','#8ad5b5'],['Vancouver',49.28,-123.12,'North America','#9bdc90'],['Chicago',41.88,-87.63,'North America','#e1bcff'],['Memphis',35.15,-90.05,'North America','#ffc679'],['Houston',29.76,-95.37,'North America','#99b8ff'],['Miami',25.76,-80.19,'North America','#69ded8'],['Savannah',32.08,-81.09,'North America','#f5b980'],['Mexico City',19.43,-99.13,'North America','#ef8c79'],['Panama City',8.98,-79.52,'Latin America','#c6de6b'],['Santos',-23.96,-46.33,'Latin America','#a8e86d'],['São Paulo',-23.55,-46.63,'Latin America','#f4cc69'],['Callao',-12.05,-77.14,'Latin America','#f7a78d'],['Buenos Aires',-34.60,-58.38,'Latin America','#93caff'],['Sydney',-33.87,151.21,'Oceania','#6ee0e4'],['Melbourne',-37.81,144.96,'Oceania','#f7aee9'],['Auckland',-36.85,174.76,'Oceania','#b0e591']
];
export const lanes = [
 {name:'Asia–Northern Europe',path:['Shanghai','Singapore','Colombo','Salalah','Jeddah','Port Said','Tangier','Rotterdam'],days:33,cost:3300,carbon:1800,mode:'Ocean · Suez'},
 {name:'Asia–Europe via the Cape',path:['Shanghai','Singapore','Colombo','Durban','Cape Town','Tangier','Rotterdam'],days:43,cost:2900,carbon:2500,mode:'Ocean · Cape of Good Hope'},
 {name:'Asia–Europe express',path:['Shanghai','Dubai','Rotterdam'],days:4,cost:12800,carbon:19600,mode:'Air · express'},
 {name:'Transpacific',path:['Shanghai','Busan','Los Angeles'],days:18,cost:2350,carbon:1250,mode:'Ocean'},
 {name:'North Atlantic',path:['Rotterdam','New York'],days:13,cost:1950,carbon:820,mode:'Ocean'},
 {name:'Indian Ocean',path:['Mumbai','Mundra','Dubai'],days:7,cost:1150,carbon:370,mode:'Ocean'},
 {name:'Asia–Oceania',path:['Singapore','Sydney','Melbourne'],days:15,cost:1700,carbon:720,mode:'Ocean'},
 {name:'Transatlantic South',path:['Santos','Tangier','Rotterdam'],days:24,cost:2450,carbon:1320,mode:'Ocean'},
 {name:'Americas Pacific',path:['Los Angeles','Panama City','Callao'],days:16,cost:2150,carbon:940,mode:'Ocean'},
 {name:'East Africa connection',path:['Dubai','Salalah','Mombasa','Durban'],days:20,cost:2100,carbon:860,mode:'Ocean'}
];

lanes.push(
 {name:'Singapore onward · Suez',path:['Singapore','Colombo','Salalah','Jeddah','Port Said','Tangier','Rotterdam'],days:26,cost:2650,carbon:1440,mode:'Ocean · Suez'},
 {name:'Singapore onward · Cape',path:['Singapore','Colombo','Durban','Cape Town','Tangier','Rotterdam'],days:36,cost:2300,carbon:2110,mode:'Ocean · Cape'},
 {name:'Singapore onward · Express',path:['Singapore','Dubai','Rotterdam'],days:4,cost:11600,carbon:17600,mode:'Air · express'}
);

hubs.push(
 ['Tianjin',39.0,117.7,'East Asia','#92d5f6'],['Dalian',38.92,121.64,'East Asia','#b2a8ff'],['Xiamen',24.48,118.08,'East Asia','#f5bd82'],
 ['Yokohama',35.45,139.65,'East Asia','#ff9abb'],['Nagoya',35.08,136.88,'East Asia','#86e1d3'],['Kobe',34.69,135.20,'East Asia','#f3a07b'],
 ['Tanjung Pelepas',1.36,103.54,'Southeast Asia','#91e7b2'],['Laem Chabang',13.08,100.88,'Southeast Asia','#d6a0ff'],
 ['Chattogram',22.31,91.80,'South Asia','#fad17d'],['Karachi',24.84,66.98,'South Asia','#86cbf6'],['Visakhapatnam',17.69,83.29,'South Asia','#9fe1bd'],
 ['Sohar',24.50,56.63,'Middle East','#ff9a82'],['Dammam',26.50,50.20,'Middle East','#e6a9f3'],['Abu Dhabi',24.51,54.39,'Middle East','#a8d9ff'],
 ['Alexandria',31.19,29.87,'Africa','#ffd67b'],['Djibouti',11.60,43.14,'Africa','#9ae5d0'],['Tema',5.63,.01,'Africa','#ffac81'],
 ['Abidjan',5.30,-4.02,'Africa','#b8dc91'],['Dakar',14.68,-17.42,'Africa','#81baff'],['Dar es Salaam',-6.82,39.29,'Africa','#d6aaff'],
 ['Genoa',44.40,8.92,'Europe','#9cf0c5'],['Piraeus',37.94,23.63,'Europe','#86c8ff'],['Gdańsk',54.40,18.70,'Europe','#ed9aa6'],
 ['Le Havre',49.48,.12,'Europe','#88dbc9'],['Felixstowe',51.96,1.32,'Europe','#b5c5ff'],['Algeciras',36.13,-5.44,'Europe','#ffbb8d'],
 ['Long Beach',33.76,-118.20,'North America','#97e0da'],['Oakland',37.80,-122.32,'North America','#d9e581'],
 ['Charleston',32.79,-79.93,'North America','#ffc28c'],['Norfolk',36.94,-76.32,'North America','#95afff'],['Halifax',44.64,-63.57,'North America','#e9b0ff'],
 ['Montréal',45.52,-73.53,'North America','#9be3d5'],['Manzanillo',19.06,-104.31,'North America','#e8d27a'],
 ['Cartagena',10.39,-75.52,'Latin America','#f3a98f'],['Colón',9.36,-79.90,'Latin America','#91d9f8'],['Guayaquil',-2.27,-79.90,'Latin America','#b5e88c'],
 ['San Antonio',-33.58,-71.62,'Latin America','#f7b481'],['Montevideo',-34.90,-56.22,'Latin America','#c1b0ff'],
 ['Brisbane',-27.38,153.17,'Oceania','#a5e9bf'],['Fremantle',-32.05,115.74,'Oceania','#f6a9d5'],['Tauranga',-37.65,176.18,'Oceania','#8bc7ff']
);
lanes.push(
 {name:'Pearl River–Pacific',path:['Shenzhen','Kaohsiung','Long Beach'],days:19,cost:2800,carbon:1400,mode:'Ocean'},
 {name:'Mediterranean feeder',path:['Piraeus','Genoa','Valencia','Algeciras'],days:11,cost:1450,carbon:560,mode:'Ocean'},
 {name:'East Asia feeder',path:['Busan','Yokohama','Kobe','Shanghai'],days:8,cost:990,carbon:420,mode:'Ocean'},
 {name:'Pacific Americas feeder',path:['Manzanillo','Colón','Cartagena'],days:9,cost:1200,carbon:510,mode:'Ocean · Panama'},
 {name:'Gulf–East Africa',path:['Jeddah','Djibouti','Mombasa','Dar es Salaam'],days:12,cost:1700,carbon:690,mode:'Ocean'},
 {name:'Northern Europe feeder',path:['Felixstowe','Rotterdam','Hamburg','Gdańsk'],days:8,cost:1250,carbon:480,mode:'Ocean'},
 {name:'Southeast Asia feeder',path:['Laem Chabang','Port Klang','Tanjung Pelepas','Singapore'],days:7,cost:950,carbon:360,mode:'Ocean'},
 {name:'Southern Pacific',path:['Sydney','Brisbane','Tauranga','Auckland'],days:11,cost:1480,carbon:640,mode:'Ocean'}
);
