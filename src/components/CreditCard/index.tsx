import React, { useCallback, useState } from 'react';
import Button from '../../components/Button';
import { useTheme } from '../../hooks/ThemeContext';
import { getExpansesColors } from '../../utils/colors/expanses';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as S from './styles';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../routes';
import CardContent from './CardContent';
import { CreditCards } from '../../interfaces/CreditCards';
import ModalComponent from '../../components/Modal';
import { useAuth } from '../../hooks/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../interfaces/State';
import { deleteCreditCard } from '../../store/modules/CreditCards/fetchActions';

export function CreditCard() {
  const dispatch = useDispatch<any>();
  const { creditCards, loading } = useSelector(
    (state: State) => state.creditCards,
  );

  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();

  const { user } = useAuth();
  const colors = getExpansesColors(theme);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Excluindo...');
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );
  const [creditCardSelected, setCreditCardSelected] =
    useState<CreditCards | null>(null);

  const PlusIcon = () => {
    return <Ionicons name="add" size={RFPercentage(6)} color="#fff" />;
  };

  const handleOpenDeleteConfirm = useCallback((card: CreditCards) => {
    setIsDeleteModalVisible(true);
    setCreditCardSelected(card);
  }, []);

  const handleRemoveCreditCard = useCallback(async () => {
    if (user && creditCardSelected) {
      setIsDeleteModalVisible(false);
      setLoadingMessage('Excluindo...');
      try {
        dispatch(deleteCreditCard(creditCardSelected.id, user.id));

        setCreditCardSelected(null);
      } catch (error: any) {
        if (error?.response?.data?.message)
          setErrorMessage(error?.response?.data?.message);
        setHasError(true);
      }
    }
  }, [creditCardSelected, user]);

  return (
    <>
      {creditCards.length > 0 ? (
        <S.Container>
          {creditCards.map(card => (
            <CardContent
              backgroundColor={card.color}
              key={card.id}
              creditCard={card}
              onDelete={() => handleOpenDeleteConfirm(card)}
            />
          ))}

          <S.ButtonContainer>
            <Button
              title="Novo Cartão"
              icon={PlusIcon}
              colors={colors.creditCardButtonColors}
              onPress={() =>
                navigation.navigate('CreateCreditCard', {
                  card: null,
                })
              }
            />
          </S.ButtonContainer>
        </S.Container>
      ) : (
        <S.EmptyContainer>
          <Button
            title="Novo Cartão"
            icon={PlusIcon}
            colors={colors.creditCardButtonColors}
            onPress={() =>
              navigation.navigate('CreateCreditCard', {
                card: null,
              })
            }
          />

          <S.Empty>
            <S.EmptyContent>
              <Ionicons
                name="close-circle"
                size={RFPercentage(4)}
                color={colors.primaryColor}
              />
              <S.EmptyText color={colors.textColor}>
                Sem cartões cadastrados
              </S.EmptyText>
            </S.EmptyContent>
          </S.Empty>
        </S.EmptyContainer>
      )}

      {/*  <ModalComponent
        type="loading"
        visible={loading}
        transparent
        title={loadingMessage}
        animationType="slide"
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
        theme={theme}
      />

      <ModalComponent
        type="confirmation"
        visible={isDeleteModalVisible}
        handleCancel={() => setIsDeleteModalVisible(false)}
        onRequestClose={() => setIsDeleteModalVisible(false)}
        transparent
        title="Tem certeza que deseja excluir essa despesa em definitivo?"
        animationType="slide"
        handleConfirm={() => handleRemoveCreditCard()}
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
      /> */}
    </>
  );
}
