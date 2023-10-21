'use client';
import Chart from './chart';
import { columns } from './components/columns';
import { useEffect, useState } from 'react';
import { DataTable } from './components/data-table';
import Image from 'next/image';
import { ModeToggle } from './components/theme-trigger';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../@/components/ui/tooltip';
import { Button } from '../@/components/ui/button';
import { Input } from '../@/components/ui/input';
import { Info } from 'lucide-react';

const champion_winrates = [
  { name: '/home', value: 1230 },
  { name: '/contact', value: 751 },
  { name: '/gallery', value: 471 },
  { name: '/august-discount-offer', value: 280 },
  { name: '/case-studies', value: 78 }
];

const shop = [
  { name: '/home', value: 453 },
  { name: '/imprint', value: 351 },
  { name: '/shop', value: 271 },
  { name: '/pricing', value: 191 }
];

const app = [
  { name: '/shop', value: 789 },
  { name: '/product-features', value: 676 },
  { name: '/about', value: 564 },
  { name: '/login', value: 234 },
  { name: '/downloads', value: 191 }
];

const data = [
  {
    category: 'Champion Winrates',
    stat: '10,234',
    data: champion_winrates
  },
  {
    category: 'Most picked Champions',
    stat: '12,543',
    data: shop
  },
  {
    category: 'Player KDA',
    stat: '2,543',
    data: app
  }
];

export type SubTask = { value: number; label: string; subLabel: string };

export type Task = {
  id: string;
  name: string;
  pickRate: SubTask;
  winRate: SubTask;
  kda: SubTask;
};
export default function Main({
  tasks,
  totalMatches,
  tournamentInfo
}: {
  tasks: Task[];
  totalMatches: number;
  tournamentInfo: any;
}) {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {tasks && (
        <>
          <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  <div>LoL Worlds 2023 </div>
                </h2>
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground">
                    Here&apos;s a list of champion stats
                  </p>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-full p-0 h-5 w-5 text-secondary-foreground"
                        >
                          <Info className="h-5" strokeWidth="1.7" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-[310px] text-sm">
                        Ongoing matches do <b>not</b> count towards these stats.
                        Upon game finish, stats are updated automatically within
                        a few minutes. Finished matches so far (incl. play-ins):{' '}
                        <span className="text-purple-400 font-bold">
                          {totalMatches}
                        </span>
                        .
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <ModeToggle></ModeToggle>
            </div>
            <DataTable
              data={tasks}
              columns={columns}
              totalRows={tasks.length}
              tournamentInfo={tournamentInfo}
            />
          </div>
        </>
      )}
      {/* <Chart /> */}
    </main>
  );
}