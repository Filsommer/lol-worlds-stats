'use client';

import { ColumnDef } from '@tanstack/react-table';

import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '../../@/components/ui/checkbox';
import { Badge } from '../../@/components/ui/badge';
import { cn } from '../../lib/utils';
import { SubTask } from '../main';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Champion" />
    ),
    cell: ({ row }) => {
      return (
        <div className="min-w-[100px] md:w-[140px] flex items-center gap-2 ml-2">
          <img
            src={`https://api.sofascore.app/api/v1/character/${row.original.id}/image`}
            className="h-10 rounded-full"
          ></img>
          <div className="truncate">{row.getValue('name')}</div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'pickRate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pick rate" />
    ),
    /** @ts-ignore */
    sortingFn: 'myCustomSorting',
    cell: ({ row }) => {
      const pickRate = row.getValue('pickRate') as SubTask;

      return (
        <div className="min-w-max flex items-center mr-3">
          <span
            className={cn(
              'font-medium mr-1',
              `${
                pickRate.value > 0.3
                  ? 'text-green-500'
                  : pickRate.value >= 0.1
                  ? 'text-secondary-foreground'
                  : 'text-red-500'
              }`
            )}
          >
            {pickRate.label}
          </span>
          <span className="text-secondary-foreground">{pickRate.subLabel}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'winRate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Win rate" />
    ),
    /** @ts-ignore */
    sortingFn: 'myCustomSorting',
    cell: ({ row }) => {
      const winRate = row.getValue('winRate') as SubTask;

      if (!winRate) {
        return null;
      }

      return (
        <div className="flex w-[120px] items-center">
          {/* {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span
            className={`font-medium mr-1 ${
              winRate.value >= 0.55
                ? 'text-green-500'
                : winRate.value >= 0.45
                ? 'text-secondary-foreground'
                : 'text-red-500'
            }`}
          >
            {winRate.label}
          </span>
          <span className="text-secondary-foreground"> {winRate.subLabel}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'kda',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="K/D/A" />
    ),
    /** @ts-ignore */
    sortingFn: 'myCustomSorting',
    cell: ({ row }) => {
      const kda = row.getValue('kda') as SubTask;

      if (!kda) {
        return null;
      }

      return (
        <div className="flex items-center">
          {/* {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span
            className={`font-medium mr-1 ${
              kda.value >= 2
                ? 'text-green-500'
                : kda.value >= 1
                ? 'text-secondary-foreground'
                : 'text-red-500'
            }`}
          >
            {kda.label}
          </span>
          <span className="text-secondary-foreground"> {kda.subLabel}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  }
];
