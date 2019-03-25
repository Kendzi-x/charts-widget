export function sensorsData(len): number[] {
  // generate an array of random data
  const data: number[] = [];
  for (let i = 0; i < len; i++) {
     data.push(Math.random());
  }
  return data;
}
