export type EmployeeApiRole = 'FUNCIONARIO' | 'GERENTE'

export interface EmployeeRequest {
  nome: string;
  email: string;
  cpf?: string;
  startShift: string;
  finishShift: string;
  diasTurno: boolean[];
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
  diasAtivo: boolean[] | null;
}

export interface EmployeeCreatedResponse {
  id: string;
  nome: string;
}
