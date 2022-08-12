import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import notifee, {
  EventType,
  TimestampTrigger,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  addDays,
  addMonths,
  differenceInMonths,
  isBefore,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { IIncomes } from '../interfaces/Income';
import { IExpanses } from '../interfaces/Expanse';
import { useSelector } from 'react-redux';
import State from '../interfaces/State';
import {
  getItemsInThisMonth,
  getItemsOnAccountThisMonth,
} from '../utils/listByDate';

interface NotificationContextData {
  nextDaysItems: RemindItemProps[];
  lateItems: ItemProps[];
  loadingLateItems: boolean;
  loadingNextItems: boolean;
  onCreateTriggerNotification: (
    title: string,
    body: string,
    date: Date,
    data: any,
    id?: string,
  ) => Promise<void>;
  getTriggerNotification: (
    id: string,
  ) => Promise<TriggerNotification | undefined>;
}

export const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData,
);

interface ItemProps extends IIncomes, IExpanses {
  type: 'EXPANSE' | 'INCOME';
}

interface RemindItemProps {
  day: Date;
  items: ItemProps[];
}

export const NotificationProvider: React.FC = ({ children }) => {
  const { accounts, loading: loadingAccounts } = useSelector(
    (state: State) => state.accounts,
  );
  const { incomes, incomesOnAccount } = useSelector(
    (state: State) => state.incomes,
  );
  const { expanses, expansesOnAccount } = useSelector(
    (state: State) => state.expanses,
  );

  const [nextDaysItems, setNextDaysItems] = useState<RemindItemProps[]>([]);
  const [lateItems, setLateItems] = useState<ItemProps[]>([]);
  const [loadingLateItems, setLoadingLateItems] = useState(true);
  const [loadingNextItems, setLoadingNextItems] = useState(true);
  const THIRTY_MINUTES = 1000 * 60 * 30;

  const expansesWithoutInvoice = useMemo(() => {
    return expanses.filter(exp =>
      accounts.find(acc => acc.id === exp.receiptDefault),
    );
  }, [accounts, expanses]);

  const getItemsNextDays = useCallback(() => {
    setLoadingNextItems(true);
    const incomesInThisMonth = getItemsInThisMonth(incomes, new Date());
    const incomesOnAccountInThisMonth = getItemsOnAccountThisMonth(
      incomesOnAccount,
      new Date(),
    );
    const expansesInThisMonth = getItemsInThisMonth(expanses, new Date());
    const expansesOnAccountInThisMonth = getItemsOnAccountThisMonth(
      expansesOnAccount,
      new Date(),
    );

    const incomesWithoutAccount = incomesInThisMonth.filter(
      i =>
        !incomesOnAccountInThisMonth.find(
          inOnAccount => inOnAccount.incomeId === i.id,
        ),
    );
    const expansesWithoutAccount = expansesInThisMonth.filter(
      i =>
        !expansesOnAccountInThisMonth.find(
          inOnAccount => inOnAccount.expanseId === i.id,
        ),
    );

    let nextDays = [];

    for (let i = 1; i <= 5; i++) {
      const nextDay = addDays(new Date(), i);

      const incomesNextDay = incomesWithoutAccount.filter(income =>
        isSameDay(
          new Date().setDate(new Date(income.receiptDate).getDate()),
          nextDay,
        ),
      );
      const expansesNextDay = expansesWithoutAccount.filter(expanse =>
        isSameDay(
          new Date().setDate(new Date(expanse.receiptDate).getDate()),
          nextDay,
        ),
      );

      const incomes = incomesNextDay.map(i => ({ ...i, type: 'INCOME' }));
      const expanses = expansesNextDay.map(i => ({ ...i, type: 'EXPANSE' }));

      nextDays.push({
        day: nextDay,
        items: [...incomes, ...expanses],
      });
    }

    const nextDaysWithItems = nextDays.filter(n => n.items.length > 0);

    setNextDaysItems(nextDaysWithItems);
    setLoadingNextItems(false);
  }, [expanses, expansesOnAccount, incomes, incomesOnAccount]);

  const getLateItems = useCallback(() => {
    setLoadingLateItems(true);
    const incomesInPrevMonths = incomes.filter(
      i =>
        isBefore(new Date(i.startDate), new Date()) ||
        (isSameMonth(new Date(i.startDate), new Date()) &&
          new Date(i.startDate).getDate() <= new Date().getDate()),
    );

    const expansesInPrevMonths = expansesWithoutInvoice.filter(
      i =>
        isBefore(new Date(i.startDate), new Date()) ||
        (isSameMonth(new Date(i.startDate), new Date()) &&
          new Date(i.startDate).getDate() <= new Date().getDate()),
    );

    const incomesOnAccountInPrevMonths = incomesOnAccount.filter(
      i =>
        isBefore(new Date(i.month), new Date()) ||
        isSameMonth(new Date(i.month), new Date()),
    );

    const expansesOnAccountInPrevMonths = expansesOnAccount.filter(
      i =>
        isBefore(new Date(i.month), new Date()) ||
        isSameMonth(new Date(i.month), new Date()),
    );

    const expansesInPrevMonthsCopy = expansesInPrevMonths.map(i => {
      let differenceStartToEnd = 0;
      const differenceBetweenMonths =
        differenceInMonths(new Date(i.startDate), new Date()) + 1;
      if (i.endDate) {
        differenceStartToEnd =
          differenceInMonths(new Date(i.endDate), new Date(i.startDate)) + 1;
      }

      return {
        ...i,
        numberOfMonths:
          differenceBetweenMonths > differenceStartToEnd &&
          differenceStartToEnd !== 0
            ? differenceStartToEnd
            : differenceBetweenMonths,
      };
    });

    const incomesInPrevMonthsCopy = incomesInPrevMonths.map(i => {
      let differenceStartToEnd = 0;
      const differenceBetweenMonths =
        differenceInMonths(new Date(i.startDate), new Date()) + 1;
      if (i.endDate) {
        differenceStartToEnd =
          differenceInMonths(new Date(i.endDate), new Date(i.startDate)) + 1;
      }

      return {
        ...i,
        numberOfMonths:
          differenceBetweenMonths > differenceStartToEnd &&
          differenceStartToEnd !== 0
            ? differenceStartToEnd
            : differenceBetweenMonths,
      };
    });

    const incomesWithoutAccount = incomesInPrevMonthsCopy.filter(
      i =>
        !incomesOnAccountInPrevMonths.find(
          inOnAccount => inOnAccount.incomeId === i.id,
        ) ||
        incomesOnAccountInPrevMonths.filter(
          inOnAccount => inOnAccount.incomeId === i.id,
        ).length < i.numberOfMonths,
    );

    const expansesWithoutAccount = expansesInPrevMonthsCopy.filter(
      i =>
        !expansesOnAccountInPrevMonths.find(
          inOnAccount => inOnAccount.expanseId === i.id,
        ) ||
        expansesOnAccountInPrevMonths.filter(
          inOnAccount => inOnAccount.expanseId === i.id,
        ).length < i.numberOfMonths,
    );

    const lateIncomes = incomesWithoutAccount.map(i => ({
      ...i,
      type: 'INCOME',
    }));
    const lateExpanses = expansesWithoutAccount.map(i => ({
      ...i,
      type: 'EXPANSE',
    }));

    setLateItems(
      [...lateIncomes, ...lateExpanses].sort(
        (a, b) =>
          new Date(a.receiptDate).getDate() - new Date(b.receiptDate).getDate(),
      ) as ItemProps[],
    );
    setLoadingLateItems(false);
  }, [incomes, expansesWithoutInvoice, incomesOnAccount, expansesOnAccount]);

  async function onCreateTriggerNotification(
    title: string,
    body: string,
    date: Date,
    data: any,
    id?: string,
  ) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime() + THIRTY_MINUTES,
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    await notifee.createChannel({
      id: 'default',
      name: 'default',
    });

    if (id) {
      await notifee.createTriggerNotification(
        {
          id,
          title,
          body,
          data,
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
          },
        },
        trigger,
      );
    } else {
      await notifee.createTriggerNotification(
        {
          title,
          body,
          data,
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
          },
        },
        trigger,
      );
    }
  }

  async function onDisplayNotification() {
    const triggerNotifications = await notifee.getTriggerNotifications();
    console.log(triggerNotifications);
  }

  async function getTriggerNotification(id: string) {
    const triggerNotifications = await notifee.getTriggerNotifications();
    const notification = triggerNotifications.find(
      n => n?.notification?.data?.expanseId === id,
    );
    return notification;
  }

  useEffect(() => {
    onDisplayNotification();
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.DELIVERED:
          if (detail.notification?.data?.expanseId) {
            console.log('expanseId', detail.notification?.data?.expanseId);
            const expanseEndDate = await AsyncStorage.getItem(
              `@FinancaAppBeta:expanseEndDate:${detail.notification?.data?.expanseId}`,
            );
            if (expanseEndDate) {
              const nextMonth = addMonths(new Date(), 1);
              nextMonth.setDate(1);
              nextMonth.setHours(0, 0, 0, 0);
              if (isBefore(nextMonth, new Date(expanseEndDate))) {
                const dateTrigger = new Date(nextMonth);
                const endDate = new Date(expanseEndDate);
                dateTrigger.setDate(endDate.getDate());
                dateTrigger.setHours(12);
                dateTrigger.setMinutes(0);
                console.log('dateTrigger', dateTrigger);

                const trigger: TimestampTrigger = {
                  type: TriggerType.TIMESTAMP,
                  timestamp: dateTrigger.getTime(),
                  alarmManager: true,
                };

                await notifee.createChannel({
                  id: 'default',
                  name: 'default',
                });

                await notifee.createTriggerNotification(
                  {
                    title: detail.notification?.title,
                    body: detail.notification?.body,
                    data: detail.notification?.data,
                    android: {
                      channelId: 'default',
                    },
                  },
                  trigger,
                );
              }
            }
          }
          break;
        /*  case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break; */
      }
    });
  }, []);

  useEffect(() => {
    getItemsNextDays();
    getLateItems();
  }, [getItemsNextDays, getLateItems]);

  return (
    <NotificationContext.Provider
      value={{
        onCreateTriggerNotification,
        getTriggerNotification,
        lateItems,
        nextDaysItems,
        loadingNextItems,
        loadingLateItems,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotification(): NotificationContextData {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification must be used within an NotificationProvider',
    );
  }
  return context;
}
