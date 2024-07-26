'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

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
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;

    const emailCookies = document.cookie.split('; ').find(row => row.startsWith('email='))?.split('=')[1];
    const passwordCookies = document.cookie.split('; ').find(row => row.startsWith('password='))?.split('=')[1];

    if(email === emailCookies && password === passwordCookies){
      router.push('/new-user');
    }
    else{
      alert('Invalid Email or Password!.');
    }
  };

  return (
    <SignInContainer>
      <Title>Sign In</Title>
      <Form onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" name='email' required />
        <Input type="password" placeholder="Password" name='password' required />
        <Button type="submit">Sign In</Button>
      </Form>
    </SignInContainer>

  );
};

export default SignIn;