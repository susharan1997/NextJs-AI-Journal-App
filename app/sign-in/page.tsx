"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #e0eafc, #cfdef3);
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-family: "Merriweather", Georgia, serif;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 350px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
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

function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>("");
  const [message, setMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get("message");
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
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.user.id, name: data.user.name })
        );
        router.push(`/journal`);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again!");
    }
  };

  return (
    <SignInContainer>
      <Banner message={message || ""} show={showBanner} />
      <Title>Sign In</Title>
      <Form onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" name="email" required />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        {error && <span>{error}</span>}
        <Button type="submit">Sign In</Button>
      </Form>
    </SignInContainer>
  );
}

export default SignIn;
