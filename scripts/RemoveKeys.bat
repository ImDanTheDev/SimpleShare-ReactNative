@echo off

(set \n=^
%=DONT REMOVE THIS=%
)

setlocal EnableDelayedExpansion

(
echo module.exports = {^%\n%%\n%    firebase: {^%\n%%\n%        webClientId: 'REPLACE_ME',^%\n%%\n%    },^%\n%%\n%};
) > %~dp0../keys.js