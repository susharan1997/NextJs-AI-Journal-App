'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validationSchema } from './form';

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #e0eafc, #cfdef3);
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-family: 'Merriweather', Georgia, serif;
  color: #333;
`;

const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 350px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled(Field)`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  font-size: 1em;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 1em;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SignInLinkButton = styled.button` 
  color: #28a745;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #218838;
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.8em;
`;

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {name: string, email: string, password: string, retypePassword: string}) => {

    try {
      const res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(values),
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
      <Formik
        initialValues={{name: '', email: '', password: '', retypePassword: ''}}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({isSubmitting}) => (
          <FormContainer>
          <ErrorMessage name='name' component={ErrorText}/>
          <Input name='name' type="text" placeholder="Name" required />
          
          <ErrorMessage name='email' component={ErrorText}/>
          <Input name='email' type="email" placeholder="Email" required />
          
          <ErrorMessage name='password' component={ErrorText}/>
          <Input name='password' type="password" placeholder="Password" required />
          
          <ErrorMessage name='retypePassword' component={ErrorText}/>
          <Input name='retypePassword' type="password" placeholder="Re-enter Password" required />

          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={isSubmitting}>Sign Up</Button>
          <span>Already a member ? <SignInLinkButton onClick={() => router.push('/sign-in')}>sign-in</SignInLinkButton></span>
        </FormContainer>
        )}
      </Formik>
    </SignUpContainer>
  );
};

export default SignUp;