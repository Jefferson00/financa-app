import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useTheme } from '../../../hooks/ThemeContext';
import { accountCardColors } from '../styles';

export function Loader() {
  const { theme } = useTheme();
  const colors = accountCardColors(theme);

  return (
    <ContentLoader
      viewBox={`0 0 223 150`}
      height={150}
      width={223}
      backgroundColor={colors.loading.background}
      foregroundColor={colors.loading.foreground}>
      <Rect x="0" y="0" rx="8" ry="8" width="223" height="150" />
    </ContentLoader>
  );
}
