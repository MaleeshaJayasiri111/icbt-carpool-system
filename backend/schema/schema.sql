create table public.users (
                              id uuid primary key references auth.users(id) on delete cascade,

                              full_name varchar(100) not null,

                              email varchar(255) not null unique,

                              phone varchar(20),

                              role varchar(20) not null default 'user',

                              created_at timestamptz not null default now(),

                              updated_at timestamptz not null default now(),

                              constraint users_role_check
                                  check (role in ('user', 'admin'))
);

alter table public.users enable row level security;

alter table public.users
drop constraint if exists users_role_check;

update public.users
set role = 'passenger'
where role = 'user';

alter table public.users
    alter column role drop default;

alter table public.users
    add constraint users_role_check
        check (role in ('admin', 'driver', 'passenger'));

alter table public.users
    add column user_profile text;



create table public.vehicles (
                                 id uuid primary key default gen_random_uuid(),

                                 driver_id uuid not null
                                     references public.users(id)
                                         on delete cascade,

                                 vehicle_number text not null unique,
                                 vehicle_type text not null,
                                 brand text not null,
                                 model text not null,
                                 color text,
                                 seat_capacity integer not null
                                     check (seat_capacity > 0),

                                 is_active boolean not null default true,

                                 created_at timestamptz not null default now(),
                                 updated_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;

create table public.rides (
                              id uuid primary key  default gen_random_uuid(),

                              driver_id uuid not null
                                  references public.users(id)
                                      on delete cascade,

                              vehicle_id uuid not null
                                  references public.vehicles(id),

                              start_location text not null,

                              start_latitude double precision not null
                                  check (
                                      start_latitude >= -90
                                          and start_latitude <= 90
                                      ),

                              start_longitude double precision not null
                                  check (
                                      start_longitude >= -180
                                          and start_longitude <= 180
                                      ),

                              destination text not null,

                              destination_latitude double precision not null
                                  check (
                                      destination_latitude >= -90
                                          and destination_latitude <= 90
                                      ),

                              destination_longitude double precision not null
                                  check (
                                      destination_longitude >= -180
                                          and destination_longitude <= 180
                                      ),

                              ride_date date not null,

                              departure_time time not null,

                              total_seats integer not null
                                  check (total_seats > 0),

                              available_seats integer not null
                                  check (available_seats >= 0),

                              fee_per_seat numeric(10, 2) not null
                                  check (fee_per_seat >= 0),

                              status text not null default 'available'
                                  check (
                                      status in (
                                                 'available',
                                                 'full',
                                                 'completed',
                                                 'cancelled'
                                          )
                                      ),

                              created_at timestamptz not null default now(),
                              updated_at timestamptz not null default now()
);

create table public.ride_bookings (
                                      id uuid primary key default gen_random_uuid(),

                                      ride_id uuid not null
                                          references public.rides(id)
                                              on delete cascade,

                                      passenger_id uuid not null
                                          references public.users(id)
                                              on delete cascade,

                                      status text not null default 'payment_pending'
                                          check (
                                              status in (
                                                         'payment_pending',
                                                         'confirmed',
                                                         'cancelled'
                                                  )
                                              ),

                                      created_at timestamptz not null default now(),
                                      updated_at timestamptz not null default now(),

                                      unique (ride_id, passenger_id)
);

create table public.payments (
                                 id uuid primary key default gen_random_uuid(),

                                 booking_id uuid not null unique
                                     references public.ride_bookings(id)
                                         on delete cascade,

                                 passenger_id uuid not null
                                     references public.users(id)
                                         on delete cascade,

                                 amount numeric(10,2) not null,

                                 payment_method text not null default 'dummy',

                                 payment_status text not null
                                     check (
                                         payment_status in (
                                                            'successful',
                                                            'failed'
                                             )
                                         ),

                                 paid_at timestamptz default now()
);

create table public.ride_messages (
                                      id uuid primary key default gen_random_uuid(),

                                      ride_id uuid not null
                                          references public.rides(id)
                                              on delete cascade,

                                      sender_id uuid not null
                                          references public.users(id)
                                              on delete cascade,

                                      message text not null,

                                      created_at timestamptz not null default now()
);