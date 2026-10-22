<?php

namespace App\Services\Auth;

use InvalidArgumentException;

class TotpService
{
    private const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    public function generateSecret(int $bytes = 20): string
    {
        return $this->base32Encode(random_bytes($bytes));
    }

    public function provisioningUri(string $secret, string $email, string $issuer = 'Raymoch'): string
    {
        $label = rawurlencode($issuer . ':' . $email);
        return "otpauth://totp/{$label}?secret={$secret}&issuer=" . rawurlencode($issuer) . '&algorithm=SHA1&digits=6&period=30';
    }

    public function verify(string $secret, string $code, int $window = 1, ?int $timestamp = null): ?int
    {
        if (! preg_match('/^\d{6}$/', $code)) return null;

        $currentStep = intdiv($timestamp ?? time(), 30);
        for ($offset = -$window; $offset <= $window; $offset++) {
            $step = $currentStep + $offset;
            if ($step >= 0 && hash_equals($this->codeAtStep($secret, $step), $code)) return $step;
        }

        return null;
    }

    public function codeAtStep(string $secret, int $step): string
    {
        $key = $this->base32Decode($secret);
        $counter = pack('N2', intdiv($step, 4294967296), $step % 4294967296);
        $hash = hash_hmac('sha1', $counter, $key, true);
        $offset = ord($hash[19]) & 0x0f;
        $binary = ((ord($hash[$offset]) & 0x7f) << 24)
            | ((ord($hash[$offset + 1]) & 0xff) << 16)
            | ((ord($hash[$offset + 2]) & 0xff) << 8)
            | (ord($hash[$offset + 3]) & 0xff);

        return str_pad((string) ($binary % 1000000), 6, '0', STR_PAD_LEFT);
    }

    private function base32Encode(string $value): string
    {
        $bits = '';
        foreach (str_split($value) as $char) $bits .= str_pad(decbin(ord($char)), 8, '0', STR_PAD_LEFT);

        $output = '';
        foreach (str_split($bits, 5) as $chunk) {
            $output .= self::ALPHABET[bindec(str_pad($chunk, 5, '0', STR_PAD_RIGHT))];
        }
        return $output;
    }

    private function base32Decode(string $value): string
    {
        $normalized = strtoupper(preg_replace('/[^A-Z2-7]/i', '', $value));
        if ($normalized === '') throw new InvalidArgumentException('The authenticator secret is invalid.');

        $bits = '';
        foreach (str_split($normalized) as $char) {
            $position = strpos(self::ALPHABET, $char);
            if ($position === false) throw new InvalidArgumentException('The authenticator secret is invalid.');
            $bits .= str_pad(decbin($position), 5, '0', STR_PAD_LEFT);
        }

        $output = '';
        foreach (str_split($bits, 8) as $chunk) {
            if (strlen($chunk) === 8) $output .= chr(bindec($chunk));
        }
        return $output;
    }
}
