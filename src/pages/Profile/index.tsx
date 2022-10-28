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
import { ReducedHeader } from '../../components/NewHeader/ReducedHeader';
import { colors } from '../../styles/colors';

interface ProfileProps {
  id: string;
}

export default function Profile({ id }: ProfileProps) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();

  const profileColors = () => {
    if (theme === 'dark') {
      return {
        text: {
          title: colors.blue[100],
          subtitle: colors.gray[200],
        },
        sign_out: colors.red.dark[500],
        alert: colors.red.dark[500],
        border: colors.gray[600],
        empty_avatar: colors.dark[700],
      };
    }
    return {
      text: {
        title: colors.gray[900],
        subtitle: colors.gray[600],
      },
      sign_out: colors.red[500],
      alert: colors.red[500],
      border: colors.blue[200],
      empty_avatar: colors.gray[600],
    };
  };

  return (
    <>
      <ReducedHeader title="" showAvatar={false} />
      <S.AvatarContainer>
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
                backgroundColor: profileColors().empty_avatar,
              }}
            />
          </SharedElement>
        )}
      </S.AvatarContainer>
      <ScrollView
        style={{ width: '100%', padding: RFPercentage(3.4) }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: RFPercentage(15),
          paddingTop: RFPercentage(4.4),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {(!user?.name || !user?.email) && (
          <S.Alert color={profileColors().alert}>Atualize seus dados</S.Alert>
        )}

        {user?.name && (
          <S.Title color={profileColors().text.title}>
            Olá, {user?.name}
          </S.Title>
        )}

        <S.Subtitle color={profileColors().text.subtitle}>
          {user?.email}
        </S.Subtitle>
        {user?.phone && (
          <S.Subtitle color={profileColors().text.subtitle}>
            {maskPhone(user.phone)}
          </S.Subtitle>
        )}

        <S.MainButtonContainer>
          <S.Button
            backgroundColor="transparent"
            color={profileColors().text.subtitle}
            border={profileColors().border}
            onPress={() => navigation.navigate('EditProfile')}>
            <Icon
              name="create"
              size={RFPercentage(3)}
              color={profileColors().text.title}
              style={{ position: 'absolute', left: 8 }}
            />
            <S.ButtonText color={profileColors().text.title}>
              Editar Perfil
            </S.ButtonText>
          </S.Button>

          <S.Button
            backgroundColor="transparent"
            color={profileColors().text.subtitle}
            border={profileColors().border}
            onPress={() => navigation.navigate('ThemeScreen')}>
            <Icon
              name="contrast"
              size={RFPercentage(3)}
              color={profileColors().text.title}
              style={{ position: 'absolute', left: 8 }}
            />
            <S.ButtonText color={profileColors().text.title}>Tema</S.ButtonText>
          </S.Button>

          <S.Button
            backgroundColor="transparent"
            border={profileColors().border}
            onPress={() => navigation.navigate('SecurityScreen')}>
            <Icon
              name="lock-closed"
              size={RFPercentage(3)}
              color={profileColors().text.title}
              style={{ position: 'absolute', left: 8 }}
            />
            <S.ButtonText color={profileColors().text.title}>
              Segurança
            </S.ButtonText>
          </S.Button>
        </S.MainButtonContainer>

        <S.LogoutContainer>
          <S.Button
            backgroundColor={profileColors().sign_out}
            onPress={() => signOut()}>
            <Icon
              name="log-out"
              size={RFPercentage(3)}
              color="#fff"
              style={{ position: 'absolute', left: 8 }}
            />
            <S.ButtonText color="#fff">Sair</S.ButtonText>
          </S.Button>
        </S.LogoutContainer>
      </ScrollView>
      {/*    <S.Container backgroundColor={colors.backgroundColor}>
        
      </S.Container> */}

      <Menu />
    </>
  );
}
