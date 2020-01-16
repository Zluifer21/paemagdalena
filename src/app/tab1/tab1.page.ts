import { Component,OnInit } from '@angular/core';
import { ComentarioService } from '../services/comentario.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  validations_form: FormGroup;
  municipios:any[];
  public loadingCtrl: LoadingController
  constructor(private _comentario: ComentarioService, private formBuilder: FormBuilder) {}
  ngOnInit(){
       this._comentario.getTodos().subscribe((todos) =>{
          this.municipios = todos;
       });
       this.resetFields();

  }

  save(value){
   this._comentario.addTodo(value).then(
       res => {
           console.log("Guardado");
       }
   )
  }
  async presentLoading(loading) {
    return await loading.present();
  }

    resetFields(){

        this.validations_form = this.formBuilder.group({
            municipio: new FormControl('', Validators.required),
            colegio: new FormControl('', Validators.required),
            nombre: new FormControl('', Validators.required),
            racion: new FormControl('', Validators.required),
            descripcion: new FormControl('', Validators.required)
        });
    }

}
