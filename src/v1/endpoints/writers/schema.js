import { userRoles } from 'c0nfig';

const emailSchema = {
    type: 'string',
    format: 'email',
    required: true
};
const passwordSchema = {
    type: 'string',
    required: true,
    minLength: 6
};

export const signupSchema = {
    payload: {
        name: {
            type: 'string',
            required: true
        },
        email: emailSchema,
        password: passwordSchema
    },
    query: {
        invite_code: {
            type: 'string',
            format: 'hex'
        }
    }
}

export const loginSchema = {
    payload: {
        email: emailSchema,
        password: passwordSchema
    }
}
