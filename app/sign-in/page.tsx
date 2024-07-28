'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Banner from '@/components/Banner';

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 1em;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1em;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>('');
  const [message, setMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('message');
    if (msg) {
      setMessage(msg);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;

    try {
      const response = await fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json();

      if (response.ok) {
        const queryParams = new URLSearchParams({
          userData: encodeURIComponent(JSON.stringify(data.user))
        }).toString();
        router.push(`/journal?${queryParams}`);
      }
      else {
        setError(data.error);
      }
    }
    catch (error) {
      setError('An error occurred. Please try again!');
    }
  };

  return (
    <SignInContainer>
      <Banner message={message || ''} show={showBanner} />
      <Title>Sign In</Title>
      <Form onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" name='email' required />
        <Input type="password" placeholder="Password" name='password' required />
        {error && <span>{error}</span>}
        <Button type="submit">Sign In</Button>
      </Form>
    </SignInContainer>

  );
};

export default SignIn;