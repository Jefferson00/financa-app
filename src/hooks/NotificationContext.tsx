import React, { createContext, useContext, useEffect } from 'react';
import notifee, {
  EventType,
  TimestampTrigger,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { addMonths, isBefore } from 'date-fns';

interface NotificationContextData {
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

export const NotificationProvider: React.FC = ({ children }) => {
  const THIRTY_MINUTES = 1000 * 60 * 30;

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

  return (
    <NotificationContext.Provider
      value={{
        onCreateTriggerNotification,
        getTriggerNotification,
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
