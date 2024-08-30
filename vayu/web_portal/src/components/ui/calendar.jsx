'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';
import './calendar.css'

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  const today = new Date();
  const previousday = new Date(today);
  previousday.setDate(today.getDate() - 1);
  const disableBeforeDate = new Date(2024, 5, 1);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{
        before: disableBeforeDate,
        after: previousday
      }}      
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-between items-center px-4 pt-2 text-center',
        caption_label: 'text-lg font-medium text-center',
        // nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'order-first',
        nav_button_next: 'order-last',
        table: 'w-full border-collapse',
        head_row: 'flex justify-between text-center',
        head_cell: 'text-muted-foreground w-10 h-10 font-normal text-sm',
        row: 'flex w-full',
        // cell: cn(
        //   'relative w-10 h-10 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
        //   props.mode === 'range'
        //     ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        //     : '[&:has([aria-selected])]:rounded-md'
        // ),
        day: cn(
          // buttonVariants({ variant: 'ghost' }),
          'h-10 w-10 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="h-5 w-5" />,
        IconRight: () => <ChevronRightIcon className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
