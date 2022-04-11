import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/AuthContext';
import Menu from '../../components/Menu';
import { Colors } from '../../styles/global';
import * as S from './styles';
import { useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Ionicons';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Header from '../../components/Header';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';
import { phoneMask } from '../../utils/masks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../../services/api';

interface ProfileProps {
  id: string;
}

export default function EditProfile({ id }: ProfileProps) {
  const { user, updateUser } = useAuth();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });
  const routes = useRoute();
  const backgroundColor = '#fff';

  const titleColor = Colors.BLUE_PRIMARY_LIGHTER;
  const textColor = Colors.MAIN_TEXT_LIGHTER;
  const inputBackground = Colors.BLUE_SOFT_LIGHTER;

  const SaveIcon = () => {
    return <Icons name="chevron-forward-outline" size={24} color="#fff" />;
  };

  type FormData = {
    name: string;
    email: string;
    phone?: string;
  };

  const saveButtonColors = {
    PRIMARY_BACKGROUND: Colors.BLUE_PRIMARY_LIGHTER,
    SECOND_BACKGROUND: Colors.BLUE_SECONDARY_LIGHTER,
    TEXT: '#fff',
  };

  const handleUpdateProfile = async (data: FormData) => {
    try {
      const userUpdated = await api.put(`users/${user?.id}`, {
        ...data,
        phone: data.phone ? `+55 ${data.phone}` : null,
      });
      updateUser(userUpdated.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header reduced showMonthSelector={false} />
      <S.Container backgroundColor={backgroundColor}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center' }}>
          <S.Title color={titleColor}>Editar Perfil</S.Title>
          {user?.avatar ? (
            <S.Avatar
              source={{ uri: user.avatar }}
              resizeMode="cover"
              style={{ borderRadius: 60, width: 120, height: 120 }}
            />
          ) : (
            <S.EmptyAvatar />
          )}
          <S.Label color={textColor}>Nome</S.Label>
          <ControlledInput
            background={inputBackground}
            textColor={textColor}
            returnKeyType="next"
            autoCapitalize="words"
            name="name"
            control={control}
            value={user?.name ? user.name : ''}
          />

          <S.Label color={textColor} style={{ marginTop: 16 }}>
            Email
          </S.Label>
          <ControlledInput
            background={inputBackground}
            textColor={textColor}
            returnKeyType="next"
            keyboardType="email-address"
            name="email"
            control={control}
            value={user?.email ? user.email : ''}
          />

          <S.Label color={textColor} style={{ marginTop: 16 }}>
            Celular
          </S.Label>
          <ControlledInput
            background={inputBackground}
            textColor={textColor}
            name="phone"
            placeholder="(99) 9 9999-9999"
            keyboardType="phone-pad"
            returnKeyType="send"
            mask={phoneMask}
            control={control}
            value={user?.phone ? user.phone : ''}
          />

          <Button
            title="Salvar"
            colors={saveButtonColors}
            icon={SaveIcon}
            style={{ marginTop: 32 }}
            onPress={handleSubmit(handleUpdateProfile)}
          />
        </KeyboardAwareScrollView>
      </S.Container>
      <Menu />
    </>
  );
}
