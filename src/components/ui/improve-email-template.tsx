import * as React from 'react';

interface ImproveEmailTemplateProps {
    name: string;
    email: string;
    message: string;
}

export const ImproveEmailTemplate: React.FC<Readonly<ImproveEmailTemplateProps>> = ({
    name,
    email,
    message
}) => (
    <div>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Message: {message}</p>
    </div>
);
