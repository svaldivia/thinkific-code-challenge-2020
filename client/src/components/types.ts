export type LoginOrSignupFormData = {
  email: string
  password: string
}

export enum FormType {
  Login,
  SignUp,
}

export type ServerResponse = {
  status?: number
  body: { token?: string; count?: string; error?: string }
}
