export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface OwnerRegistrationRequest {
  nome: string
  email: string
  password: string
  cpf: null
  role: 'PROPRIETARIO'
  telefone: string
}

export interface UpdateProfileRequest {
  nome: string
  email: string
  telefone: string
}

export interface ChangePasswordRequest {
  senhaAtual: string
  novaSenha: string
}

export interface AuthenticatedUserResponse {
  id: string
  nome: string
  email: string | null
  telefone: string
  dataCadastro: string
  imagem: string | null
  role: 'proprietario' | 'gerente' | 'funcionario'
}
