<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * List the authenticated user's bookings.
     */
    public function mine(Request $request)
    {
        $bookings = Booking::with('room.hotel')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('check_in_date')
            ->get();

        return response()->json($bookings);
    }

    /**
     * Show a single booking (owner only).
     */
    public function show(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        return response()->json($booking->load('room.hotel', 'user'));
    }

    /**
     * Store a newly created booking.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_id' => 'required|integer|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Availability check — prevent overlapping active bookings for the same room
        $overlap = Booking::where('room_id', $validated['room_id'])
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($validated) {
                $q->where('check_in_date', '<', $validated['check_out_date'])
                  ->where('check_out_date', '>', $validated['check_in_date']);
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'message' => 'This room is no longer available for the selected dates. Please try different dates or another room.',
            ], 409);
        }

        // Calculate total price
        $room = Room::findOrFail($validated['room_id']);
        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $numberOfNights = $checkOut->diffInDays($checkIn);

        $validated['user_id'] = $request->user()->id;
        $validated['total_price'] = $numberOfNights * $room->price_per_night;
        $validated['status'] = 'confirmed';
        $validated['reference'] = strtoupper('ANG-' . Str::random(6));

        $booking = Booking::create($validated);

        return response()->json($booking->load('room.hotel'), 201);
    }

    /**
     * Cancel a booking (owner only, only if check-in is in the future).
     */
    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['message' => 'This booking has already been cancelled.'], 422);
        }

        if (Carbon::parse($booking->check_in_date)->isPast()) {
            return response()->json(['message' => 'Past bookings cannot be cancelled.'], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json($booking->load('room.hotel'));
    }
}
