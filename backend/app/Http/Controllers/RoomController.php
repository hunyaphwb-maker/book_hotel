<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms for a specific hotel.
     */
    public function index(Hotel $hotel)
    {
        // Using the 'rooms' relationship we defined in the Hotel model
        $rooms = $hotel->rooms;
        return response()->json($rooms);
    }
}
