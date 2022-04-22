import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/AuthContext';
import Menu from '../../components/Menu';
import { Colors } from '../../styles/global';
import * as S from './styles';
import { useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Feather';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Header from '../../components/Header';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';
import { phoneMask } from '../../utils/masks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../../services/api';
import ModalComponent from '../../components/Modal';
import { useTheme } from '../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface ProfileProps {
  id: string;
}

export default function EditProfile({ id }: ProfileProps) {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const titleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const inputBackground =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;

  const SaveIcon = () => {
    return (
      <Icons
        name="save"
        size={24}
        color={theme === 'dark' ? '#d8d8d8' : '#fff'}
      />
    );
  };

  type FormData = {
    name: string;
    email: string;
    phone?: string;
  };

  const saveButtonColors = {
    PRIMARY_BACKGROUND:
      theme === 'dark'
        ? Colors.BLUE_PRIMARY_DARKER
        : Colors.BLUE_PRIMARY_LIGHTER,
    SECOND_BACKGROUND:
      theme === 'dark'
        ? Colors.BLUE_SECONDARY_DARKER
        : Colors.BLUE_SECONDARY_LIGHTER,
    TEXT: theme === 'dark' ? '#d8d8d8' : '#fff',
  };

  const handleUpdateProfile = async (data: FormData) => {
    setIsSubmitting(true);
    const userInput = {
      email: data.email ? data.email : null,
      name: data.name ? data.name : null,
      phone: data.phone ? `+55${data.phone}` : null,
    };
    try {
      const userUpdated = await api.put(`users/${user?.id}`, userInput);
      updateUser({
        ...userUpdated.data,
        phone: userUpdated.data.phone.replace('+55', ''),
      });
      setEditSucessfully(true);
    } catch (error: any) {
      if (error?.response?.data?.message)
        setErrorMessage(error?.response?.data?.message);
      console.log(error?.response?.data);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header reduced showMonthSelector={false} />
      <S.Container>
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
              style={{
                borderRadius: RFPercentage(8),
                width: RFPercentage(16),
                height: RFPercentage(16),
              }}
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
        <ModalComponent
          type="loading"
          visible={isSubmitting}
          transparent
          title="Atualizando..."
          animationType="slide"
        />
        <ModalComponent
          type="error"
          visible={hasError}
          handleCancel={() => setHasError(false)}
          onRequestClose={() => setHasError(false)}
          transparent
          title={errorMessage}
          subtitle="Tente novamente mais tarde"
          animationType="slide"
        />
        <ModalComponent
          type="success"
          visible={editSucessfully}
          transparent
          title="Perfil atualizado com sucesso!"
          animationType="slide"
          handleCancel={() => setEditSucessfully(false)}
        />
      </S.Container>
      <Menu />
    </>
  );
}
