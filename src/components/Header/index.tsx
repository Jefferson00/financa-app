import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Colors } from '../../styles/global';
import Icons from 'react-native-vector-icons/Ionicons';
import * as S from './styles';
import { getMounthAndYear } from '../../utils/dateFormats';

export default function Header() {
  const { user } = useAuth();
  const backgroundColor = Colors.BLUE_PRIMARY_LIGHTER;

  const [selectorColor, setSelectorColor] = useState(
    Colors.ORANGE_PRIMARY_LIGHTER,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleChangeMonth = useCallback(
    (order: 'PREV' | 'NEXT') => {
      const currentMonth = selectedDate.getMonth();
      setSelectedDate(
        new Date(
          selectedDate.setMonth(
            order === 'NEXT' ? currentMonth + 1 : currentMonth - 1,
          ),
        ),
      );
    },
    [selectedDate],
  );

  useEffect(() => {
    if (
      selectedDate.getMonth() + 1 === new Date().getMonth() + 1 &&
      selectedDate.getFullYear() === new Date().getFullYear()
    ) {
      setSelectorColor(Colors.ORANGE_PRIMARY_LIGHTER);
    } else {
      setSelectorColor('#fff');
    }
  }, [selectedDate]);

  return (
    <S.Container backgroundColor={backgroundColor}>
      <S.MonthSelector>
        <S.PrevButton onPress={() => handleChangeMonth('PREV')}>
          <Icons name="chevron-back" size={32} color={selectorColor} />
        </S.PrevButton>
        <S.Month color={selectorColor}>
          {getMounthAndYear(selectedDate)}
        </S.Month>
        <S.NextButton onPress={() => handleChangeMonth('NEXT')}>
          <Icons name="chevron-forward" size={32} color={selectorColor} />
        </S.NextButton>
      </S.MonthSelector>
      {user?.avatar ? (
        <S.Avatar source={{ uri: user.avatar }} />
      ) : (
        <S.EmptyAvatar />
      )}
    </S.Container>
  );
}
