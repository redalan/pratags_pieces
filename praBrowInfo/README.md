#praBrowInfo
(cc)(p) Redalan Net 2022
vers. 0.22101701 alfa


## About

Small independent function that will be part of the PRATAGS class, which you can use now.

This function gives you information about the browser's capabilities in some essential aspects, such as whether it supports Array Functions, session and localStorage, or has the ability to use indexDB.

The capabilities it currently tests are:
- sessionStorage
- localStorage
- cookies
- Array Functions
- indexDB
- querySelector
- jQuery

## Use

To use this function, you can either download the js or add it to your js or script area of your html. You can also use it in an android or iOS webview to see the support of that webview on that phone (which is where it can be most useful as many webviews don't support many desktop browser features).

To call the function you will use:
 ~~~
 praBrowInfo([string info], [string allRequired=arrowFunction,querySelector,cookies])
 Return variant
~~~

praBroInfo returns bool or a json object depending on the given "info".

If "info" is not specified, it will return a json object with information about each supported test and whether it is supported or not. You will also get, in that info, the version of the javascript engine supported by the browser.

If in "info" you specify one of the supported capabilities, it will return True or False if it is or is not supported by the browser.

If in "info" you specify "all", then it will look at all the capabilities included, in a comma-separated list-like string, and if ALL are supported, it will return True. By default it uses "arrowFunction,querySelector,cookies", but you can specify in this second parameter the capabilities you want to check.

## Examples

`
praBrowInfo();
`
Return:
{
  "jsVersion": 1.5,
  "arrowFunction": true,
  "cookies": true,
  "querySelector": true,
  "localStorage": true,
  "sessionStorage": true,
  "jquery": false,
  "indexedDB": true
}

`
praBrowInfo('cookies');
`

Return:
True

`
praBrowInfo('all');
`

Return:
True // if arrowFunction,querySelector,cookies is supported


`
praBrowInfo('all','jquery,querySelector');
`

Return:
True // if jQuery and querySelector is supported


---