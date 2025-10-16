(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function r(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(n){if(n.ep)return;n.ep=!0;const t=r(n);fetch(n.href,t)}})();const i="";function b(e){var l,a,d,p,m,g,f;let o=i,r,c=[];const n=e.id,t=((l=e.metadata.vscode)==null?void 0:l.languageId)||"python";if(((a=e.metadata.vscode)==null?void 0:a.languageId)=="html")o=((p=(d=e.source)==null?void 0:d.filter(s=>s.trim()!="%%script false --no-raise-error"))==null?void 0:p.join(""))||i,r="code";else if(r="code",o=((m=e.source)==null?void 0:m.join(i))||i,e.outputs!==void 0&&e.outputs.length>0)for(let s of e.outputs)if(s.output_type=="stream"){console.log("* Found Text output");const h=((g=s.text)==null?void 0:g.join(i))||i;c.push({type:"text",content:h})}else s.output_type=="display_data"&&(console.log("* Found image"),c.push({type:"image",dataUrl:(f=s.data)==null?void 0:f["image/png"]}));return{source:o,id:n,outputs:c,cell_type:r,language:t}}function y(e){return e.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace('"',"&quot;").replace("'","&#39;")}function x(e,o){const r=[],c=[`
    <style>
        :root {
            --body-background-color: ${o["body-background-color"]};
            --main-background-color: ${o["main-background-color"]};
            --cell-background-color: ${o["cell-background-color"]};
        }
    </style>
`];if(e.cells===void 0)throw new Error("No cells found (Cells in ipynb file undefined)");if(!(e.cells.length>0))throw new Error("No cells found");for(const n of e.cells){const t=b(n);r.push(t)}for(const n of r)if(n.cell_type=="code"&&n.language!=="html"){if(n.outputs===void 0)continue;const t=[];for(const l of n.outputs)l.type=="text"?t.push(`<pre class="output-text">${l.content}</pre>`):l.type=="image"&&t.push(`<img class="output-image" id="${n.id}" src="data:image/png;base64,${l.dataUrl}">`);c.push(`<div class="cell"><pre class="language-${n.language}"><code class="language-${n.language}">${y(n.source)}</code></pre><div class="output">${t.join(i)}</div></div>`)}else if(n.language=="html")c.push(`<div class="cell in-cell-html">${n.source}</div>`);else if(n.cell_type=="markdown")throw new Error("Not implemented");return c.join(i)}const w=`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>

        <!-- FiraCode Font -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet">

        <!-- prism.css -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css">

        <!-- prism.min.js -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js"
        integrity="sha512-UOoJElONeUNzQbbKQbjldDf9MwOHqxNz49NNJJ1d90yp+X9edsHyJoAs6O4K19CZGaIdjI5ohK+O2y5lBTW6uQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"><\/script>

        <!-- prism-python.min.js -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-python.min.js"
        integrity="sha512-3qtI9+9JXi658yli19POddU1RouYtkTEhTHo6X5ilOvMiDfNvo6GIS6k2Ukrsx8MyaKSXeVrnIWeyH8G5EOyIQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"><\/script>


        <style>
        /* for printing */
        @media print {
            @page {
                size: A4 landscape;
                margin: 3mm 3mm;

            }
        }

        body {
            background-color: var(--body-background-color);
            min-height: 100vh;
            min-width: 100vw;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow-x: hidden;
        }

        main {
            width: 80%;
            min-height: 90%;
            display: flex;
            flex-direction: column;
            justify-content: right;
            gap: 10px;
            border-radius: 15px;
            background-color: var(--main-background-color);
            padding: 15px;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        }

        /* "cell" may include code & output or html */
        .cell {
            background-color: var(--cell-background-color);
            border-radius: 15px;
            padding: 5px;

            font-family: "Fira Code", monospace;
            font-size: 15px;

            white-space: pre-wrap;
            overflow-wrap: anywhere;

            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        }

        /* Prism.js specific fix for strings */
        .cell .token.string {
            word-break: break-word;
            overflow-wrap: anywhere;
        }

        /* output cell */
        .output {

        }

        .output .output-image {
            margin: auto;
        }          

        /* images */
        .output-image {
            width: 100%;
            border-radius: 15px;
            border-style: solid;
            border-color: #1e1e1e;
            border-width: 1px;
            margin: 2px;
        }

        /* changing defaults of prism highlighting */
        pre[class*="language-"] {
            border-radius: 15px;
            background-color: #1e1e1e;
            margin-inline: 5px;
        }

        pre[class*="language-"] code[class*="language-"] {
            background-color: inherit;
            text-shadow: none;
            font-family: "Fira Code";
            white-space: pre-wrap;
            color: #cfcfcf;
        }

        pre[class*="language-"] code[class*="language-"] .token.operator {
            background-color: inherit;
        }

        pre[class*="language-"] code[class*="language-"] .token.comment {
            color: #7e8e6f;
        }

        pre[class*="language-"] code[class*="language-"] .token.keyword {
            color: #82a7c9;
        }

        pre[class*="language-"] code[class*="language-"] .token.number {
            color: #b3c6a1;
        }

        pre[class*="language-"] code[class*="language-"] .token.boolean {
            color: #cfcb9c;
        }
        </style>
        <style>
        .text-box {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .text-box p.text {
            margin: 1px;
            align-items: center;
            font-size: 16px;
            font-optical-sizing: auto;
        }

        em {
            border-style: solid;
            width: fit-content;
            padding-inline: 4px;
            border-width: 1px;
            border-radius: 5px;
            background-color: rgba(255, 192, 0, 0.25);
            border-color: #8B8000;
        }

        .text-box.bulleted p.text::before {
            margin: 0;
            content: "*";
            padding-inline-end: 10px;
        }

        .underlined {
            text-decoration: underline;
        }

        .comment {
            color: #7e8e6f;
        }

        .header {
            width: fit-content;
            padding: 5px;
            margin: 0;
        }
        </style>

    </head>

    <body>
        <main>

        </main>
    </body>

</html>
`,u=document.querySelector("input[name=ipynb-file-input]"),v=document.querySelector("p#filename-preview"),k=document.querySelector("input[name=body-color]"),j=document.querySelector("input[name=main-color]"),E=document.querySelector("input[name=cell-color]"),O=document.querySelector("button#select-file-button"),N=document.querySelector("button#convert-button");O.addEventListener("click",()=>{var o;u.click();const e=(o=u.files)==null?void 0:o[0];v.innerText=(e==null?void 0:e.name)||""});N.addEventListener("click",async()=>{var d;const e=(d=u.files)==null?void 0:d[0];if(e===void 0){alert("No file detected!!! Select a file first");return}const o=await e.text(),r=await JSON.parse(o),c=x(r,{"body-background-color":k.value,"main-background-color":j.value,"cell-background-color":E.value}),n=S(c),t=new Blob([n.toString()],{type:"text/plain"}),l=URL.createObjectURL(t),a=document.createElement("a");a.href=l,a.download="converted.html",a.click(),window.location.href=window.location.href});function S(e){const o=document.createElement("html");o.innerHTML=w;const r=o.querySelector("main");if(r===null)throw new Error("No main element found in the html template");return r.innerHTML=e,o.outerHTML}
