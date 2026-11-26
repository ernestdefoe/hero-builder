<?php

namespace ErnestDefoe\HeroBuilder\Tests\integration;

use ErnestDefoe\HeroBuilder\ShadowValue;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class ShadowValueTest extends TestCase
{
    public static function allowed(): array
    {
        return [
            'two lengths' => ['0 4px', '0 4px'],
            'full rgba' => ['0 12px 32px -12px rgba(0, 0, 0, 0.5)', '0 12px 32px -12px rgba(0, 0, 0, 0.5)'],
            'inset and hex' => ['inset 0 0 0 2px #FFF', 'inset 0 0 0 2px #FFF'],
            'color first' => ['#7c3aed 0 8px 24px', '0 8px 24px #7c3aed'],
            'css variable' => ['0 8px 24px var(--shadow-color)', '0 8px 24px var(--shadow-color)'],
            'named color' => ['1px 1px 2px black', '1px 1px 2px black'],
            'hsl' => ['0 1em 2em hsla(270, 80%, 50%, .4)', '0 1em 2em hsla(270, 80%, 50%, .4)'],
            'several layers, extra spaces' => ["0 1px 2px red ,  0 4px   8px blue", '0 1px 2px red, 0 4px 8px blue'],
            'none' => ['None', 'none'],
            'uppercase units' => ['0 4PX 8Px', '0 4px 8px'],
        ];
    }

    public static function rejected(): array
    {
        return [
            'empty' => [''],
            'url' => ['0 0 0 url(https://evil.example/x.png)'],
            'expression' => ['0 0 expression(alert(1))'],
            'semicolon breakout' => ['0 0 red; background: url(x)'],
            'braces' => ['0 0 red} body{display:none'],
            'quotes' => ['0 0 "red"'],
            'backslash escape' => ['0 0 \\75 rl(x)'],
            'comment' => ['0 0 /* x */ red'],
            'colon' => ['0 0 javascript:red'],
            'only one length' => ['4px red'],
            'five lengths' => ['1px 2px 3px 4px 5px'],
            'two colors' => ['0 0 red blue'],
            'unitless non-zero' => ['0 4 8 red'],
            'var with fallback' => ['0 0 4px var(--x, url(y))'],
            'unknown function' => ['0 0 4px attr(data-x)'],
            'calc' => ['0 calc(1px + 2px) red'],
            'five layers' => ['0 1px, 0 1px, 0 1px, 0 1px, 0 1px'],
            'too long' => [str_repeat('0 1px red, ', 40)],
            'unbalanced parens' => ['0 0 rgb(0,0,0'],
            'control character' => ["0 0 4px\x00red"],
            'inset twice' => ['inset inset 0 1px'],
        ];
    }

    #[Test]
    #[DataProvider('allowed')]
    public function a_shadow_in_the_grammar_is_rebuilt(string $in, string $out)
    {
        $this->assertSame($out, ShadowValue::clean($in));
    }

    #[Test]
    #[DataProvider('rejected')]
    public function anything_else_is_rejected(string $in)
    {
        $this->assertNull(ShadowValue::clean($in));
    }
}
