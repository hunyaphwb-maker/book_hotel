<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        $rooms = [
            [
                'type' => 'Standard Room',
                'desc' => 'A comfortable and well-appointed room featuring a plush queen-size bed, flat-screen TV, high-speed Wi-Fi, and a modern en-suite bathroom. Ideal for solo travelers and couples.',
            ],
            [
                'type' => 'Deluxe Room',
                'desc' => 'Enjoy extra space and premium furnishings in our Deluxe Room. Features include a king-size bed, sitting area, city or garden view, complimentary minibar, and luxury bath amenities.',
            ],
            [
                'type' => 'Suite',
                'desc' => 'Our spacious Suite offers a separate living room, dining area, and a premium king-size bedroom. Perfect for honeymooners or guests seeking an elevated level of comfort and privacy.',
            ],
            [
                'type' => 'Presidential Suite',
                'desc' => 'The pinnacle of luxury. This expansive suite features two bedrooms, a private terrace with panoramic views, a jacuzzi, butler service, and exclusive access to the executive lounge.',
            ],
            [
                'type' => 'Family Room',
                'desc' => 'Designed with families in mind, this generous room includes one king bed and two single beds, a spacious bathroom, and a cozy seating area — everything you need for a comfortable family stay.',
            ],
            [
                'type' => 'Executive Room',
                'desc' => 'Tailored for business travelers, the Executive Room provides a dedicated workspace, ergonomic chair, high-speed internet, and complimentary access to the executive lounge and breakfast.',
            ],
        ];

        $room = $this->faker->randomElement($rooms);

        return [
            'room_type'       => $room['type'],
            'description'     => $room['desc'],
            'price_per_night' => $this->faker->numberBetween(3500, 28000),
        ];
    }
}
