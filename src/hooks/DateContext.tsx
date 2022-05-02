import React, { createContext, useContext, useState } from 'react';

interface DateContextData {
  selectedDate: Date;
  changeMonth(order: 'PREV' | 'NEXT'): Promise<unknown>;
}

export const DateContext = createContext<DateContextData>(
  {} as DateContextData,
);

export const DateProvider: React.FC = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  function changeMonth(order: 'PREV' | 'NEXT') {
    return new Promise((resolve, reject) => {
      const currentMonth = selectedDate.getMonth();
      setTimeout(() => {
        setSelectedDate(
          new Date(
            selectedDate.setMonth(
              order === 'NEXT' ? currentMonth + 1 : currentMonth - 1,
            ),
          ),
        );
        resolve(true);
      }, 500);
    });
  }

  return (
    <DateContext.Provider value={{ selectedDate, changeMonth }}>
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
