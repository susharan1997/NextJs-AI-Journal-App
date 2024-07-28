'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  margin-bottom: 20px
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

const SignInLinkButton = styled.button` 
  color: green;

  &:hover {
    color: #0056b3;
  }
`;

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      console.log('Request sent, awaiting response...');

      const data = await res.json();
      if (res.ok) {
        router.push('/sign-in?message=User created successfully!');
      }
      else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <SignUpContainer>
      <Title>Sign Up</Title>
      <Form onSubmit={handleSubmit}>
        <Input name='name' type="text" placeholder="Name" required />
        <Input name='email' type="email" placeholder="Email" required />
        <Input name='password' type="password" placeholder="Password" required />
        {error && <span>{error}</span>}
        <Button type="submit">Sign Up</Button>
        <span>Already a member ? <SignInLinkButton onClick={() => router.push('/sign-in')}>sign-in</SignInLinkButton></span>
      </Form>
    </SignUpContainer>
  );
};

export default SignUp;