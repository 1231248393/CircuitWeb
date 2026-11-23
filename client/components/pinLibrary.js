/** Physical pin definitions for common DIP ICs and Arduino UNO R3. Coordinates use the 140x90 symbol viewport. */
const dip = (count, names, prefix='') => {
  const leftCount = count / 2;
  const pins = [];
  for (let i = 0; i < leftCount; i++) pins.push({ number: i + 1, name: names[i] || `P${i+1}`, x: 29, y: 25 + i * (42 / Math.max(1, leftCount - 1)), side: 'left' });
  for (let i = 0; i < leftCount; i++) {
    const number = count - i;
    pins.push({ number, name: names[number - 1] || `P${number}`, x: 111, y: 25 + i * (42 / Math.max(1, leftCount - 1)), side: 'right' });
  }
  return pins.map(p => ({ ...p, name: prefix ? `${prefix} ${p.name}` : p.name, kind: /VCC|VDD|VCC\b/.test(p.name) ? 'power' : /GND|VSS/.test(p.name) ? 'ground' : 'signal' }));
};
export const IC_PIN_MAPS = {
  'ne555': dip(8, ['GND','TRIG','OUT','RESET','CTRL','THRESH','DISCH','VCC']),
  '555': dip(8, ['GND','TRIG','OUT','RESET','CTRL','THRESH','DISCH','VCC']),
  '74hc00': dip(14, ['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC']),
  '74hc02': dip(14, ['1Y','1A','1B','2Y','2A','2B','GND','3A','3B','3Y','4A','4B','4Y','VCC']),
  '74hc04': dip(14, ['1A','1Y','2A','2Y','3A','3Y','GND','4Y','4A','5Y','5A','6Y','6A','VCC']),
  '74hc08': dip(14, ['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC']),
  '74hc32': dip(14, ['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC']),
  '74hc86': dip(14, ['1A','1B','1Y','2A','2B','2Y','GND','3Y','3A','3B','4Y','4A','4B','VCC']),
  '74hc73': dip(14, ['1CLR','1K','1J','1CLK','1Q','1Q̅','GND','2Q̅','2Q','2CLK','2J','2K','2CLR','VCC']),
};
export const ARDUINO_UNO_PINS = [
  ...Array.from({length:14},(_,i)=>({number:i,name:i===0?'D0/RX':i===1?'D1/TX':`D${i}`,x:37+i*5.1,y:13,side:'digital',kind:'digital'})),
  ...['IOREF','RESET','3V3','5V','GND1','GND2','VIN'].map((name,i)=>({number:name,name,x:25+i*5.2,y:77,side:'power',kind:/GND/.test(name)?'ground':/V|VIN/.test(name)?'power':'control'})),
  ...Array.from({length:6},(_,i)=>({number:`A${i}`,name:`A${i}`,x:69+i*7.2,y:77,side:'analog',kind:'analog'})),
  {number:'AREF',name:'AREF',x:119,y:77,side:'analog',kind:'reference'},
];
export const getPhysicalPinMap = type => IC_PIN_MAPS[String(type||'').toLowerCase().replace(/[^a-z0-9]/g,'')] || null;
