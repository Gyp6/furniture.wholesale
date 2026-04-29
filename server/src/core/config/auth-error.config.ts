export const authErrorConfig = {
  INVALID_EMAIL_OR_PASSWORD: {
    message: 'Invalid email or password',
    statusCode: 401,
  },
  USER_ALREADY_EXISTS: {
    message: 'User with this email already exists',
    statusCode: 409,
  },
  USER_NOT_FOUND: { message: 'User not found', statusCode: 404 },
  FAILED_TO_CREATE_USER: {
    message: 'Failed to create user',
    statusCode: 500,
  },
  FIELD_NOT_ALLOWED: { message: 'Field not allowed', statusCode: 400 },
} as const;
