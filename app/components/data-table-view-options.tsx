'use client';

import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../@/components/ui/dropdown-menu';
import { Button } from '../../@/components/ui/button';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  tournamentInfo: any;
}

export function DataTableViewOptions<TData>({
  table,
  tournamentInfo
}: DataTableViewOptionsProps<TData>) {
  if (!tournamentInfo) return <></>;

  return (
    <a
      className="flex flex-col md:flex-row gap-0 md:gap-1 items-center text-sm md:mt-3"
      href={`https://www.sofascore.com/nrg-esports-team-liquid/${
        tournamentInfo.events.at(-1).customId
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="text-muted-foreground">
        {tournamentInfo.events.at(-1).status.finished
          ? 'Last update: '
          : 'Currently playing: '}
      </div>
      <div className="flex">
        <span className="hidden sm:flex font-medium text-purple-700 mr-1">
          {tournamentInfo.events.at(-1).homeTeam.shortName}
        </span>
        <span className="sm:hidden font-medium text-purple-700 mr-1">
          {tournamentInfo.events.at(-1).homeTeam.nameCode}
        </span>
        <span className="text-muted-foreground mr-1">vs</span>
        <span className="hidden sm:flex font-medium text-purple-700">
          {tournamentInfo.events.at(-1).awayTeam.shortName}
        </span>
        <span className="sm:hidden font-medium text-purple-700">
          {tournamentInfo.events.at(-1).awayTeam.nameCode}
        </span>
      </div>
    </a>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="outline"
    //       size="sm"
    //       className="ml-auto hidden h-8 lg:flex"
    //     >
    //       <MixerHorizontalIcon className="mr-2 h-4 w-4" />
    //       View
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[150px]">
    //     <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     {table
    //       .getAllColumns()
    //       .filter(
    //         (column) =>
    //           typeof column.accessorFn !== 'undefined' && column.getCanHide()
    //       )
    //       .map((column) => {
    //         return (
    //           <DropdownMenuCheckboxItem
    //             key={column.id}
    //             className="capitalize"
    //             checked={column.getIsVisible()}
    //             onCheckedChange={(value) => column.toggleVisibility(!!value)}
    //           >
    //             {column.id}
    //           </DropdownMenuCheckboxItem>
    //         );
    //       })}
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}
