'use client';
import Link from 'next/link';
import styled from 'styled-components';
import DropdownComponent from '@/components/DropdownComponent';
import React, { Suspense, useEffect, useState } from 'react';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const Sidebar = styled.aside`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 220px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
`;

const Logo = styled.div`
  padding: 16px;
  margin: 16px 0;
  font-size: 24px;  
  font-weight: bold;
  color: #343a40;
`;

const NavList = styled.ul`
  padding: 16px;
`;

const NavItem = styled.li`
  font-size: 18px;
  margin: 12px 0;
  list-style: none;
  a {
    text-decoration: none;
    color: #007bff;
    transition: color 0.3s ease;
    &:hover {
      color: #0056b3;
    }
  }
`;

const Main = styled.div`
  margin-left: 220px;
  height: 100%;
  width: calc(100vw - 220px);
`;

const Header = styled.header`
  height: 70px;
  width: calc(100vw - 220px);
  border-bottom: 3px solid #e0e0e0;
  background: linear-gradient(135deg, #ffffff, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Content = styled.div`
  height: calc(100vh - 70px);
  padding: 20px;
`;

const UserTitle = styled.span`
  position: relative;
  font-size: 1em;
  font-weight: bold;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f3a683, #f7b731);
  color: #333;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  display: inline-block;
  margin-right: 30px;
`;

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

  const [user, setUser] = useState<{ name: string, id: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
          <UserTitle>
            {` Welcome ${user?.name} (${user?.id})`}
          </UserTitle>
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