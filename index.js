/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import notifee, {
  EventType,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { addMonths, isBefore } from 'date-fns';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.DELIVERED) {
    if (notification?.data?.expanseId) {
      const expanseEndDate = await AsyncStorage.getItem(
        `@FinancaAppBeta:expanseEndDate:${notification?.data?.expanseId}`,
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

          const trigger = {
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
              title: notification?.title,
              body: notification?.body,
              data: notification?.data,
              android: {
                channelId: 'default',
              },
            },
            trigger,
          );
        }
      }
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
