import React, { useState } from "react";
import styled from "styled-components";

export const Block = styled.div`
  position: relative;
  align-items: center;
  border: solid 1px black;
  cursor: pointer;
  display: flex;
  height: 70px;
  justify-content: center;
  width: 70px;
  background-color: black;

  &:hover {
    &::before {
      background-color: lightblue;
    }
  }

  &::before {
    content: "";
    background-color: ${({ clicked }) => (clicked ? "lightgray" : "white")};
    border-radius: 50%;
    height: 60px;
    width: 60px;
  }

  &::after {
    content: "";
    position: absolute;
    background-color: transparent;
    border-radius: 50%;
    height: 60px;
    width: 60px;
    pointer-events: none;
  }

  &.player-1::after {
    background-color: red;
  }

  &.player-2::after {
    background-color: yellow;
  }
`;

export const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  ${({ marking }) => marking && "background-color: lightgray;"}
  border: solid 1px black;
  margin-bottom: 30px;

  & > div > div {
    ${({ marking }) => marking && "background-color: lightgray;"}
  }
`;

export const Row = styled.div`
  display: flex;
`;
