/**
 * Educational 8051 / HD44780 LCD-call interpreter.
 *
 * Scope: decodes literal LCD helper calls from the Code tab; it does not
 * compile C51 or execute arbitrary 8051 machine code. Pin wiring is checked
 * against the actual CircuitWeb component pin IDs and wire endpoint schema.
 */
const blankRows = () => ['                ', '                '];

function connected(wires, aComp, aPin, bComp, bPin) {
  if (aComp == null || aPin == null || bComp == null || bPin == null) return false;
  const key = (component, pin) => `${String(component)}:${String(pin)}`;
  const start = key(aComp, aPin);
  const target = key(bComp, bPin);
  const seen = new Set([start]);
  const queue = [start];

  while (queue.length) {
    const current = queue.shift();
    if (current === target) return true;
    for (const wire of wires || []) {
      const left = key(wire.startComp ?? wire.from?.compId, wire.startPin ?? wire.from?.pin);
      const right = key(wire.endComp ?? wire.to?.compId, wire.endPin ?? wire.to?.pin);
      if (left === current && !seen.has(right)) { seen.add(right); queue.push(right); }
      if (right === current && !seen.has(left)) { seen.add(left); queue.push(left); }
    }
  }
  return false;
}

function pinByFunction(pins, names) {
  const wanted = (Array.isArray(names) ? names : [names]).map((name) =>
    String(name).toUpperCase().replace(/[^A-Z0-9.]/g, '')
  );
  return pins.find((pin) => {
    const actual = String(pin.function || '').toUpperCase().replace(/[^A-Z0-9.]/g, '');
    return wanted.some((name) => actual === name || actual.startsWith(`${name}/`) || actual.startsWith(name));
  })?.id;
}

function decodeLcdProgram(source) {
  const rows = blankRows();
  let row = 0;
  let col = 0;
  let wrote = false;
  const code = String(source || '');
  const pattern = /\blcd_cmd\s*\(\s*(0x80|0xC0|0x01)\s*\)|\b(lcd_string|lcd_puts|lcd_print|LCD_PRINT|lcd_data|lcd_char|lcd_write_char)\s*\(\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*\)/g;

  for (const match of code.matchAll(pattern)) {
    if (match[1]) {
      const command = match[1].toLowerCase();
      if (command === '0x80') { row = 0; col = 0; }
      else if (command === '0xc0') { row = 1; col = 0; }
      else if (command === '0x01') { rows[0] = '                '; rows[1] = '                '; row = 0; col = 0; }
      continue;
    }
    const fn = match[2].toLowerCase();
    const literal = match[3];
    let value;
    if (literal.startsWith('"')) {
      value = literal.slice(1, -1)
        .replace(/\\n/g, '\n').replace(/\\r/g, '\r')
        .replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    } else {
      value = literal.slice(1, -1);
    }
    if (fn === 'lcd_string' || fn === 'lcd_puts' || fn === 'lcd_print' || fn === 'lcd_print') {
      // String helpers write all characters; a newline advances to row 2.
    }
    for (const char of value) {
      if (char === '\n') { row = Math.min(1, row + 1); col = 0; continue; }
      if (col >= 16) { row = Math.min(1, row + 1); col = 0; }
      if (row > 1) break;
      rows[row] = rows[row].slice(0, col) + char + rows[row].slice(col + 1);
      col += 1;
      wrote = true;
    }
  }
  return { rows, wrote };
}

function isFiveVoltSupply(part) {
  if (!['DC Voltage Source', '9V Battery'].includes(part.name)) return false;
  const value = Number.parseFloat(part.val ?? part.value ?? '');
  return Number.isFinite(value) && Math.abs(value - 5) < 0.01;
}

export function execute8051LcdDemo(source, components = [], wires = [], componentPins = {}) {
  const rows = blankRows();
  const mcu = components.find((part) => part.name === '8051 AT89C51 DIP-40');
  const lcd = components.find((part) => part.name === 'LCD 16x2 (HD44780)');
  if (!mcu || !lcd) return { supported: false, rows, message: 'Add an 8051 and LCD 16x2' };

  const mcuPins = componentPins[mcu.name] || [];
  const lcdPins = componentPins[lcd.name] || [];
  const mcuPin = (port) => pinByFunction(mcuPins, port);
  const lcdPin = (fn) => pinByFunction(lcdPins, fn);

  // AT89C51 DIP-40 port pins: P2.0=21, P2.1=22, P2.4=25 ... P2.7=28.
  const mapping = [
    ['RS', 'P2.0', 'RS'], ['E', 'P2.1', 'E'],
    ['D4', 'P2.4', 'D4'], ['D5', 'P2.5', 'D5'],
    ['D6', 'P2.6', 'D6'], ['D7', 'P2.7', 'D7']
  ];
  const missing = mapping.filter(([, port, lcdFn]) =>
    !connected(wires, mcu.id, mcuPin(port), lcd.id, lcdPin(lcdFn))
  ).map(([label]) => label);

  const ground = components.find((part) => part.name === 'Ground');
  const supply = components.find(isFiveVoltSupply);
  const lcdPowerOk =
    connected(wires, lcd.id, lcdPin('VSS'), ground?.id, 'gnd') &&
    connected(wires, lcd.id, lcdPin('VDD'), supply?.id, 'pos') &&
    connected(wires, lcd.id, lcdPin('R/W'), ground?.id, 'gnd');
  const mcuPowerOk =
    connected(wires, mcu.id, mcuPin('GND'), ground?.id, 'gnd') &&
    connected(wires, mcu.id, mcuPin('VCC'), supply?.id, 'pos');

  if (missing.length || !lcdPowerOk || !mcuPowerOk) {
    const warnings = [...missing];
    if (!lcdPowerOk) warnings.push('LCD VSS/VDD/RW');
    if (!mcuPowerOk) warnings.push('8051 VCC/GND');
    return {
      supported: false, rows,
      message: `LCD wiring incomplete: ${warnings.join(', ')}`,
      warnings
    };
  }

  const decoded = decodeLcdProgram(source);
  if (!decoded.wrote) {
    return { supported: false, rows, message: 'No supported literal LCD calls found (try lcd_string("HELLO") or lcd_char(\'H\'))' };
  }
  const outputRows = decoded.rows;

  return {
    supported: true, rows: outputRows,
    message: 'LCD text decoded from supported literal calls',
    mode: 'educational LCD-call interpreter'
  };
}
