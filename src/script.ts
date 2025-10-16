import "./style.scss";
import { convertToHtml } from "./parser";
import htmlTemplate from "./assets/template.html?raw";

const fileInput = document.querySelector<HTMLInputElement>("input[name=ipynb-file-input]")!;
const filenamePreview = document.querySelector<HTMLParagraphElement>("p#filename-preview")!;

const bodyColorElm = document.querySelector<HTMLInputElement>("input[name=body-color]")!;
const mainColorElm = document.querySelector<HTMLInputElement>("input[name=main-color]")!;
const cellColorElm = document.querySelector<HTMLInputElement>("input[name=cell-color]")!;

const selectFileButton = document.querySelector<HTMLButtonElement>("button#select-file-button")!;
const convertButton = document.querySelector<HTMLButtonElement>("button#convert-button")!;


selectFileButton.addEventListener("click", ()=>{
    fileInput.click();
    const file = fileInput.files?.[0];
    filenamePreview.innerText = file?.name || "";
});

convertButton.addEventListener("click", async () => {
    const file = fileInput.files?.[0];

    if(file === undefined) {
        alert("No file detected!!! Select a file first");
        return;
    }

    const text = await file.text();
    const json = await JSON.parse(text);

    const mainContentHtml = convertToHtml(json, {
        "body-background-color": bodyColorElm.value,
        "main-background-color": mainColorElm.value,
        "cell-background-color": cellColorElm.value,
    })

    const html = createHtmlNode(mainContentHtml);


    const blob = new Blob([html.toString()], {"type": "text/plain"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.html";
    link.click();
    window.location.href = window.location.href;
});

/**
 *  Returns <html> node created by combining the html template and html string of main content
 * */
function createHtmlNode(mainContent:string) {
    const htmlElm = document.createElement("html");
    htmlElm.innerHTML = htmlTemplate;

    const mainElm  = htmlElm.querySelector<HTMLDivElement>("main");
    if(mainElm === null) throw new Error("No main element found in the html template");
    mainElm.innerHTML = mainContent;

    return htmlElm.outerHTML;
}
