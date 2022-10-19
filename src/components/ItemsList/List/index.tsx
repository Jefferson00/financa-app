import React, { useState } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles/colors';
import { useTheme } from '../../../hooks/ThemeContext';
import * as S from './styles';
import { getDayOfTheMounth, getMonthName } from '../../../utils/dateFormats';
import { IncomesItemsByDate } from '../../../pages/Incomes';
import { useDate } from '../../../hooks/DateContext';
import ItemCard, { SwitchColors } from '../../../components/ItemCard';
import { reduceString } from '../../../utils/reduceString';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../../interfaces/State';
import { differenceInCalendarMonths } from 'date-fns';
import { getCurrentIteration } from '../../../utils/getCurrentIteration';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../../routes';
import { Item } from '../Item';
import { Modal } from '../../../components/NewModal';
import { useAuth } from '../../../hooks/AuthContext';
import { ICreateIncomeOnAccount } from '../../../interfaces/IncomeOnAccount';
import {
  createIncomeOnAccount,
  deleteIncomeOnAccount,
} from '../../../store/modules/Incomes/fetchActions';
import { ItemsByDate } from '..';
import { ViewProps } from 'react-native';

interface ListProps extends ViewProps {
  type: 'Incomes' | 'Expanses';
  itemsByDate: ItemsByDate;
  onDelete: (item: Item) => void;
  switchActions: {
    onSelect: (item: any) => void;
    onUnselect: (item: any) => void;
  };
}

export function List({
  type,
  itemsByDate,
  switchActions,
  onDelete,
  style,
}: ListProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch<any>();
  const { selectedDate } = useDate();
  const [incomeSelected, setIncomeSelected] = useState<any>();
  const [isConfirmReceiveModalVisible, setIsConfirmReceiveModalVisible] =
    useState(false);
  const [isConfirmUnreceiveModalVisible, setIsConfirmUnreceiveModalVisible] =
    useState(false);
  const [accountIdSelected, setAccountIdSelected] = useState<string | null>(
    null,
  );
  const { accounts } = useSelector((state: State) => state.accounts);
  const { incomes } = useSelector((state: State) => state.incomes);
  const { expanses } = useSelector((state: State) => state.expanses);
  const navigation = useNavigation<Nav>();

  const verifyRecurrence = (income: any) => {
    let currentPart = null;
    if (income.endDate) {
      currentPart = differenceInCalendarMonths(
        new Date(income.endDate),
        selectedDate,
      );
    } else if (income.income && income.income.endDate) {
      currentPart = differenceInCalendarMonths(
        new Date(income.income.endDate),
        selectedDate,
      );
    }
    if (income.iteration && income.iteration.toLowerCase() !== 'mensal') {
      return getCurrentIteration(currentPart, income.iteration);
    }
    if (income.income && income.income.iteration.toLowerCase() !== 'mensal') {
      return getCurrentIteration(currentPart, income.income.iteration);
    }
    return '';
  };

  const receivedMessage = (accountId: string, paymentDate?: string) => {
    const accountName = accounts.find(acc => acc.id === accountId)?.name;
    const formatedAccountName = reduceString(accountName, 16);

    if (type === 'Expanses') {
      return paymentDate
        ? `Pago em ${getDayOfTheMounth(
            new Date(paymentDate),
          )} - ${formatedAccountName}`
        : 'Pagar';
    }
    return paymentDate
      ? `Recebido em ${getDayOfTheMounth(
          new Date(paymentDate),
        )} - ${formatedAccountName}`
      : 'Receber';
  };

  const listColors = () => {
    if (theme === 'dark') {
      return {
        primary:
          type === 'Incomes' ? colors.green.dark[500] : colors.red.dark[500],
        secondary:
          type === 'Incomes' ? colors.green.dark[400] : colors.red.dark[400],
        background: colors.dark[700],
        title: colors.gray[600],
        text: colors.blue[200],
      };
    }
    return {
      primary: type === 'Incomes' ? colors.green[500] : colors.red[500],
      secondary: type === 'Incomes' ? colors.green[400] : colors.red[400],
      background: type === 'Incomes' ? colors.green[100] : colors.red[100],
      title: colors.gray[600],
      text: colors.gray[600],
    };
  };

  const switchColors = (): SwitchColors => {
    if (theme === 'dark') {
      return {
        background: type === 'Incomes' ? colors.green[500] : colors.green[500],
        thumbColor: {
          false:
            type === 'Incomes' ? colors.green.dark[400] : colors.red.dark[400],
          true:
            type === 'Incomes' ? colors.green.dark[500] : colors.red.dark[500],
        },
        trackColor: {
          false: colors.dark[700],
          true:
            type === 'Incomes' ? colors.green.dark[400] : colors.red.dark[400],
        },
      };
    }
    return {
      background: type === 'Incomes' ? colors.green[500] : colors.green[500],
      thumbColor: {
        false: type === 'Incomes' ? colors.green[400] : colors.red[400],
        true: type === 'Incomes' ? colors.green[500] : colors.red[500],
      },
      trackColor: {
        false: type === 'Incomes' ? colors.green[200] : colors.red[200],
        true: type === 'Incomes' ? colors.green[400] : colors.red[400],
      },
    };
  };

  return (
    <>
      <S.Container style={style}>
        <S.Text
          color={listColors().title}
          fontSize={2}
          fontWeight="Medium"
          style={{
            marginBottom: RFPercentage(2.5),
          }}>
          {itemsByDate.day} de {getMonthName(selectedDate)}
        </S.Text>

        {itemsByDate.items.map(item => (
          <Item
            onDelete={onDelete}
            item={{
              id: item.id,
              category: item.category,
              name: item.name,
              recurrence: verifyRecurrence(item),
              value: item.value,
            }}
            key={item.id}
            colors={listColors()}
            received={!!item?.paymentDate}
            receivedMessage={receivedMessage(item.accountId, item.paymentDate)}
            switchColors={switchColors()}
            onRedirect={() => {
              const key = type === 'Incomes' ? 'income' : 'expanse';
              const itemFound = () => {
                if (type === 'Expanses') {
                  return expanses.find(
                    exp => exp.id === item.id || exp.id === item.expanseId,
                  );
                }
                return incomes.find(
                  inc => inc.id === item.id || inc.id === item.incomeId,
                );
              };
              navigation.navigate(
                type === 'Expanses' ? 'CreateExpanse' : 'CreateIncome',
                {
                  [key]: itemFound(),
                },
              );
            }}
            onSwitchChange={() => {
              if (!item?.paymentDate) {
                switchActions.onSelect(item);
              } else {
                switchActions.onUnselect(item);
              }
            }}
          />
        ))}
      </S.Container>
    </>
  );
}
