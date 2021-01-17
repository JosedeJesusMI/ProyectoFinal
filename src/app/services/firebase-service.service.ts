import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getCarro(){
   return this.firestore.collection("carros").snapshotChanges();
  }

  createCarro(carros:any){
   return this.firestore.collection("carros").add(carros);
  }

  updateCarro(id, carros:any){
   return this.firestore.collection("carros").doc(id).update(carros);
  }

  delateCarro(id:any){
   return this.firestore.collection("carros").doc(id).delete();
  }
}
