<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $totalBookings = Booking::where('status', '!=', 'cancelled')->count();
        $totalRevenue = Booking::where('status', '!=', 'cancelled')->sum('total_price');
        $totalUsers = User::where('is_admin', false)->count();
        $totalHotels = Hotel::count();
        $totalRooms = Room::count();

        $today = now()->toDateString();
        $activeBookings = Booking::where('status', '!=', 'cancelled')
            ->where('check_in_date', '<=', $today)
            ->where('check_out_date', '>=', $today)
            ->count();

        return response()->json([
            'total_bookings'  => $totalBookings,
            'total_revenue'   => (float) $totalRevenue,
            'total_users'     => $totalUsers,
            'total_hotels'    => $totalHotels,
            'total_rooms'     => $totalRooms,
            'active_bookings' => $activeBookings,
        ]);
    }

    public function bookings()
    {
        $bookings = Booking::with(['user:id,name,email', 'room.hotel:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function rooms()
    {
        $today = now()->toDateString();

        $rooms = Room::with('hotel:id,name')
            ->withCount([
                'bookings as active_bookings_count' => function ($query) use ($today) {
                    $query->where('status', '!=', 'cancelled')
                        ->where('check_in_date', '<=', $today)
                        ->where('check_out_date', '>=', $today);
                },
                'bookings as total_bookings_count' => function ($query) {
                    $query->where('status', '!=', 'cancelled');
                },
            ])
            ->get()
            ->map(function ($room) {
                $room->status = $room->active_bookings_count > 0 ? 'Booked' : 'Available';
                return $room;
            });

        return response()->json($rooms);
    }
}
