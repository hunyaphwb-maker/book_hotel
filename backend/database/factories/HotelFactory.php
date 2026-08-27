<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    protected $model = Hotel::class;

    public function definition(): array
    {
        $properties = [
            [
                'name'        => 'El Nido Beachfront Resort',
                'address'     => 'Bacuit Bay, El Nido, Palawan 5313',
                'description' => 'A serene beachfront resort in El Nido offering direct access to Bacuit Bay\'s limestone cliffs and turquoise waters. Ideal for island-hopping adventures and quiet sunset dinners on the sand.',
                'image_url'   => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1740&q=80',
            ],
            [
                'name'        => 'Boracay Sands Boutique Hotel',
                'address'     => 'Station 1, White Beach, Boracay, Aklan 5608',
                'description' => 'Steps from the powdery sands of White Beach, this boutique hotel blends contemporary Filipino design with tropical ease. Featuring a rooftop infinity pool and a farm-to-table restaurant.',
                'image_url'   => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1740&q=80',
            ],
            [
                'name'        => 'Cebu Metropolitan Suites',
                'address'     => 'Cebu Business Park, Cebu City 6000',
                'description' => 'A refined city hotel in the heart of Cebu\'s business district. Guests enjoy panoramic city views, a signature Cebuano-inspired restaurant, and quick access to Mactan\'s beaches.',
                'image_url'   => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1740&q=80',
            ],
            [
                'name'        => 'Siargao Surf Lodge',
                'address'     => 'Cloud 9, General Luna, Siargao Island 8419',
                'description' => 'A laid-back boutique lodge just minutes from Cloud 9. Wake up to the sound of waves, enjoy locally roasted coffee, and swap surf stories in our open-air lounge.',
                'image_url'   => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1625&q=80',
            ],
            [
                'name'        => 'Vigan Heritage Casa',
                'address'     => 'Calle Crisologo, Vigan City, Ilocos Sur 2700',
                'description' => 'A meticulously restored Spanish colonial casa along Vigan\'s cobblestone streets. Enjoy hand-crafted furniture, Ilocano cuisine, and evening kalesa rides through the heritage village.',
                'image_url'   => 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1740&q=80',
            ],
            [
                'name'        => 'Baguio Pine Retreat',
                'address'     => 'Session Road, Baguio City, Benguet 2600',
                'description' => 'Tucked amid Baguio\'s pine forests, this cool mountain retreat offers cosy fireplaces, garden trails, and locally sourced strawberry-inspired dining — a refreshing escape from the lowland heat.',
                'image_url'   => 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1740&q=80',
            ],
        ];

        $property = $this->faker->unique()->randomElement($properties);

        return [
            'name'        => $property['name'],
            'address'     => $property['address'],
            'description' => $property['description'],
            'image_url'   => $property['image_url'],
        ];
    }
}
