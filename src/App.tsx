import React from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import { resources } from 'i18n/config';
import { Flex } from '@atlaskit/primitives';
import Button from '@atlaskit/button/new';
import Router from './Router';
import { Toaster } from 'react-hot-toast';

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    if (lang === i18n.language) return;

    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <>
      <Flex gap="space.050" justifyContent="end">
        {Object.keys(resources).map((lang) => (
          <Button
            appearance="subtle"
            key={lang}
            isSelected={lang === i18n.language}
            onClick={() => changeLanguage(lang)}
          >
            {lang}
          </Button>
        ))}
      </Flex>

      <Toaster />

      <Router />
    </>
  );
}

export default App;
