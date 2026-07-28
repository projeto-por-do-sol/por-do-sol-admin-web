import { Component, Signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/user-model';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-sidebar',
  imports: [MatSelectModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  paginaAtual?: string = 'visao-geral'
  quiosqueSelecionado: string = ''

  user!: Signal<User>
  userNameInitials: string = ""

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.getNameInitials()
  }

  // Pega as iniciais do usuário logado para colocar na sidebar
  getNameInitials() {
    const userData = this.user()
    const firtInitial = userData.name?.charAt(0) || "!"
    let secondInitial = ""

    // Se o usuário ter 2 nomes cadastrados ele pega as duas iniciais
    if (userData.name && userData.name?.split(" ").length >= 2) {

      // Filtra o nome do usuário para remover nomes como: "da/de". Exemplo: José da Silva, transforma em: José Silva. Iniciais: JS
      const splitName = userData.name.split(" ").filter(x => x.length > 2)
      secondInitial = splitName[1].charAt(0)
    }
    this.userNameInitials = `${firtInitial}${secondInitial}`
  }

}
