import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarios: any[] = [];
  private usuarioAutenticado: any = null; // Añadir propiedad para el usuario autenticado

  constructor() {
    // Crear usuarios predefinidos con datos completos
    this.usuarios.push(
      {
        rut: '12345678-9',
        correo: 'admin@duocuc.cl',
        password: 'admin123',
        nombre: 'Admin',
        fecha_nacimiento: '1990-01-01',
        genero: 'masculino',
        sede: 'Puente alto',
        tiene_auto: 'si',
        marca_auto: 'Toyota',
        patente: 'ABCD12',
        asientos_disp: 4
      },
    );
  }

  public createUsuario(usuario: any): boolean {
    if (this.getUsuario(usuario.rut) === undefined) {
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }

  public getUsuario(rut: string) {
    return this.usuarios.find(elemento => elemento.rut === rut);
  }

  public getUsuarios(): any[] {
    return this.usuarios;
  }

  public updateUsuario(rut: string, nuevoUsuario: any) {
    const indice = this.usuarios.findIndex(elemento => elemento.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.usuarios[indice] = nuevoUsuario;
    return true;
  }

  public deleteUsuario(rut: string): boolean {
    const indice = this.usuarios.findIndex(elemento => elemento.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.usuarios.splice(indice, 1);
    return true;
  }

  public authenticate(email: string, password: string): boolean {
    console.log('Verificando:', email, password); // Depuración
    const usuario = this.usuarios.find(user => user.correo === email && user.password === password);
    if (usuario) {
      this.usuarioAutenticado = usuario; // Establecer usuario autenticado
      return true;
    }
    return false;
  }

  public getUsuarioAutenticado() {
    return this.usuarioAutenticado; // Obtener usuario autenticado
  }

  public logUsuarios() {
    console.log(this.usuarios);
  }
}