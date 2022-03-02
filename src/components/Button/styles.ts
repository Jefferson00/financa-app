import styled from 'styled-components/native';

interface MainContainer {
  backgroundColor: string,
  borderColor?: string;
}

interface IconContainer {
  backgroundColor: string,
}

interface TextColor {
  color: string,
}

export const Container = styled.Pressable`
  height: 56px;
  width: 100%;
  flex-direction: row;
`
export const Main = styled.View<MainContainer>`
  flex:1;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`
export const MainText = styled.Text<TextColor>`
  color:${(props) => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: 16px;
`
export const Icon = styled.View<IconContainer>`
  width: 56px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`