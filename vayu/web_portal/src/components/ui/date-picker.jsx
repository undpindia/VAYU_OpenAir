'use client';

import * as React from 'react';
import { format } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CaretSortIcon } from '@radix-ui/react-icons';

export function DatePicker({ label, onSelect }) {
  const [date, setDate] = React.useState();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    onSelect(selectedDate);
    setIsOpen(false); // Close the Popover after date selection
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-between text-left font-normal text-[18px] hover:text-white hover:bg-white hover:text-primary'
          )}
        >
          {date ? (
            format(date, 'PPP')
          ) : (
            <span className="font-normal text-[18px]">{label}</span>
          )}
          <CaretSortIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
