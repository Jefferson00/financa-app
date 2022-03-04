import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerProps {
  isLoading: boolean,
}

export const Container = styled.View<ContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.5);

  color: #fff;

  display: ${(props) => props.isLoading ? 'flex' : 'none'};
`