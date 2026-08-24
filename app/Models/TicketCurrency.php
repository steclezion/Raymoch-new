<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketCurrency extends Model
{
    protected $table = 'ticket_currency';

    public $timestamps = false;

    protected $guarded = [];
}
