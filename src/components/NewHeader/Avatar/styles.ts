import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const Avatar = styled.Image`
  height: ${RFPercentage(6.5)}px;
  width: ${RFPercentage(6.5)}px;
`;

export const EmptyAvatar = styled.View`
  background-color: #d2d2d2;
`;
