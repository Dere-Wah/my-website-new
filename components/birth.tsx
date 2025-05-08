"use client";

import { Shield } from "@/components/ui/shield";
import { differenceInYears, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from "date-fns";
import { useState, useCallback } from "react";

const AGE_UNITS = [
  {
    label: "years old",
    calculate: (date: Date) => differenceInYears(new Date(), date),
    icon: "twemoji:birthday-cake"
  },
  {
    label: "days on Earth",
    calculate: (date: Date) => differenceInDays(new Date(), date),
    icon: "twemoji:globe-showing-europe-africa"
  },
  {
    label: "hours of existence",
    calculate: (date: Date) => differenceInHours(new Date(), date),
    icon: "twemoji:alarm-clock"
  },
  {
    label: "minutes alive",
    calculate: (date: Date) => differenceInMinutes(new Date(), date),
    icon: "twemoji:hourglass-done"
  },
  {
    label: "seconds of life",
    calculate: (date: Date) => differenceInSeconds(new Date(), date),
    icon: "twemoji:high-voltage"
  },
  {
    label: "Minecraft days",
    calculate: (date: Date) => Math.floor(differenceInMinutes(new Date(), date) / 20),
    icon: "twemoji:pick"
  },
  {
    label: "dog years",
    calculate: (date: Date) => Math.floor(differenceInYears(new Date(), date) * 7),
    icon: "twemoji:dog-face"
  },
  {
    label: "times around the Sun",
    calculate: (date: Date) => differenceInYears(new Date(), date),
    icon: "twemoji:sun"
  }
];

export default function Birth() {
  const birthDate = parseISO("2003-08-29");
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  
  const handleClick = useCallback(() => {
    setCurrentUnitIndex((prev) => (prev + 1) % AGE_UNITS.length);
  }, []);
  
  const currentUnit = AGE_UNITS[currentUnitIndex];
  const value = currentUnit.calculate(birthDate);
  
  return (
    <Shield
      text={`${value.toLocaleString()} ${currentUnit.label}`}
      icon={currentUnit.icon}
      variant="subtle"
      onClick={handleClick}
      className="cursor-pointer transition-all duration-300 hover:scale-105"
    />
  );
}