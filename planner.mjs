export function routeOptions(lanes,origin,destination,avoid,metric) {
 return lanes.map((lane,index)=>({...lane,index})).filter(lane=>lane.path[0]===origin && lane.path.at(-1)===destination && (!avoid || !lane.path.includes(avoid))).sort((a,b)=>a[metric]-b[metric]);
}

export const demoShipment = {
 id:'TF-1042',origin:'Shanghai',destination:'Rotterdam',location:'Singapore',
 cargo:'Palletized equipment',status:'Connection missed',planned:'2026-11-18',revised:'2026-11-23',
 invoice:'TF-1042',
 events:[
  ['2026-10-23','Booking confirmed at Shanghai'],
  ['2026-10-28','Cargo received at Shanghai terminal'],
  ['2026-10-30','Departed Shanghai'],
  ['2026-11-06','Arrived at Singapore'],
  ['2026-11-12','Missed onward connection at Singapore']
 ]
};

export const shipmentRecordDate = '2026-11-12';
const shipmentSeeds = [
 ['TF-1043','Singapore','Sydney','Sydney','Retail fixtures','Delivered','2026-11-10','2026-11-11'],
 ['TF-1044','Dubai','Dar es Salaam','Djibouti','Automotive parts','In transit','2026-11-19','2026-11-19'],
 ['TF-1045','Shenzhen','Long Beach','Kaohsiung','Consumer electronics','At transfer port','2026-11-26','2026-11-27'],
 ['TF-1046','Rotterdam','New York','Rotterdam','Textiles','Awaiting departure','2026-11-28','2026-11-28'],
 ['TF-1047','Busan','Shanghai','Kobe','Machine components','In transit','2026-11-16','2026-11-16'],
 ['TF-1048','Felixstowe','Gdańsk','Hamburg','Packaging rolls','At transfer port','2026-11-19','2026-11-19'],
 ['TF-1049','Manzanillo','Cartagena','Colón','Spare parts','In transit','2026-11-21','2026-11-22'],
 ['TF-1050','Piraeus','Algeciras','Valencia','Ceramic tiles','At transfer port','2026-11-19','2026-11-20'],
 ['TF-1051','Laem Chabang','Singapore','Port Klang','Furniture','In transit','2026-11-17','2026-11-17'],
 ['TF-1052','Sydney','Auckland','Tauranga','Medical equipment','At transfer port','2026-11-22','2026-11-22'],
 ['TF-1053','Shanghai','Rotterdam','Rotterdam','Warehouse fittings','Delivered','2026-11-09','2026-11-09'],
 ['TF-1054','Mumbai','Dubai','Mundra','Machine spares','In transit','2026-11-20','2026-11-20']
];

export const shipments = [demoShipment,...shipmentSeeds.map((seed, index) => {
 const [id,origin,destination,location,cargo,status,planned,revised] = seed;
 const recordDay = Date.parse(shipmentRecordDate);
 const daysBeforeRecord = days => new Date(recordDay - days * 86400000).toISOString().slice(0, 10);
 const departedDaysAgo = id === 'TF-1053' ? 35 : 7 + index % 5;
 const events = [
  [daysBeforeRecord(departedDaysAgo + 5),'Booking confirmed at '+origin],
  [daysBeforeRecord(departedDaysAgo + 2),'Cargo received at '+origin+' terminal']
 ];
 if (location !== origin) {
  events.push([daysBeforeRecord(departedDaysAgo),'Departed '+origin]);
  if (status === 'Delivered') {
   events.push([revised,'Delivered at '+destination]);
  } else {
   events.push([daysBeforeRecord(index % 3),status === 'At transfer port' ? 'Arrived at '+location+' for transfer' : 'Reported near '+location]);
  }
 }
 return {id,origin,destination,location,cargo,status,planned,revised,invoice:null,events};
})];
