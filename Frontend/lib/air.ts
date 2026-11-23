export type AirResponse={source:string;sourceType:string;scale:string;updatedAt:string|null;current:{time:string;us_aqi:number|null;pm2_5:number|null;pm10:number|null;nitrogen_dioxide:number|null;ozone:number|null};hourly:{time:string[];us_aqi:(number|null)[]};}
export function airLevel(aqi:number|null|undefined) {
 if(aqi==null)return {label:'Unavailable',tone:'moderate'}
 if(aqi<=50)return {label:'Good',tone:'good'}
 if(aqi<=100)return {label:'Moderate',tone:'moderate'}
 if(aqi<=150)return {label:'Unhealthy for sensitive groups',tone:'poor'}
 if(aqi<=200)return {label:'Unhealthy',tone:'poor'}
 if(aqi<=300)return {label:'Very unhealthy',tone:'very-poor'}
 return {label:'Hazardous',tone:'severe'}
}
export function airAdvice(aqi:number|null|undefined){
 if(aqi==null)return 'Air quality is unavailable. Check again before planning outdoor activity.'
 if(aqi<=50)return 'Air quality is good. Outdoor activities are generally suitable.'
 if(aqi<=100)return 'Air is moderate. Particularly sensitive people may prefer shorter outdoor exertion.'
 if(aqi<=150)return 'Sensitive groups should reduce prolonged outdoor exertion.'
 if(aqi<=200)return 'Limit prolonged outdoor exertion, especially for sensitive groups.'
 if(aqi<=300)return 'Avoid prolonged outdoor exertion. Reduce outdoor time where possible.'
 return 'Avoid outdoor exertion and keep indoor particle exposure low where possible.'
}
