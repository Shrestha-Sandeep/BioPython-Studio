'use strict';
/* BioPython Studio: original training content. Biology expertise is assumed;
 * programming expertise is not. Progress stays on this device. */
const $ = id => document.getElementById(id);
const STORAGE_KEY = 'biopython_studio_personal_v1';
const IMAGE_SOURCE = 'https://github.com/guiwitz/PyImageCourse_beginner';
const HANDBOOK_SOURCE = 'https://jakevdp.github.io/PythonDataScienceHandbook/';

// Real Human Protein Atlas fluorescence composites, credited at point of use.
// Images are fetched directly from the publisher with CORS, not from truncated
// GitHub binary copies. Resampled JPEG blue-channel pixels are teaching data,
// NOT calibrated raw fluorescence intensity measurements.
const REAL_IMAGE_SOURCES = [
  {id:'HPA-8346-22-C1-1',origin:'https://images.proteinatlas.org/8346/22_C1_1_blue_red_green.jpg',size:64},
  {id:'HPA-46658-784-B12-1',origin:'https://images.proteinatlas.org/46658/784_B12_1_blue_red_green.jpg',size:56},
  {id:'HPA-23394-182-H7-1',origin:'https://images.proteinatlas.org/23394/182_H7_1_blue_red_green.jpg',size:72}
];
let loadedMicroscopy = [];
let imageError = '';
let imageReady = false;
let imageLoading = false;
function blueArrayFromImage(image, dimension){
  const canvas = document.createElement('canvas');
  canvas.width=dimension;canvas.height=dimension;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(image,0,0,dimension,dimension);
  const pixels=ctx.getImageData(0,0,dimension,dimension).data;
  return Array.from({length:dimension},(_,row)=>Array.from({length:dimension},(_,col)=>pixels[(row*dimension+col)*4+2]));
}
function informativeThreshold(arr){
  const v=arr.flat().sort((a,b)=>a-b);
  return v[Math.floor(v.length*.78)];
}
function decodeMicroscopyBlob(blob) {
  if (typeof createImageBitmap === 'function') return createImageBitmap(blob);
  return new Promise((resolve,reject) => {
    const url=URL.createObjectURL(blob);
    const img=new Image();
    img.onload=() => {URL.revokeObjectURL(url);resolve(img);};
    img.onerror=() => {URL.revokeObjectURL(url);reject(new Error('JPEG could not be decoded'));};
    img.src=url;
  });
}
async function fetchMicroscopy(spec) {
  const abort=new AbortController();
  const timeout=setTimeout(()=>abort.abort(),30000);
  try {
    const response=await fetch(spec.origin,{mode:'cors',cache:'force-cache',signal:abort.signal});
    if(!response.ok) throw new Error(spec.id+': HTTP '+response.status);
    const blob=await response.blob();
    // A 1.5 KB truncated JPEG can report dimensions and fire an image load
    // event while rendering an empty field. Never accept that as a real image.
    if(blob.size<50000 || !blob.type.startsWith('image/')) {
      throw new Error(spec.id+': image incomplete or invalid ('+blob.size+' bytes)');
    }
    const element=await decodeMicroscopyBlob(blob);
    const width=element.width||element.naturalWidth;
    const height=element.height||element.naturalHeight;
    if(width<256 || height<256) throw new Error(spec.id+': unexpected image dimensions');
    const blue=blueArrayFromImage(element,spec.size);
    const values=blue.flat();
    if(new Set(values).size<3 || Math.max(...values)<8) {
      throw new Error(spec.id+': decoded image contains no readable blue-channel variation');
    }
    return {...spec,element,blue,width,height,byteSize:blob.size};
  } finally {clearTimeout(timeout);}
}
async function loadMicroscopy(){
  if(imageLoading)return;
  imageLoading=true;
  $('retry-images').hidden=true;
  try {
    const media=await Promise.all(REAL_IMAGE_SOURCES.map(fetchMicroscopy));
    loadedMicroscopy=media;
    const sets=[['shape',[0,1,2]],['pixel',[0,2,1]],['mask',[0,1,2]]];
    for(const [skill,indices] of sets){
      data[skill]=indices.map(i=>({image:media[i].blue,...(skill==='mask'?{threshold:informativeThreshold(media[i].blue)}:{})}));
    }

    // Added field-work module: all image examples originate from the same
    // three Human Protein Atlas decoded JPEGs displayed to the learner.
    const imagingInputs = {"roi_crop":[{"r0":4,"r1":20,"c0":6,"c1":26},{"r0":8,"r1":25,"c0":3,"c1":24},{"r0":11,"r1":33,"c0":12,"c1":42}],"roi_mean":[{"r0":5,"r1":18,"c0":9,"c1":21},{"r0":10,"r1":28,"c0":7,"c1":22},{"r0":8,"r1":30,"c0":14,"c1":37}],"bright_fraction":null,"background_subtract":[{"background":20},{"background":30},{"background":12}],"intensity_hist":null,"candidate_regions":null,"field_report":[{"sample_id":"CTRL-W07-R2"},{"sample_id":"TREATED-W09-R3"},{"sample_id":"RECOVERY-W12-R1"}]};
    for (const [skill, options] of Object.entries(imagingInputs)) {
      data[skill]=media.map((item,i)=>({image:item.blue,
        ...(options ? options[i] : {}),
        ...(['bright_fraction','candidate_regions','field_report'].includes(skill)
           ? {threshold:informativeThreshold(item.blue)} : {})}));
    }
    imageReady=true;
    imageError='';
  } catch(error){
    imageReady=false;
    imageError=error?.name==='AbortError'?'Image request timed out. Please retry.':String(error?.message||error);
    // Do not invent microscopy pixels if the published source is unavailable.
  } finally {
    imageLoading=false;
    $('retry-images').hidden=imageReady;
    // Update just the microscopy panel: do not erase a learner's current
    // Python output, editor contents, or feedback while images download.
    renderMetadata();
    drawImage();
  }
}

const data = {
  sample:[{sample_id:'control_A01'},{sample_id:'treated_B08'},{sample_id:'replicate_C03'}],
  change:[{control:80,treated:60},{control:120,treated:150},{control:70,treated:56}],
  replicates:[{counts:[4,6,7]},{counts:[6,2,9,1]},{counts:[2,2,2]}],
  function:[{signals:[12,14,18]},{signals:[4,8,12,16]},{signals:[5,7]}],
  shape:[],
  pixel:[],
  mask:[],
  table:[{rows:[{sample_id:'A01',bright_pixels:54},{sample_id:'A02',bright_pixels:61},{sample_id:'B01',bright_pixels:47}]},
         {rows:[{sample_id:'C01',bright_pixels:11},{sample_id:'D01',bright_pixels:42}]},
         {rows:[{sample_id:'E01',bright_pixels:12},{sample_id:'E02',bright_pixels:25},{sample_id:'F01',bright_pixels:9},{sample_id:'F02',bright_pixels:13}]}],
  group:[{rows:[{sample_id:'A01',condition:'control',bright_pixels:41},{sample_id:'A02',condition:'control',bright_pixels:39},{sample_id:'B01',condition:'treated',bright_pixels:54},{sample_id:'B02',condition:'treated',bright_pixels:50}]},
         {rows:[{sample_id:'C01',condition:'control',bright_pixels:20},{sample_id:'C02',condition:'control',bright_pixels:24},{sample_id:'D01',condition:'treated',bright_pixels:18},{sample_id:'D02',condition:'treated',bright_pixels:21}]},
         {rows:[{sample_id:'G01',condition:'control',bright_pixels:100},{sample_id:'G02',condition:'control',bright_pixels:120},{sample_id:'H01',condition:'treated',bright_pixels:110},{sample_id:'H02',condition:'treated',bright_pixels:122}]}],
  plot:[{control_mean:40,treated_mean:52},{control_mean:22,treated_mean:19},{control_mean:110,treated_mean:116}],
  transfer:[{sample_id:'sample_F07',counts:[4,6,3]},{sample_id:'sample_R12',counts:[10,2,8,4]},{sample_id:'sample_H20',counts:[7,9]}],
  sample_parts:[{"sample_id":"CTRL-W07-R2"},{"sample_id":"TREATED-W09-R3"},{"sample_id":"RECOVERY-W12-R1"}],
  gc_fraction:[{"sequence":"ATGCGCTA"},{"sequence":"GGGCCCAA"},{"sequence":"ATATATAA"}],
  quality_filter:[{"signals":[5,15,3,12],"minimum":10},{"signals":[0,2,8,20],"minimum":5},{"signals":[12,19,9,0,4],"minimum":12}],
  metadata_dict:[{"sample_id":"W07","condition":"control","bio_rep":2},{"sample_id":"W14","condition":"treated","bio_rep":3},{"sample_id":"W21","condition":"recovery","bio_rep":1}],
  missing_records:[{"rows":[{"sample_id":"A1","bright_pixels":54},{"sample_id":"A2","bright_pixels":null},{"sample_id":"A3","bright_pixels":0},{"sample_id":"A4","bright_pixels":41}]},{"rows":[{"sample_id":"B1","bright_pixels":null},{"sample_id":"B2","bright_pixels":38},{"sample_id":"B3","bright_pixels":12}]},{"rows":[{"sample_id":"C1","bright_pixels":0},{"sample_id":"C2","bright_pixels":null},{"sample_id":"C3","bright_pixels":null},{"sample_id":"C4","bright_pixels":6}]}],
  join_metadata:[{"measurements":[{"sample_id":"S1","field":1,"bright_pixels":42},{"sample_id":"S1","field":2,"bright_pixels":50},{"sample_id":"S2","field":1,"bright_pixels":33}],"metadata":[{"sample_id":"S1","condition":"control"},{"sample_id":"S2","condition":"treated"}]},{"measurements":[{"sample_id":"S3","field":1,"bright_pixels":30},{"sample_id":"S4","field":1,"bright_pixels":9},{"sample_id":"S4","field":2,"bright_pixels":12}],"metadata":[{"sample_id":"S3","condition":"baseline"},{"sample_id":"S4","condition":"test"}]},{"measurements":[{"sample_id":"S8","field":1,"bright_pixels":100},{"sample_id":"S8","field":2,"bright_pixels":110},{"sample_id":"S9","field":1,"bright_pixels":94}],"metadata":[{"sample_id":"S8","condition":"control"},{"sample_id":"S9","condition":"treated"}]}],
  replicate_means:[{"rows":[{"condition":"control","bio_rep":"C1","field":1,"bright_pixels":10},{"condition":"control","bio_rep":"C1","field":2,"bright_pixels":14},{"condition":"control","bio_rep":"C2","field":1,"bright_pixels":18},{"condition":"treated","bio_rep":"T1","field":1,"bright_pixels":30},{"condition":"treated","bio_rep":"T1","field":2,"bright_pixels":34},{"condition":"treated","bio_rep":"T2","field":1,"bright_pixels":22}]},{"rows":[{"condition":"control","bio_rep":"C3","field":1,"bright_pixels":100},{"condition":"control","bio_rep":"C3","field":2,"bright_pixels":80},{"condition":"control","bio_rep":"C3","field":3,"bright_pixels":90},{"condition":"control","bio_rep":"C4","field":1,"bright_pixels":50},{"condition":"treated","bio_rep":"T3","field":1,"bright_pixels":130},{"condition":"treated","bio_rep":"T4","field":1,"bright_pixels":60},{"condition":"treated","bio_rep":"T4","field":2,"bright_pixels":80}]},{"rows":[{"condition":"control","bio_rep":"C5","field":1,"bright_pixels":20},{"condition":"control","bio_rep":"C6","field":1,"bright_pixels":30},{"condition":"control","bio_rep":"C6","field":2,"bright_pixels":24},{"condition":"treated","bio_rep":"T5","field":1,"bright_pixels":50},{"condition":"treated","bio_rep":"T5","field":2,"bright_pixels":70},{"condition":"treated","bio_rep":"T5","field":3,"bright_pixels":60},{"condition":"treated","bio_rep":"T6","field":1,"bright_pixels":40}]}],
  roi_crop:[],
  roi_mean:[],
  bright_fraction:[],
  background_subtract:[],
  intensity_hist:[],
  candidate_regions:[],
  field_report:[],
};
const lessons = [
  {id:'sample',chapter:'01 · Python foundations',name:'Sample identity',goal:'Make the analysis report the correct specimen, even when the sample changes.',instruction:'Change the command so Python prints the provided sample_id variable, not a fixed ID.',starter:'print("control_A01")',why:'A variable lets one script work on many experimental samples without rewriting sample identifiers.',caution:'A sample ID is metadata. A fluorescence image alone cannot tell you which biological replicate it came from.',hints:['Text in quotation marks stays the same, but a variable takes the current sample value.','Replace the line with print(sample_id).'],sourceImage:'01-Python_essentials.ipynb',sourceHandbook:null},
  {id:'change',chapter:'01 · Python foundations',name:'Treatment effect',goal:'Calculate percent change from a fluorescence control to a treated sample.',instruction:'Set change_pct = (treated - control) / control * 100, then print it rounded to one decimal.',starter:'change_pct = treated - control\nprint(change_pct)',why:'Percent change has a denominator. If you subtract two signals without normalizing, you calculate a difference, not a percentage.',caution:'This is an arithmetic example, not evidence of a biological treatment effect; viability and replication still matter.',hints:['Percent change = (treated − control) ÷ control × 100.','Use change_pct = round((treated - control) / control * 100, 1) then print(change_pct).'],sourceImage:'01-Python_essentials.ipynb'},
  {id:'replicates',chapter:'01 · Python foundations',name:'Multiple fields',goal:'Combine manually curated counts from an arbitrary number of image fields.',instruction:'Use the Python sum() function on the provided counts list. Store the answer in total and print it.',starter:'total = counts[0]\nprint(total)',why:'Lists and built-in functions let you handle a changing number of measurements with one short script.',caution:'Adding counts across fields does not create additional independent biological replicates.',hints:['counts is already a list of integers; you do not need to write each number.','Use total = sum(counts) and print(total).'],sourceImage:'01-Python_essentials.ipynb'},
  {id:'function',chapter:'01 · Python foundations',name:'Reusable measurement',goal:'Write one function to calculate the mean intensity for different lists of measurements.',instruction:'Define mean_signal(values) so it returns the arithmetic mean; print the result rounded to two decimals.',starter:'def mean_signal(values):\n    return values[0]\n\nprint(round(mean_signal(signals), 2))',why:'A function captures a reusable analysis operation. The same function should work for unfamiliar samples.',caution:'Field-level mean intensity may be affected by acquisition settings, background and sample preparation.',hints:['Mean = sum of measurements ÷ number of measurements.','Inside the function, return sum(values) / len(values).'],sourceImage:'08-Logical_flow.ipynb'},
  {id:'shape',chapter:'02 · Images as NumPy arrays',name:'Discover image dimensions',goal:'Read the height and width of a microscopy image from its actual NumPy array.',instruction:'Print the image shape rather than typing the dimensions manually.',starter:'print((36, 52))',why:'Images are arrays. A 2D shape is (rows, columns), commonly interpreted as (height, width).',caution:'Real multichannel and time-lapse images can have 3–5 axes; shape alone does not tell you axis meaning.',hints:['Each image already exists as a NumPy array named image.','Use print(image.shape).'],sourceImage:'02-Images_as_arrays.ipynb',sourceHandbook:'02.02-the-basics-of-numpy-arrays.html'},
  {id:'pixel',chapter:'02 · Images as NumPy arrays',name:'Inspect one pixel',goal:'Inspect a numerical fluorescence pixel in a 2D image.',instruction:'Print the integer value at row 20, column 25 using NumPy indexing.',starter:'print(0)',why:'image[row, column] uses zero-based indices; the order is row first, column second.',caution:'Pixel values reflect image acquisition and preprocessing, not direct absolute molecule counts.',hints:['Rows index vertically, columns index horizontally, and indexing starts at zero.','Use print(int(image[20, 25])).'],sourceImage:'02-Images_as_arrays.ipynb',sourceHandbook:'02.02-the-basics-of-numpy-arrays.html'},
  {id:'mask',chapter:'02 · Images as NumPy arrays',name:'Threshold bright pixels',goal:'Build a reproducible bright-pixel mask for each microscopy image.',instruction:'Create mask = image > threshold, then print the number of True pixels.',starter:'mask = image > 100\nprint(int(mask.sum()))',why:'NumPy comparisons produce a Boolean mask. The same code can apply to new images and new thresholds.',caution:'Bright-pixel area is not an object or cell count. Touching objects, noise and background change interpretation.',hints:['The provided threshold variable may change between images.','Use mask = image > threshold, followed by print(int(mask.sum())).'],sourceImage:'04-Thresholding.ipynb',sourceHandbook:'02.06-boolean-arrays-and-masks.html'},
  {id:'table',chapter:'03 · Scientific tables',name:'Create a measurements table',goal:'Build a table from sample identifiers and previously measured bright-pixel counts.',instruction:'Create a Pandas DataFrame named df from rows; print the sum of its bright_pixels column.',starter:'df = pd.DataFrame(rows)\nprint(df["bright_pixels"].iloc[0])',why:'Pandas structures scientific results as labeled columns and rows so they can be checked and combined later.',caution:'These later table exercises still use illustrative counts, not measurements from the displayed HPA image. Record provenance and experimental units in real studies.',hints:['df = pd.DataFrame(rows) creates the table; then select a column.','Use print(int(df["bright_pixels"].sum())).'],sourceImage:'07-Pipeline.ipynb',sourceHandbook:'03.00-introduction-to-pandas.html'},
  {id:'group',chapter:'03 · Scientific tables',name:'Compare conditions',goal:'Compute the mean bright-pixel measurement for each condition.',instruction:'Group the table by condition, then print treated mean minus control mean to two decimals.',starter:'df = pd.DataFrame(rows)\nmeans = df.groupby("condition")["bright_pixels"].mean()\nprint(0)',why:'Groupby makes it possible to summarize data by experimental factors instead of averaging everything together.',caution:'Do not confuse field counts with biological replicate counts. Means across fields can hide pseudoreplication.',hints:['means is a Pandas Series indexed by control and treated.','Use print(round(float(means["treated"] - means["control"]), 2)).'],sourceImage:'07-Pipeline.ipynb',sourceHandbook:'03.08-aggregation-and-grouping.html'},
  {id:'plot',chapter:'04 · Scientific visualization',name:'Plot the measured groups',goal:'Turn control and treated mean measurements into a reproducible figure.',instruction:'Create a Matplotlib bar chart using control_mean and treated_mean; label the y-axis.',starter:'fig, ax = plt.subplots()\nax.bar(["control", "treated"], [control_mean, 0])\nax.set_ylabel("")',why:'A plot is scientific output. Axes, labels and underlying measurements should remain correct when the data changes.',caution:'A bar chart of means without biological-replicate uncertainty is descriptive only. Error bars require appropriate replicate data.',hints:['The group labels are control and treated, and both values are provided.','Set the second bar to treated_mean and write ax.set_ylabel("Bright pixels / field").'],sourceImage:'03-More_on_images.ipynb',sourceHandbook:'04.00-introduction-to-matplotlib.html'},
  {id:'transfer',chapter:'05 · Independent transfer',name:'Your own small analysis',goal:'Create a reusable summary for a previously unseen biological specimen.',instruction:'Write summarize(sample_id, counts) to return a dictionary with sample_id, total and mean. Test it on the supplied sample.',starter:'def summarize(sample_id, counts):\n    # Return sample_id, total and mean\n    return {}\n\nprint(summarize(sample_id, counts))',why:'Transfer means using Python skills on new scientific inputs without copying a single expected answer.',caution:'This is a small reproducibility milestone, not yet an automated image-processing pipeline.',hints:['Compute total = sum(counts), mean = round(total / len(counts), 2).','Return {"sample_id": sample_id, "total": total, "mean": mean}.'],sourceImage:'07-Pipeline.ipynb'},
  {"id":"sample_parts","chapter":"06 · Scientific Python in the lab","name":"Decode a sample ID","goal":"Extract the experimental group from a structured sample ID.","instruction":"Use sample_id.split(\"-\") to extract the group before the first hyphen; store it in group and print it.","starter":"group = sample_id\nprint(group)","why":"Hyphen-delimited sample identifiers can encode experimental metadata, but their format must be documented and validated.","caution":"Sample IDs are provided metadata; an image cannot reliably reveal treatment or replicate identity.","hints":["The split(\"-\") method returns a list of parts.","Use group = sample_id.split(\"-\")[0], then print(group)."],"extraSources":[{"label":"Python for Biologists","url":"https://www.pythonforbiologists.org/"},{"label":"Image Processing for Beginners","url":"https://guiwitz.github.io/PyImageCourse_beginner/README.html"}]},
  {"id":"gc_fraction","chapter":"06 · Scientific Python in the lab","name":"DNA GC percentage","goal":"Calculate a simple genomic sequence property with Python strings.","instruction":"Compute the percent of uppercase DNA bases that are G or C; store rounded one-decimal value in gc_pct and print it.","starter":"gc_pct = sequence.count(\"G\")\nprint(gc_pct)","why":"String methods and arithmetic are reusable scientific tools, including in sequence quality summaries.","caution":"This simplified exercise uses A/C/G/T-only sequences; it does not teach how to treat ambiguous or low-quality bases.","hints":["String .count(\"G\") counts occurrences of G; repeat for C.","gc_pct = round(100 * (sequence.count(\"G\")+sequence.count(\"C\")) / len(sequence), 1)."],"extraSources":[{"label":"Python for Biologists","url":"https://www.pythonforbiologists.org/"}]},
  {"id":"quality_filter","chapter":"06 · Scientific Python in the lab","name":"Filter low-quality fields","goal":"Select recorded fields that meet a stated quality criterion.","instruction":"Create kept containing every value in signals that is greater than or equal to minimum; print len(kept).","starter":"kept = signals[:1]\nprint(len(kept))","why":"Filtering a list is a first step towards robust data QA and handling variable-length experimental records.","caution":"Quality thresholds must have experimental justification. Dropping fields simply because their results are inconvenient introduces bias.","hints":["Build kept by iterating over signals and testing value >= minimum.","A list comprehension is concise: [x for x in signals if x >= minimum]."],"extraSources":[{"label":"Python for Biologists","url":"https://www.pythonforbiologists.org/"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"}]},
  {"id":"metadata_dict","chapter":"06 · Scientific Python in the lab","name":"Build a metadata record","goal":"Build a readable record from the provided experimental variables.","instruction":"Create a dictionary record with sample_id, condition, and bio_rep; print condition and bio_rep separated by a colon.","starter":"record = {\"sample_id\": sample_id}\nprint(sample_id)","why":"Dictionaries give experiments consistently named fields and are the foundation of tabular and structured data.","caution":"This lesson records supplied metadata. It does not infer sample condition from the displayed image.","hints":["A dictionary uses {\"key\": value} pairs.","Include three entries: \"sample_id\", \"condition\", \"bio_rep\". Print str(record[\"condition\"]) + \":\" + str(record[\"bio_rep\"])."],"extraSources":[{"label":"Python for Biologists","url":"https://www.pythonforbiologists.org/"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"}]},
  {"id":"roi_crop","chapter":"07 · Quantitative microscopy","name":"Crop a region of interest","goal":"Extract the same relative type of rectangular image region from real microscopy pixels.","instruction":"Assign roi = image[r0:r1, c0:c1] and print roi.shape.","starter":"roi = image[:10, :10]\nprint(roi.shape)","why":"Array slicing is how image-processing pipelines select regions reproducibly.","caution":"ROI coordinates are row/column indices of resized JPEG channel pixels—not calibrated microscope coordinates.","hints":["Rows and columns are separately sliced with a colon.","Use roi = image[r0:r1, c0:c1] to handle all changed coordinates."],"extraSources":[{"label":"The Carpentries: Image Processing","url":"https://datacarpentry.github.io/image-processing/instructor/08-connected-components.html"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"},{"label":"Image Processing for Beginners","url":"https://guiwitz.github.io/PyImageCourse_beginner/README.html"}]},
  {"id":"roi_mean","chapter":"07 · Quantitative microscopy","name":"Mean signal in an ROI","goal":"Calculate the mean JPEG blue-channel value in a specified microscopy region.","instruction":"Create roi from image[r0:r1,c0:c1]; store float(roi.mean()) in mean_intensity, and print it rounded to two decimals.","starter":"roi = image[:10, :10]\nmean_intensity = 0\nprint(round(mean_intensity, 2))","why":"ROI means are a basic building block for background correction and compartment measurements.","caution":"These values come from browser-decoded RGB JPEG composites and are not calibrated fluorescence intensities.","hints":["First crop with r0:r1 and c0:c1.","Use mean_intensity = float(roi.mean()), then print(round(mean_intensity, 2))."],"extraSources":[{"label":"Bio-image Analysis Notebooks","url":"https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/22_feature_extraction/quantitative_measurements.html"},{"label":"Introduction to Bioimage Analysis","url":"https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"}]},
  {"id":"bright_fraction","chapter":"07 · Quantitative microscopy","name":"Fraction of bright pixels","goal":"Measure the fraction of a real image above a given threshold.","instruction":"Create mask = image > threshold; store its mean in fraction; print round(fraction, 3).","starter":"mask = image > 100\nfraction = 0\nprint(fraction)","why":"A Boolean mask has a mean equal to the fraction of pixels selected by that mask.","caution":"Bright-pixel fraction is area occupancy, not a number of cells, puncta or biological objects.","hints":["Compare the entire image to the variable threshold.","For a Boolean mask, float(mask.mean()) gives the selected fraction."],"extraSources":[{"label":"Introduction to Bioimage Analysis","url":"https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html"},{"label":"The Carpentries: Image Processing","url":"https://datacarpentry.github.io/image-processing/instructor/08-connected-components.html"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"}]},
  {"id":"background_subtract","chapter":"07 · Quantitative microscopy","name":"Subtract background safely","goal":"Avoid uint8 wraparound when subtracting a background value.","instruction":"Create corrected = np.maximum(image.astype(np.int16) - background, 0), then print int(corrected.sum()).","starter":"corrected = image - background\nprint(int(corrected.sum()))","why":"Unsigned 8-bit subtraction can wrap around below zero; explicit signed casting prevents a common scientific bug.","caution":"A constant background estimate is an educational simplification and is not a universally valid correction method.","hints":["Before subtraction, cast the uint8 array to a signed integer type.","Use np.maximum(..., 0) to avoid negative corrected values."],"extraSources":[{"label":"Introduction to Bioimage Analysis","url":"https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html"},{"label":"The Carpentries: Image Processing","url":"https://datacarpentry.github.io/image-processing/instructor/08-connected-components.html"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"}]},
  {"id":"intensity_hist","chapter":"07 · Quantitative microscopy","name":"Make an intensity histogram","goal":"Count how many image pixels fall into four brightness ranges.","instruction":"Use np.histogram(image, bins=4, range=(0,256)) to create hist; print int(hist[-1]).","starter":"hist = np.array([0, 0, 0, 0])\nprint(0)","why":"Intensity distributions help evaluate background, contrast and reasonable threshold strategies.","caution":"A 4-bin JPEG histogram is a teaching example, not a substitute for quantitative raw-data histograms.","hints":["np.histogram returns two arrays: counts and bin edges.","Assign hist, edges = np.histogram(image, bins=4, range=(0,256)), then print int(hist[-1])."],"extraSources":[{"label":"The Carpentries: Image Processing","url":"https://datacarpentry.github.io/image-processing/instructor/08-connected-components.html"},{"label":"Introduction to Bioimage Analysis","url":"https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"}]},
  {"id":"candidate_regions","chapter":"07 · Quantitative microscopy","name":"Find connected regions","goal":"Distinguish thresholded pixels from separate connected candidate regions.","instruction":"Create mask = image > threshold; use ndi.label(mask) to get labels and region_count; print region_count.","starter":"mask = image > threshold\nregion_count = int(mask.sum())\nprint(region_count)","why":"Connected-component labeling identifies groups of foreground pixels based on connectivity rules.","caution":"One connected bright region does not necessarily equal one biological object; noise and merges affect results. Default connectivity is 4-neighbor in 2D.","hints":["SciPy ndimage is already available as ndi.","Use labels, region_count = ndi.label(mask); print region_count."],"extraSources":[{"label":"The Carpentries: Image Processing","url":"https://datacarpentry.github.io/image-processing/instructor/08-connected-components.html"},{"label":"Bio-image Analysis Notebooks","url":"https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/22_feature_extraction/quantitative_measurements.html"},{"label":"Introduction to Bioimage Analysis","url":"https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html"}]},
  {"id":"missing_records","chapter":"08 · Data integrity and replication","name":"Handle missing measurements","goal":"Distinguish missing observations from measured zero values.","instruction":"Build df = pd.DataFrame(rows), then clean = df.dropna(subset=[\"bright_pixels\"]), and print len(clean).","starter":"df = pd.DataFrame(rows)\nclean = df\nprint(len(clean))","why":"Pandas makes missingness visible and permits declared inclusion/exclusion criteria.","caution":"Missing data may be informative or biased. Dropping rows here is a demonstration, not a justification for excluding experimental observations.","hints":["None in rows becomes a missing value in Pandas.","Use clean = df.dropna(subset=[\"bright_pixels\"]) and print len(clean)."],"extraSources":[{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"},{"label":"Bio-image Analysis Notebooks","url":"https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/22_feature_extraction/quantitative_measurements.html"}]},
  {"id":"join_metadata","chapter":"08 · Data integrity and replication","name":"Join image and sample metadata","goal":"Combine measurements with a separate sample metadata table using stable identifiers.","instruction":"Build merged = pd.DataFrame(measurements).merge(pd.DataFrame(metadata), on=\"sample_id\", validate=\"many_to_one\"); print len(merged).","starter":"merged = pd.DataFrame(measurements)\nprint(len(merged))","why":"Merging analysis outputs with sample metadata enables reproducible condition comparisons and audit trails.","caution":"An incorrect join can silently mislabel scientific samples; unique metadata identifiers and validation matter.","hints":["The measurements list may contain several fields for one sample.","Use .merge(...,on=\"sample_id\",validate=\"many_to_one\") to attach condition information."],"extraSources":[{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"},{"label":"Bio-image Analysis Notebooks","url":"https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/22_feature_extraction/quantitative_measurements.html"}]},
  {"id":"replicate_means","chapter":"08 · Data integrity and replication","name":"Respect biological replicates","goal":"Aggregate imaging fields within biological replicates before comparing conditions.","instruction":"Compute rep_means = df.groupby([\"condition\",\"bio_rep\"])[\"bright_pixels\"].mean(), then condition_means from those replicates, and print the treated–control difference.","starter":"df = pd.DataFrame(rows)\ncondition_means = df.groupby(\"condition\")[\"bright_pixels\"].mean()\nprint(0)","why":"Experimental units are biological replicates, not individual images or fields; grouping in the wrong order risks pseudoreplication.","caution":"This is descriptive aggregation; no statistical significance or biological treatment effect is established.","hints":["Group by condition and bio_rep first to compute within-replicate means.","Then average these replicate means by condition."],"extraSources":[{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"},{"label":"Bio-image Analysis Notebooks","url":"https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/22_feature_extraction/quantitative_measurements.html"},{"label":"Introduction to Bioimage Analysis","url":"https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html"}]},
  {"id":"field_report","chapter":"09 · Imaging project","name":"Reusable microscopy report","goal":"Combine real-image thresholding, connected regions, and specimen metadata into a reusable function.","instruction":"Write analyze(sample_id, image, threshold) returning sample_id, bright_pixels, bright_fraction and regions; print bright_pixels for the given case.","starter":"def analyze(sample_id, image, threshold):\n    return {\"sample_id\": sample_id}\n\nresult = analyze(sample_id, image, threshold)\nprint(result[\"sample_id\"])","why":"A reusable function is the start of a testable image-analysis pipeline that can process unfamiliar images without hardcoded outputs.","caution":"Counts are candidate connected regions from RGB JPEG blue-channel masks, not validated cell counts; raw microscopy, annotations, and calibration come later.","hints":["Inside analyze, make mask = image > threshold; ndimage.label identifies candidate regions.","Return a dictionary including int(mask.sum()), round(float(mask.mean()),3) and int(region_count) plus sample_id."],"extraSources":[{"label":"Bio-image Analysis Notebooks","url":"https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/22_feature_extraction/quantitative_measurements.html"},{"label":"Introduction to Bioimage Analysis","url":"https://bioimagebook.github.io/chapters/2-processing/3-thresholding/thresholding.html"},{"label":"The Carpentries: Image Processing","url":"https://datacarpentry.github.io/image-processing/instructor/08-connected-components.html"},{"label":"Python Data Science Handbook","url":"https://jakevdp.github.io/PythonDataScienceHandbook/"}]},
];
// Short learner-facing task contract for each original exercise. No change to evaluator.
const TASK_GUIDES = {
  "sample": {
    "focus": "A quoted specimen name never updates. Your code must read the variable.",
    "given": "Python already supplies sample_id = \"control_A01\". The next test specimen has a different ID. You do not need to create the variable.",
    "steps": [
      "Find the fixed specimen name inside print(...).",
      "Change print(...) so it uses sample_id as a variable instead of quoted text.",
      "Click Run Python & check."
    ],
    "expected": "First sample prints control_A01. Another sample must print treated_B08 using the same code.",
    "check": "Your code is run with 3 different sample IDs. A fixed answer will fail."
  },
  "change": {
    "focus": "Calculate percentage change, not simply the difference between two measurements.",
    "given": "Python gives control = 80 and treated = 60 for the first example. Both values change in later tests.",
    "steps": [
      "Compute treated minus control, then divide by control and multiply by 100.",
      "Store the percentage in a variable named change_pct.",
      "Round the answer to one decimal place and print it."
    ],
    "expected": "For control 80 and treated 60, the printed percentage is -25.0 (a 25% decrease).",
    "check": "We check change_pct and the printed percentage on 3 sets of values. This is arithmetic practice, not a biological conclusion."
  },
  "replicates": {
    "focus": "Total the values in a list, even when the list length changes.",
    "given": "A list named counts is ready. For example counts = [4, 6, 7] are manually recorded counts from three fields.",
    "steps": [
      "Use a Python operation that adds every number in counts.",
      "Save that number in a variable named total.",
      "Print total; do not type a fixed number or use only the first field."
    ],
    "expected": "For [4, 6, 7], the total printed is 17. A longer or shorter list must also work.",
    "check": "We check the total variable and output for different lists, not just the first sample."
  },
  "function": {
    "focus": "Create a reusable function that works for lists of any length.",
    "given": "Python supplies signals = [12, 14, 18] for the first example. Your starter already defines mean_signal(values), but it returns only the first value.",
    "steps": [
      "Inside mean_signal(values), calculate the sum of values divided by their length.",
      "Return the calculated mean rather than a single list element.",
      "Call mean_signal(signals), round to 2 decimals, and print it."
    ],
    "expected": "For signals [12, 14, 18], output is 14.67. Different lists give different averages.",
    "check": "We call your function on changing signal lists and check the returned mean and printed result."
  },
  "shape": {
    "focus": "Ask the NumPy image for its dimensions; do not guess them.",
    "given": "A real fluorescence image has been converted to a 2D NumPy array named image. The first array is 64 rows × 64 columns.",
    "steps": [
      "Look at the code editor: the fixed tuple is not a measurement.",
      "Use the NumPy array attribute that reports its shape.",
      "Print that shape, not a manually typed pair of dimensions."
    ],
    "expected": "The first image prints (64, 64). Later images may print (56, 56) or (72, 72).",
    "check": "We verify the output matches each real image array, including images with other sizes."
  },
  "pixel": {
    "focus": "Look up one pixel by its row and column index.",
    "given": "A 2D NumPy array image is ready. Read row 20, column 25. Python indexes start at 0 and use image[row, column].",
    "steps": [
      "Access the element at row 20 and column 25 from image.",
      "Convert the NumPy pixel value to an ordinary Python integer.",
      "Print the integer instead of the starter zero."
    ],
    "expected": "One integer from 0 to 255, taken from the supplied image. The value changes with the image.",
    "check": "We check that the printed pixel value matches the value at [20, 25] in each of 3 images."
  },
  "mask": {
    "focus": "Use a changing fluorescence threshold to make a Boolean image mask.",
    "given": "You have image, a 2D NumPy array, and threshold, a number chosen for that image. The threshold changes in different test images.",
    "steps": [
      "Compare every image pixel against the supplied threshold using >.",
      "Store the resulting True/False array in mask.",
      "Count how many pixels are True and print the number."
    ],
    "expected": "A Boolean array named mask with the same dimensions as image, plus one printed bright-pixel count. The orange overlay shows your mask after a correct run.",
    "check": "Both mask and the printed count must match all test images. Bright pixels are not a count of cells."
  },
  "table": {
    "focus": "Turn supplied measurement records into a Pandas table.",
    "given": "Python supplies rows, a list of records. The first example has bright_pixels values 54, 61 and 47. These are illustrative measurements.",
    "steps": [
      "Create a Pandas DataFrame named df using the rows list (starter line is already correct).",
      "Select the bright_pixels column of df.",
      "Print the sum of all values in that column, not just the first row."
    ],
    "expected": "First dataset prints 162. The same code must work when the number of rows changes.",
    "check": "We check both the DataFrame content and the printed total against multiple sets of records."
  },
  "group": {
    "focus": "Compare control and treated means without mixing the groups.",
    "given": "The rows records have condition and bright_pixels columns. In the first example, control values are 41 and 39; treated values are 54 and 50.",
    "steps": [
      "Build df from rows and calculate the mean for each condition using groupby (already shown in starter).",
      "Get the treated mean and subtract the control mean.",
      "Print the difference rounded to two decimals. Replace print(0)."
    ],
    "expected": "Control mean = 40, treated mean = 52. The printed treated-minus-control difference is 12.0.",
    "check": "We verify the grouped means and difference for 3 datasets. Multiple fields are not automatically biological replicates."
  },
  "plot": {
    "focus": "Make a figure that changes when the measurements change.",
    "given": "Python supplies control_mean = 40 and treated_mean = 52 for the first example. You already have Matplotlib as plt.",
    "steps": [
      "Create two bars labelled control and treated.",
      "Replace the fixed 0 in the starter with treated_mean so each bar uses the correct value.",
      "Label the y-axis with the measurement and its units."
    ],
    "expected": "A bar plot with heights 40 and 52 for the first example, plus a non-empty y-axis label.",
    "check": "We inspect both bar heights and the y-axis label over different input values, not the image appearance alone."
  },
  "transfer": {
    "focus": "Combine what you learned into a reusable function for unseen specimens.",
    "given": "Python supplies sample_id = \"sample_F07\" and counts = [4, 6, 3] for the first example. Later tests provide different IDs and list lengths.",
    "steps": [
      "Write summarize(sample_id, counts) so it computes total and mean from counts.",
      "Return a dictionary with keys sample_id, total and mean; round mean to 2 decimals.",
      "Call the function on the given inputs and print the returned dictionary."
    ],
    "expected": "For sample_F07: sample_id is sample_F07, total is 13 and mean is 4.33.",
    "check": "We evaluate the function with unfamiliar specimen IDs and counts. A hardcoded report will fail."
  },
  "sample_parts":{"focus":"Use sample_id.split(\"-\") to extract the group before the first hyphen; store it in group and print it.","given":"For example sample_id = \"CTRL-W07-R2\". The group is the first component, CTRL.","steps":["Split sample_id into pieces at each hyphen.","Select the first piece (index 0) and assign it to group.","Print group without hardcoding CTRL."],"expected":"The first case prints CTRL; different IDs produce other group codes.","check":"We check the stored group and output across three unfamiliar sample IDs."},
  "gc_fraction":{"focus":"Compute the percent of uppercase DNA bases that are G or C; store rounded one-decimal value in gc_pct and print it.","given":"The first sequence is ATGCGCTA; Python provides sequence, so no FASTA parser is needed.","steps":["Count how many G and C bases occur in sequence.","Divide that count by len(sequence), multiply by 100 and round to one decimal.","Store the result in gc_pct and print it."],"expected":"ATGCGCTA gives 50.0 percent GC.","check":"Three different sequences must produce the right gc_pct variable and printed value."},
  "quality_filter":{"focus":"Create kept containing every value in signals that is greater than or equal to minimum; print len(kept).","given":"signals = [5, 15, 3, 12], minimum = 10 in the first example.","steps":["Inspect each value in signals using a loop or list comprehension.","Keep values at or above the supplied minimum, not a hardcoded 10.","Assign the resulting list to kept and print its length."],"expected":"The first example gives kept = [15, 12] and prints 2.","check":"Both kept and the printed count must match changing signals and quality cutoffs."},
  "metadata_dict":{"focus":"Create a dictionary record with sample_id, condition, and bio_rep; print condition and bio_rep separated by a colon.","given":"Python provides sample_id = \"W07\", condition = \"control\", bio_rep = 2 in the first case.","steps":["Create record as a dictionary containing all three supplied values.","Read the condition and biological replicate fields from record.","Print them as control:2, using the variables rather than fixed text."],"expected":"The first example prints control:2.","check":"We check the dictionary values and output for three changed metadata records."},
  "roi_crop":{"focus":"Assign roi = image[r0:r1, c0:c1] and print roi.shape.","given":"Python supplies image as a real 2D blue-channel array plus r0, r1, c0, c1.","steps":["Slice the array from r0 to r1 (excluded) and c0 to c1 (excluded).","Store that NumPy subarray in roi.","Print roi.shape rather than a hardcoded size."],"expected":"A 2D tuple (ROI height, ROI width) such as (16, 20).","check":"The actual ROI values and shape must match three real images and changing crop boundaries."},
  "roi_mean":{"focus":"Create roi from image[r0:r1,c0:c1]; store float(roi.mean()) in mean_intensity, and print it rounded to two decimals.","given":"image is already a NumPy array; the four crop coordinates are supplied and vary.","steps":["Select exactly the supplied ROI, and save it as roi.","Call roi.mean(), convert it to float, and save in mean_intensity.","Print the mean rounded to two decimal places."],"expected":"A number between 0 and 255; it changes with the ROI and image.","check":"We check the ROI itself, stored mean and printed result on three images."},
  "bright_fraction":{"focus":"Create mask = image > threshold; store its mean in fraction; print round(fraction, 3).","given":"image is a real resampled HPA blue channel; threshold is provided separately for each image.","steps":["Create the Boolean mask using image > threshold.","Set fraction to float(mask.mean()).","Print round(fraction, 3)."],"expected":"A proportion between 0 and 1, changing with threshold and image.","check":"We check the complete mask and fraction against three different images and thresholds."},
  "background_subtract":{"focus":"Create corrected = np.maximum(image.astype(np.int16) - background, 0), then print int(corrected.sum()).","given":"Python provides image as uint8 and a background number such as 20.","steps":["Convert image to int16 before subtracting background.","Clip negative corrected values to zero and store the new array in corrected.","Print the integer sum of corrected."],"expected":"A corrected nonnegative array with the same dimensions as image.","check":"We verify all corrected pixel values, safe dtype and printed sum across changed inputs."},
  "intensity_hist":{"focus":"Use np.histogram(image, bins=4, range=(0,256)) to create hist; print int(hist[-1]).","given":"image is an actual 2D array of resampled JPEG blue-channel values between 0 and 255.","steps":["Calculate four equal-width histogram bins covering 0 to 256.","Store the bin counts in hist.","Print the count in the last, brightest bin."],"expected":"Four bin counts whose sum equals the total number of pixels.","check":"We verify the four counts and brightest-bin output for three images."},
  "candidate_regions":{"focus":"Create mask = image > threshold; use ndi.label(mask) to get labels and region_count; print region_count.","given":"image and threshold are provided; ndi is the loaded SciPy ndimage module.","steps":["Create the thresholded Boolean mask.","Use ndi.label(mask) to identify 4-connected regions and store labels, region_count.","Print the number of candidate regions, not the number of True pixels."],"expected":"An integer count of candidate connected regions; typically different from the pixel count.","check":"We check the mask, labeled image and number of regions on three real-image arrays."},
  "missing_records":{"focus":"Build df = pd.DataFrame(rows), then clean = df.dropna(subset=[\"bright_pixels\"]), and print len(clean).","given":"rows contains illustrative measurements; some bright_pixels are None, while 0 is a valid observed value.","steps":["Create df from all provided records.","Remove only rows with missing bright_pixels, not records where bright_pixels is zero.","Store the result in clean and print the retained row count."],"expected":"Only rows with actual measurements remain; zero measurements are retained.","check":"We verify the full cleaned DataFrame and row count on three varying datasets."},
  "join_metadata":{"focus":"Build merged = pd.DataFrame(measurements).merge(pd.DataFrame(metadata), on=\"sample_id\", validate=\"many_to_one\"); print len(merged).","given":"Python provides measurements (one row per field) and metadata (one row per sample).","steps":["Create a DataFrame from each provided list.","Merge on sample_id with validate=\"many_to_one\" and save as merged.","Print len(merged); the resulting rows must include condition labels."],"expected":"Each measurement row receives the correct condition from its sample ID.","check":"We check the merged records, row count and field-to-sample relationships across three datasets."},
  "replicate_means":{"focus":"Compute rep_means = df.groupby([\"condition\",\"bio_rep\"])[\"bright_pixels\"].mean(), then condition_means from those replicates, and print the treated–control difference.","given":"rows has condition, bio_rep, field and bright_pixels, with varying fields per biological replicate.","steps":["Create df from rows.","Compute rep_means across fields for each condition and bio_rep. Then compute condition_means across replicates.","Print treated minus control condition mean, rounded to two decimals."],"expected":"The comparison gives each biological replicate equal weight despite unequal field counts.","check":"We inspect the replicate-level and condition-level summaries over three uneven datasets."},
  "field_report":{"focus":"Write analyze(sample_id, image, threshold) returning sample_id, bright_pixels, bright_fraction and regions; print bright_pixels for the given case.","given":"Python provides a real HPA blue-channel image, a sample_id, threshold, np, and ndi.","steps":["Define analyze(sample_id, image, threshold) without hardcoded specimen data.","Calculate bright_pixels, bright_fraction (rounded to three decimals) and candidate regions using ndi.label(mask).","Return a dictionary with all four required keys. Call the function and print result[\"bright_pixels\"]."],"expected":"A reproducible report dictionary and one bright-pixel count; it must work on three different images.","check":"We call your function independently on unseen image arrays and inspect all four report fields, not just a printed answer."},
};
// chunk1-v1: additive scientific curriculum (previous lesson IDs and positions retained)
const IMAGE_LESSONS = new Set(["shape","pixel","mask","roi_crop","roi_mean","bright_fraction","background_subtract","intensity_hist","candidate_regions","field_report"]);
const MASK_LESSONS = new Set(["mask","bright_fraction","candidate_regions","field_report"]);
const chapterTitles = ['01 · Python foundations','02 · Images as NumPy arrays','03 · Scientific tables','04 · Scientific visualization','05 · Independent transfer',"06 · Scientific Python in the lab","07 · Quantitative microscopy","08 · Data integrity and replication","09 · Imaging project"];
const initial = {step:0,completed:{},drafts:{},hintUsed:{}};
let saved = {...initial};
try { const restored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); if(restored && typeof restored==='object') saved={...initial,...restored}; } catch(_) {}
saved.completed ||= {}; saved.drafts ||= {}; saved.hintUsed ||= {};
const unlocked = () => {let i=0; while(i<lessons.length && saved.completed[lessons[i].id])i++;return i;};
saved.step=Math.min(Math.max(0,Number(saved.step)||0),Math.min(unlocked(),lessons.length-1));
let current=saved.step, helpCount=0, running=false,worker=null,requestSeq=0, lastMask=null, maskVisible=true;
function persist(){saved.step=current;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));}catch(_){}}
function tell(title,body,type=''){$('feedback').hidden=false;$('feedback').className='feedback'+(type?' '+type:'');$('feedback').replaceChildren();const t=document.createElement('strong');t.textContent=title;const p=document.createElement('p');p.textContent=body;$('feedback').append(t,p);}
function renderCurriculum(){
 const nav=$('curriculum');nav.replaceChildren();let previous='';const limit=unlocked();
 lessons.forEach((lesson,i)=>{
   if(lesson.chapter!==previous){const d=document.createElement('div');d.className='group-title';d.textContent=lesson.chapter;nav.append(d);previous=lesson.chapter;}
   const b=document.createElement('button');b.className='step'+(i===current?' active':'')+(saved.completed[lesson.id]?' done':'');
   b.disabled=i>limit;b.title=b.disabled?'Complete previous skills first':lesson.name;
   const num=document.createElement('span');num.className='step-number';num.textContent=saved.completed[lesson.id]?'✓':String(i+1);
   const txt=document.createElement('span');txt.textContent=lesson.name;b.append(num,txt);
   b.addEventListener('click',()=>switchLesson(i));nav.append(b);
 });
 $('done-count').textContent=String(Object.keys(saved.completed).filter(k=>saved.completed[k]).length);
 $('progress-fill').style.width=(100*Object.keys(saved.completed).filter(k=>saved.completed[k]).length/lessons.length)+'%';
 $('curriculum-now').textContent=(current+1)+' / '+lessons.length;
}
function metadataValue(v){
 if(Array.isArray(v))return v.length>10?'array '+(v.length)+' rows':JSON.stringify(v).slice(0,65);
 if(typeof v==='object'&&v)return 'table '+Object.keys(v).length+' keys';
 return String(v);
}
function renderMetadata(){
 const lesson=lessons[current],info=data[lesson.id]?.[0]||{};const out=$('input-metadata');out.replaceChildren();
 const entries=Object.entries(info).filter(([k])=>k!=='image');
 if(info.image?.length)entries.unshift(['image','NumPy array '+info.image.length+' × '+info.image[0].length]);
 if(IMAGE_LESSONS.has(lesson.id) && !imageReady)entries.unshift(['image',imageError||'Loading real microscopy pixels…']);
 if(lesson.id==='table'||lesson.id==='group')entries.splice(0,entries.length,['rows',info.rows.length+' illustrative numeric measurements']);
 for(const [k,v] of entries){const chip=document.createElement('span');chip.className='value-chip';chip.textContent=k+' = '+metadataValue(v);out.append(chip);}
}
function drawImage(){
 const lesson=lessons[current],sample=data[lesson.id]?.[0]||{};
 const canvas=$('microscope'),ctx=canvas.getContext('2d',{alpha:false});
 ctx.fillStyle='#0b1820';ctx.fillRect(0,0,canvas.width,canvas.height);
 if(!imageReady){
   ctx.fillStyle='#d9f2eb';ctx.font='16px system-ui';
   ctx.fillText(imageError?'Microscopy images unavailable':'Loading real microscopy images…',24,canvas.height/2);
   $('image-caption').textContent=imageError?'Image unavailable: '+imageError:'Loading source images from Human Protein Atlas…';
   $('image-credit').hidden=true;
   $('sample-label').textContent='Image data pending';
   $('pixel-cursor').hidden=true;
   $('show-mask').disabled=true;return;
 }
 const media=loadedMicroscopy[0];
 // Every teaching array is sampled from one of these same real RGB images.
 // Lesson previews use the first source image; mask overlays use its sampled blue channel.
 const arr=sample.image||media.blue, height=arr.length,width=arr[0].length;
 ctx.imageSmoothingEnabled=true;
 ctx.imageSmoothingQuality='high';
 ctx.drawImage(media.element,0,0,canvas.width,canvas.height);
 if(maskVisible&&lastMask){
   const maskCanvas=document.createElement('canvas');maskCanvas.width=width;maskCanvas.height=height;
   const mc=maskCanvas.getContext('2d');const m=mc.createImageData(width,height);
   for(let y=0;y<height;y++)for(let x=0;x<width;x++){
     const idx=(y*width+x)*4, yes=lastMask[y]?.[x];
     m.data[idx]=yes?255:0;m.data[idx+1]=yes?191:0;m.data[idx+2]=yes?61:0;m.data[idx+3]=yes?180:0;
   }
   mc.putImageData(m,0,0);ctx.drawImage(maskCanvas,0,0,canvas.width,canvas.height);
 }
 if(lesson.id==='pixel'){
   const cx=(25+.5)*canvas.width/width,cy=(20+.5)*canvas.height/height;
   ctx.strokeStyle='#ffc557';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-13,cy);ctx.lineTo(cx+13,cy);ctx.moveTo(cx,cy-13);ctx.lineTo(cx,cy+13);ctx.stroke();
 }
 $('pixel-cursor').hidden=lesson.id!=='pixel';
 $('sample-label').textContent=media.id+' · blue-channel sample '+height+' × '+width;
 $('image-caption').textContent=MASK_LESSONS.has(lesson.id)?(lastMask?'Orange = pixels selected by Python from HPA blue channel':'HPA RGB image · compute a blue-channel mask to overlay'):'Real fluorescence composite · blue-channel data '+height+' × '+width+' · teaching only';
 $('image-credit').hidden=false;$('image-credit').href=media.origin;
 $('show-mask').disabled=!lastMask;
 $('show-mask').checked=lastMask?maskVisible:false;
}
function showGeneratedResult(report){
 const dest=$('generated-result');dest.replaceChildren();dest.hidden=true;
 if(report.plot_png){const img=document.createElement('img');img.alt='Figure generated by your Matplotlib Python code';img.src='data:image/png;base64,'+report.plot_png;dest.append(img);dest.hidden=false;return;}
 if(report.table?.length){const table=document.createElement('table');table.className='result-table';const head=document.createElement('thead');const tr=document.createElement('tr');const cols=Object.keys(report.table[0]);cols.forEach(c=>{const th=document.createElement('th');th.textContent=c;tr.append(th);});head.append(tr);table.append(head);
  const tb=document.createElement('tbody');report.table.slice(0,8).forEach(row=>{const rr=document.createElement('tr');cols.forEach(k=>{const td=document.createElement('td');td.textContent=String(row[k]??'');rr.append(td)});tb.append(rr)});table.append(tb);dest.append(table);dest.hidden=false;
 }
}
function showLinks(lesson){const dest=$('source-links');dest.replaceChildren();const make=(url,label)=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label+' ↗';dest.append(a);};
 if(lesson.sourceImage)make(IMAGE_SOURCE+'/blob/master/'+lesson.sourceImage,'Image Processing for Beginners');
 else make(IMAGE_SOURCE,'Image Processing for Beginners');
 make(lesson.sourceHandbook?HANDBOOK_SOURCE+lesson.sourceHandbook:HANDBOOK_SOURCE,'Python Data Science Handbook');
 if(lesson.extraSources){for(const item of lesson.extraSources)make(item.url,item.label);}
 if(IMAGE_LESSONS.has(lesson.id))make('https://www.proteinatlas.org/about/licence','HPA data license');
}
function render(){
 const mission=lessons[current];const already=!!saved.completed[mission.id];
 $('chapter').textContent=mission.chapter+' · Skill '+(current+1)+' of '+lessons.length;
 $('mission-title').textContent=mission.name;$('mission-goal').textContent=mission.goal;
 const guide=TASK_GUIDES[mission.id];
 $('brief-number').textContent=String(current+1).padStart(2,'0');
 $('instruction-text').textContent=mission.instruction;
 $('task-given').textContent=guide.given;
 const steps=$('task-steps');steps.replaceChildren();
 guide.steps.forEach(instruction=>{const item=document.createElement('li');item.textContent=instruction;steps.append(item);});
 $('task-expected').textContent=guide.expected;
 $('task-check').textContent=guide.check;
 $('task-details').open=false;$('learn-more').open=false;
 $('why').textContent=mission.why;$('science-caution').textContent=mission.caution;
 $('editor').value=typeof saved.drafts[mission.id]==='string'?saved.drafts[mission.id]:mission.starter;
 $('hint').hidden=true;$('hint-button').textContent='Show a hint';helpCount=0;lastMask=null;
 $('python-output').textContent='';
 $('output-area').hidden=true;$('feedback').hidden=true;
 $('generated-result').hidden=true;$('generated-result').replaceChildren();
 $('back').disabled=current===0;$('back').hidden=current===0;
 $('next').disabled=current>=lessons.length-1||!already;
 $('next').hidden=current>=lessons.length-1||!already;
 $('navigation').hidden=$('back').hidden&&$('next').hidden;
 const proof=$('proof-label');proof.className='pill'+(already?(saved.completed[mission.id]==='independent'?' verified':' guided'):'');
 proof.textContent=already?(saved.completed[mission.id]==='independent'?'Completed independently':'Completed with a hint'):'Ready';
 proof.hidden=!already;
 $('runtime-state').textContent='Runs in your browser';
 $('data-title').textContent=IMAGE_LESSONS.has(mission.id)?'Fluorescence image array':(['table','group','plot'].includes(mission.id)?'Biological measurements':'Microscopy field');
 $('image-role').textContent='USED IN THIS TASK';
 const usesImage=IMAGE_LESSONS.has(mission.id);
 $('image-panel').hidden=!usesImage;
 $('workspace-layout').classList.toggle('has-image',usesImage);
 renderMetadata();renderCurriculum();drawImage();showLinks(mission);
 if(usesImage&&!imageReady&&!imageLoading&&!imageError)loadMicroscopy();
 // No placeholder feedback: only show results after a code run.
 persist();
}
function switchLesson(index){if(running||index<0||index>=lessons.length||index>unlocked())return;current=index;render();$('curriculum-toggle').open=false;window.scrollTo({top:0,behavior:'auto'});}
function hint(){const lesson=lessons[current],i=helpCount%lesson.hints.length;$('hint').textContent=lesson.hints[i];$('hint').hidden=false;helpCount++;saved.hintUsed[lesson.id]=true;persist();$('hint-button').textContent=helpCount%lesson.hints.length===0?'Repeat hints':'Another hint';}
function stopWorker(){if(worker){worker.terminate();worker=null;}}
async function run(){
 if(running)return;
 const lesson=lessons[current];
 if(IMAGE_LESSONS.has(lesson.id) && !imageReady){tell('Real microscopy data not available',imageError||'Image files are still loading. Try again when they appear.','error');return;}
 const code=$('editor').value;
 if(!code.trim()){tell('Write some Python first','Your code editor is empty.','error');return;}
 saved.drafts[lesson.id]=code;persist();running=true;
 const id=++requestSeq;
 $('run').disabled=true;$('runtime-state').textContent='Starting…';$('output-area').hidden=false;$('python-output').textContent='Evaluating actual Python…';
 tell('Running scientific checks','Your code is being tested with changed specimen data.');
 let timer;
 try{
   if(!worker)worker=new Worker('./worker.js');
   const active=worker;
   const response=await new Promise((resolve,reject)=>{
     timer=setTimeout(()=>{stopWorker();reject(new Error('The Python runtime exceeded the time limit. Check for an infinite loop.'))},95000);
     active.onmessage=event=>{const msg=event.data||{};if(msg.type==='status'){$('runtime-state').textContent=msg.message;return;}
       if(msg.requestId!==id)return;clearTimeout(timer);if(msg.type==='result')resolve(msg);else reject(new Error(msg.message||'Python execution failed.'));
     };
     active.onerror=()=>{clearTimeout(timer);stopWorker();reject(new Error('Python could not load. Check the network or try a different browser.'))};
     active.postMessage({requestId:id,lesson:lesson.id,source:code,cases:data[lesson.id]});
   });
   if(response.cases?.[0])$('python-output').textContent=response.cases[0].output?.trim()||'(No printed output)';
   else $('python-output').textContent='(Python did not finish a test case)';
   if(!response.ok){tell('Not yet—here is what to change',response.message,'error');$('generated-result').hidden=true;return;}
   const first=response.cases[0];if(first.mask){lastMask=first.mask;maskVisible=true;drawImage();}
   showGeneratedResult(first);
   const evidence=saved.hintUsed[lesson.id]?'guided':'independent';
   saved.completed[lesson.id]=saved.completed[lesson.id]==='independent'?'independent':evidence;
   persist();
   tell('Verified on '+response.cases.length+' datasets',lesson.why+'\n'+(evidence==='guided'?'You used a hint; try again later without one for independent evidence.':'You solved this without opening a hint.'),'success');
   $('proof-label').textContent=evidence==='guided'?'Practiced with guidance':'Independently demonstrated';
   $('proof-label').className='pill '+(evidence==='guided'?'guided':'verified');
   $('proof-label').hidden=false;
   $('next').disabled=current>=lessons.length-1;
   $('next').hidden=current>=lessons.length-1;
   $('navigation').hidden=$('back').hidden&&$('next').hidden;
   renderCurriculum();
   if(current===lessons.length-1)tell('Research milestone complete','You built a reusable, checked Python analysis across unseen exercise datasets. Next: open real notebooks for image segmentation and experimental data workflows.','success');
 }catch(error){tell('Python runtime problem',String(error?.message||error),'error');$('python-output').textContent='Execution unavailable. No result was simulated.';}
 finally{clearTimeout(timer);running=false;$('run').disabled=false;$('runtime-state').textContent='Ctrl+Enter to run';}
}
$('run').addEventListener('click',run);
$('hint-button').addEventListener('click',hint);
$('back').addEventListener('click',()=>switchLesson(current-1));
$('next').addEventListener('click',()=>switchLesson(current+1));
$('reset-code').addEventListener('click',()=>{if(running)return;$('editor').value=lessons[current].starter;saved.drafts[lessons[current].id]=lessons[current].starter;persist();tell('Starter code restored','You can edit and run this code again.');});
$('editor').addEventListener('input',()=>{saved.drafts[lessons[current].id]=$('editor').value;persist()});
$('editor').addEventListener('keydown',event=>{
 if(event.key==='Tab'){event.preventDefault();const e=event.currentTarget;e.setRangeText('    ',e.selectionStart,e.selectionEnd,'end');saved.drafts[lessons[current].id]=e.value;persist();}
});
$('show-mask').addEventListener('change',e=>{maskVisible=e.target.checked;drawImage()});
$('retry-images').addEventListener('click',loadMicroscopy);
document.addEventListener('keydown',e=>{
 if(e.key!=='Enter'||e.isComposing||e.altKey)return;
 if(e.shiftKey&&(e.ctrlKey||e.metaKey)){e.preventDefault();switchLesson(current-1);}
 else if(e.ctrlKey||e.metaKey){e.preventDefault();run();}
 else if(e.shiftKey){e.preventDefault();switchLesson(current+1);}
});
render();
$('curriculum-toggle').open=false;