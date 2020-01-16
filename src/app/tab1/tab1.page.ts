import { Component,OnInit } from '@angular/core';
import { ComentarioService } from '../services/comentario.service';
import { NavController, LoadingController,ToastController} from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  validations_form: FormGroup;
  municipios:any[];
  constructor(private _comentario: ComentarioService,
              private formBuilder: FormBuilder,
              private imagePicker: ImagePicker,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private webview: WebView) {}
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
    openImagePicker(){
        this.imagePicker.hasReadPermission()
            .then((result) => {
                if(result == false){
                    // no callbacks required as this opens a popup which returns async
                    this.imagePicker.requestReadPermission();
                }
                else if(result == true){
                    this.imagePicker.getPictures({
                        maximumImagesCount: 1
                    }).then(
                        (results) => {
                            for (var i = 0; i < results.length; i++) {
                                this.uploadImageToFirebase(results[i]);
                            }
                        }, (err) => console.log(err)
                    );
                }
            }, (err) => {
                console.log(err);
            });
    }
    async uploadImageToFirebase(image){
        const loading = await this.loadingCtrl.create({
            message: 'Please wait...'
        });
        const toast = await this.toastCtrl.create({
            message: 'Image was updated successfully',
            duration: 3000
        });
        this.presentLoading(loading);
        let image_src = this.webview.convertFileSrc(image);
        let randomId = Math.random().toString(36).substr(2, 5);

        //uploads img to firebase storage
        this._comentario.uploadImage(image_src, randomId)
            .then(photoURL => {
                console.log(photoURL);
                loading.dismiss();
                toast.present();
            }, err =>{
                console.log(err);
            })
    }

}
