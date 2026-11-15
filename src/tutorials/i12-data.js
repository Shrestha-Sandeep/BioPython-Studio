// I12 — synthetic independent-unit statistics, confidence intervals and honest figures.
"use strict";
(() => {
window.BioPythonImagingTutorials=Object.freeze([...(window.BioPythonImagingTutorials||[]),{
  "id": "i12-chapter",
  "chapter": "I12",
  "title": "Report uncertainty without misleading plots",
  "short": "SD, SEM, CI, bootstrap and replicate-level inference",
  "minutes": "12–17 min",
  "goals": [
    "I12-G01",
    "I12-G02",
    "I12-G03",
    "I12-G04",
    "I12-G05",
    "I12-G06",
    "I12-G07",
    "I12-G08",
    "I12-G09",
    "I12-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: effect and uncertainty from independent biological units",
      "say": "I11 separated biological experimental units from microscope fields. Now we'll turn synthetic independent-unit summaries into a defensible descriptive report, explicitly labeling the effect, sample size, uncertainty interval and analysis assumptions. The published microscopy figure remains context, not a source of numerical evidence or real p-values.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Input",
          "assumed independent unit values"
        ],
        [
          "Outputs",
          "effect, n, interval and plots"
        ],
        [
          "Limit",
          "not a real experiment"
        ]
      ],
      "output": "",
      "note": "Synthetic unit labels are not proof of real experimental independence; published Witz/HPA imagery is not the source of the numbers.",
      "goal": "I12-G01",
      "preview": {
        "image": "fluorescence-single",
        "label": "Published Witz/HPA teaching figure; following replicate values are entirely synthetic"
      }
    },
    {
      "title": "Sample SD and SEM answer different questions",
      "say": "Three invented independent biological-unit values are one, two and three. Their sample standard deviation is one, representing dispersion among observed units, while their standard error of the mean is approximately zero point five seven seven. Neither quantity is justified by treating fields as independent.",
      "code": "import numpy as np\nunits=np.array([1.,2.,3.])\nsd=float(units.std(ddof=1))\nsem=float(sd/np.sqrt(len(units)))\nprint(len(units),round(sd,3),round(sem,3))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Replicate n",
          "3"
        ],
        [
          "SD",
          "1.000"
        ],
        [
          "SEM",
          "0.577"
        ]
      ],
      "output": "3 1.0 0.577",
      "note": "SEM measures estimated precision of a mean under sampling assumptions, not cell-to-cell dispersion.",
      "goal": "I12-G01"
    },
    {
      "title": "Extra imaging fields do not increase the biological n",
      "say": "Suppose three fields are collected from each of two independently treated preparations. Six measurement rows do not become six independent experiments. Increasing fields may improve a within-preparation estimate, but biological n remains two under this assumed design.",
      "code": "import pandas as pd\ndf=pd.DataFrame({'bio':['B1']*3+['B2']*3,\n                 'field':['F1','F2','F3','F4','F5','F6']})\nprint('Fields:',len(df))\nprint('Biological units:',df.bio.nunique())",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Image fields",
          "6"
        ],
        [
          "Independent units",
          "2 assumed"
        ],
        [
          "Valid n",
          "not 6"
        ]
      ],
      "output": "Fields: 6\nBiological units: 2",
      "note": "A true experimental unit must be justified from treatment assignment and biological sampling, not an ID label.",
      "goal": "I12-G01"
    },
    {
      "title": "Skewed data deserve a median and interquartile range",
      "say": "The invented values one, two, three and thirty have a high outlier. Their median is two point five, with a first quartile of one point seven five and third quartile of nine point seven five under NumPy's default linear quantile rule. Their IQR is eight.",
      "code": "import numpy as np\nx=np.array([1.,2.,3.,30.])\nq=np.percentile(x,[25,50,75])\nprint([round(float(v),2) for v in q])\nprint(round(float(q[2]-q[0]),2))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Median",
          "2.5"
        ],
        [
          "Quartiles",
          "1.75 and 9.75"
        ],
        [
          "IQR",
          "8.0"
        ]
      ],
      "output": "[1.75, 2.5, 9.75]\n8.0",
      "note": "Quantile algorithms differ across software; declare the method if exact quartiles materially affect results.",
      "goal": "I12-G02"
    },
    {
      "title": "The mean reacts strongly to an extreme value",
      "say": "With values one, two, three and thirty, the mean is nine while the median remains two point five. Robust descriptive summaries can reveal asymmetry, but this does not authorize automatically deleting the largest measured biological replicate.",
      "code": "import numpy as np\nx=np.array([1.,2.,3.,30.])\nprint(float(x.mean()),float(np.median(x)))\nprint(len(x))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Mean",
          "9.0"
        ],
        [
          "Median",
          "2.5"
        ],
        [
          "Source n",
          "4 retained"
        ]
      ],
      "output": "9.0 2.5\n4",
      "note": "Exclusion decisions must follow prespecified measurement quality rules, not the desired effect size.",
      "goal": "I12-G02"
    },
    {
      "title": "Construct a 95 percent Student-t interval transparently",
      "say": "Four assumed independent biological-unit measurements are two, four, six and eight. We use their sample SD divided by square-root n as SEM and the Student-t critical value at three degrees of freedom. The rounded two-sided confidence interval is zero point eight nine to nine point one one.",
      "code": "import numpy as np\nfrom scipy.stats import t\nx=np.array([2.,4.,6.,8.])\nn=x.size\nmean=float(x.mean())\nsem=float(x.std(ddof=1)/np.sqrt(n))\ncrit=float(t.ppf(0.975,df=n-1))\nprint(mean,[round(mean-crit*sem,2),round(mean+crit*sem,2)])",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Biological n",
          "4"
        ],
        [
          "Mean",
          "5.0"
        ],
        [
          "95% t CI",
          "0.89 to 9.11"
        ]
      ],
      "output": "5.0 [0.89, 9.11]",
      "note": "The interval relies on independent units and the t approximation; this tiny synthetic dataset has no biological inference.",
      "goal": "I12-G03"
    },
    {
      "title": "A realized frequentist interval is not a probability on the fixed parameter",
      "say": "A ninety-five percent frequentist confidence procedure covers a fixed population mean in ninety-five percent of hypothetical repeated eligible samples under its assumptions. It does not put a ninety-five percent posterior probability on the parameter after observing this one interval; n of one cannot estimate a sample SD.",
      "code": "import numpy as np\nx=np.array([5.])\nci=None if len(x)<2 else 'computable'\nprint(len(x),ci)",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "n=1",
          "No sample SD"
        ],
        [
          "95% CI",
          "not estimable"
        ],
        [
          "Meaning",
          "coverage procedure"
        ]
      ],
      "output": "1 None",
      "note": "Do not interpret one observed 95% confidence interval as 95% probability that a fixed mean lies within it.",
      "goal": "I12-G03"
    },
    {
      "title": "Bootstrap independent biological-unit values with an explicit seed",
      "say": "We bootstrap the mean by repeatedly resampling the three assumed independent unit values two, four and six—not image fields. Two hundred seeded resamples yield a transparent percentile interval. This is a demonstration, not evidence that n became two hundred.",
      "code": "import numpy as np\nunits=np.array([2.,4.,6.])\nrng=np.random.default_rng(7)\nresamples=rng.choice(units,size=(200,len(units)),replace=True)\nmeans=resamples.mean(axis=1)\nprint([round(float(v),2) for v in np.percentile(means,[2.5,97.5])])\nprint(resamples.shape)",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Biological n",
          "3"
        ],
        [
          "Resamples",
          "200"
        ],
        [
          "Percentile CI",
          "2.65 to 6.0"
        ]
      ],
      "output": "[2.65, 6.0]\n(200, 3)",
      "note": "Percentile bootstrap intervals can be unreliable at very small n; resampling cannot repair selection bias or nonindependence.",
      "goal": "I12-G04"
    },
    {
      "title": "A thousand resamples cannot manufacture a thousand experiments",
      "say": "Resampling the same three biological-unit values one thousand times creates one thousand computational estimates, but only three unique observed units. Be explicit about which number is the biological sample size and which is Monte Carlo computation.",
      "code": "import numpy as np\nunits=np.array([2.,4.,6.])\nrng=np.random.default_rng(2)\nboot=rng.choice(units,size=(1000,3),replace=True)\nprint(len(units),len(boot))\nprint(bool(boot.shape[1]==len(units)))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Real sample size",
          "3 units"
        ],
        [
          "Monte Carlo",
          "1000 resamples"
        ],
        [
          "New biology",
          "none"
        ]
      ],
      "output": "3 1000\nTrue",
      "note": "The bootstrap approximates sampling variability under assumptions; it cannot add independent biological observations.",
      "goal": "I12-G04"
    },
    {
      "title": "Choose paired or independent comparisons from the study design",
      "say": "When the same biological source contributes matched control and treatment measurements, a paired t test acts on within-unit changes. For independent treatment groups, Welch's unequal-variance test may be appropriate. This example explicitly declares paired design and checks that a paired test returns a finite p-value.",
      "code": "import numpy as np\nfrom scipy.stats import ttest_rel\ncontrol=np.array([2.,4.,5.])\ntreated=np.array([4.,4.,8.])\npaired=True\ntest=ttest_rel(treated,control)\nprint('paired' if paired else 'Welch')\nprint(bool(np.isfinite(test.pvalue)))",
      "focus": [
        6,
        7,
        8
      ],
      "visual": [
        [
          "Same units",
          "matched pairs"
        ],
        [
          "Procedure",
          "paired t"
        ],
        [
          "Choice",
          "before p-value"
        ]
      ],
      "output": "paired\nTrue",
      "note": "Both methods require defensible replication, distributional assumptions and a question fixed before observing results.",
      "goal": "I12-G05"
    },
    {
      "title": "Welch does not pair independent observations by row number",
      "say": "Two separately sampled sets of biological units have no source-wise matching. We run a two-sided Welch test with unequal-variance handling, without inventing pairs based on DataFrame order. A finite p-value is merely a property of these synthetic values.",
      "code": "import numpy as np\nfrom scipy.stats import ttest_ind\ncontrol=np.array([1.,3.,5.])\ntreated=np.array([2.,6.,8.])\ntest=ttest_ind(treated,control,equal_var=False)\nprint('Welch')\nprint(bool(np.isfinite(test.pvalue)))",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Control units",
          "3 independent IDs"
        ],
        [
          "Treatment units",
          "3 other IDs"
        ],
        [
          "Method",
          "Welch"
        ]
      ],
      "output": "Welch\nTrue",
      "note": "A small dataset and a computed p-value do not establish a real experimental treatment effect.",
      "goal": "I12-G05"
    },
    {
      "title": "Correct a declared family of multiple comparisons with Holm",
      "say": "Three hypothetical p-values belong to one declared comparison family. The Holm step-down adjustment sorts them, multiplies by the remaining number of tests, enforces monotonic adjusted values and restores the original comparison order.",
      "code": "import numpy as np\np=np.array([0.03,0.001,0.02])\norder=np.argsort(p)\nadjusted_sorted=np.maximum.accumulate((len(p)-np.arange(len(p)))*p[order])\nadjusted=np.empty_like(p)\nadjusted[order]=np.minimum(adjusted_sorted,1)\nprint([round(float(v),3) for v in adjusted])",
      "focus": [
        5,
        6,
        7
      ],
      "visual": [
        [
          "Raw p",
          "0.03, 0.001, 0.02"
        ],
        [
          "Holm adjusted",
          "0.04, 0.003, 0.04"
        ],
        [
          "Order",
          "original restored"
        ]
      ],
      "output": "[0.04, 0.003, 0.04]",
      "note": "Declare the family and effect sizes before comparing p-values; adjustment does not validate study independence.",
      "goal": "I12-G06"
    },
    {
      "title": "Bonferroni and Holm are corrections, not effect sizes",
      "say": "Bonferroni multiplies each p-value by three, capped at one, while the step-down Holm method can be less conservative. Both procedures address a chosen error-rate family; neither tells us the magnitude, precision or biological meaning of a treatment effect.",
      "code": "import numpy as np\np=np.array([0.03,0.001,0.02])\nbonf=np.minimum(1,p*len(p))\nprint([round(float(v),3) for v in bonf])\nprint('Comparisons:',len(p))",
      "focus": [
        3,
        4,
        5
      ],
      "visual": [
        [
          "Bonferroni",
          "0.09, 0.003, 0.06"
        ],
        [
          "Holm",
          "earlier computed"
        ],
        [
          "Biological effect",
          "not given by p"
        ]
      ],
      "output": "[0.09, 0.003, 0.06]\nComparisons: 3",
      "note": "Multiple-testing choices and practical relevance depend on the scientific question, not a desire for significance.",
      "goal": "I12-G06"
    },
    {
      "title": "A descriptive plot should show biological-unit observations",
      "say": "Plot individual invented biological-unit summaries for control and treatment, rather than only a bar with an unlabeled error bar. Here two scatter collections each contain three independent-unit points under the *assumed* study design.",
      "code": "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nfig,ax=plt.subplots()\na=ax.scatter([0,0,0],[2,4,6],label='Control units')\nb=ax.scatter([1,1,1],[3,7,8],label='Treatment units')\nax.set(xlabel='Condition',ylabel='Synthetic unit response')\nprint(len(ax.collections),len(a.get_offsets()),len(b.get_offsets()))\nplt.close(fig)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Control",
          "3 points"
        ],
        [
          "Treatment",
          "3 points"
        ],
        [
          "Meaning",
          "one per unit"
        ]
      ],
      "output": "2 3 3",
      "note": "Biological n cannot be inferred from plotted pixels or image fields; declared unit independence is required.",
      "goal": "I12-G07"
    },
    {
      "title": "Predict the number of paired trajectories in the figure",
      "say": "Three fictional biological units each have a control and matched treatment measurement. We connect each unit's two values with one line so the reader sees individual within-unit changes. Predict how many line artists exist before revealing the answer.",
      "code": "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nctrl=[2,4,6];treated=[3,7,8]\nfig,ax=plt.subplots()\nfor a,b in zip(ctrl,treated):\n    ax.plot([0,1],[a,b])\nprint(len(ax.lines))\nplt.close(fig)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "Paired biological IDs",
          "3"
        ],
        [
          "Values",
          "control + treated"
        ],
        [
          "Predict",
          "line artists = ?"
        ]
      ],
      "output": "",
      "note": "One plotted line represents one assumed matched biological unit, not an extra independent observation.",
      "goal": "I12-G07",
      "checkpoint": true
    },
    {
      "title": "Reveal: three trajectories represent three matched units",
      "say": "Each matched unit contributes one paired line, so the plot has three line artists. Although six measurements are displayed, there remain three assumed independent experimental units in this paired design.",
      "code": "import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nctrl=[2,4,6];treated=[3,7,8]\nfig,ax=plt.subplots()\nfor a,b in zip(ctrl,treated):\n    ax.plot([0,1],[a,b])\nprint(len(ax.lines))\nprint(len(ctrl))\nplt.close(fig)",
      "focus": [
        8,
        9,
        10
      ],
      "visual": [
        [
          "Paired lines",
          "3"
        ],
        [
          "Values shown",
          "6"
        ],
        [
          "Independent units",
          "3 assumed"
        ]
      ],
      "output": "3\n3",
      "note": "Pair identities must be validated in the acquisition records; a line connecting arbitrary rows can fabricate a paired design.",
      "goal": "I12-G07"
    },
    {
      "title": "Store experimental assumptions alongside numerical output",
      "say": "A machine-readable JSON summary can preserve which unit was assumed independent, biological n, the chosen confidence level, RNG seed and the synthetic source status. This provenance does not prove that the upstream metadata were correct.",
      "code": "import json\nreport={'source':'synthetic','unit':'assumed biological preparation',\n        'n_bio':3,'seed':7,'alpha':0.05}\nprint(json.dumps(report,sort_keys=True))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Source",
          "synthetic"
        ],
        [
          "n",
          "3 assumed units"
        ],
        [
          "Settings",
          "seed 7, alpha 0.05"
        ]
      ],
      "output": "{\"alpha\": 0.05, \"n_bio\": 3, \"seed\": 7, \"source\": \"synthetic\", \"unit\": \"assumed biological preparation\"}",
      "note": "A metadata report documents decisions; reproducibility is not the same as causal validity.",
      "goal": "I12-G08"
    },
    {
      "title": "Export named biological-unit rows rather than only aggregate means",
      "say": "A CSV export should retain each source replicate ID and individual observed value, including leading zeros in text identifiers. A summary without an underlying replicate table cannot be meaningfully audited or reanalyzed.",
      "code": "import csv,io\nbuf=io.StringIO()\nwriter=csv.DictWriter(buf,fieldnames=['unit_id','value'])\nwriter.writeheader()\nwriter.writerows([{'unit_id':'0001','value':2.0},\n                  {'unit_id':'0002','value':4.0}])\nrows=buf.getvalue().splitlines()\nprint(rows)\nprint(len(rows)-1)",
      "focus": [
        7,
        8,
        9
      ],
      "visual": [
        [
          "CSV header",
          "unit_id, value"
        ],
        [
          "Source IDs",
          "0001, 0002"
        ],
        [
          "Rows",
          "2 units"
        ]
      ],
      "output": "['unit_id,value', '0001,2.0', '0002,4.0']\n2",
      "note": "The source IDs and raw measurement provenance must remain available beyond a plotted or summarized mean.",
      "goal": "I12-G08"
    },
    {
      "title": "Label SD, SEM and confidence intervals as different quantities",
      "say": "A sample SD of one for three units corresponds to an SEM of approximately zero point five seven seven. The illustrative 95 percent Student-t half-width is much larger, about two point four eight four, because there are only three values. These are not interchangeable error bars.",
      "code": "import numpy as np\nfrom scipy.stats import t\nx=np.array([1.,2.,3.]);n=x.size\nsd=float(x.std(ddof=1));sem=sd/np.sqrt(n)\nhalf=float(t.ppf(.975,n-1)*sem)\nprint(round(sd,3),round(sem,3),round(half,3))",
      "focus": [
        4,
        5,
        6
      ],
      "visual": [
        [
          "Sample SD",
          "1"
        ],
        [
          "SEM",
          "0.577"
        ],
        [
          "95% CI half-width",
          "2.484"
        ]
      ],
      "output": "1.0 0.577 2.484",
      "note": "A confidence interval must name its method and sampling assumptions; SD and SEM should never be silently swapped.",
      "goal": "I12-G09"
    },
    {
      "title": "Make a real figure with clearly labeled SD error bars",
      "say": "Matplotlib can draw the means of two invented biological-unit groups with sample SD error bars. The axis label explicitly says SD, and there are real underlying replicate points available for plotting. A valid Matplotlib object is not proof of statistical validity.",
      "code": "import numpy as np\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\ngroups=[np.array([2.,4.,6.]),np.array([3.,7.,8.])]\nmeans=[float(v.mean()) for v in groups]\nsd=[float(v.std(ddof=1)) for v in groups]\nfig,ax=plt.subplots()\nax.errorbar([0,1],means,yerr=sd,fmt='o')\nax.set_ylabel('Synthetic group mean ± sample SD')\nprint(ax.get_ylabel())\nprint(len(groups))\nplt.close(fig)",
      "focus": [
        11,
        12,
        13
      ],
      "visual": [
        [
          "Real figure",
          "Matplotlib errorbar"
        ],
        [
          "Interval type",
          "sample SD"
        ],
        [
          "Groups",
          "2"
        ]
      ],
      "output": "Synthetic group mean ± sample SD\n2",
      "note": "For scientific communication, show the biological unit values alongside the explicitly defined interval.",
      "goal": "I12-G09"
    },
    {
      "title": "Capstone: a paired effect, t confidence interval and honest n",
      "say": "Complete a compact report from four assumed independent paired biological sources. Compute each within-source treatment-minus-control change, the mean change, a 95 percent Student-t CI and actual paired trajectories. Confirm the source arrays remain unchanged and disclose that no real experiment was validated.",
      "code": "import numpy as np\nfrom scipy.stats import t\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\ncontrol=np.array([2.,4.,6.,8.])\ntreated=np.array([3.,7.,8.,12.])\noriginal=(control.copy(),treated.copy())\ndelta=treated-control\nn=delta.size;effect=float(delta.mean())\nsem=float(delta.std(ddof=1)/np.sqrt(n))\ncritical=float(t.ppf(.975,n-1))\ninterval=[round(effect-critical*sem,2),round(effect+critical*sem,2)]\nfig,ax=plt.subplots()\nfor a,b in zip(control,treated):\n    ax.plot([0,1],[a,b])\nax.set(xlabel='Matched condition',ylabel='Synthetic per-unit response')\nprint('n:',n,'effect:',effect,'95% t CI:',interval)\nprint('Source preserved:',bool(np.array_equal(control,original[0]) and np.array_equal(treated,original[1])))\nprint('Verified:',False)\nplt.close(fig)",
      "focus": [
        19,
        20,
        21
      ],
      "visual": [
        [
          "Biological n",
          "4 synthetic paired"
        ],
        [
          "Effect",
          "+2.5"
        ],
        [
          "95% t CI",
          "0.45 to 4.55"
        ]
      ],
      "output": "n: 4 effect: 2.5 95% t CI: [0.45, 4.55]\nSource preserved: True\nVerified: False",
      "note": "Passing this calculation does not establish independent animal-level replication, unbiased acquisition or a real treatment effect.",
      "goal": "I12-CAPSTONE"
    },
    {
      "title": "Independent transfer: can you defend the uncertainty in a new dataset?",
      "say": "Return to the editor and create new synthetic field and independent-unit tables including an unequal number of image fields, one unmatched pair and an acquisition-batch warning. Decide paired versus independent analysis from IDs before computing effects, uncertainty and a figure. Keep individual-unit values visible and label every interval.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Design",
          "define independent unit and exclusions"
        ],
        [
          "Prove",
          "effect and justified interval"
        ],
        [
          "Report",
          "real n, settings and limits"
        ]
      ],
      "output": "",
      "note": "This transfer must be independently solved using new data and Python; avoid copying the tutorial or treating resamples as biological replicates.",
      "goal": "I12-CAPSTONE"
    }
  ]
}]);
})();
