"use client";

import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DatePickerFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  placeholder?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePickerFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "날짜를 선택하세요",
  disablePastDates = false,
  disableFutureDates = false,
  minDate,
  maxDate,
}: DatePickerFormFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP", { locale: ko })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString())}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (disablePastDates && date < today) return true;
                  if (disableFutureDates && date > today) return true;
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;

                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
