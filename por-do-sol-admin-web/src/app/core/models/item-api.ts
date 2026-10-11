export interface AccompanimentResponse { id: number; nome: string; valor: number }
export interface ItemResponse {
  id: number; nome: string; descricao: string; ingredientes: string[];
  acompanhamentos: AccompanimentResponse[]; valorBase: number; valorPromo: number | null;
  imagem: string | null; ordem: number | null;
}
export interface CategoryResponse { id_categoria: number; nome: string; ordem: number; itens: ItemResponse[] }
export const ITEM_CATEGORIES = ['Lanches', 'Porções', 'Bebidas', 'Outros', 'Petiscos', 'Frutos do mar', 'Sobremesas', 'Açaí', 'Sucos', 'Coquetéis', 'Cervejas', 'Grelhados', 'Saladas', 'Caldos', 'Sorvetes'];

export interface CatalogKioskResponse {
  id: number; nome: string; cidade?: string; uf?: string; openingTime: string; closingTime: string;
  categorias: (string | { nome: string })[]; imagem?: string; nota?: number;
  pedidosHoje?: number; tempoMedio?: number; faturamentoHoje?: number;
}
