import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { isPlatformBrowser, NgFor } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [NgFor, AlertComponent, FormsModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.css'
})
export class ServicesListComponent implements OnInit {
  orders: any[] = []; // Aquí se almacenan todas las órdenes
  displayedOrders: any[] = []; // Órdenes visibles en la página actual
  currentPage: number = 1;
  itemsPerPage: number = 5; // Número de elementos por página
  selectedOrder: any = null;
  isModalVisible: boolean = false;
  searchQuery: string = ''; // Nueva propiedad para la búsqueda

  constructor(
    private clientService: ClientService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getOrders()
    }
  }

  getOrders() {
    this.clientService.getOrders().subscribe({
      next: (response) => {
        this.orders = response; // Asumimos que `response` contiene las órdenes
        this.updateDisplayedOrders();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  updateDisplayedOrders() {
    // Filtra las órdenes por el `searchQuery`
    const filteredOrders = this.orders.filter(order =>
      order.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      order.phone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      order.notes.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedOrders = filteredOrders.slice(startIndex, endIndex);
  }

  filterOrders() {
    // Cuando el valor del campo de búsqueda cambia, actualiza la lista de órdenes
    this.updateDisplayedOrders();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedOrders();
    }
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.orders.length / this.itemsPerPage)) {
      this.currentPage++;
      this.updateDisplayedOrders();
    }
  }


  showDetails(order: any) {
    // Cerrar el modal antes de abrir uno nuevo
    this.isModalVisible = false;
    setTimeout(() => {
      this.selectedOrder = order;
      this.isModalVisible = true;
    }, 0); // Se asegura que el modal se cierre y luego se vuelva a abrir correctamente
  }

}
