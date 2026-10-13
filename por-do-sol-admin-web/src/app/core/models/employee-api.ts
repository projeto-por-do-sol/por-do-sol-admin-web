export type EmployeeApiRole = 'FUNCIONARIO' | 'GERENTE'

export interface EmployeeRequest {
  nome: string;
  email: string;
  password: string;
  cpf?: string;
  startShift: string;
  finishShift: string;
  role: EmployeeApiRole;
  telefone: string;
}

export interface EmployeeResponse {
  id: string;
  quiosqueId: number | null;
  nome: string;
  email: string;
  role: string;
  telefone: string | null;
  imagem: string | null;
  startShift: string | null;
  finishShift: string | null;
}

export interface EmployeeCreatedResponse {
  id: string;
  nome: string;
}
