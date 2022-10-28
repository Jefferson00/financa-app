import React, { memo, useEffect } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles/colors';
import { useTheme } from '../../hooks/ThemeContext';
import * as S from './styles';
import { List } from './List';
import { IExpanses } from '../../interfaces/Expanse';
import { IIncomes } from '../../interfaces/Income';

interface ItemType {
  id: string;
  month: string;
  paymentDate: string;
  receiptDate: string;
  recurrence?: string;
  value: number;
  accountId: string;
  name: string;
  category: string;
  income?: IIncomes;
  incomeId?: string;
  expanse?: IExpanses;
  expanseId?: string;
  receiptDefault: string;
  startDate: string;
  iteration: string;
  endDate?: string;
}

export interface ItemsByDate {
  day: number;
  items: ItemType[];
}

interface ItemsListProps {
  showTitle?: boolean;
  type: 'Incomes' | 'Expanses';
  itemsByDate: ItemsByDate[];
  onDelete: (item: any) => void;
  switchActions: {
    onSelect: (item: any) => void;
    onUnselect: (item: any) => void;
  };
}

export const ItemsList = memo(
  ({
    type,
    itemsByDate,
    switchActions,
    showTitle = true,
    onDelete,
  }: ItemsListProps) => {
    const { theme } = useTheme();

    const itemsListConsts = () => {
      if (type === 'Expanses') {
        return {
          title: 'Despesas',
        };
      }
      return {
        title: 'Entradas',
      };
    };

    const itemsListColors = () => {
      if (theme === 'dark') {
        return {
          primary:
            type === 'Incomes' ? colors.green.dark[500] : colors.red.dark[500],
          secondary:
            type === 'Incomes' ? colors.green.dark[400] : colors.red.dark[400],
          title: colors.gray[200],
          text: colors.gray[600],
          icon_circle: colors.dark[700],
        };
      }
      return {
        primary: type === 'Incomes' ? colors.green[500] : colors.red[500],
        secondary: type === 'Incomes' ? colors.green[400] : colors.red[400],
        title: colors.gray[600],
        text: colors.blue[200],
        icon_circle: type === 'Incomes' ? colors.green[100] : colors.red[100],
      };
    };

    return (
      <S.Container>
        {showTitle && (
          <S.Row>
            <S.IconCircle
              style={{
                backgroundColor: itemsListColors().icon_circle,
              }}>
              <Icon
                name="arrow-down"
                size={RFPercentage(3)}
                color={itemsListColors().primary}
              />
            </S.IconCircle>
            <S.Text
              color={itemsListColors().title}
              fontSize={2}
              fontWeight="SemiBold">
              {itemsListConsts().title}
            </S.Text>
          </S.Row>
        )}

        {itemsByDate.length > 0 &&
          itemsByDate.map(item => (
            <List
              onDelete={onDelete}
              switchActions={switchActions}
              itemsByDate={item}
              type={type}
              key={item.day}
              style={
                !showTitle && {
                  marginTop: 0,
                }
              }
            />
          ))}
      </S.Container>
    );
  },
);
