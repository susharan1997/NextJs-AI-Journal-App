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
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  margin-bottom: 20px
`;

const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Input = styled(Field)`
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

const ErrorText = styled.div`
  color: red;
  margin-bottom: 10px;
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
          <Input name='name' type="text" placeholder="Name" required />
          <ErrorMessage name='name' component={ErrorText}/>

          <Input name='email' type="email" placeholder="Email" required />
          <ErrorMessage name='email' component={ErrorText}/>

          <Input name='password' type="password" placeholder="Password" required />
          <ErrorMessage name='password' component={ErrorText}/>

          <Input name='retypePassword' type="password" placeholder="Re-enter Password" required />
          <ErrorMessage name='retypePassword' component={ErrorText}/>

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