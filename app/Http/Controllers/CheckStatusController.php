<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CheckStatusController extends Controller
{
    
    public function checkStatus()
    {
        return response()->json('Your account is active');
    }
}
