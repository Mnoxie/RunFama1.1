import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  isPasswordVisible: boolean = false;
  isRepetirPasswordVisible: boolean = false;
  
  // Declara las propiedades email y password (si las necesitas en el futuro)
  
  constructor(private alertController: AlertController, private router: Router, private usuarioService: UsuarioService) { }

  // Lista de marcas de autos
  marcasAuto: string[] = [
    'abarth', 'acura', 'alfa romeo', 'audi', 'bmw', 'bentley', 'buick', 'cadillac', 
    'chevrolet', 'citroën', 'dodge', 'fiat', 'ford', 'genesis', 'honda', 'hyundai', 
    'infiniti', 'jaguar', 'jeep', 'kia', 'lamborghini', 'land rover', 'lexus', 
    'lincoln', 'maserati', 'mazda', 'mclaren', 'mercedes benz', 'mini', 'mitsubishi', 
    'nissan', 'pagani', 'peugeot', 'porsche', 'ram', 'renault', 'rolls royce', 
    'saab', 'seat', 'skoda', 'smart', 'subaru', 'suzuki', 'tesla', 'toyota', 
    'volkswagen', 'volvo', 'byd', 'jac', 'changan', 'great wall', 'geely', 
    'haval', 'mg', 'brilliance', 'foton', 'lynk & co', 'dongfeng', 'xpeng', 
    'nio', 'ora', 'rivian', 'polestar', 'karma', 'landwind', 'zotye', 
    'wuling', 'baojun', 'gac', 'hummer'
  ];

  // Formulario
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.anosvalidar(18, 100)]),
    correo: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    repetir_password: new FormControl('', [Validators.required]), // Campo para repetir la contraseña
    genero: new FormControl('', [Validators.required]),
    sede: new FormControl('', [Validators.required]),
    foto_perfil: new FormControl(null), // Campo para la foto de perfil
    tiene_auto: new FormControl('no', [Validators.required]),
    marca_auto: new FormControl(''),
    patente: new FormControl(''),
    asientos_disp: new FormControl(''),
  });
 ngOnInit() {
  // Validar que las contraseñas coincidan
  this.persona.get('repetir_password')?.setValidators([
    Validators.required,
    this.validarRepetirPassword.bind(this)
  ]);

    
    // Escuchar cambios en el campo 'tiene_auto' para actualizar las validaciones de marca_auto, patente y asientos_disp
    this.persona.get('tiene_auto')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        // Si tiene auto, se añaden los validadores a los campos relacionados con el auto
        this.persona.get('marca_auto')?.setValidators([Validators.required, this.validarMarcaAuto.bind(this)]);
        this.persona.get('patente')?.setValidators([Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]); // Patente de Chile
        this.persona.get('asientos_disp')?.setValidators([Validators.required, this.validarAsientos]);
      } else {
        // Si no tiene auto, se eliminan los validadores de los campos relacionados con el auto
        this.persona.get('marca_auto')?.clearValidators();
        this.persona.get('patente')?.clearValidators();
        this.persona.get('asientos_disp')?.clearValidators();
      }
      // Actualizamos la validez de los campos
      this.persona.get('marca_auto')?.updateValueAndValidity();
      this.persona.get('patente')?.updateValueAndValidity();
      this.persona.get('asientos_disp')?.updateValueAndValidity();
    });
  }

  validarRepetirPassword(control: AbstractControl): { [key: string]: any } | null {
    const password = this.persona.get('password')?.value;
    if (control.value !== password) {
      return { contrasenasNoCoinciden: true }; // Devuelve error si no coinciden
    }
    return null; // Devuelve null si coinciden
  }

  validarAsientos(control: AbstractControl) {
    const valor = control.value;
    if (valor < 1 || valor > 10) {
      return { asientosInvalidos: true };
    }
    return null;
  }
  anosvalidar(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return (age >= minAge && age <= maxAge) ? null : { 'invalidAge': true };
    };
  }
  // Validador personalizado para verificar si la marca de auto está en la lista
  validarMarcaAuto(control: AbstractControl) {
    const marca = control.value ? control.value.toLowerCase() : '';
    if (marca && !this.marcasAuto.includes(marca)) {
      return { marcaNoExiste: true };
    }
    return null;
  }
  async registrar() {
    if (this.persona.valid) {
      const usuario = this.persona.value;
      const registrado = this.usuarioService.createUsuario(usuario);
      if (registrado) {
        await this.presentAlert('Perfecto!', 'Registrado correctamente');
        this.router.navigate(['/login']);
      } else {
        await this.presentAlert('Error', 'El usuario ya está registrado.');
      }
    } else {
      await this.presentAlert('Error', 'Por favor, revisa los campos del formulario.');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Puedes hacer algo con el archivo aquí, como cargar una vista previa o almacenarlo en el formulario
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.persona.patchValue({
          foto_perfil: e.target.result // Usar URL de datos para la vista previa
        });
      };
      reader.readAsDataURL(file);
    }
  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();    
  }

   // Métodos para mostrar/ocultar contraseñas
   togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleRepetirPasswordVisibility() {
    this.isRepetirPasswordVisible = !this.isRepetirPasswordVisible;
  }

}