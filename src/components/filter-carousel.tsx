"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
interface FilterCarouselProps {
  value?: string | number | null;
  isLoading?: boolean;
  onSelect: (value: string | number | null) => void;
  data: {
    value: string | number;
    label: string;
  }[];
}
const FilterCarousel = ({
  value,
  onSelect,
  isLoading,
  data,
}: FilterCarouselProps) => {
  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="px-12 w-full"
      >
        <CarouselContent className="-ml-3">
          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index} className="pl-3 basis-auto">
                <Skeleton className="rounded-lg text-sm w-[100px] font-semibold px-3 py-1 h-full">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}
          {!isLoading && (
            <CarouselItem
              className="pl-3 basis-auto"
              onClick={() => onSelect(null)}
            >
              <Badge
                variant={!value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap"
              >
                All
              </Badge>
            </CarouselItem>
          )}
          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                key={item.value}
                className="pl-3 basis-auto"
                onClick={() => onSelect(item.value)}
              >
                <Badge
                  variant={value === item.value ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="z-20 left-0" />
        <CarouselNext className="z-20 right-0" />
      </Carousel>
    </div>
  );
};

export default FilterCarousel;
