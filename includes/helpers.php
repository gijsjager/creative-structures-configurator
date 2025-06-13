<?php
/**
 * Debug
 * @param $var
 * @return void
 */
function debug($var): void
{
    if ($_SERVER['REMOTE_ADDR'] === '86.85.30.166'){
        echo '<pre>';
        var_dump($var);
        echo '</pre>';
    }
}