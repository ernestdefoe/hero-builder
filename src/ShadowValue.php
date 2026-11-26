<?php

/*
 * This file is part of ernestdefoe/hero-builder.
 * MIT licensed.
 */

namespace ErnestDefoe\HeroBuilder;

/**
 * Checks a custom box-shadow typed in the Hero Studio against a small grammar
 * and rebuilds it from the parts it recognises: up to 4 comma-separated
 * shadows, each made of an optional `inset`, 2 to 4 lengths and at most one
 * colour (#hex, rgb/rgba/hsl/hsla with plain numbers, a colour name, or a
 * var(--custom-property)). Anything else, such as url(), expression(), quotes,
 * semicolons or braces, rejects the whole value.
 */
class ShadowValue
{
    private const LENGTH = '/^(?:0|-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|em|rem|vh|vw|vmin|vmax|%))$/i';

    private const COLOR = '/^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(?:rgba?|hsla?)\([0-9.,%\s-]+\)|[a-z]{3,20}|var\(--[a-z0-9_-]{1,60}\))$/i';

    /** The cleaned value, or null when it is not a box-shadow this allows. */
    public static function clean(string $value): ?string
    {
        $value = trim($value);

        if ($value === '' || strlen($value) > 300 || preg_match('/[^a-z0-9#().,%\s_-]/i', $value)) {
            return null;
        }

        if (strtolower($value) === 'none') {
            return 'none';
        }

        $layers = self::split($value, ',');
        if (count($layers) > 4) {
            return null;
        }

        $out = [];
        foreach ($layers as $layer) {
            $clean = self::layer($layer);
            if ($clean === null) {
                return null;
            }
            $out[] = $clean;
        }

        return implode(', ', $out);
    }

    private static function layer(string $layer): ?string
    {
        $inset = false;
        $lengths = [];
        $color = null;

        foreach (self::split($layer, ' ') as $token) {
            if (strtolower($token) === 'inset' && ! $inset) {
                $inset = true;
            } elseif (preg_match(self::LENGTH, $token)) {
                $lengths[] = strtolower($token);
            } elseif ($color === null && preg_match(self::COLOR, $token) && ! in_array(strtolower($token), ['inset', 'none'], true)) {
                $color = preg_replace('/\s+/', ' ', $token);
            } else {
                return null;
            }
        }

        if (count($lengths) < 2 || count($lengths) > 4) {
            return null;
        }

        $parts = $inset ? ['inset', ...$lengths] : $lengths;
        if ($color !== null) {
            $parts[] = $color;
        }

        return implode(' ', $parts);
    }

    /** @return list<string> Parts split on $sep outside parentheses, empty parts dropped. */
    private static function split(string $value, string $sep): array
    {
        $parts = [];
        $depth = 0;
        $current = '';

        foreach (str_split($value) as $char) {
            if ($char === '(') {
                $depth++;
            } elseif ($char === ')') {
                $depth--;
            }

            $isSep = $sep === ' ' ? ctype_space($char) : $char === $sep;
            if ($isSep && $depth === 0) {
                $parts[] = $current;
                $current = '';
            } else {
                $current .= $char;
            }
        }
        $parts[] = $current;

        return array_values(array_filter(array_map('trim', $parts), fn ($p) => $p !== ''));
    }
}
