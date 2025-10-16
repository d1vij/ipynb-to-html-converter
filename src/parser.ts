const knownLanguageIds = ["python", "html", "javascript", "unknown"] as const;
type KnownLanguages = (typeof knownLanguageIds)[number];

type Output = {
    "output_type": "display_data" | "stream",
    "text"?: Array<string>
    "data"?: {
        "image/png": string,
        "text/plain": Array<string>
    }
};

type IPyCellType = "markdown" | "code";
type VscodeMetadata = {
    "languageId"?: string;
}


// A jupyter notebook is just a pretty-printed json file
// All cells are stored as array of cell objects
// A simplified version of it is
type IPyCell = {
    "id": string,
    "cell_type": IPyCellType,
    "outputs"?: Output[],
    "source"?: string[],
    "metadata": {
       "vscode": VscodeMetadata;
    }
};

type Cell = {
    "id": string,
    "cell_type": "markdown" | "code",
    "language"?: string;
    "source": string,
    "outputs": Array<{
        "type": "text" | "image",
        "content"?: string
        "dataUrl"?: string

    }>
};


const EMPTY = '';

type OutputHtmlColors = {
    "body-background-color": string,
    "main-background-color": string,
    "cell-background-color": string,
}

function getDataOfCell(ipyCell: IPyCell): Cell{
    let source: string = EMPTY;
    let cell_type: IPyCellType;
    let outputs = [];

    const id = ipyCell.id;
    const language: KnownLanguages = (ipyCell.metadata.vscode?.languageId || "python") as KnownLanguages;

    if (ipyCell.metadata.vscode?.languageId == "html") {
        source = ipyCell.source?.filter(ln => ln.trim() != "%%script false --no-raise-error")?.join('') || EMPTY;
        cell_type = "code";
    }
    else { //Celltype is code
        cell_type = "code";
        //
        // Joining based on empty string cuz the json is already formatted as it should be
        source = ipyCell.source?.join(EMPTY) || EMPTY;

        if (ipyCell.outputs !== undefined && ipyCell.outputs.length > 0 ) {

            for (let output of ipyCell.outputs) {

                if ( output.output_type == "stream") {

                    console.log("* Found Text output");
                    const content = output.text?.join(EMPTY) || EMPTY;
                    outputs.push({
                        "type": "text",
                        content
                    })
                }
                else if (output.output_type == "display_data") {

                    console.log("* Found image")
                    outputs.push({
                        type: "image",
                        dataUrl: output.data?.["image/png"] //assuming all images would be pngs
                    })
                }
            }
        }
    }
    return {
        source,
        id,
        outputs,
        cell_type,
        language
    } as Cell;
}

function sanitizeHTML(__string: string): string {
    return __string
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
}


/** 
 * Takes in JSON Object of the ipynb file and returns output html string
 * */
export function convertToHtml(json:{"cells": IPyCell[]}, colors: OutputHtmlColors): string {
    const parsedCells: Cell[] = [];

    const builtHtmlArray = [`
    <style>
        :root {
            --body-background-color: ${colors["body-background-color"]};
            --main-background-color: ${colors["main-background-color"]};
            --cell-background-color: ${colors["cell-background-color"]};
        }
    </style>
`];

    if(json["cells"] === undefined) throw new Error("No cells found (Cells in ipynb file undefined)");
    if(!(json["cells"].length > 0)) throw new Error("No cells found");

    // Parsing json cells
    for (const cell of json["cells"]) {
        const data = getDataOfCell(cell);
        parsedCells.push(data);
    }


    // Building the html
    for (const cell of parsedCells) {

        if (cell.cell_type == "code" && cell.language !== "html") {

            if (cell.outputs === undefined) continue;

            const builtOutputsHtmlArray = []

            for (const output of cell.outputs) {

                if (output.type == "text") {
                    builtOutputsHtmlArray.push(`<pre class="output-text">${output.content}</pre>`);

                } else if (output.type == "image") {
                    builtOutputsHtmlArray.push(`<img class="output-image" id="${cell.id}" src="data:image/png;base64,${output.dataUrl}">`);
                }
            }

            builtHtmlArray.push(`<div class="cell"><pre class="language-${cell.language}"><code class="language-${cell.language}">${sanitizeHTML(cell.source)}</code></pre><div class="output">${builtOutputsHtmlArray.join(EMPTY)}</div></div>`)

        } else if (cell.language == "html") {
            builtHtmlArray.push(`<div class="cell in-cell-html">${cell.source}</div>`)

        } else if (cell.cell_type == "markdown") {
            throw new Error("Not implemented");
        }
    } 

    return builtHtmlArray.join(EMPTY);
}
