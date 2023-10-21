import Main, { Task } from './main';

function updateDicts(
  characted: { id: string; name: string },
  kills: number,
  deaths: number,
  assists: number,
  didChampionWin: boolean,
  newChampionPickDict: {
    [key: string]: { pickedCount: number; bannedCount: number; id: string };
  },
  newChamionWinDict: any,
  newChampionKdaDict: any
) {
  const championName = characted.name;
  // pickrates
  if (championName in newChampionPickDict)
    newChampionPickDict[championName as string].pickedCount += 1;
  else
    newChampionPickDict[championName as string] = {
      pickedCount: 1,
      bannedCount: 0,
      id: characted.id
    };

  // champ kdas
  if (championName in newChampionKdaDict) {
    newChampionKdaDict[championName as string].kills += 1;
    newChampionKdaDict[championName as string].deaths += 1;
    newChampionKdaDict[championName as string].assists += 1;
  } else {
    newChampionKdaDict[championName as string] = {
      kills: kills,
      deaths: deaths,
      assists: assists
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

  const newChampionPickDict: {
    [key: string]: { pickedCount: number; bannedCount: number; id: string };
  } = {};
  const newChampionWinDict: {
    [key: string]: { wins: number; losses: number };
  } = {};
  const newChampionKdaDict: {
    [key: string]: {
      kills: number;
      deaths: number;
      assists: number;
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

        const bansResponse = await fetch(
          `https://api.sofascore.com/api/v1/esports-game/${g.id}/bans`,
          { next: { revalidate: 90 } }
        );
        const bansData = await bansResponse.clone().json();

        bansData.homeTeamBans.forEach((ban: { name: string; id: string }) => {
          if (ban.name in newChampionPickDict)
            newChampionPickDict[ban.name as string].bannedCount += 1;
          else
            newChampionPickDict[ban.name as string] = {
              bannedCount: 1,
              pickedCount: 0,
              id: ban.id
            };
        });

        bansData.awayTeamBans.forEach((ban: { name: string; id: string }) => {
          if (ban.name in newChampionPickDict)
            newChampionPickDict[ban.name as string].bannedCount += 1;
          else
            newChampionPickDict[ban.name as string] = {
              bannedCount: 1,
              pickedCount: 0,
              id: ban.id
            };
        });

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

    // calculate champ kdas
    for (const [key, value] of Object.entries(newChampionKdaDict)) {
      const kda =
        value.deaths > 0
          ? (value.kills + value.assists) / value.deaths
          : 99999999;
      const winrate =
        newChampionWinDict[key].wins /
        (newChampionWinDict[key].wins + newChampionWinDict[key].losses);
      const pickRate = newChampionPickDict[key].pickedCount / totalMatches;
      const banRate = newChampionPickDict[key].bannedCount / totalMatches;
      const presence =
        (newChampionPickDict[key].pickedCount +
          newChampionPickDict[key].bannedCount) /
        totalMatches;
      newStats_CHAMP_KDAs.push({
        id: newChampionPickDict[key].id,
        name: key,
        presence: {
          value: presence,
          label: `${(presence * 100).toFixed(0)}%`,
          subLabel: ` (${
            newChampionPickDict[key].pickedCount +
            newChampionPickDict[key].bannedCount
          } pick/ban)`
        },
        pickRate: {
          value: pickRate,
          label: `${(pickRate * 100).toFixed(0)}%`,
          subLabel: ` (${newChampionPickDict[key].pickedCount} matches)`
        },
        banRate: {
          value: banRate,
          label: `${(banRate * 100).toFixed(0)}%`,
          subLabel: ` (${newChampionPickDict[key].bannedCount} matches)`
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
      });
    }
    newStats_CHAMP_KDAs.sort((a, b) => b.pickRate.value - a.pickRate.value);
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
