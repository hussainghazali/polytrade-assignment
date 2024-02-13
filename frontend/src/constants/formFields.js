const loginFields=[
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields = [
    {
        labelText: "Email address",
        labelFor: "email-address",
        id: "email-address",
        name: "email",
        type: "email",
        autoComplete: "email",
        isRequired: true,
        placeholder: "Email address"
    },
    {
        labelText: "First Name",
        labelFor: "first-name",
        id: "first-name",
        name: "firstName",
        type: "text",
        autoComplete: "given-name",
        isRequired: true,
        placeholder: "First Name"
    },
    {
        labelText: "Last Name",
        labelFor: "last-name",
        id: "last-name",
        name: "lastName",
        type: "text",
        autoComplete: "family-name",
        isRequired: true,
        placeholder: "Last Name"
    },
    {
        labelText: "Password",
        labelFor: "password",
        id: "password",
        name: "password",
        type: "password",
        autoComplete: "new-password",
        isRequired: true,
        placeholder: "Password"
    },
];

export {loginFields,signupFields}