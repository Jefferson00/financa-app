import React from 'react';
import { useAuth } from '../../hooks/AuthContext';
import Menu from '../../components/Menu';
import { Colors } from '../../styles/global';
import * as S from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nav } from '../../routes';
import { maskPhone } from '../../utils/masks';
import { useTheme } from '../../hooks/ThemeContext';

interface ProfileProps {
  id: string;
}

export default function Profile({ id }: ProfileProps) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const backgroundColor =
    theme === 'dark' ? Colors.BACKGROUND_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const btnBackgroundColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : '#fff';
  const btnColor = theme === 'dark' ? '#c5c5c5' : '#09192D';
  const btnIconColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor = theme === 'dark' ? '#c5c5c5' : '#fff';
  const signOutBtnColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const alertColor = '#ffaea7';

  return (
    <S.Container backgroundColor={backgroundColor}>
      {user?.avatar ? (
        <SharedElement id="teste">
          <S.Avatar
            source={{ uri: user.avatar }}
            resizeMode="cover"
            style={{ borderRadius: 60, width: 120, height: 120 }}
          />
        </SharedElement>
      ) : (
        <SharedElement id="teste">
          <S.EmptyAvatar
            style={{
              borderRadius: 60,
              width: 120,
              height: 120,
              backgroundColor: '#d2d2d2',
            }}
          />
        </SharedElement>
      )}

      {(!user?.name || !user?.email) && (
        <S.Alert color={alertColor}>Atualize seus dados</S.Alert>
      )}

      {user?.name && <S.Title color={textColor}>Olá, {user?.name}</S.Title>}

      <S.Subtitle color={textColor}>{user?.email}</S.Subtitle>
      {user?.phone && (
        <S.Subtitle color={textColor}>{maskPhone(user.phone)}</S.Subtitle>
      )}

      <ScrollView
        style={{ width: '100%', padding: 24 }}
        contentContainerStyle={{
          flex: 1,
          paddingBottom: 96,
        }}>
        <S.MainButtonContainer>
          <S.Button
            backgroundColor={btnBackgroundColor}
            color={btnColor}
            onPress={() => navigation.navigate('EditProfile')}>
            <Icon
              name="create"
              size={30}
              color={btnIconColor}
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color={btnColor}>Editar Perfil</S.ButtonText>
          </S.Button>

          <S.Button
            backgroundColor={btnBackgroundColor}
            color={btnColor}
            onPress={() => navigation.navigate('ThemeScreen')}>
            <Icon
              name="contrast"
              size={30}
              color={btnIconColor}
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color={btnColor}>Tema</S.ButtonText>
          </S.Button>

          <S.Button
            backgroundColor={btnBackgroundColor}
            onPress={() => navigation.navigate('SecurityScreen')}>
            <Icon
              name="lock-closed"
              size={30}
              color={btnIconColor}
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color={btnColor}>Segurança</S.ButtonText>
          </S.Button>
        </S.MainButtonContainer>

        <S.LogoutContainer>
          <S.Button backgroundColor={signOutBtnColor} onPress={() => signOut()}>
            <Icon
              name="log-out"
              size={30}
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
