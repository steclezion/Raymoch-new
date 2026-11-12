<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class Git extends Command
{
    protected $signature = 'git
                            {--dry-run : Display the next commit name without changing the repository}';

    protected $description = 'Stage all changes, create a numbered daily commit, and force-push main';

    public function handle(): int
    {
        if (! is_dir(base_path('.git'))) {
            $this->components->error('The application directory is not a Git repository.');

            return self::FAILURE;
        }

        $branch = trim($this->runGit(['branch', '--show-current']));

        if ($branch !== 'main') {
            $this->components->error("The current branch is '{$branch}'. Switch to main before running this command.");

            return self::FAILURE;
        }

        $commitName = $this->nextCommitName();

        if ($this->option('dry-run')) {
            $this->components->info("Next commit name: {$commitName}");

            return self::SUCCESS;
        }

        $this->components->task('Staging all changes', function (): void {
            $this->runGit(['add', '.']);
        });

        if (trim($this->runGit(['diff', '--cached', '--name-only'])) === '') {
            $this->components->warn('There are no changes to commit.');
            $this->line("Commit name: {$commitName}");

            return self::SUCCESS;
        }

        $this->components->task("Creating commit {$commitName}", function () use ($commitName): void {
            $this->runGit(['commit', '-m', $commitName], 120);
        });

        $this->components->task('Force-pushing main to origin', function (): void {
            $this->runGit(['push', 'origin', 'main', '--force'], 300);
        });

        $this->newLine();
        $this->components->info("Commit name: {$commitName}");

        return self::SUCCESS;
    }

    private function nextCommitName(): string
    {
        $date = now()->format('d-m-Y');
        $subjects = preg_split('/\R/', trim($this->runGit(['log', '--all', '--format=%s']))) ?: [];
        $highestCount = 0;

        foreach ($subjects as $subject) {
            if (preg_match('/^'.preg_quote($date, '/').'-(\d{2,})$/', trim($subject), $matches) === 1) {
                $highestCount = max($highestCount, (int) $matches[1]);
            }
        }

        return sprintf('%s-%02d', $date, $highestCount + 1);
    }

    private function runGit(array $arguments, int $timeout = 60): string
    {
        $process = new Process(['git', ...$arguments], base_path());
        $process->setTimeout($timeout);
        $process->run();

        if (! $process->isSuccessful()) {
            $message = trim($process->getErrorOutput()) ?: trim($process->getOutput());

            throw new \RuntimeException($message ?: 'The Git command failed.');
        }

        return $process->getOutput();
    }
}
