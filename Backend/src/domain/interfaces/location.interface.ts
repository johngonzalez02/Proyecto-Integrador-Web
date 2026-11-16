export interface Country {
  id: number;
  nombre: string;
}

export interface Department {
  id: number;
  nombre: string;
  country_id: number;
  country: string;
}

export interface City {
  id: number;
  nombre: string;
  department_id: number;
  department: string;
  country_id: number;
  country: string;
}