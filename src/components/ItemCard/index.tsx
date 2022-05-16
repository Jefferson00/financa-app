import React from 'react';
import { Animated, Switch, View } from 'react-native';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as S from './styles';
import { RectButton } from 'react-native-gesture-handler';

interface ItemCardProps {
  icon: React.FC;
  title?: string;
  mainColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  actionBarColor?: string;
  switchValue?: boolean;
  received?: boolean;
  receivedMessage?: string;
  onSwitchChange?: () => void;
  value: number;
  handleRemove: () => void;
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
  onSwitchChange,
  handleRemove,
  ...rest
}: ItemCardProps) {
  return (
    <Swipeable
      renderRightActions={() => (
        <Animated.View>
          <View>
            <S.DeleteButton onPress={handleRemove}>
              <FeatherIcons name="trash" size={32} color="#fff" />
            </S.DeleteButton>
          </View>
        </Animated.View>
      )}>
      <S.Container backgroundColor={backgroundColor || '#fff'}>
        <S.Main>
          <S.TitleContainer>
            <Icon />
            <S.TitleText color={textColor ? textColor : '#000'}>
              {title}
            </S.TitleText>
          </S.TitleContainer>

          <S.ValueContainer>
            <S.ValueText color={mainColor ? mainColor : '#000'}>
              {getCurrencyFormat(value)}
            </S.ValueText>
          </S.ValueContainer>
        </S.Main>

        <S.ActionContainer backgroundColor="#FF981E">
          <S.SubtitleText color={textColor ? textColor : '#000'}>
            {received ? receivedMessage : 'Receber'}
          </S.SubtitleText>

          <Switch
            trackColor={{ true: textColor, false: textColor }}
            thumbColor={textColor}
            value={received}
            onChange={onSwitchChange}
          />
        </S.ActionContainer>
      </S.Container>
    </Swipeable>
  );
}
