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

interface ProfileProps {
  id: string;
}

export default function Profile({ id }: ProfileProps) {
  const { user } = useAuth();
  const routes = useRoute();
  const navigation = useNavigation<Nav>();
  const backgroundColor = Colors.BLUE_PRIMARY_LIGHTER;
  const btnBackgroundColor = '#fff';
  const btnColor = '#09192D';
  const btnIconColor = Colors.BLUE_PRIMARY_LIGHTER;
  const textColor = '#fff';

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
        <S.EmptyAvatar />
      )}

      <S.Title color={textColor}>Olá, {user?.name}</S.Title>
      <S.Subtitle color={textColor}>{user?.email}</S.Subtitle>

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

          <S.Button backgroundColor={btnBackgroundColor} color={btnColor}>
            <Icon
              name="contrast"
              size={30}
              color={btnIconColor}
              style={{ position: 'absolute', left: 18 }}
            />
            <S.ButtonText color={btnColor}>Tema</S.ButtonText>
          </S.Button>

          <S.Button backgroundColor={btnBackgroundColor}>
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
          <S.Button backgroundColor="#CC3728">
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
