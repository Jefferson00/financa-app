import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import * as S from './styles';
import Header from '../../components/Header';

export default function Home() {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const controller = new AbortController();

  const getApiUsersExample = useCallback(async () => {
    try {
      const { data } = await api.get('users');
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getApiUsersExample();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <S.Container>
      <Header />

      <TouchableOpacity onPress={() => signOut()}>
        <Text>SAIR</Text>
      </TouchableOpacity>
    </S.Container>
  );
}
