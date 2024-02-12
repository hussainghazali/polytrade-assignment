import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; // (Correct for v6)
import { signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import Toast from "./Toast"; // Import the Toast component

const fields = signupFields;
let fieldsState = {};

fields.forEach(field => fieldsState[field.id]='');

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const [showToast, setShowToast] = useState(false); // State to control the toast visibility
  const [error, setError] = useState(null); // State to hold error messages
  const [redirectToLogin, setRedirectToLogin] = useState(false); // State to manage redirect to login

  const handleChange = (e) => setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount();
  }

  const createAccount = () => {
    let signUpFields = {
      email: signupState['email-address'],
      firstName: signupState['first-name'],
      lastName: signupState['last-name'],
      password: signupState['password']
    };

    const endpoint = 'http://localhost:3001/users/register';
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUpFields)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create account');
      }
      return response.json();
    })
    .then(data => {
      setShowToast(true); // Show the toast
      setTimeout(() => {
        setShowToast(false); // Hide the toast after 3 seconds
        setRedirectToLogin(true); // Set redirect to login flag to true
      }, 3000);
    })
    .catch(error => {
      setError(error.message); // Set error message
      console.error(error);
    });
  }

  // Render the Navigate component if redirectToLogin is true
  if (redirectToLogin) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div>
      {showToast && <Toast message="Signup successful! Redirecting to login..." />}
      {error && <div className="text-red-500">{error}</div>} {/* Display error message */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
          {fields.map(field =>
            <Input
              key={field.id}
              handleChange={handleChange}
              value={signupState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          )}
          <FormAction handleSubmit={handleSubmit} text="Signup" />
        </div>
      </form>
    </div>
  )
}
