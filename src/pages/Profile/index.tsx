import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';

import Menu from '../../components/Menu';

import * as S from './styles';
import { Nav } from '../../routes';
import { maskPhone } from '../../utils/masks';
import { getProfileColors } from '../../utils/colors/profile';

interface ProfileProps {
  id: string;
}

export default function Profile({ id }: ProfileProps) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();

  const colors = getProfileColors(theme);

  return (
    <S.Container backgroundColor={colors.backgroundColor}>
      <ScrollView
        style={{ width: '100%', padding: 24 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {user?.avatar ? (
          <SharedElement id="avatar">
            <S.Avatar
              source={{ uri: user.avatar }}
              resizeMode="cover"
              style={{
                borderRadius: RFPercentage(8),
                width: RFPercentage(16),
                height: RFPercentage(16),
              }}
            />
          </SharedElement>
        ) : (
          <SharedElement id="avatar">
            <S.EmptyAvatar
              style={{
                borderRadius: RFPercentage(8),
                width: RFPercentage(16),
                height: RFPercentage(16),
                backgroundColor: '#d2d2d2',
              }}
            />
          </SharedElement>
        )}

        {(!user?.name || !user?.email) && (
          <S.Alert color={colors.alertColor}>Atualize seus dados</S.Alert>
        )}

        {user?.name && (
          <S.Title color={colors.textColor}>Olá, {user?.name}</S.Title>
        )}

        <S.Subtitle color={colors.textColor}>{user?.email}</S.Subtitle>
        {user?.phone && (
          <S.Subtitle color={colors.textColor}>
            {maskPhone(user.phone)}
          </S.Subtitle>
        )}

        <S.MainButtonContainer>
          <S.Button
            backgroundColor={colors.btnBackgroundColor}
            color={colors.btnColor}
            onPress={() => navigation.navigate('EditProfile')}>
            <Icon
              name="create"
              size={RFPercentage(5)}
              color={colors.btnIconColor}
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color={colors.btnColor}>Editar Perfil</S.ButtonText>
          </S.Button>

          <S.Button
            backgroundColor={colors.btnBackgroundColor}
            color={colors.btnColor}
            onPress={() => navigation.navigate('ThemeScreen')}>
            <Icon
              name="contrast"
              size={RFPercentage(5)}
              color={colors.btnIconColor}
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color={colors.btnColor}>Tema</S.ButtonText>
          </S.Button>

          <S.Button
            backgroundColor={colors.btnBackgroundColor}
            onPress={() => navigation.navigate('SecurityScreen')}>
            <Icon
              name="lock-closed"
              size={RFPercentage(5)}
              color={colors.btnIconColor}
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color={colors.btnColor}>Segurança</S.ButtonText>
          </S.Button>
        </S.MainButtonContainer>

        <S.LogoutContainer>
          <S.Button
            backgroundColor={colors.signOutBtnColor}
            onPress={() => signOut()}>
            <Icon
              name="log-out"
              size={RFPercentage(5)}
              color="#fff"
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color="#fff">Sair</S.ButtonText>
          </S.Button>
        </S.LogoutContainer>
      </ScrollView>
      <Menu />
    </S.Container>
  );
}
