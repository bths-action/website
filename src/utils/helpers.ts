export function isAlumni(gradYear: number) {
  return new Date("July 1," + gradYear) < new Date();
}
