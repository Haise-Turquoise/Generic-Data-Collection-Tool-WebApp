import * as React from 'react';
//@ts-ignore
import styled, { createGlobalStyle } from 'styled-components';

const PageContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  max-width: 80vw;
  max-height: 80vh;
`;

export const Page = ({ children }:{children:any}) => <PageContent>{children}</PageContent>;
