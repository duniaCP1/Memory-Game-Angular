import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';





@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('joc-de-la-memoria');



  constructor(private cdRef: ChangeDetectorRef) {
    if (typeof window !== 'undefined') {
      const dadesGuardades = localStorage.getItem("Usuaris");
      if (dadesGuardades) {
        this.usuaris = JSON.parse(dadesGuardades);
      }
    }
  }


  nouUsuari: string = '';
  id: number = 0;
  partides: number = 0;
  private _nom: string = '';
  numBarrejes: number = 0;
  jugarPartida: boolean = false;


  usuaris: { nom: string, id: number, partides: number }[] = [];

  veureUsuaris: boolean = false;

  imatges: { id: number; nom: string; mostrarTapa: boolean }[] = [];


  cartesDestapades: { id: number; nom: string; mostrarTapa: boolean }[] = [];

  acertades: { id: number; nom: string; mostrarTapa: boolean }[] = [];

  bloquejat = false;

 





  get nom(): string {
    return this._nom;
  }



  introduirUsuaris() {
    if (this.nouUsuari.trim() !== '') {
      const nJugador = { id: this.id++, nom: this.nouUsuari.trim(), partides: this.partides };
      this.usuaris.push(nJugador);
      this._nom = this.nouUsuari.trim();
      this.nouUsuari = '';
      this.veureUsuaris = false;


      const usuari = this.usuaris.find(u => u.nom === this._nom);
      if (usuari) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("Usuaris", JSON.stringify(this.usuaris));
        }
      }

    }
  }


  mostrarUsuaris() {


    this.veureUsuaris = !this.veureUsuaris;


  }

  esborrarRanking() {

    this.usuaris = [];
    if (typeof window !== 'undefined') {
    localStorage.removeItem("Usuaris");
  }


  }


  mostrarImatges() {
    this.jugarPartida = true;
    this.cartesDestapades = [];
    this.acertades = [];
    this.bloquejat = false;
   


    const rutes = [
      'cardsDeck/armadillo1.png', 'cardsDeck/armadillo1.png',
      'cardsDeck/búfal1.png', 'cardsDeck/búfal1.png',
      'cardsDeck/gat1.png', 'cardsDeck/gat1.png',
      'cardsDeck/linx1.png', 'cardsDeck/linx1.png',
      'cardsDeck/mofeta1.png', 'cardsDeck/mofeta1.png',
      'cardsDeck/ós_rentador1.png', 'cardsDeck/ós_rentador1.png',
      'cardsDeck/ós1.png', 'cardsDeck/ós1.png',
      'cardsDeck/ovella1.png', 'cardsDeck/ovella1.png',
      'cardsDeck/tigre1.png', 'cardsDeck/tigre1.png',
      'cardsDeck/tortuga1.png', 'cardsDeck/tortuga1.png'
    ];

    for (let i = 0; i < this.numBarrejes; i++) {
      rutes.sort(function () { return Math.random() - 0.5 });
    }




    this.imatges = rutes.map((ruta, index) => ({
      id: index,
      nom: ruta,
      mostrarTapa: false,

    }));

    let seconds = 10;
    const tmp = setInterval(() => {
      seconds--;
      if (seconds === 0) {
        clearInterval(tmp);

        this.imatges.forEach(element => element.mostrarTapa = true);
        this.imatges = [...this.imatges];
        this.cdRef.detectChanges();
        ;
      }
    }, 1000);

  }




  girarCarta(carta: { id: number; nom: string; mostrarTapa: boolean }) {
    if (this.bloquejat || carta.mostrarTapa === false) return;
    carta.mostrarTapa = false;
    this.cartesDestapades.push(carta);




    if (this.cartesDestapades.length === 2) {
      if (this.cartesDestapades[0].nom === this.cartesDestapades[1].nom) {
        this.acertades.push(...this.cartesDestapades);
        this.cartesDestapades = [];
      }
      else {
        this.bloquejat = true;

        setTimeout(() => {
          this.cartesDestapades[0].mostrarTapa = true;
          this.cartesDestapades[1].mostrarTapa = true;
          this.cartesDestapades = [];
          this.bloquejat = false;
          this.cdRef.detectChanges();
        }, 2000);
      }

      if (this.acertades.length === this.imatges.length) {
        const usuari = this.usuaris.find(u => u.nom === this._nom);
        if (usuari) {
          usuari.partides++;
          if (typeof window !== 'undefined') {
            localStorage.setItem("Usuaris", JSON.stringify(this.usuaris));
          }
        }
        this.imatges = [];
        this.cartesDestapades = [];
        this.acertades = [];
        this.bloquejat = true;
        this.jugarPartida = false;
      }




    }



  }



}
