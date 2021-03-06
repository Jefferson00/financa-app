import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icons from 'react-native-vector-icons/Feather';
import ControlledInput from '../../components/ControlledInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';

import Menu from '../../components/Menu';
import ModalComponent from '../../components/Modal';
import Button from '../../components/Button';
import Header from '../../components/Header';

import * as S from './styles';
import api from '../../services/api';
import { phoneMask } from '../../utils/masks';
import { getEditProfileColors } from '../../utils/colors/profile';

interface ProfileProps {
  id: string;
}

const schema = yup.object({
  name: yup
    .string()
    .required('Campo obrigátorio')
    .min(2, 'deve ter no mínimo 2 caracteres')
    .max(25, 'deve ter no máximo 25 caracteres'),
  email: yup.string().required('Campo obrigátorio').email('E-mail inválido'),
  phone: yup.string().required('Campo obrigátorio'),
});

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
    resolver: yupResolver(schema),
  });

  const colors = getEditProfileColors(theme);

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
      console.log(error);
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
          <S.Title color={colors.titleColor}>Editar Perfil</S.Title>
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

          <ControlledInput
            label="Nome"
            background={colors.inputBackground}
            textColor={colors.textColor}
            returnKeyType="next"
            autoCapitalize="words"
            name="name"
            control={control}
            value={user?.name ? user.name : ''}
          />

          <ControlledInput
            label="Email"
            background={colors.inputBackground}
            textColor={colors.textColor}
            returnKeyType="next"
            keyboardType="email-address"
            name="email"
            control={control}
            value={user?.email ? user.email : ''}
          />

          <ControlledInput
            label="Celular"
            background={colors.inputBackground}
            textColor={colors.textColor}
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
            colors={colors.saveButtonColors}
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
          onSucessOkButton={() => setEditSucessfully(false)}
        />
      </S.Container>
      <Menu />
    </>
  );
}
