<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompanySearchLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CompanySearchLogController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'event'    => 'required|string|max:100',
            'q'        => 'nullable|string|max:255',
            'sector'   => 'nullable|string|max:150',
            'country'  => 'nullable|string|max:150',
            'verified' => 'nullable|boolean',
            'page'     => 'nullable|integer|min:1',
            'session_id' => 'nullable|string|max:100',
        ]);

        $data['user_id']    = optional($request->user())->id;
        $data['ip']         = $request->ip();
        $data['user_agent'] = $request->userAgent();
        $data['referer']    = $request->headers->get('referer');
        $data['verified']   = (bool) ($data['verified'] ?? false);
        $data['page']       = (int) ($data['page'] ?? 1);

        $log = CompanySearchLog::create($data);

        // Optional: also dump to laravel.log for debugging / analytics
        Log::info('Company search interaction', [
            'id'      => $log->id,
            'event'   => $log->event,
            'q'       => $log->q,
            'sector'  => $log->sector,
            'country' => $log->country,
            'verified' => $log->verified,
            'page'    => $log->page,
        ]);

        return response()->json([
            'status' => 'ok',
        ]);
    }
}
