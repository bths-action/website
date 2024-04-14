export function isAlumni(gradYear: number) {
  return new Date("July 1," + gradYear) < new Date();
}

export function* shuffle<T>(arr: T[]): Generator<T> {
  arr = [...arr];
  while (arr.length) yield arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

export function chooseWinners(
  entries: { entries: number; userEmail: string }[],
  numWinners: number
) {
  const totalEntries = entries.reduce((acc, entry) => acc + entry.entries, 0);

  // pick winners based on entry weight
  const winners: string[] = [];
  let weight = totalEntries;
  let giveawayEntries = [...entries];

  for (let i = 0; i < numWinners; i++) {
    const winningEntry = Math.floor(Math.random() * weight);
    let currentEntry = 0;
    for (let j = 0; j < giveawayEntries.length; j++) {
      currentEntry += giveawayEntries[j].entries;
      if (currentEntry >= winningEntry) {
        let entry = giveawayEntries[j];
        winners.push(giveawayEntries[j].userEmail);

        // basically u yeet the last entry into the current entry and pop the last entry cuz ur gonna delete it anyways
        giveawayEntries[j] = giveawayEntries[giveawayEntries.length - 1];
        giveawayEntries.pop();
        // subtract the weight from the current entry for uniqueness
        weight -= entry.entries;
        break;
      }
    }
  }

  // lets test if giveaway remains same results with our 1k votes

  return winners;
}
