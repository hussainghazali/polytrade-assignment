import React, { useState } from 'react';
import { loginFields } from "../constants/formFields";
import { Navigate } from 'react-router-dom'; // (Correct for v6)
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import SuccessToast from "./SuccessToast"; // Import the SuccessToast component

const fields = loginFields;
let fieldsState = {};
fields.forEach(field => fieldsState[field.id] = '');

export default function Login() {
    const [loginState, setLoginState] = useState(fieldsState);
    const [showToast, setShowToast] = useState(false); // State to control the toast visibility
    const [error, setError] = useState(null); // State to hold error messages
    const [redirectToDashboard, setRedirectToDashboard] = useState(false); // State to manage redirect to login

    const handleChange = (e) => {
        setLoginState({ ...loginState, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        authenticateUser();
    }

    // Handle Login API Integration here
    const authenticateUser = () => {
        let loginFields = {
            email: loginState['email-address'],
            password: loginState['password']
        };

        const endpoint = 'http://localhost:3001/users/login';
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginFields)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to login');
                }
                return response.json();
            })
            .then(data => {
                setShowToast(true); // Show the toast
                setTimeout(() => {
                    setShowToast(false); // Hide the toast after 3 seconds
                    setRedirectToDashboard(true); // Set redirect to login flag to true
                }, 3000);
            })
            .catch(error => {
                setError(error.message); // Set error message
                console.error(error);
            });
    }

    // Render the Navigate component if redirectToLogin is true
    if (redirectToDashboard) {
        return <Navigate to="/dashboard" replace={true} />;
    }

    return (
        <div>
            {showToast && <SuccessToast message="Login successful! Redirecting to dashboard..." />}
            {error && <div className="text-red-500">{error}</div>} {/* Display error message */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="-space-y-px">
                    {
                        fields.map(field =>
                            <Input
                                key={field.id}
                                handleChange={handleChange}
                                value={loginState[field.id]}
                                labelText={field.labelText}
                                labelFor={field.labelFor}
                                id={field.id}
                                name={field.name}
                                type={field.type}
                                isRequired={field.isRequired}
                                placeholder={field.placeholder}
                            />
                        )
                    }
                </div>

                <FormExtra />
                <FormAction handleSubmit={handleSubmit} text="Login" />

            </form>
        </div>
    )
}
