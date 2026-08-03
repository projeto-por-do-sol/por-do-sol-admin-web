export class UserInitial {
  // Pega as iniciais do usuário logado para colocar na sidebar
  static getNameInitials(name: string): string {
    const firtInitial = name.charAt(0) || "!"
    let secondInitial = ""

    // Se o usuário ter 2 nomes cadastrados ele pega as duas iniciais
    if (name.split(" ").length >= 2) {

      // Filtra o nome do usuário para remover nomes como: "da/de". Exemplo: José da Silva, transforma em: José Silva. Iniciais: JS
      const splitName = name.split(" ").filter(x => x.length > 2)
      secondInitial = splitName[1].charAt(0)
    }
    return `${firtInitial}${secondInitial}`
  }
}
