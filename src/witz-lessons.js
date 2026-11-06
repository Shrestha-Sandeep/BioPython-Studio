/* Explicit source-to-mission mapping. Witz's BSD-licensed numbered exercise
 * prompts live in curriculum/witz_exercise_inventory.json, not duplicated here.
 * Each referenced cell is surfaced in Learn and linked to its original notebook.
 * Secondary sources support gaps; they never replace the Witz spine. */
export const EXERCISE_ASSIGNMENTS = Object.freeze({
  "py-01": { notebook:"e01", cells:[1,2,3,4,5,6] },
  "py-03": { notebook:"e08", cells:[1,2,3,4,5,6] },
  "im-01": { notebook:"e02", cells:[1,2,3,4,5] },
  "im-02": { notebook:"e03", cells:[8,9,10,11,12,13] },
  "im-03": { notebook:"e03", cells:[1,2,3,4,5,6] },
  "im-04": { notebook:"e04", cells:[1,2,3,4,5,6,7] },
  "im-05": { notebook:"e05", cells:[2,3,4,5] },
  "im-06": { notebook:"e06", cells:[2,3,4,5,6,7,8] }
});
/* In Witz's original exercises some remote example files have moved.
 * Modernized instructions reference his locally documented HPA TIFFs instead.
 * PNG figures bundled here are preview/context ONLY, never array data. */
const MODERNIZED = Object.freeze({
  "e03:2":"Load the original fluorescence image from Witz's images/8346_22_C1_1.tif and name the array image. Inspect its axes before choosing a channel.",
  "e04:2":"Load Witz's image images/46658_784_B12_1.tif. Note that the embedded preview is a rendered figure, not a numeric TIFF.",
  "e06:2":"Load Witz's image images/46658_784_B12_1.tif for region measurements; inspect its channel order before applying a mask."
});
export const SUPPLEMENTS = Object.freeze({
  "py-01":{title:"Python for Biologists · beginner Python",url:"https://www.pythonforbiologists.org/",enhancement:"Supporting practice: use descriptive sample names and explain the printed value rather than copying a fixed output."},
  "py-02":{title:"Python for Biologists · scientific coding",url:"https://www.pythonforbiologists.org/",enhancement:"Biological extension: compare relative changes only when the baseline is valid and denominators are defined."},
  "py-03":{title:"Python for Biologists · loop practice",url:"https://www.pythonforbiologists.org/",enhancement:"Transfer: replace generic number lists with per-field measurements while keeping biological replicate IDs separate."},
  "py-04":{title:"Python Data Science Handbook · scientific Python",url:"https://jakevdp.github.io/PythonDataScienceHandbook/"},
  "im-01":{title:"Python Data Science Handbook · NumPy",url:"https://jakevdp.github.io/PythonDataScienceHandbook/",enhancement:"NumPy extension: inspect dtype, shape and axis meaning before doing arithmetic on image pixels."},
  "im-02":{title:"Introduction to Bioimage Analysis · image pixels",url:"https://bioimagebook.github.io/",enhancement:"Reproducibility check: record ROI coordinates and confirm a crop does not silently modify the source array."},
  "im-03":{title:"Data Carpentry · image histograms",url:"https://datacarpentry.github.io/image-processing/",enhancement:"Scientific check: distinguish a display color map from underlying pixel values, and select histogram bins deliberately."},
  "im-04":{title:"scikit-image · thresholding",url:"https://scikit-image.org/docs/stable/auto_examples/applications/plot_thresholding_guide.html",enhancement:"Validate a binary mask visually; an algorithmic threshold is not proof that each foreground region is one nucleus."},
  "im-05":{title:"Bio-image Analysis Notebooks · filtering",url:"https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/"},
  "im-06":{title:"Introduction to Bioimage Analysis · segmentation",url:"https://bioimagebook.github.io/",enhancement:"Evaluate candidate labels against annotations where possible; touching nuclei and border truncation bias counts."},
  "im-07":{title:"Data Carpentry · image measurements",url:"https://datacarpentry.github.io/image-processing/",enhancement:"A nuclear/edge enrichment score depends on segmentation quality, channel assignment and the biological sampling unit."},
  "im-08":{title:"Python Data Science Handbook · tables",url:"https://jakevdp.github.io/PythonDataScienceHandbook/",enhancement:"Persist per-object and per-sample identifiers; group fields by independent biological replicate before inference."}
});
export const WITZ_FIGURES = Object.freeze({
  "py-01":{path:"assets/witz/fluorescence-single.png",notebook:"Demo.ipynb",cell:12,alt:"Witz's Human Protein Atlas fluorescence image example"},
  "im-01":{path:"assets/witz/fluorescence-single.png",notebook:"Demo.ipynb",cell:12,alt:"Witz fluorescence image used to introduce image arrays"},
  "im-02":{path:"assets/witz/fluorescence-examples.png",notebook:"Demo.ipynb",cell:3,alt:"Two Human Protein Atlas fluorescence examples from Witz"},
  "im-03":{path:"assets/witz/nuclear-intensity-histogram.png",notebook:"04-Thresholding.ipynb",cell:13,alt:"Witz's histogram of nuclear channel intensities"},
  "im-04":{path:"assets/witz/threshold-mask.png",notebook:"04-Thresholding.ipynb",cell:16,alt:"Witz nuclear-channel binary mask after thresholding"},
  "im-05":{path:"assets/witz/otsu-nuclei-mask.png",notebook:"Demo.ipynb",cell:17,alt:"Witz nuclei-like foreground mask from Otsu thresholding"},
  "im-06":{path:"assets/witz/labeled-nuclei.png",notebook:"06-Regions.ipynb",cell:10,alt:"Witz's connected-component candidate labels"},
  "im-07":{path:"assets/witz/fluorescence-examples.png",notebook:"Demo.ipynb",cell:3,alt:"Witz nuclear localization fluorescence comparison"},
  "im-08":{path:"assets/witz/fluorescence-examples.png",notebook:"Demo.ipynb",cell:3,alt:"Two HPA images used in Witz's multi-image pipeline"}
});
export const REFERENCE_TIFFS = Object.freeze({
  "im-01":"https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/8346_22_C1_1.tif",
  "im-02":"https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/8346_22_C1_1.tif",
  "im-04":"https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/46658_784_B12_1.tif",
  "im-05":"https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/46658_784_B12_1.tif",
  "im-06":"https://github.com/guiwitz/PyImageCourse_beginner/blob/master/images/46658_784_B12_1.tif"
});
function cleanPrompt(source){
  return source.replace(/^\s*\d+\.\s*/,"")
    .replace(/```([^\x60]+)```/g,"$1")
    .replace(/\*\*([^*]+)\*\*/g,"$1")
    .trim();
}
export function resolveExercises(inventory,missionId){
  const ref=EXERCISE_ASSIGNMENTS[missionId];
  if(!ref)return[];
  const notebook=inventory?.notebooks?.find(n=>n.id===ref.notebook);
  if(!notebook)throw new Error("Missing Witz source notebook: "+ref.notebook);
  return ref.cells.map(cell=>{
    const original=notebook.numbered_prompts.find(p=>p.cell===cell);
    if(!original)throw new Error("Missing original Witz exercise cell: "+ref.notebook+":"+cell);
    return {id:ref.notebook+":"+cell,sourceCell:cell,sourcePath:notebook.path,
      sourceUrl:notebook.url,original:original.original,
      prompt:MODERNIZED[ref.notebook+":"+cell]||cleanPrompt(original.original),
      modernized:Boolean(MODERNIZED[ref.notebook+":"+cell])};
  });
}
