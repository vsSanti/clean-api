export type AccountModel = {
  id: string
  name: string
  email: string
  password: string
  role?: 'admin'
  accessToken?: string
}
