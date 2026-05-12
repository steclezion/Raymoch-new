<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Search\RunSearchService;
use App\Services\Search\StartSearchService;
use Illuminate\Http\Request;
use App\Services\Search\CompanySearchEngineService;

class MainSearchEngineController extends Controller
{
    public function __construct(
        protected StartSearchService $startSearchService,
        protected RunSearchService $runSearchService
    ) {}

    public function start(Request $request)
    {
        $result = $this->startSearchService->handle($request);

        return response()->json($result);
    }

    public function run(Request $request, string $token)
    {
        $result = $this->runSearchService->run($token);

        return response()->json(
            [
                'ok' => $result['ok'],
                'message' => $result['message'],
            ],
            $result['status_code']
        );
    }

    public function status(string $token)
    {
        $result = $this->runSearchService->status($token);

        if (!$result['ok']) {
            return response()->json([
                'ok' => false,
                'message' => $result['message'],
            ], $result['status_code']);
        }

        return response()->json([
            'ok' => true,
            'data' => $result['data'],
        ], $result['status_code']);
    }
}
