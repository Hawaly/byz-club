"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Video,
  FileText,
  MessageSquare,
  BarChart
} from 'lucide-react';
import { CalendarEvent } from '@/app/client-portal/calendrier/types';

interface ClientCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export function ClientCalendar({ events, onEventClick }: ClientCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Navigation functions
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get events for a specific day
  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter(event => 
      isSameDay(day, new Date(event.start))
    );
  };

  // Get the icon for an event based on its type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'contenu':
      case 'editorial':
        return <FileText className="w-3 h-3" />;
      case 'reunion':
        return <MessageSquare className="w-3 h-3" />;
      case 'reporting':
        return <BarChart className="w-3 h-3" />;
      default:
        return <CalendarIcon className="w-3 h-3" />;
    }
  };

  // Get days of the week
  const daysOfWeek = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {format(currentDate, 'MMMM yyyy', { locale: fr }).charAt(0).toUpperCase() + format(currentDate, 'MMMM yyyy', { locale: fr }).slice(1)}
          </h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={goToToday}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Aujourd'hui
          </button>
          <div className="flex gap-1">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <motion.div 
              key={day.toString()} 
              className={`relative min-h-[110px] p-1 rounded-lg border ${
                isCurrentMonth 
                  ? isToday
                    ? 'bg-blue-50 border-blue-200'
                    : isSelected
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isCurrentMonth) {
                  setSelectedDate(day);
                }
              }}
            >
              {/* Day number */}
              <div className={`text-right text-sm font-medium ${
                isToday ? 'text-blue-600 font-bold' : 
                isSelected ? 'text-orange-600 font-bold' : 
                isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
              } p-1`}>
                {format(day, 'd')}
              </div>
              
              {/* Day events */}
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <motion.div
                    key={event.id}
                    className="rounded-md px-2 py-1 text-xs font-medium truncate cursor-pointer"
                    style={{ backgroundColor: `${event.color}20`, color: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick && onEventClick(event);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-1">
                      {getEventIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  </motion.div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-slate-500 font-medium ml-2">
                    +{dayEvents.length - 3} autres
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
