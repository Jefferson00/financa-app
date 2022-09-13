import React from 'react';
import { ModalBaseProps, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../styles/global';
import { useTheme } from '../../hooks/ThemeContext';

import {
  Container,
  ModalContent,
  ButtonsContainer,
  ButtonCancel,
  Button,
  TextButton,
  Title,
  ContainerContent,
} from './styles';

interface ModalProps extends ModalBaseProps {
  onCameraModalCancel: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
}

const CameraModal: React.FC<ModalProps> = ({
  onCameraModalCancel,
  onSelectGallery,
  onSelectCamera,
  ...rest
}) => {
  const { theme } = useTheme();
  const buttonColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const titleColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const backgroundColor =
    theme === 'dark' ? Colors.BACKGROUND_DARKER : Colors.BACKGROUND_LIGTHER;
  const buttonBackground =
    theme === 'dark' ? Colors.CARD_BACKGROUND_DARKER : '#f1f1f1';

  return (
    <Container>
      <Modal {...rest}>
        <ContainerContent>
          <ModalContent backgroundColor={backgroundColor}>
            <Title color={titleColor}> Escolha uma opção </Title>
            <ButtonsContainer>
              <Button
                onPress={onSelectCamera}
                backgroundColor={buttonBackground}>
                <Icon name="camera" size={65} color={buttonColor} />
                <TextButton type="ok" color={buttonColor}>
                  Camera
                </TextButton>
              </Button>
              <Button
                onPress={onSelectGallery}
                backgroundColor={buttonBackground}>
                <Icon name="folder-open" size={65} color={buttonColor} />
                <TextButton type="ok" color={buttonColor}>
                  Galeria
                </TextButton>
              </Button>
            </ButtonsContainer>

            <ButtonCancel onPress={onCameraModalCancel}>
              <TextButton type="cancel">Cancelar</TextButton>
            </ButtonCancel>
          </ModalContent>
        </ContainerContent>
      </Modal>
    </Container>
  );
};

export default CameraModal;
