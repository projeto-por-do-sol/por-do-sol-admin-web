export interface KioskRegistrationRequest {
  nome: string;
  email: string;
  cnpj: string;
  openingTime: string;
  closingTime: string;
  distAtendimento: number;
  cep: string;
  uf: string;
  cidade: string;
  referencia: string;
  rua: string;
  numero: string;
  latitude: number;
  longitude: number;
  diasAtivo?: boolean[];
}

export interface KioskRegistrationResponse extends Omit<KioskRegistrationRequest, 'cnpj'> {
  id: number;
  status: 'Ativa' | 'Desativada';
}

export interface KioskDetailsResponse extends Partial<Omit<KioskRegistrationResponse, 'id' | 'numero'>> {
  id: number;
  numero?: number | string | null;
  cnpj?: string;
  imagem?: string;
}
