<p align="center">
	<img src='./assets/logo-sm.svg' width="256">
</p>

## Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)

<br>
<br>

## Getting Started

----
## Installation

Import the package  via [JSDelivr](https://jsdelivr.net)
```html
<script src='https://cdn.jsdelivr.net/gh/jabo-bernardo/acfoc/dist/build.js'></script>
```

---
## Basic Usage
Creating a new instance of ACFOC.
```js
const acfoc = new ACFOC();
acfoc.initialize();
```
To verify that the code above is working check the devtools and you should see a log from the ACFOC script.

---
## Properties
- `idleTimeout` : Number - How long ACFOC will wait before it gives a idle penalty.
- `allowCopy` : Boolean - Should the page allow copying?
- `allowPaste` : Boolean - Should the page allow pasting?
- `allowIdle`: Boolean - Should the page ignore idling?
- `scores` : Object - Change scoring for specific penalty
	- `idle` : {Number} - Score will give the user on idling
	- `copy` : {Number} - Score will give the user on copying
	- `paste` : {Number} - Score will give the user on pasting
	- `changeFocus` : {Number} - Score will give the user on tab changing, opening another application, or opening developer tools
