<?php
// Standalone service test; no SQL, real locks, or queue delivery.
namespace Illuminate\Http {
    class Request
    {
        public function __construct(private array $input) {}
        public function validate($rules)
        {
            return $this->input;
        }
    }
}

namespace Illuminate\Support {
    class Str
    {
        public static function uuid()
        {
            static $id = 0;
            return 'token-' . ++$id;
        }
    }
}

namespace Illuminate\Validation {
    class ValidationException extends \RuntimeException
    {
        public static function withMessages($m)
        {
            return new self('Invalid ID');
        }
    }
}

namespace Illuminate\Support\Facades {
    class Cache
    {
        public static string $instance;
        public static function store($n)
        {
            return self::$instance ??= new \FakeCache();
        }
    }
}

namespace App\Jobs\Search {
    class RunSearchStep
    {
        public static array $sent = [];
        public function __construct(string $token, string $step) {}
        public static function dispatch(string $token, string $step)
        {
            self::$sent[] = [$token, $step];
            return new self($token, $step);
        }
        public function onConnection(string $c)
        {
            return $this;
        }
        public function onQueue(string $q)
        {
            return $this;
        }
    }
}

namespace App\Services\Search {
    class CompanySearchEngineService {}
}

namespace {
    class FakeCache
    {
        private array $data = [];
        public function get(string $k)
        {
            return $this->data[$k] ?? null;
        }
        public function has(string $k)
        {
            return isset($this->data[$k]);
        }
        public function put(string $k, $v, int $ttl)
        {
            $this->data[$k] = $v;
        }
        public function lock(string $k, int $ttl)
        {
            return $this;
        }
        public function block(int $s, callable $callback)
        {
            return $callback();
        }
    }
    function config(string $k)
    {
        return ['search.steps' => ['keyword', 'region', 'country', 'state', 'city', 'sector', 'industry', 'verification'], 'search.ttl_seconds' => 1800, 'search.cache_store' => 'database', 'search.connection' => 'database', 'search.queue' => 'company-search'][$k];
    }
    function now()
    {
        return new class {
            public function toISOString()
            {
                return gmdate('c');
            }
        };
    }
    function report($e) {}
    function check(bool $ok, string $message)
    {
        if (!$ok) throw new \RuntimeException($message);
        echo "PASS: $message\n";
    }
    require __DIR__ . '/../app/Services/Search/StartSearchService.php';
    require __DIR__ . '/../app/Services/Search/RunSearchService.php';
    $start = new \App\Services\Search\StartSearchService();
    $run = new \App\Services\Search\RunSearchService($start, new \App\Services\Search\CompanySearchEngineService());
    $input = ['request_id' => 'one', 'keyword' => '', 'verification' => true];
    $token = $start->handle(new \Illuminate\Http\Request($input))['token'];
    check($start->handle(new \Illuminate\Http\Request($input))['token'] === $token, 'Start retry reuses token');
    $rejected = false;
    try {
        $start->handle(new \Illuminate\Http\Request([...$input, 'keyword' => 'changed']));
    } catch (\Illuminate\Validation\ValidationException $e) {
        $rejected = true;
    }
    check($rejected, 'Request ID cannot change filters');
    $run->run($token);
    $run->run($token);
    check(count(\App\Jobs\Search\RunSearchStep::$sent) === 8, 'Repeated run dispatches only eight jobs');
    foreach (array_reverse(config('search.steps')) as $step) $run->updateStep($token, $step, ['status' => $step === 'keyword' ? 'skipped' : 'completed']);
    $meta = $run->status($token)['data']['meta'];
    check($meta['is_completed'] && $meta['progress_percent'] === 100 && $meta['skipped_steps'] === 1, 'Out-of-order completion reaches 100%');
    $run->updateStep($token, 'region', ['status' => 'completed']);
    check($run->status($token)['data']['meta']['completed_steps'] === 7, 'Duplicate completion does not double-count');
    $second = $start->handle(new \Illuminate\Http\Request([...$input, 'request_id' => 'two']))['token'];
    $run->run($second);
    $run->stop($second);
    $run->updateStep($second, 'region', ['status' => 'completed']);
    check($run->status($second)['data']['steps']['region']['status'] === 'cancelled', 'Late results cannot overwrite cancellation');
    check($run->run($second)['status_code'] === 409, 'Stopped token cannot restart');
}
