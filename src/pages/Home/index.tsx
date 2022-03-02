import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import * as S from './styles';

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
      <Text
        style={{
          color: '#000',
        }}>
        {user?.name}
      </Text>
      {users.map(uss => (
        <Text
          key={uss.id}
          style={{
            color: '#000',
          }}>
          {uss?.name}
        </Text>
      ))}

      <TouchableOpacity onPress={() => signOut()}>
        <Text>SAIR</Text>
      </TouchableOpacity>
    </S.Container>
  );
}
