'use client';
import Link from 'next/link';
import styled from 'styled-components';
import DropdownComponent from '@/components/DropdownComponent';
import React, { Suspense } from 'react';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`

const Sidebar = styled.aside`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 200px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  padding: 16px;
  margin: 16px 0;
  font-size: 24px;  
`

const NavList = styled.ul`
  padding: 16px;
`

const NavItem = styled.li`
  font-size: 20px;
  margin: 16px 0;
`

const Main = styled.div`
  margin-left: 200px;
  height: 100%;
  width: calc(100vw - 200px);
`

const Header = styled.header`
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const Nav = styled.nav`
  padding: 16px;
  height: 100%;
`

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`

const Content = styled.div`
  height: calc(100vh - 60px);
`

const links = [
    {
        name: 'Journals',
        href: '/journal',
    },
    {
        name: 'History',
        href: '/history',
    }
]

const DashboardLayout = ({ children }: any) => {
    return (
        <Container>
            <Sidebar>
                <Logo>Mindscribe</Logo>
                <NavList>
                    {links.map((link) => (
                        <NavItem key={link.name}>
                            <Link href={link.href}>{link.name}</Link>
                        </NavItem>
                    ))}
                </NavList>
            </Sidebar>
            <Main>
                <Header>
                    <Nav>
                        <NavContent>
                            <DropdownComponent />
                        </NavContent>
                    </Nav>
                </Header>
                <Content>
                  <Suspense fallback={<div>Loading...</div>}>
                    {children}
                  </Suspense>
                </Content>
            </Main>
        </Container>
    )
};

export default DashboardLayout;