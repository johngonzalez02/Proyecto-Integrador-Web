import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EVENT_STATES, EventPayload, EventState } from '../../interfaces/event.interface';
import { AgentEventsService } from '../../services/agent-events.service';
import { LocationService } from '../../services/location.service';
import { UserService } from '../../services/user.service';
import { apiError } from '../../utils/api-error';
import { toLocalInput } from '../../utils/date.util';

/** Sirve para registrar un evento nuevo y para editar uno existente (ruta edit-event/:id). */
@Component({
  selector: 'app-agent-create-event-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './agent-create-event.page.html',
  styleUrl: './agent-create-event.page.scss',
})
export class AgentCreateEventPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private events = inject(AgentEventsService);
  private user = inject(UserService);
  private locations = inject(LocationService);

  cities = toSignal(this.locations.getCities(), { initialValue: [] });
  states = EVENT_STATES;
  eventId: number | null = null;
  agentId = this.user.currentUser()?.id ?? 0;
  saving = signal(false);
  error = signal<string | null>(null);

  form = {
    nombre: '',
    descripcion: '',
    teatro: '',
    city_id: null as number | null,
    fecha_inicio: '',
    fecha_fin: '',
    capacidad: null as number | null,
    precio: null as number | null,
    observaciones: '',
    estado: 'Programado' as EventState,
    causa_cancelacion: '',
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.eventId = Number(id);
    this.events.getEventById(this.eventId).subscribe({
      next: (e) => {
        this.agentId = e.agent_id;
        this.form = {
          nombre: e.nombre,
          descripcion: e.descripcion,
          teatro: e.teatro,
          city_id: e.city_id,
          fecha_inicio: toLocalInput(e.fecha_inicio),
          fecha_fin: toLocalInput(e.fecha_fin),
          capacidad: e.capacidad,
          precio: e.precio,
          observaciones: e.observaciones ?? '',
          estado: e.estado,
          causa_cancelacion: e.causa_cancelacion ?? '',
        };
      },
      error: (err) => this.error.set(apiError(err)),
    });
  }

  submit(): void {
    const f = this.form;

    if (!f.nombre.trim() || !f.descripcion.trim() || !f.teatro.trim() || !f.city_id ||
        !f.fecha_inicio || !f.fecha_fin || !f.capacidad || f.precio === null) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }
    if (new Date(f.fecha_fin) <= new Date(f.fecha_inicio)) {
      this.error.set('La fecha de fin debe ser posterior a la de inicio');
      return;
    }
    if (f.estado === 'Cancelado' && !f.causa_cancelacion.trim()) {
      this.error.set('Indica la causa de la cancelación');
      return;
    }

    const payload: EventPayload = {
      nombre: f.nombre.trim(),
      descripcion: f.descripcion.trim(),
      teatro: f.teatro.trim(),
      city_id: f.city_id,
      agent_id: this.agentId,
      fecha_inicio: new Date(f.fecha_inicio).toISOString(),
      fecha_fin: new Date(f.fecha_fin).toISOString(),
      capacidad: f.capacidad,
      precio: f.precio,
      observaciones: f.observaciones,
      estado: f.estado,
      causa_cancelacion: f.estado === 'Cancelado' ? f.causa_cancelacion.trim() : undefined,
    };

    this.saving.set(true);
    this.error.set(null);

    const request = this.eventId
      ? this.events.update(this.eventId, payload)
      : this.events.create(payload);

    request.subscribe({
      next: () => this.router.navigate(['/agent/events']),
      error: (err) => {
        this.error.set(apiError(err));
        this.saving.set(false);
      },
    });
  }
}