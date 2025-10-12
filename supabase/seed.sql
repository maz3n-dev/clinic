-- Create tables
create extension if not exists pgcrypto;

create table public.doctors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text,
  photo_url text,
  created_at timestamptz default now()
);

create table public.reservations (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid references public.doctors(id) on delete set null,
  client_name text not null,
  client_phone text not null,
  date date not null,
  time_slot text not null,
  notes text,
  created_at timestamptz default now()
);

-- Seed doctors
insert into public.doctors (name, specialty, photo_url) values
('Dr. Amina El-Sayed', 'General Practitioner', ''),
('Dr. Karim Hassan', 'Dentistry', ''),
('Dr. Sara Mahmoud', 'Pediatrics', '');
