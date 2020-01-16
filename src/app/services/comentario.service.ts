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

}
