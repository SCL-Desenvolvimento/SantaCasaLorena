import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PatientManual } from '../../../models/patientManual';

@Component({
  selector: 'app-patient-manual',
  standalone: false,
  templateUrl: './patient-manual.component.html',
  styleUrl: './patient-manual.component.css'
})
export class PatientManualComponent {
  @Input() manuals: PatientManual[] = [];
  @Output() createManual = new EventEmitter<void>();
  @Output() editManual = new EventEmitter<PatientManual>();
  @Output() deleteManual = new EventEmitter<string>();

  onCreateManual() {
    this.createManual.emit();
  }

  onEditManual(item: PatientManual) {
    this.editManual.emit(item);
  }

  onDeleteManual(id: string) {
    this.deleteManual.emit(id);
  }
}
