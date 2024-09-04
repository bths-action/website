export function isAlumni(gradYear: number) {
  return new Date("July 1," + gradYear) < new Date();
}

export function* shuffle<T>(arr: T[]): Generator<T> {
  arr = [...arr];
  while (arr.length) yield arr.splice((Math.random() * arr.length) | 0, 1)[0];
}


