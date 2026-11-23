/** Standard solderless breadboard topology. Each terminal strip connects five holes per numbered row; rails are split at the midpoint by default. */
export const BREADBOARD = Object.freeze({ columns: 30, rowsPerSide: 5, holePitch: 16, rowPitch: 16, splitRails: true });
export function breadboardHoleId(zone, column, row) { return `${zone}:${column}:${row}`; }
export function breadboardNetId(zone, column, row) {
  if (zone === 'topRail' || zone === 'bottomRail') {
    const half = column < 15 ? 'L' : 'R';
    return `${zone}:${half}:${row}`;
  }
  const bank = zone === 'upper' ? 'upper' : 'lower';
  return `terminal:${bank}:${column}`;
}
export function areBreadboardHolesConnected(a,b) {
  if (!a || !b) return false;
  return breadboardNetId(a.zone,a.column,a.row) === breadboardNetId(b.zone,b.column,b.row);
}
export function createBreadboardHoleGrid() {
  const holes=[];
  for(let c=0;c<BREADBOARD.columns;c++) {
    for(let r=0;r<5;r++) holes.push({id:breadboardHoleId('upper',c,r),zone:'upper',column:c,row:r,netId:breadboardNetId('upper',c,r)});
    for(let r=0;r<5;r++) holes.push({id:breadboardHoleId('lower',c,r),zone:'lower',column:c,row:r,netId:breadboardNetId('lower',c,r)});
    for(let r=0;r<2;r++) holes.push({id:breadboardHoleId('topRail',c,r),zone:'topRail',column:c,row:r,netId:breadboardNetId('topRail',c,r)});
    for(let r=0;r<2;r++) holes.push({id:breadboardHoleId('bottomRail',c,r),zone:'bottomRail',column:c,row:r,netId:breadboardNetId('bottomRail',c,r)});
  }
  return holes;
}
