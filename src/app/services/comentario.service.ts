import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private snapshotChangesSubscription: any;
  private comentarioCollection: AngularFirestoreCollection;
  private municipiosCollection: AngularFirestoreCollection;
  private comentarios: Observable<any>;
  private municipios:Observable<any>;
  constructor( public db: AngularFirestore){
    this.comentarioCollection= db.collection('comentarios');
    this.municipiosCollection=db.collection('municipios');
    this.municipios= this.municipiosCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );
  }

  getTodos(){
    return this.municipios;
  }

  addTodo(item){
    return this.comentarioCollection.add({
      municipio: item.municipio,
      colegio: item.colegio,
      nombre: item.nombre,
      racion: item.racion,
      descripcion: item.descripcion
    });
  }
  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
            .then(snapshot => {
              snapshot.ref.getDownloadURL()
                  .then(res => resolve(res))
            }, err => {
              reject(err);
            })
      })
    })
  }

}
