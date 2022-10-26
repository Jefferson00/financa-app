import React from 'react';
import { Animated, Switch, View } from 'react-native';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as S from './styles';
import { isSameMonth } from 'date-fns';
import { useDate } from '../../../hooks/DateContext';
import { getCategoryIcon } from '../../../utils/getCategoryIcon';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useTheme } from '../../../hooks/ThemeContext';

export interface SwitchColors {
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

export interface ItemColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  value: number;
  recurrence: string;
}

interface ItemCardProps {
  icon?: React.FC;
  colors: ItemColors;
  switchColors: SwitchColors;
  received?: boolean;
  receivedMessage?: string;
  onRedirect?: () => void;
  onDelete: (item: Item) => void;
  onSwitchChange?: () => void;
  item: Item;
}

export function Item({
  icon: Icon,
  colors,
  received,
  receivedMessage,
  switchColors,
  item,
  onSwitchChange,
  onRedirect,
  onDelete,
}: ItemCardProps) {
  const { theme } = useTheme();
  const { selectedDate } = useDate();

  const itemColors = () => {
    if (theme === 'dark') {
      return {
        action_container: {
          background: '#121212',
          text: '#5E5E5E',
        },
      };
    }
    return {
      action_container: {
        background: '#fff',
        text: '#5E5E5E',
      },
    };
  };

  return (
    <>
      <Swipeable
        renderRightActions={() => (
          <Animated.View>
            <View>
              <S.DeleteButton
                backgroundColor={colors.primary}
                onPress={() => onDelete(item)}>
                <FeatherIcons
                  name="trash"
                  size={RFPercentage(3)}
                  color="#fff"
                />
              </S.DeleteButton>
            </View>
          </Animated.View>
        )}>
        <S.Container backgroundColor={colors.background}>
          <S.Main onPress={onRedirect}>
            <S.TitleContainer>
              {Icon ? (
                <Icon />
              ) : (
                getCategoryIcon(item.category, colors.text, 20)
              )}
              <S.TitleText
                color={colors.text}
                style={{ marginLeft: RFPercentage(1.3) }}>
                {item.name} {item.recurrence && ` ${item.recurrence}`}
              </S.TitleText>
            </S.TitleContainer>

            <S.ValueContainer>
              <S.ValueText color={colors.primary}>
                {getCurrencyFormat(item.value)}
              </S.ValueText>
            </S.ValueContainer>
          </S.Main>

          <S.ActionContainer
            backgroundColor={itemColors().action_container.background}
            borderColor={colors.secondary}>
            {isSameMonth(new Date(), selectedDate) && (
              <>
                <S.SubtitleText color={itemColors().action_container.text}>
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

      {/*  <Modal
        transparent
        animationType="slide"
        texts={{
          successText: 'Excluido com sucesso!',
          errorText: 'Erro ao excluir',
          confirmationText: 'Tem certeza que deseja excluir?',
          loadingText: 'Excluindo...',
        }}
        requestConfirm={handleDelete}
        defaultConfirm={closeModal}
        onCancel={closeModal}
        visible={isDeleteModalVisible}
        type="Confirmation"
      /> */}
    </>
  );
}
