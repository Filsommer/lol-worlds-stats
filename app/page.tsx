import Main, { Task } from './main';

function updateDicts(
  characted: { id: string; name: string },
  kills: number,
  deaths: number,
  assists: number,
  didChampionWin: boolean,
  newChampionPickDict: any,
  newChamionWinDict: any,
  newChampionKdaDict: any
) {
  const championName = characted.name;
  // pickrates
  if (championName in newChampionPickDict)
    newChampionPickDict[championName as string] += 1;
  else newChampionPickDict[championName as string] = 1;

  // champ kdas
  if (championName in newChampionKdaDict) {
    newChampionKdaDict[championName as string].kills += 1;
    newChampionKdaDict[championName as string].deaths += 1;
    newChampionKdaDict[championName as string].assists += 1;
  } else {
    newChampionKdaDict[championName as string] = {
      kills: kills,
      deaths: deaths,
      assists: assists,
      id: characted.id
    };
  }

  // champ winrates
  if (championName in newChamionWinDict) {
    newChamionWinDict[championName as string].wins += didChampionWin ? 1 : 0;
    newChamionWinDict[championName as string].losses += didChampionWin ? 0 : 1;
  } else
    newChamionWinDict[championName as string] = {
      wins: didChampionWin ? 1 : 0,
      losses: didChampionWin ? 0 : 1
    };
}

export default async function App() {
  const response = await fetch(
    'https://api.sofascore.com/api/v1/unique-tournament/16053/season/54688/events/last/0',
    { next: { revalidate: 90 } }
  );
  const tournamentInfo = await response.json();
  const newStats_CHAMP_KDAs: Task[] = [];

  const newChampionPickDict: { [key: string]: number } = {};
  const newChampionWinDict: {
    [key: string]: { wins: number; losses: number };
  } = {};
  const newChampionKdaDict: {
    [key: string]: {
      kills: number;
      deaths: number;
      assists: number;
      id: string;
    };
  } = {};
  let totalMatches = 0;
  try {
    const promises = tournamentInfo.events.map(async (e: any) => {
      const response = await fetch(
        `https://api.sofascore.com/api/v1/event/${e.id}/esports-games`,
        { next: { revalidate: 90 } }
      );
      const eventData = await response.clone().json();

      const gamesPromises = eventData.games.map(async (g: any) => {
        if (g.status.type !== 'finished') return;

        totalMatches += 1;

        const gameResponse = await fetch(
          `https://api.sofascore.com/api/v1/esports-game/${g.id}/lineups`,
          { next: { revalidate: 90 } }
        );
        const statisticsData = await gameResponse.clone().json();

        statisticsData.homeTeamPlayers.forEach((entry: any) => {
          updateDicts(
            entry.character,
            entry.kills,
            entry.deaths,
            entry.assists,
            g.winnerCode === 1,
            newChampionPickDict,
            newChampionWinDict,
            newChampionKdaDict
          );
        });
        statisticsData.awayTeamPlayers.forEach((entry: any) => {
          updateDicts(
            entry.character,
            entry.kills,
            entry.deaths,
            entry.assists,
            g.winnerCode === 2,
            newChampionPickDict,
            newChampionWinDict,
            newChampionKdaDict
          );
        });
      });
      await Promise.all(gamesPromises);
    });
    await Promise.all(promises);

    // // calculate pick rate
    // const newStats_PICKRATE: {
    //   name: string;
    //   value: string;
    //   numberValue: number;
    // }[] = [];
    // for (const [key, value] of Object.entries(newChampionPickDict)) {
    //   const pickRate = value / totalMatches;
    //   newStats_PICKRATE.push({
    //     name: key,
    //     value: `${(pickRate * 100).toFixed(0)}% (${(
    //       pickRate * totalMatches
    //     ).toFixed(0)}/${totalMatches})`,
    //     numberValue: pickRate
    //   });
    // }
    // newStats_PICKRATE.sort((a, b) => b.numberValue - a.numberValue);

    // // calculate win rate
    // const newStats_WR: {
    //   name: string;
    //   value: string;
    //   numberValue: number;
    //   nrOfMatches: number;
    // }[] = [];
    // for (const [key, value] of Object.entries(newChampionWinDict)) {
    //   const winrate = value.wins / (value.wins + value.losses);
    //   newStats_WR.push({
    //     name: key,
    //     numberValue: winrate,
    //     nrOfMatches: value.wins + value.losses,
    //     value: `${(winrate * 100).toFixed(0)}% (${value.wins}W - ${
    //       value.losses
    //     }L)`
    //   });
    // }
    // newStats_WR.sort((a, b) => {
    //   if (b.numberValue < a.numberValue) {
    //     return -1;
    //   } else if (b.numberValue > a.numberValue) {
    //     return 1;
    //   } else {
    //     // If 'age' is the same, compare by 'kids'
    //     if (b.nrOfMatches < a.nrOfMatches) {
    //       return -1;
    //     } else if (b.nrOfMatches > a.nrOfMatches) {
    //       return 1;
    //     } else {
    //       return 0; // If both 'age' and 'kids' are equal
    //     }
    //   }
    // });

    // calculate champ kdas
    for (const [key, value] of Object.entries(newChampionKdaDict)) {
      const kda =
        value.deaths > 0
          ? (value.kills + value.assists) / value.deaths
          : 99999999;
      const winrate =
        newChampionWinDict[key].wins /
        (newChampionWinDict[key].wins + newChampionWinDict[key].losses);
      const pickRate = newChampionPickDict[key] / totalMatches;
      newStats_CHAMP_KDAs.push({
        id: value.id,
        name: key,
        pickRate: {
          value: pickRate,
          label: `${(pickRate * 100).toFixed(0)}%`,
          subLabel: ` (${newChampionPickDict[key]} matches)`
        },
        winRate: {
          value: winrate,
          label: `${(winrate * 100).toFixed(0)}%`,
          subLabel: `(${newChampionWinDict[key].wins}W ${newChampionWinDict[key].losses}L)`
        },
        kda: {
          value: kda,
          label: `${kda < 99999998 ? kda.toFixed(1) + ':1' : 'Perfect'}`,
          subLabel: `(${value.kills}/${value.deaths}/${value.assists})`
        }
        //value: `${kda < 99999998 ? kda.toFixed(0) : 'Perfect'}`,
        //numberValue: kda
      });
    }
    newStats_CHAMP_KDAs.sort((a, b) => b.pickRate.value - a.pickRate.value);

    //setTasks(newStats_CHAMP_KDAs);
    //setTotalMatches(totalMatches);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return newStats_CHAMP_KDAs.length > 0 ? (
    <Main
      tasks={newStats_CHAMP_KDAs}
      totalMatches={totalMatches}
      tournamentInfo={tournamentInfo}
    />
  ) : (
    <></>
  );
}
