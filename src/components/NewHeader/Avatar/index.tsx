import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../../routes';
import { useAuth } from '../../../hooks/AuthContext';
import { SharedElement } from 'react-navigation-shared-element';
import { RFPercentage } from 'react-native-responsive-fontsize';

import * as S from './styles';

export function Avatar() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  const avatarStyle = {
    borderRadius: RFPercentage(4),
    width: RFPercentage(8),
    height: RFPercentage(8),
    backgroundColor: '#d2d2d2',
  };

  return (
    <Pressable onPress={() => navigation.navigate('Profile', { id: 'avatar' })}>
      {user?.avatar ? (
        <SharedElement id="avatar">
          <S.Avatar
            source={{ uri: user.avatar }}
            style={avatarStyle}
            resizeMode="cover"
          />
        </SharedElement>
      ) : (
        <SharedElement id="avatar">
          <S.EmptyAvatar style={avatarStyle} />
        </SharedElement>
      )}
    </Pressable>
  );
}
