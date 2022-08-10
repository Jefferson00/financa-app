import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icons from 'react-native-vector-icons/Feather';
import ControlledInput from '../../components/ControlledInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

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
import CameraModal from '../../components/CameraModal';

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
  const [cameraModal, setCameraModal] = useState(false);
  const [avatarToUpload, setAvatarToUpload] = useState('');
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
    let avatarUrl = null;
    if (avatarToUpload) {
      avatarUrl = await uploadImage(avatarToUpload);
    }
    const userInput = {
      email: data.email ? data.email : null,
      name: data.name ? data.name : null,
      phone: data.phone ? `+55${data.phone}` : null,
      avatar: avatarUrl ? avatarUrl : user?.avatar,
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

  const handleCancelCamera = () => {
    setCameraModal(false);
  };

  const uploadImage = async (path: string) => {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const reference = storage()
      .refFromURL('gs://financa-ffd88.appspot.com')
      .child(`users/${user?.id}/${filename}`);
    await reference.putFile(path);
    const url = await reference.getDownloadURL();
    return url;
  };

  const handleSelectImage = (from: 'camera' | 'gallery') => {
    if (from === 'gallery') {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxHeight: 625,
          maxWidth: 625,
        },
        response => {
          if (response.didCancel) {
            setCameraModal(false);
            return;
          }
          if (response.errorCode) {
            return;
          }

          if (
            response.assets &&
            response.assets.length > 0 &&
            response.assets[0].uri
          ) {
            const imageUri = response.assets[0].uri;
            setAvatarToUpload(imageUri);
            setCameraModal(false);
          }
        },
      );
    }

    if (from === 'camera') {
      launchCamera(
        {
          mediaType: 'photo',
          maxHeight: 625,
          maxWidth: 625,
        },
        response => {
          if (response.didCancel) {
            setCameraModal(false);
            return;
          }
          if (response.errorCode) {
            return;
          }

          if (
            response.assets &&
            response.assets.length > 0 &&
            response.assets[0].uri
          ) {
            const imageUri = response.assets[0].uri;
            setAvatarToUpload(imageUri);
            setCameraModal(false);
          }
        },
      );
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

          <S.AvatarContainer>
            {user?.avatar ? (
              <S.Avatar
                source={{ uri: avatarToUpload ? avatarToUpload : user.avatar }}
                resizeMode="cover"
                style={{
                  borderRadius: RFPercentage(8),
                  width: RFPercentage(16),
                  height: RFPercentage(16),
                }}
              />
            ) : avatarToUpload ? (
              <S.Avatar
                source={{ uri: avatarToUpload }}
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
            <S.UpdateAvatarButton onPress={() => setCameraModal(true)}>
              <Icons name="camera" size={20} color="#FFFFFF" />
            </S.UpdateAvatarButton>
          </S.AvatarContainer>

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
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
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
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
        />
        <ModalComponent
          type="success"
          visible={editSucessfully}
          transparent
          title="Perfil atualizado com sucesso!"
          animationType="slide"
          handleCancel={() => setEditSucessfully(false)}
          onSucessOkButton={() => setEditSucessfully(false)}
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
        />

        <CameraModal
          onCameraModalCancel={handleCancelCamera}
          onSelectGallery={() => handleSelectImage('gallery')}
          onSelectCamera={() => handleSelectImage('camera')}
          visible={cameraModal}
          transparent
          animationType="slide"
        />
      </S.Container>
      <Menu />
    </>
  );
}
