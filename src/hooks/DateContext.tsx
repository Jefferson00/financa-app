import { addMonths, subMonths } from 'date-fns';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface DateContextData {
  selectedDate: Date;
  loadingChangeMonth: boolean;
  changeDate: (date: Date) => void;
  changeMonth(order: 'PREV' | 'NEXT'): void;
  setCurrentMonth: () => void;
  setLoadingChangeMonth: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DateContext = createContext<DateContextData>(
  {} as DateContextData,
);

export const DateProvider: React.FC = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingChangeMonth, setLoadingChangeMonth] = useState(false);

  const changeDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  function changeMonth(order: 'PREV' | 'NEXT') {
    console.log('change');
    if (order === 'NEXT') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
    /*   const currentMonth = selectedDate.getMonth();
    setSelectedDate(
      new Date(
        selectedDate.setMonth(
          order === 'NEXT' ? currentMonth + 1 : currentMonth - 1,
        ),
      ),
    ); */
  }

  const setCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        loadingChangeMonth,
        setLoadingChangeMonth,
        changeDate,
        changeMonth,
        setCurrentMonth,
      }}>
      {children}
    </DateContext.Provider>
  );
};

export function useDate(): DateContextData {
  const context = useContext(DateContext);

  if (!context) {
    throw new Error('useDate must be used within an DateProvider');
  }
  return context;
}
