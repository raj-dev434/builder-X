import { FormField } from '../../schema/types';

export const DEFAULT_FORM_FIELDS: FormField[] = [
    { id: 'name', type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
    { id: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
    { id: 'message', type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: false }
];
