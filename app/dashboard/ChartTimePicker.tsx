'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Neurosity } from '@neurosity/sdk';
import { Session } from '@supabase/auth-helpers-nextjs';
import React, { useState } from 'react';
import {Button} from '@/components/ui/Button';
import { Fragment } from 'react'
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    MapPinIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'

interface Props {
    session?: Session;
    states?: any[];
}
export const ChartTimePicker = ({ session, states }: Props) => {

    return (
        <Calendar />
    );
}



function getDaysInMonth(month: number, year: number) {
    let date = new Date(year, month, 1);
    let days = [];
    let today = new Date();

    while (date.getMonth() === month) {
        let isToday = (date.getDate() === today.getDate()) && (date.getMonth() === today.getMonth()) && (date.getFullYear() === today.getFullYear());
        let day = {
            date: date.toISOString().split('T')[0],
            isSelected: false,
            isCurrentMonth: true,
            isToday: isToday
        };

        days.push(day);
        date.setDate(date.getDate() + 1);
    }

    return days;
}

let date = new Date();
let days = getDaysInMonth(date.getMonth(), date.getFullYear());

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}
function getMonthName(monthIndex: number) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}

export default function Calendar() {
    let date = new Date();
    let days = getDaysInMonth(date.getMonth(), date.getFullYear());
    let monthName = getMonthName(date.getMonth());

    // Selected date state
    const [selectedDate, setSelectedDate] = useState(date.toISOString().split('T')[0]);

    // Update isToday and isSelected properties for each day
    days = days.map(day => {
        day.isToday = day.date === date.toISOString().split('T')[0];
        day.isSelected = day.date === selectedDate;
        return day;
    });

    const handleDayClick = (d: string) => {
        setSelectedDate(d);
    }

    return (
        <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
            <div className="flex items-center text-gray-900">
                {/* <button
                    type="button"
                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                    <span className="sr-only">Previous month</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex-auto text-sm font-semibold">{monthName}</div>
                <button
                    type="button"
                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                    <span className="sr-only">Next month</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button> */}
            </div>
            <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
                <div>S</div>
            </div>
            <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                {days.map((day, dayIdx) => (
                    <button
                        key={day.date}
                        type="button"
                        onClick={() => handleDayClick(day.date)}
                        className={classNames(
                            'py-1.5 hover:bg-gray-100 focus:z-10',
                            day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                            (day.isSelected || day.isToday) && 'font-semibold',
                            day.isSelected && 'text-white',
                            !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                            !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400',
                            day.isToday && !day.isSelected && 'text-indigo-600',
                            dayIdx === 0 && 'rounded-tl-lg',
                            dayIdx === 6 && 'rounded-tr-lg',
                            dayIdx === days.length - 7 && 'rounded-bl-lg',
                            dayIdx === days.length - 1 && 'rounded-br-lg'
                        )}
                    >
                        <time
                            dateTime={day.date}
                            className={classNames(
                                'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                                day.isSelected && day.isToday && 'bg-indigo-600',
                                day.isSelected && !day.isToday && 'bg-gray-900'
                            )}
                        >
                            {day.date.split('-').pop()?.replace(/^0/, '')}
                        </time>
                    </button>
                ))}
            </div>
        </div>
    )
}
