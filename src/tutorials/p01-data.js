/* One science-first P01 chapter tutorial.
 * A single coherent workflow, not seven isolated syntax videos.
 * Witz/HPA figure previews show future capability, NOT an analysis
 * performed by the Python snippets. All measurements are hypothetical.
 */
"use strict";
(() => {
  const id='specimen = "S01"';
  const count=id+"\ncells = {CELLS}";
  const firstPrint=count+"\nprint(specimen)";
  const bothPrint=firstPrint+"\nprint(cells)";
  const inputs=count+"\npixels = 40\npixel_size_um = 0.2";
  const length=inputs+"\nlength_um = pixels * pixel_size_um";
  const report=length+'\nprint(f"{specimen}: {cells} cells")\nprint(f"Length: {length_um:.1f} µm")';
  const finalOutput="S01: {CELLS} cells\nLength: 8.0 µm";
  const preview={image:"labeled-nuclei",label:"Where this leads: labeled nuclei from a published Witz tutorial"};
  const scene=(title,say,code,focus,visual,output,note,extras={})=>({
    title,say,code,focus,visual,output,note,...extras
  });
  window.BioPythonP01Tutorials=Object.freeze([{
    id:"p01-chapter",
    chapter:"P01",
    title:"From a microscope field to a trustworthy report",
    short:"One chapter example",
    minutes:"5–8 min",
    goals:[
      "P01-G01","P01-G02","P01-G03","P01-G04",
      "P01-G05","P01-G06","P01-G07","P01-CAPSTONE"
    ],
    parameter:{label:"Manually counted cells",min:5,max:50,step:1,value:25,token:"CELLS"},
    steps:[
      scene(
        "The destination: a whole experiment",
        "Imagine finishing a microscopy experiment with hundreds of fields. Instead of manually copying numbers, a Python workflow could organize specimen identifiers, count candidate objects, measure their dimensions, and create a report. This published image shows labeled nuclei from an advanced image processing lesson. Our code today will not segment this image.",
        "",[],[["Future capability","Image analysis + traceable reports"],["Today's goal","One trustworthy specimen report"]],"",
        "A labeled-nuclei image is an illustration of future capability, not evidence that today's code detects cells.",
        {preview,goal:"P01-G01"}
      ),
      scene(
        "What we can really build today",
        "We begin with one microscope field. Someone has manually counted twenty five cells, and measured a hypothetical forty pixel distance. We also have an illustrative calibration of zero point two micrometres per pixel. We will store these inputs, calculate one length, and print a clear report.",
        "",[],[["Specimen","S01"],["Manual count","{CELLS} cells"],["Distance","40 px"],["Example calibration","0.2 µm/px"]],"",
        "These are invented training inputs; no counts, distances or calibration are inferred from the published picture.",
        {preview:{image:"fluorescence-single",label:"Microscopy context: published fluorescence image"},goal:"P01-G01"}
      ),
      scene(
        "Give the sample a name",
        "First, Python assigns the text S zero one to a variable called specimen. The quotation marks mean we are storing a string, not a number. Without a reliable sample identifier, even a perfect image measurement can become impossible to interpret.",
        id,[1],[["Variable","specimen"],["Value","S01"],["Type","str"]],"",
        "The equals sign assigns a value. A variable name is how later instructions refer to that value.",
        {goal:"P01-G02"}
      ),
      scene(
        "Record an observation",
        "Next we assign the manually counted value to cells. Whole numbers are called integers. The same variable could later receive a count produced by an image analysis function, but for now we supply the number ourselves.",
        count,[2],[["Specimen","S01"],["cells","{CELLS}"],["Type","int"]],"",
        "A stored manually counted number is not the same as an automated or independently verified count.",
        {goal:"P01-G02"}
      ),
      scene(
        "Run a small scientific script",
        "Python follows instructions in order. Print specimen writes the sample identifier. Print cells writes the observed count. Notice that Python prints the values stored under those names, not the variable names themselves.",
        bothPrint,[3,4],[["First print","S01"],["Second print","{CELLS}"]],"S01\n{CELLS}",
        "Each print starts a new line. Try this exact script using the real editor's Run button.",
        {goal:"P01-G01"}
      ),
      scene(
        "Predict before seeing the answer",
        "Now think before we continue. If the cell count changed from twenty five to thirty one, which line of the output should change? What about the specimen identifier? Make a prediction. When ready, press Reveal to continue.",
        bothPrint,[2],[["Question","Change cells only"],["Prediction","Which output line changes?"]],"",
        "Stop and predict. The answer follows after you press Reveal. The same reasoning will later help you test analysis parameters.",
        {checkpoint:true,goal:"P01-G02"}
      ),
      scene(
        "Reveal: the input controls the output",
        "Only the second output line depends on cells. The first line still displays S zero one. Move the count slider to thirty one and watch that change. You have just separated the input data from the code that reports it.",
        bothPrint,[2,4],[["Unchanged specimen","S01"],["Changing count","{CELLS}"]],"S01\n{CELLS}",
        "Changing an input can change part of an output without changing the program's instructions.",
        {goal:"P01-G02"}
      ),
      scene(
        "Pixels are not physical length",
        "Now add a second measurement: forty pixels. A distance in pixels becomes a real-world length only when it is multiplied by the appropriate, verified image calibration. This is a frequent source of mistakes in quantitative microscopy.",
        inputs,[3,4],[["Distance","40 pixels"],["Example scale","0.2 µm per pixel"]],"",
        "The 0.2 micrometres per pixel calibration is hypothetical and does NOT apply to the image preview.",
        {goal:"P01-G03"}
      ),
      scene(
        "Two different number types",
        "Pixels is an integer: forty. Pixel size is a float, a decimal value. A string stores a label, an integer stores a whole number, and a float stores a decimal number. Python uses these types when it evaluates expressions.",
        inputs,[2,3,4],[["specimen","string"],["cells, pixels","integers"],["pixel_size_um","float"]],"",
        "Types describe how Python represents values. The variable name, not the type alone, documents scientific units.",
        {goal:"P01-G04"}
      ),
      scene(
        "Calculate the length",
        "We multiply forty pixels by zero point two micrometres per pixel, obtaining eight micrometres. Python assigns the calculated value to length underscore u m. The units of pixels cancel, leaving micrometres.",
        length,[5],[["40 px × 0.2 µm/px","8.0 µm"],["Variable","length_um"]],"",
        "In real measurements, verify that calibration and measured pixels refer to the same image and axis.",
        {goal:"P01-G03"}
      ),
      scene(
        "A useful logical result",
        "Python can also ask questions. Here, is the length at least five micrometres? The comparison returns True, a Boolean value. Later, comparisons will help us flag values for review. This five micrometre cutoff is only for learning, not a validated biological quality rule.",
        length+"\nprint(length_um >= 5)",[6],[["Length","8.0 µm"],["Illustrative condition","at least 5 µm"],["Boolean result","True"]],"True",
        "A comparison is only as scientifically meaningful as its defined criterion.",
        {goal:"P01-G04"}
      ),
      scene(
        "Not all mistakes cause errors",
        "Now imagine somebody accidentally types zero point four instead of the correct calibration, zero point two. The program still runs but reports sixteen micrometres instead of eight. Python cannot know that the input calibration is wrong. Reliable analysis requires checking provenance and units.",
        'pixels = 40\npixel_size_um = 0.4\nlength_um = pixels * pixel_size_um\nprint(round(length_um, 1))',
        [2,3,4],[["Wrong assumed scale","0.4 µm/px"],["Printed length","16.0 µm"],["With 0.2 µm/px","8.0 µm"]],"16.0",
        "A silent scientific error can be more dangerous than an obvious traceback; this comparison is hypothetical.",
        {goal:"P01-G05"}
      ),
      scene(
        "An error Python does catch",
        "Here is a visible error. We define a variable called cells but try to print cell without the final s. Python raises NameError. The final line of a traceback tells us which name it could not find.",
        "cells = 25\nprint(cell)",[2],[["Defined name","cells"],["Used name","cell"],["Error","NameError"]],
        "NameError: name 'cell' is not defined",
        "The preview shows a shortened error message; a full traceback includes file and line context.",
        {goal:"P01-G05"}
      ),
      scene(
        "Repair the underlying cause",
        "When we change cell to cells, the program prints twenty five again. Python variable names must match exactly. In a larger workflow, the same error might appear when an analysis refers to a misspelled column or image channel.",
        "cells = 25\nprint(cells)",[2],[["Fixed name","cells"],["Value","25"]],"25",
        "Fix the code and rerun it. Never confuse fixing a traceback with validating the underlying scientific measurement.",
        {goal:"P01-G05"}
      ),
      scene(
        "You can ask Python for help",
        "You will not remember every function and argument. The built-in help function gives documentation. For example, help of len explains how to retrieve the number of items in a sequence or another collection.",
        "help(len)",[1],[["Ask Python about","len"],["Meaning","Number of items"]],
        "Help on built-in function len …",
        "This documentation excerpt is deliberately abbreviated rather than an exact copy of full Python help output.",
        {goal:"P01-G06"}
      ),
      scene(
        "Make your work reproducible",
        "Notebook variables can survive from earlier cells, even if the code is no longer visible. Printing cells in a new interpreter fails unless the variable has been defined. Reproducible scripts work from a clean start and make all required inputs explicit.",
        "print(cells)",[1],[["Fresh session","cells not defined"],["Outcome","NameError"]],
        "NameError: name 'cells' is not defined",
        "A script that works only because of hidden notebook state is not safely reproducible.",
        {goal:"P01-G07"}
      ),
      scene(
        "Put it all together",
        "Now we have a complete small scientific report. First, record the specimen identifier, manual cell count, pixel length, and hypothetical calibration. Then calculate length. Finally, f strings insert values into readable output, and dot one f displays the length to one decimal place.",
        report,[1,2,3,4,5,6,7],[["Count","{CELLS} cells"],["Computed length","8.0 µm"]],
        finalOutput,
        "A real specimen report also needs image identifiers, replicate labels, source metadata, and validated measurements.",
        {goal:"P01-CAPSTONE"}
      ),
      scene(
        "See the bigger picture again",
        "This tiny report is a first building block. Later, loops will handle many fields, dictionaries will connect metadata, functions will perform repeated calculations, and image analysis can supply candidate-object measurements. The advanced image is a preview, not something this beginner script produced.",
        report,[2,5,6,7],[["Now","One report from supplied numbers"],["Later","Images → validated measurements → dataset"]],
        finalOutput,
        "Future image segmentation requires independent validation. The beginner report only processes supplied inputs.",
        {preview,goal:"P01-CAPSTONE"}
      ),
      scene(
        "Your turn: transfer the idea",
        "Return to the real editor. Add a variable for microscope field number and print it. Then change pixels from forty to sixty five, predict the new length in micrometres, and run the entire script from a clean start. Explain why changing the cell count does not change the measured length.",
        report,[2,3,4,5,6,7],[["Challenge A","Add a field number"],["Challenge B","Predict 65-pixel length"],["Challenge C","Run from the top"]],
        finalOutput,
        "Independent challenge: write the changes in the editor without copying a completed solution.",
        {goal:"P01-CAPSTONE"}
      )
    ]
  }]);
})();
