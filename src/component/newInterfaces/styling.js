import React from 'react';
import styled, { css } from 'styled-components';


export const Block = styled.div`
  align-items: center;
  border: solid 1px black;
  cursor: pointer;
  display: flex;
  height: 70px;
  justify-content: center;
  width: 70px;

  &:hover {
    background-color: lightblue;
  }
`;

export const Container = styled.div`
  ${({ marking }) => marking && 'background-color: lightgray;'}
  border: solid 1px black;
  margin-bottom: 30px;

  & > div > div {
    ${({ marking }) => marking && 'background-color: lightgray;'}
  }
`;

export const Row = styled.div`
  display: flex;
`;
