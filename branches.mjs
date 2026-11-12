export const branches = [
 {name:'Berlin',region:'Europe · Sales & distribution',currency:'EUR',budgetRate:1.08,actualRate:1.12,cash:74000, revenue:241000, costs:[['Payroll',88000,92000],['Cloud & software',26000,36000],['Facilities',11000,11000],['Freight & vendors',14000,15000]],loan:{name:'Working capital facility',principal:180000,due:12000,day:8},route:0},
 {name:'Mumbai',region:'Asia · Product & engineering',currency:'INR',budgetRate:.012,actualRate:.0117,cash:6200000,revenue:17200000,costs:[['Payroll',8100000,8700000],['Cloud & software',2600000,2800000],['Facilities',1000000,960000],['Freight & vendors',900000,1100000]],loan:{name:'Equipment term loan',principal:4500000,due:350000,day:11},route:0},
 {name:'Tokyo',region:'Asia · Sales & partnerships',currency:'JPY',budgetRate:.0068,actualRate:.0065,cash:8400000,revenue:31600000,costs:[['Payroll',14700000,15300000],['Cloud & software',4200000,4900000],['Facilities',2800000,2750000],['Freight & vendors',1500000,1800000]],loan:{name:'Expansion facility',principal:18000000,due:1100000,day:14},route:1},
 {name:'Toronto',region:'North America · Customer operations',currency:'CAD',budgetRate:.74,actualRate:.72,cash:97000,revenue:223000,costs:[['Payroll',97000,94000],['Cloud & software',29000,33000],['Facilities',14000,13500],['Freight & vendors',9000,9300]],loan:{name:'Office build-out loan',principal:140000,due:10500,day:10},route:2}
];

export function branchFinancials(branch, fx = 0) {
 const budget = branch.costs.reduce((sum, [,amount]) => sum + amount, 0);
 const actual = branch.costs.reduce((sum, [,,amount]) => sum + amount, 0);
 const rate = branch.actualRate * (1 + fx / 100);
 const budgetUsd = budget * branch.budgetRate;
 const actualUsd = actual * rate;
 return {budget,actual,rate,budgetUsd,actualUsd,varianceUsd:actualUsd-budgetUsd,
  spendEffectUsd:(actual-budget)*branch.budgetRate,fxEffectUsd:actual*(rate-branch.budgetRate),
  cashUsd:branch.cash*rate,remainingAfterDebtUsd:(branch.cash-branch.loan.due)*rate};
}

const addedOffices = [
 ['London','Europe · Treasury','GBP',0.79,1.27,4,2],['Rotterdam','Europe · Port operations','EUR',.91,1.1,1,0],
 ['Singapore','Asia · Regional operations','SGD',1.35,.74,3,1],['Dubai','Middle East · Distribution','AED',3.67,.272,2,1],
 ['Shanghai','Asia · Sourcing','CNY',7.2,.139,5,1],['Hong Kong','Asia · Trade finance','HKD',7.8,.128,3,1],
 ['Los Angeles','North America · Distribution','USD',1,1,4,2],['New York','North America · Finance','USD',1,1,5,2],
 ['Frankfurt','Europe · Cloud operations','EUR',.91,1.1,3,0],['Bengaluru','Asia · Engineering','INR',84,.0117,4,0],
 ['São Paulo','Latin America · Commercial','BRL',5.4,.18,2,2],['Sydney','Oceania · Regional sales','AUD',1.5,.66,2,1],
 ['Mexico City','North America · Operations','MXN',18,.055,3,2],['Nairobi','Africa · Regional sales','KES',130,.0077,1,1]
];
for(const [name,region,currency,unit,rate,size,route] of addedOffices){
 const local=amount=>Math.round(amount*unit*size);
 branches.push({name,region,currency,budgetRate:rate*(currency==='USD'?1:1.018),actualRate:rate,
  cash:local(34000),revenue:local(102000),route,
  costs:[['Payroll',local(39000),local(41100)],['Cloud & software',local(12100),local(14300)],['Facilities',local(5500),local(5300)],['Freight & vendors',local(6400),local(6900)]],
  loan:{name:'Operating facility',principal:local(71000),due:local(4900),day:12}});
}
