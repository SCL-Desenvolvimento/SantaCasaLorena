import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp',
  standalone: false,
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.css']
})
export class WhatsappComponent {

  openWhatsApp(phone: string, department: string) {
    const message = `Olá! Gostaria de falar sobre ${department} na Santa Casa de Lorena.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

}
