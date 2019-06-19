export let document = {
    name: 'document',
    key: 'title', 
    defaults: {
        title: 'Dyslexic Character Sheets',
        favicon: 'favicon.png',
        sort: true
    },
    render: (args, reg) => {
        var faviconData = getDataURL("core", "images/"+args.favicon);

        return `<!DOCTYPE html>
<html lang='en-GB'>
<head>
<meta charset='utf-8'/>
<title>${esc(args.title)}</title>
<link id="favicon" rel="shortcut icon" type="image/png" href='${faviconData}' />
<style>
${CharacterSheets.stylesheet()}
</style>
</head>

<body>
<nav id='nav-pages'>
<a class="skip-link" href="#page-core">Go to character info</a>
<a class="skip-link" href="#page-combat">Go to combat</a>
</nav>

<main>
${reg.render(args.contents)}
</main>

<nav id='screen-buttons'>
<section id='left-buttons'>
<button id='button--large' class='btn' onclick="document.getElementsByTagName('html')[0].className += ' html--size_large';"><i></i><span>Large font</span></button>
<button id='button--high-contrast' class='btn' onclick="document.getElementsByTagName('html')[0].className += ' html--high_contrast';"><i></i><span>High contrast</span></button>
</section>
<button id='button--print' onclick="window.print();return false;">Print</button>
</nav>
</body>
</html>`;
    }
}
