import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    transition: all 0.3s linear;
  }
`;

const lightTheme = {
  body: '#FFF',
  text: '#000',
  toggleBorder: '#FFF',
  background: '#363537',
};

const darkTheme = {
  body: '#000',
  text: '#FFF',
  color:"white",
  toggleBorder: '#6B8096',
  background: '#999',

};

const ToggleContainer = styled.button`
  background: ${({ theme }) => theme.toggleBorder};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.5rem;
  justify-content: space-between;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.5rem;
  position: relative;
  height: 2rem;
  outline: none;

  &:focus {
    outline: none;
  }
`;

const ToggleCircle = styled.div`
  background: ${({ theme }) => theme.text};
  border-radius: 50%;
  height: 10px;
  width: 10px;
  position: absolute;
  top: 0.5rem;
  left: ${({ lightTheme }) => (lightTheme ? '0.5rem' : '4rem')};
  transition: all 0.3s linear;
`;

const ToggleText = styled.span`
  font-family:poppins;
  padding:0 14px;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState('light');

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <ToggleContainer onClick={themeToggler}>
        <ToggleCircle lightTheme={theme === 'light'} />
        <ToggleText>{theme === 'light' ? 'Light' : 'Dark'}</ToggleText>
      </ToggleContainer>
    </ThemeProvider>
  );
};

export default ThemeToggleButton;
