<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@hotel.com',
            'password' => bcrypt('admin123'),
            'is_admin' => true,
        ]);

        // Create 10 users
        User::factory(10)->create();

        // Create a specific user for testing
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create 6 Philippine boutique hotels, and for each hotel, create 5 rooms
        Hotel::factory(6)
            ->has(Room::factory()->count(5))
            ->create();
    }
}
