# VSCode RDF Sketch

This extension provides a way to visualize RDF data in [Visual Studio Code](https://code.visualstudio.com).

This extension is based on our [Zazuko Sketch](https://sketch.zazuko.com/) web app. Code is available [here](https://github.com/zazuko/rdf-sketch).

## Features

* Visualize RDF data in a separate Visual Studio Code tab
* Auto-layout & zoom

## Installation

You can install it directly from the Visual Studio Code Extension tab. It is available on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=Zazuko.vscode-rdf-sketch)

## Usage

Open a file that contains RDF data (N3/Turtle format). Then trigger the `RDF: Open preview` command. It will open a side-pane with a live rendering of your data.

![sketch](https://user-images.githubusercontent.com/8033981/160698016-d3fc7652-5187-4ad5-96db-565026cb0dc7.gif)


We recommend using it in conjunction with the [Stardog RDF Grammars](https://marketplace.visualstudio.com/items?itemName=stardog-union.stardog-rdf-grammars) for Turtle syntax highlighting.

This extension is still pretty raw but it works for us [tm]. Bug reports & contributions are very welcome!

### Limitations

* Currently, it only supports N3/Turtle RDF serializations.
* While you can move around boxes, the layout will not persist. Every time something in the data changes, it will auto-layout again and discard what you did before.
* [YMMV](https://www.urbandictionary.com/define.php?term=ymmv) regarding how much data and what kind of graph you can visualize in a useful way.

## Development

To start the extension from this repository:

- Open Visual Studio Code for this repository
- Open debug panel
- Hit *Run extension* on the upper right corner
- To open dev tools: `Ctrl+P` and toggle developer tools
