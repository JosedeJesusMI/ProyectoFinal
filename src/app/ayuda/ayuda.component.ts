import { Component, OnInit } from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from '.././services/firebase-service.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {

  
  closeResult = '';

  estudianteForm: FormGroup;
  idFirebaseActualizar: string;
  actualizar: boolean;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService
    ) {}
     
  config: any;
  collection = { count: 20, data: []}

  ngOnInit(): void {

    this.idFirebaseActualizar = "";
    this.actualizar = false;
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.count
    };
 
    this.estudianteForm = this.fb.group({
 
      id: ['', Validators.required],
      carro: ['', Validators.required],
      precio: ['', Validators.required],
    });

    this.firebaseServiceService.getCarro().subscribe(resp => {
      this.collection.data = resp.map((e: any) =>{
        return {
          id: e.payload.doc.data().id,
          carro: e.payload.doc.data().carro,
          precio: e.payload.doc.data().precio,
          idfirebase: e.payload.doc.id
        }
      })
    },
    error => {
      console.error(error);
    });

   
  }
  pageChanged(event){
    this.config.currentPage = event;
  }
  
  eliminar(item:any): void{
    this.firebaseServiceService.delateCarro(item.idfirebase);
  }

  guardarEstudiante (): void{
    this.firebaseServiceService.createCarro(this.estudianteForm.value).then(resp=>{
     
    this.estudianteForm.reset();
    this.modalService.dismissAll();
    }).catch(error => {
       console.error(error)
    })

  }

  actualizarEstudiante(){
    if(isNullOrUndefined(this.idFirebaseActualizar)){
      this.firebaseServiceService.updateCarro( this.idFirebaseActualizar, this.estudianteForm.value).then(resp=>{
      this.estudianteForm.reset();
      this.modalService.dismissAll();
      }).catch(error=>{
        console.error(error);
      });
    }
   
  }

  openeditar(content, item:any) {
    this.estudianteForm.setValue({
      id: item.id,
      carro: item.carro,
      precio: item.precio
    })
    this.idFirebaseActualizar=item.idfirebase;
    this.actualizar= true;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    this.actualizar= false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  } 
}
