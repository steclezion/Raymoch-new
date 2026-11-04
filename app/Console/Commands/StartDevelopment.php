<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class StartDevelopment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:dev {--port=9090 : The port used by the Laravel development server}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the Laravel server, queue workers, and Vite development server';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $concurrently = base_path(
            PHP_OS_FAMILY === 'Windows'
                ? 'node_modules/.bin/concurrently.cmd'
                : 'node_modules/.bin/concurrently'
        );

        if (! is_file($concurrently)) {
            $this->components->error('The concurrently package is missing. Run npm install first.');

            return self::FAILURE;
        }

        $port = (string) $this->option('port');

        if (filter_var($port, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]]) === false) {
            $this->components->error('The port must be a number between 1 and 65535.');

            return self::FAILURE;
        }

        $this->components->info("Starting development services on http://127.0.0.1:{$port}");
        $this->line('Press Ctrl+C to stop all services.');

        $process = new Process([
            $concurrently,
            '--kill-others',
            '--names=server,company-search,search,vite',
            '--prefix-colors=blue,magenta,cyan,yellow',
            sprintf('"%s" artisan serve --port=%s', PHP_BINARY, $port),
            sprintf('"%s" artisan queue:work database --queue=company-search --tries=3 --timeout=120 --verbose', PHP_BINARY),
            sprintf('"%s" artisan queue:work database --queue=search --tries=3 --timeout=120 --verbose', PHP_BINARY),
            'npm run dev',
        ], base_path());

        $process->setTimeout(null);
        $process->setIdleTimeout(null);

        return $process->run(function (string $type, string $output): void {
            $type === Process::ERR
                ? $this->output->getErrorOutput()->write($output)
                : $this->output->write($output);
        });
    }
}
