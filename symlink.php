<?php

$target = __DIR__ . '/storage/app/public';
$link = __DIR__ . '/public/storage';

if (file_exists($link)) {
    echo "Link already exists.";
} else {
    if (symlink($target, $link)) {
        echo "Symlink created successfully.";
    } else {
        echo "Failed to create symlink. symlink() may be disabled.";
    }
}

?>