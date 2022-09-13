import React from 'react';
import { Animated, Switch, View } from 'react-native';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as S from './styles';
import { isSameMonth } from 'date-fns';
import { useDate } from '../../hooks/DateContext';
import { getCategoryIcon } from '../../utils/getCategoryIcon';

interface SwitchColors {
  background: string;
  trackColor: {
    true: string;
    false: string;
  };
  thumbColor: {
    true: string;
    false: string;
  };
}

interface ItemCardProps {
  icon?: React.FC;
  title?: string;
  mainColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  actionBarColor?: string;
  switchValue?: boolean;
  received?: boolean;
  receivedMessage?: string;
  switchColors?: SwitchColors;
  onRedirect?: () => void;
  onSwitchChange?: () => void;
  value: number;
  handleRemove: () => void;
  recurrence?: string;
  category: string;
}

export default function ItemCard({
  title,
  icon: Icon,
  value,
  mainColor,
  textColor,
  switchValue,
  backgroundColor,
  received,
  receivedMessage,
  switchColors,
  recurrence,
  category,
  onSwitchChange,
  handleRemove,
  onRedirect,
  ...rest
}: ItemCardProps) {
  const { selectedDate } = useDate();

  return (
    <Swipeable
      renderRightActions={() => (
        <Animated.View>
          <View>
            <S.DeleteButton
              backgroundColor={switchColors?.background || '#000'}
              onPress={handleRemove}>
              <FeatherIcons name="trash" size={32} color="#fff" />
            </S.DeleteButton>
          </View>
        </Animated.View>
      )}>
      <S.Container backgroundColor={backgroundColor || '#fff'}>
        <S.Main onPress={onRedirect}>
          <S.TitleContainer>
            {Icon ? (
              <Icon />
            ) : (
              getCategoryIcon(category, mainColor || '#fff', 24)
            )}
            <S.TitleText color={textColor ? textColor : '#000'}>
              {title} {recurrence && ` ${recurrence}`}
            </S.TitleText>
          </S.TitleContainer>

          <S.ValueContainer>
            <S.ValueText color={mainColor ? mainColor : '#000'}>
              {getCurrencyFormat(value)}
            </S.ValueText>
          </S.ValueContainer>
        </S.Main>

        <S.ActionContainer
          backgroundColor={
            isSameMonth(new Date(), selectedDate)
              ? switchColors
                ? switchColors.background
                : '#FF981E'
              : 'transparent'
          }>
          {isSameMonth(new Date(), selectedDate) && (
            <>
              <S.SubtitleText color="#262626">
                {received ? receivedMessage : 'Receber'}
              </S.SubtitleText>

              <Switch
                trackColor={{
                  true: switchColors?.trackColor.true,
                  false: switchColors?.trackColor.false,
                }}
                thumbColor={
                  received
                    ? switchColors?.thumbColor.true
                    : switchColors?.thumbColor.false
                }
                value={received}
                onChange={onSwitchChange}
              />
            </>
          )}
        </S.ActionContainer>
      </S.Container>
    </Swipeable>
  );
}
