/* P02: one evidence-led chapter tutorial, following the canonical P02 goals. */
"use strict";
(() => {
  const scene=(title,say,code,focus,visual,output,note,goal,extra={})=>({title,say,code,focus,visual,output,note,goal,...extra});
  const base="strain = 'N2'\nplate = 'p03 '\ncondition = ' Heat '";
  const formatted=base+"\nlabel = f'{strain}_{plate.strip().upper()}_{condition.strip().lower()}'\nprint(label)";
  const raw="sample_id = 'N2_P03_heat'\nparts = sample_id.split('_')";
  const checks=raw+"\nprint(parts)\nprint(len(parts))";
  const focus="focus_score = 0.80\nminimum_focus = 0.80\nprint(focus_score >= minimum_focus)\nprint(focus_score > minimum_focus)\nprint(0 <= focus_score <= 1)";
  const ordered="sample_id = 'N2_P03_heat'\nfocus_score = 0.80\nminimum_focus = 0.80\nparts = sample_id.split('_')\nif len(parts) != 3:\n    decision = 'REJECT'\n    reason = 'wrong field count'\nelif focus_score < minimum_focus:\n    decision = 'REJECT'\n    reason = 'low focus'\nelse:\n    decision = 'ACCEPT'\n    reason = 'shape and focus acceptable'\nprint(decision, reason)";
  const validator="sample_id = 'N2_P03_heat'\nfocus_score = 0.80\nminimum_focus = 0.80\nparts = sample_id.split('_')\nif len(parts) != 3:\n    reason = 'wrong field count'\nelif not parts[0].isascii() or not parts[0].isalnum():\n    reason = 'invalid strain'\nelif len(parts[1]) != 3 or not parts[1].startswith('P') or not parts[1][1:].isascii() or not parts[1][1:].isdigit():\n    reason = 'invalid plate'\nelif parts[2] not in ('control', 'heat', 'recovery'):\n    reason = 'invalid condition'\nelif not 0 <= focus_score <= 1:\n    reason = 'invalid focus range'\nelif focus_score < minimum_focus:\n    reason = 'low focus'\nelse:\n    reason = 'accepted'\ndecision = 'ACCEPT' if reason == 'accepted' else 'REJECT'\nprint(f'{sample_id}: {decision} ({reason})')";
  const result="N2_P03_heat: ACCEPT (accepted)";
  window.BioPythonFoundationTutorials=Object.freeze([...(window.BioPythonFoundationTutorials||window.BioPythonP01Tutorials||[]),{
    id:"p02-chapter",chapter:"P02",title:"Preventing specimen mix-ups before analysis",
    short:"One chapter example",minutes:"5–8 min",
    goals:["P02-G01","P02-G02","P02-G03","P02-G04","P02-CAPSTONE"],
    steps:[
      scene("The destination: trustworthy sample identity",
        "Imagine a folder of microscopy files from control, heat, and recovery treatments. Python can help prevent images from being assigned to the wrong group, and can record why an image was excluded. That matters before the most sophisticated segmentation or statistics.",
        "",[],[["Problem","Mislabelled treatment"],["Future capability","Auditable experiment intake"]],"",
        "The microscopy figure is context, not evidence that its sample labels have been validated.",
        "P02-G01",{preview:{image:"fluorescence-examples",label:"Images must be linked to verified experimental metadata"}}),
      scene("Build one informative label",
        "We know the strain, plate, and experimental condition. We assemble their names in a fixed order with underscores. An f string inserts the values of our variables rather than printing the words strain, plate, and condition.",
        formatted,[4,5],[["Strain","N2"],["Plate","P03"],["Treatment","heat"]],"N2_P03_heat",
        "This label convention is a teaching policy. Sample identity must still be checked against acquisition metadata.","P02-G01"),
      scene("Normalize new labels, not original records",
        "The strip method removes surrounding spaces. Upper makes the plate prefix uppercase; lower makes the condition lowercase. We preserve the strain name. But when validating an existing raw file identifier, we must keep its original spelling for audit.",
        formatted,[2,3,4],[["Input plate","p03 [space]"],["Output plate","P03"],["Input condition"," Heat "]],"N2_P03_heat",
        "Normalization is appropriate when creating a new label under a declared convention, not when silently repairing historical data.","P02-G01"),
      scene("Split an existing identifier",
        "When an image comes from a file, we can split the sample identifier around underscores. The method split returns three parts. The len function counts those parts, and later we can validate each one.",
        checks,[2,3,4],[["Pieces","N2 | P03 | heat"],["Number","3"]],"['N2', 'P03', 'heat']\n3",
        "A list of three strings is not automatically a valid biological label.","P02-G02"),
      scene("An extra field is a warning",
        "Suppose a filename contains an extra underscore and time point. Splitting produces four components. A simple structure check detects this before we accidentally interpret the wrong treatment.",
        "sample_id = 'N2_P03_heat_day2'\nparts = sample_id.split('_')\nprint(len(parts) == 3)",[1,2,3],[["Parts","4"],["Expected","3"],["Structure valid?","False"]],"False",
        "Do not guess whether extra text should be merged or discarded without an explicit naming policy.","P02-G02"),
      scene("Even three components can be wrong",
        "A record with two adjacent underscores still has three parts, but its plate component is empty. A robust check tests the component count and checks that none of the parts is empty.",
        "sample_id = 'N2__heat'\nparts = sample_id.split('_')\nshape_ok = len(parts) == 3 and all(parts)\nprint(shape_ok)",[2,3,4],[["Plate component","empty"],["Structure valid?","False"]],"False",
        "all(parts) checks nonempty strings here; full validation must also check the actual allowed fields.","P02-G02"),
      scene("Compare a focus score with a rule",
        "A focus score is a numerical measurement. A greater-than-or-equal comparison includes the exact boundary. A greater-than comparison excludes it. The score range of zero through one and the minimum of zero point eight are hypothetical for this lesson.",
        focus,[3,4,5],[["Score","0.80"],["Minimum","0.80"],["Inclusive pass","True"]],"True\nFalse\nTrue",
        "Set quality thresholds before comparing experimental groups; do not tune them to favour a treatment.","P02-G03"),
      scene("Predict the boundary outcome",
        "Think before continuing. With a score exactly equal to the minimum, will a rule using greater than or equal accept the field? Will strict greater than accept it? Press Reveal once you have predicted both answers.",
        focus,[3,4],[["Question","Equality at the boundary"],["Predict","True or False?"]],"",
        "This pause is deliberate. Decide what each comparison operator means before revealing the result.","P02-G03",{checkpoint:true}),
      scene("Reveal: equality changes the decision",
        "The inclusive comparison is True. The strict comparison is False. A single equals sign assigns a value, whereas two equals signs compare equality. This small distinction can change which microscope fields enter a dataset.",
        focus,[3,4,5],[["score >= minimum","True"],["score > minimum","False"],["0 ≤ score ≤ 1","True"]],"True\nFalse\nTrue",
        "A valid numerical comparison is not, by itself, proof that the proposed QC criterion is scientifically appropriate.","P02-G03"),
      scene("Classify cases in the right order",
        "We can now use if, elif, and else. Python checks each condition in order, choosing the first matching branch. Here, malformed structure is checked before focus, and a score below the minimum has its own rejection reason.",
        ordered,[5,6,7,8,9,10,11,12,13,14],[["Decision","ACCEPT"],["Reason","shape and focus acceptable"]],
        "ACCEPT shape and focus acceptable",
        "This short demonstration checks only part count and focus. The full validator adds strict field and range checks.","P02-G04"),
      scene("Give different failures different reasons",
        "If the label is malformed, we must not call it an out-of-focus image. If the label is valid but the focus score is low, report that separately. An audit should preserve the raw identifier and say why a record was rejected.",
        "sample_id = 'N2_P03_heat_extra'\nfocus_score = 0.95\nparts = sample_id.split('_')\nif len(parts) != 3:\n    reason = 'wrong field count'\nelif focus_score < 0.80:\n    reason = 'low focus'\nelse:\n    reason = 'accepted'\nprint(reason)",
        [3,4,5,6,7,8,9],[["Raw ID","N2_P03_heat_extra"],["Score","0.95"],["First reason","wrong field count"]],"wrong field count",
        "The priority of failure reasons must be explicit. A good focus score cannot repair a malformed identifier.","P02-G04"),
      scene("A strict but readable validator",
        "Here is the integrated script. It checks the number of fields, the strain, a plate beginning with uppercase P and exactly two digits, an allowed treatment, the numerical score range, and the declared focus threshold. It then prints the unchanged raw identifier and a decision.",
        validator,[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        [["Raw identifier","N2_P03_heat"],["QC decision","ACCEPT"],["Reason","accepted"]],result,
        "This demonstration assumes numeric focus scores. A complete import pipeline must also explicitly handle missing and nonnumeric values.","P02-CAPSTONE"),
      scene("What this enables when images arrive",
        "The same decisions can eventually be applied to many image records, and every rejection can be logged. Later, lists, loops, and dictionaries will let us implement that responsibly. But even a successful validator cannot prove that the specimen identity in the acquisition metadata is correct.",
        validator,[17,18,19,20],[["Today's result","One validated record"],["Next chapter","Many records, documented exclusions"]],result,
        "A passed label rule does not validate fluorescence images, treatment assignment, or replicate independence.","P02-CAPSTONE",
        {preview:{image:"fluorescence-single",label:"Later: assign image records to validated specimen metadata"}}),
      scene("Your turn: test a boundary and a bad ID",
        "In the real editor, build the validator for changed inputs. Check the exact score boundary, then deliberately add an unexpected fourth label segment. Explain why the label check happens before the focus check. Do not simply copy this result.",
        validator,[1,2,3,4,5,6,8,10,12,14,16,18,19,20],
        [["Test one","score = minimum"],["Test two","four ID components"],["Explain","First matching reason"]],result,
        "Independent transfer: change the input and predict each decision before running Python.","P02-CAPSTONE")
    ]
  }]);
})();