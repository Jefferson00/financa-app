import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface ContainerProps {
  backgroundColor: string,
}

interface MonthProps {
  color: string,
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 74px 16px;
`
export const Avatar = styled.Image`
  height: 50px;
  width: 50px;
  border-radius: 25px;
`
export const EmptyAvatar = styled.View`
  height: 50px;
  width: 50px;
  background-color: #d2d2d2;
  border-radius: 25px;
`
export const MonthSelector = styled.View`
  flex-direction: row;
  align-items: center;
`

export const PrevButton = styled.Pressable`

`
export const NextButton = styled.Pressable`

`
export const Month = styled.Text<MonthProps>`
  color: ${(props) => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(3.2)}px;
  margin: 0 ${RFPercentage(1)}px;;
`