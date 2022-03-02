import styled from 'styled-components/native';
import { RFPercentage } from "react-native-responsive-fontsize";

interface ColorsProps {
  background?: string;
}

export const Container = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})<ColorsProps>`
  position: relative;
  width: 100%;
  background-color: ${(props) => props.background ?  props.background : '#fff'};
`;

export const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const Header = styled.View<ColorsProps>`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${RFPercentage(45)}px;
  padding: ${RFPercentage(7)}px ${RFPercentage(6)}px;
  background-color: ${(props) => props.background ?  props.background : '#fff'};
`;

export const Logo = styled.Image``;

export const MainContainer = styled.View<ColorsProps>`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  height: ${RFPercentage(60)}px;
  padding: 0 ${RFPercentage(2)}px ${RFPercentage(4)}px;
  margin: 0 auto;
  position: absolute;
  elevation: 10;
  top: 40%;
  background-color: ${(props) => props.background ?  props.background : '#fff'};
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${RFPercentage(4)}px 0;
`;

export const Title = styled.Text`
  font-size: ${RFPercentage(2.2)}px;
  font-family: 'Poppins-SemiBold';
`;

export const Form = styled.View`
  flex: 1;
  justify-content: flex-start;
`;
