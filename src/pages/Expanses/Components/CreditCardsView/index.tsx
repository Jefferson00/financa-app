import React, { useCallback, useState } from 'react';
import Button from '../../../../components/Button';
import { useTheme } from '../../../../hooks/ThemeContext';
import { getExpansesColors } from '../../../../utils/colors/expanses';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as S from './styles';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../../../routes';
import CardContent from '../CardContent';
import { useAccount } from '../../../../hooks/AccountContext';
import { CreditCards } from '../../../../interfaces/CreditCards';
import ModalComponent from '../../../../components/Modal';
import api from '../../../../services/api';
import { useAuth } from '../../../../hooks/AuthContext';

export default function CreditCardsView() {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();
  const { creditCards, getUserCreditCards } = useAccount();
  const { user } = useAuth();
  const colors = getExpansesColors(theme);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (creditCardSelected) {
      setIsDeleteModalVisible(false);
      setLoadingMessage('Excluindo...');
      setIsSubmitting(true);
      try {
        await api.delete(`creditCards/${creditCardSelected.id}/${user?.id}`);
        await getUserCreditCards();
      } catch (error: any) {
        if (error?.response?.data?.message)
          setErrorMessage(error?.response?.data?.message);
        setHasError(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [creditCardSelected, user]);

  return (
    <>
      <S.Container
        contentContainerStyle={{
          paddingBottom: RFPercentage(26),
        }}>
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

        {creditCards.length > 0 &&
          creditCards.map(card => (
            <CardContent
              backgroundColor={card.color}
              key={card.id}
              creditCard={card}
              onDelete={() => handleOpenDeleteConfirm(card)}
            />
          ))}
      </S.Container>

      {creditCards.length === 0 && (
        <S.Empty>
          <Ionicons
            name="close-circle"
            size={RFPercentage(4)}
            color={colors.primaryColor}
          />
          <S.EmptyText color={colors.textColor}>
            Sem cartões cadastrados
          </S.EmptyText>
        </S.Empty>
      )}

      <ModalComponent
        type="loading"
        visible={isSubmitting}
        transparent
        title={loadingMessage}
        animationType="slide"
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
    </>
  );
}

{
  /* <S.ExpandableCard key={card.id} onPress={() => setOpen(o => !o)}>
            <S.CardView backgroundColor={card.color}>
              {open && (
                <S.HiddenContent
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                  layout={Layout}>
                  <View collapsable={false}>
                    <S.ItemView>
                      <S.DateTitle color="#fff">05 Nov</S.DateTitle>
                      <S.ItemCard></S.ItemCard>
                      <S.ItemCard></S.ItemCard>
                    </S.ItemView>
                    <S.ItemView>
                      <S.DateTitle color="#fff">06 Nov</S.DateTitle>
                      <S.ItemCard></S.ItemCard>
                      <S.ItemCard></S.ItemCard>
                      <S.ItemCard></S.ItemCard>
                    </S.ItemView>
                  </View>
                </S.HiddenContent>
              )}
            </S.CardView>
          </S.ExpandableCard> */
}
