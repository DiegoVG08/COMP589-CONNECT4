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
  
  & > div {
    border-radius: 50%;
    height: 60px;
    width: 60px;
  }
  
  &.player-1 > div {
    background-color: red;
  }
  
  &.player-2 > div {
    background-color: yellow;
  }
  
  &:hover {
    background-color: lightblue;
  }
`;


export const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
