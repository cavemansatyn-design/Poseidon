const newsCache = new Map();
const pendingSignals = new Map();
const newsHost = 'https://news.google.com';
const decode = (raw='') => raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
 .replace(/&(?:amp|quot|apos|lt|gt|#39|#8217|#8211);/g,entity=>({
  '&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&#39;':"'",'&#8217;':'’','&#8211;':'–'
 })[entity]).trim();
const field = (xml,key) => decode(xml.match(new RegExp('<'+key+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+key+'>','i'))?.[1]);

async function getFeed(url) {
 const response=await fetch(url,{signal:AbortSignal.timeout(6500)});
 if(!response.ok) throw new Error('Feed unavailable');
 return response;
}

async function freightNews(city) {
 const query=new URLSearchParams({q:'"'+city+'" (port OR shipping OR freight) (delay OR strike OR congestion OR disruption) when:14d',hl:'en-US',gl:'US',ceid:'US:en'});
 const xml=await (await getFeed(newsHost+'/rss/search?'+query)).text();
 if(!/<rss\b/i.test(xml)) throw new Error('Feed returned invalid RSS');
 const cutoff=Date.now()-14*86400000;
 return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(([,item])=>{
  const title=field(item,'title'), source=field(item,'source'),url=field(item,'link'),date=Date.parse(field(item,'pubDate'));
  if(!title || !url.startsWith(newsHost+'/rss/articles/') || !Number.isFinite(date) || date<cutoff || date>Date.now()+3600000) return null;
  return {title:title.slice(0,250),source:source.slice(0,80),url,publishedAt:new Date(date).toISOString()};
 }).filter(Boolean).filter((item,i,all)=>all.findIndex(other=>other.title===item.title)===i).slice(0,6);
}

async function portForecast(lat,lon) {
 const query=new URLSearchParams({latitude:lat,longitude:lon,daily:'wind_gusts_10m_max,precipitation_sum',timezone:'UTC',forecast_days:'3'});
 const {daily}=await (await getFeed('https://api.open-meteo.com/v1/forecast?'+query)).json();
 if(!Array.isArray(daily?.time)||!Array.isArray(daily.wind_gusts_10m_max)||!Array.isArray(daily.precipitation_sum)) throw new Error('Forecast incomplete');
 return daily.time.map((date,i)=>({date,gustKmh:daily.wind_gusts_10m_max[i],rainMm:daily.precipitation_sum[i]}));
}

async function currentSignals(city) {
 const hub=hubs.find(([name])=>name===city);
 if(!hub) throw new ServiceError('Choose a location from the atlas.',400);
 const cached=newsCache.get(city);
 if(cached && Date.now()-Date.parse(cached.checkedAt)<5*60000) return cached;
 if(pendingSignals.has(city)) return pendingSignals.get(city);
 const task=(async()=>{
  const [news,weather]=await Promise.allSettled([freightNews(city),portForecast(hub[1],hub[2])]);
  const result={city,checkedAt:new Date().toISOString(),news:news.status==='fulfilled'?news.value:null,
   weather:weather.status==='fulfilled'?weather.value:null};
  if(result.news!==null&&result.weather!==null) newsCache.set(city,result);
  return result;
 })();
 pendingSignals.set(city,task);
 try{return await task}finally{pendingSignals.delete(city)}
}
