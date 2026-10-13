export class UserInitials {
  // Pega as iniciais do usuário logado para colocar na sidebar
  static getNameInitials(name?: string | null): string {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
    const firtInitial = parts[0]?.charAt(0) || "!"

    // Se o usuário ter 2 nomes cadastrados ele pega as duas iniciais
    // Filtra o nome do usuário para remover nomes como: "da/de". Exemplo: José da Silva, transforma em: José Silva. Iniciais: JS
    // Se sobrar só um nome (ex.: "Mesa 3"), usa a última parte original como segunda inicial.
    const longParts = parts.slice(1).filter(x => x.length > 2)
    const secondInitial = (longParts[0] ?? parts[parts.length - 1] ?? '').charAt(0)

    return parts.length >= 2 ? `${firtInitial}${secondInitial}` : firtInitial
  }
}
