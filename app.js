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
  transfer:[{sample_id:'sample_F07',counts:[4,6,3]},{sample_id:'sample_R12',counts:[10,2,8,4]},{sample_id:'sample_H20',counts:[7,9]}]
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
  {id:'transfer',chapter:'05 · Independent transfer',name:'Your own small analysis',goal:'Create a reusable summary for a previously unseen biological specimen.',instruction:'Write summarize(sample_id, counts) to return a dictionary with sample_id, total and mean. Test it on the supplied sample.',starter:'def summarize(sample_id, counts):\n    # Return sample_id, total and mean\n    return {}\n\nprint(summarize(sample_id, counts))',why:'Transfer means using Python skills on new scientific inputs without copying a single expected answer.',caution:'This is a small reproducibility milestone, not yet an automated image-processing pipeline.',hints:['Compute total = sum(counts), mean = round(total / len(counts), 2).','Return {"sample_id": sample_id, "total": total, "mean": mean}.'],sourceImage:'07-Pipeline.ipynb'}
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
  }
};
const chapterTitles = ['01 · Python foundations','02 · Images as NumPy arrays','03 · Scientific tables','04 · Scientific visualization','05 · Independent transfer'];
const initial = {step:0,completed:{},drafts:{},hintUsed:{}};
let saved = {...initial};
try { const restored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); if(restored && typeof restored==='object') saved={...initial,...restored}; } catch(_) {}
saved.completed ||= {}; saved.drafts ||= {}; saved.hintUsed ||= {};
const unlocked = () => {let i=0; while(i<lessons.length && saved.completed[lessons[i].id])i++;return i;};
saved.step=Math.min(Math.max(0,Number(saved.step)||0),Math.min(unlocked(),lessons.length-1));
let current=saved.step, helpCount=0, running=false,worker=null,requestSeq=0, lastMask=null, maskVisible=true;
function persist(){saved.step=current;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));}catch(_){}}
function tell(title,body,type=''){$('feedback').className='feedback'+(type?' '+type:'');$('feedback').replaceChildren();const t=document.createElement('strong');t.textContent=title;const p=document.createElement('p');p.textContent=body;$('feedback').append(t,p);}
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
 if(['shape','pixel','mask'].includes(lesson.id) && !imageReady)entries.unshift(['image',imageError||'Loading real microscopy pixels…']);
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
 $('image-caption').textContent=lesson.id==='mask'?(lastMask?'Orange = pixels selected by Python from HPA blue channel':'HPA RGB image · compute a blue-channel mask to overlay'):'Real fluorescence composite · blue-channel data '+height+' × '+width+' · teaching only';
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
 make('https://www.proteinatlas.org/about/licence','HPA data license');
}
function render(){
 const mission=lessons[current];const already=!!saved.completed[mission.id];
 $('chapter').textContent=mission.chapter+' · Skill '+(current+1)+' of '+lessons.length;
 $('mission-title').textContent=mission.name;$('mission-goal').textContent=mission.goal;
 const guide=TASK_GUIDES[mission.id];
 $('brief-number').textContent=String(current+1).padStart(2,'0');
 $('instruction-text').textContent=guide.focus;
 $('task-given').textContent=guide.given;
 const steps=$('task-steps');steps.replaceChildren();
 guide.steps.forEach(instruction=>{const item=document.createElement('li');item.textContent=instruction;steps.append(item);});
 $('task-expected').textContent=guide.expected;
 $('task-check').textContent=guide.check;
 $('why').textContent=mission.why;$('science-caution').textContent=mission.caution;
 $('editor').value=typeof saved.drafts[mission.id]==='string'?saved.drafts[mission.id]:mission.starter;
 $('hint').hidden=true;$('hint-button').textContent='Show a hint';helpCount=0;lastMask=null;
 $('python-output').textContent='Output will appear here.';
 $('generated-result').hidden=true;$('generated-result').replaceChildren();
 $('back').disabled=current===0;$('next').disabled=current>=lessons.length-1||!already;
 const proof=$('proof-label');proof.className='pill'+(already?(saved.completed[mission.id]==='independent'?' verified':' guided'):'');
 proof.textContent=already?(saved.completed[mission.id]==='independent'?'Independently demonstrated':'Practiced with guidance'):'Ready to practice';
 $('runtime-state').textContent='Runs in your browser';
 $('data-title').textContent=['shape','pixel','mask'].includes(mission.id)?'Fluorescence image array':(['table','group','plot'].includes(mission.id)?'Biological measurements':'Microscopy field');
 $('image-role').textContent=['shape','pixel','mask'].includes(mission.id)?'IMAGE USED BY YOUR PYTHON': 'VISUAL CONTEXT · NOT THE TASK DATA';
 renderMetadata();renderCurriculum();drawImage();showLinks(mission);
 tell(already?'Previous result saved':'Start here',already?'You can rerun this activity or continue to your next skill.':'Follow the three instructions above, then run the edited Python. The same code must work on changed data.');
 persist();
}
function switchLesson(index){if(running||index<0||index>=lessons.length||index>unlocked())return;current=index;render();if(window.innerWidth<750)$('curriculum-toggle').open=false;window.scrollTo({top:0,behavior:'auto'});}
function hint(){const lesson=lessons[current],i=helpCount%lesson.hints.length;$('hint').textContent=lesson.hints[i];$('hint').hidden=false;helpCount++;saved.hintUsed[lesson.id]=true;persist();$('hint-button').textContent=helpCount%lesson.hints.length===0?'Repeat hints':'Another hint';}
function stopWorker(){if(worker){worker.terminate();worker=null;}}
async function run(){
 if(running)return;
 const lesson=lessons[current];
 if(['shape','pixel','mask'].includes(lesson.id) && !imageReady){tell('Real microscopy data not available',imageError||'Image files are still loading. Try again when they appear.','error');return;}
 const code=$('editor').value;
 if(!code.trim()){tell('Write some Python first','Your code editor is empty.','error');return;}
 saved.drafts[lesson.id]=code;persist();running=true;
 const id=++requestSeq;
 $('run').disabled=true;$('runtime-state').textContent='Starting…';$('python-output').textContent='Evaluating actual Python…';
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
   $('next').disabled=current>=lessons.length-1;
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
loadMicroscopy();
if (window.matchMedia('(max-width: 750px)').matches) $('curriculum-toggle').open = false;