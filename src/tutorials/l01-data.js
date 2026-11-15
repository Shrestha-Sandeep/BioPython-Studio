// L01 — synthetic biological units, group split and leakage-safe preprocessing.
"use strict";
(()=>{window.BioPythonMLTutorials=Object.freeze([...(window.BioPythonMLTutorials||[]),{
  "id": "l01-chapter",
  "chapter": "L01",
  "title": "Prevent leakage in biological machine learning",
  "short": "Independent animals, group split, train-only preprocessing",
  "minutes": "14–20 min",
  "goals": [
    "L01-G01",
    "L01-G02",
    "L01-G03",
    "L01-G04",
    "L01-CAPSTONE"
  ],
  "steps": [
    {
      "title": "Predict new animals, not familiar microscope fields",
      "say": "A supervised model may appear accurate when training and test images come from the same individual animal. This tutorial uses invented animals with repeated microscopy fields to show how to define independent units, keep them apart and learn preprocessing only from training data.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "Synthetic animal fields"
        ],
        [
          "Holdout",
          "Completely unseen animals"
        ],
        [
          "Preprocessing",
          "Fit training only"
        ]
      ],
      "output": "",
      "note": "A tiny artificial dataset cannot demonstrate an actual biological effect, microscope generalization or prospective model performance.",
      "goal": "L01-G01"
    },
    {
      "title": "Four microscope fields are not four biological replicates",
      "say": "The invented table has two fields from animal A and two from B. The total image count is four, but the number of independent biological subjects is two. The target should be defined at the appropriate experimental unit.",
      "code": "rows=[('A',0),('A',0),('B',1),('B',1)]\nprint(len(rows),len({animal for animal,label in rows}))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Image fields",
          "4"
        ],
        [
          "Animals",
          "2"
        ],
        [
          "Biological n",
          "2, not 4"
        ]
      ],
      "output": "4 2",
      "note": "Fields from the same animal share biological and acquisition effects; merely collecting extra fields does not create independent subjects.",
      "goal": "L01-G01"
    },
    {
      "title": "Check label consistency before counting subject-level classes",
      "say": "Each animal in this synthetic classification table should have one consistent class. Build a set of labels per animal before counting classes so duplicate fields do not inflate the positive or negative subject count.",
      "code": "rows=[('A',0),('A',0),('B',1),('C',1)]\nby={a:{y for g,y in rows if g==a} for a,_ in rows}\nprint({a:next(iter(y)) for a,y in sorted(by.items())})",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Class 0",
          "animal A"
        ],
        [
          "Class 1",
          "animals B, C"
        ],
        [
          "Unit",
          "animal, not field"
        ]
      ],
      "output": "{'A': 0, 'B': 1, 'C': 1}",
      "note": "Labels must be meaningful and consistently assigned to source subjects; this table does not establish experimental group equivalence.",
      "goal": "L01-G01"
    },
    {
      "title": "Conflicting labels within an animal require an explicit decision",
      "say": "One subject appears with two different class labels in this fabricated table. Detect that contradiction rather than overwriting the earlier row or silently treating the conflicting fields as different animals.",
      "code": "rows=[('A',0),('A',1),('B',1)]\nconflicts=sorted(a for a in {x for x,_ in rows} if len({y for x,y in rows if x==a})>1)\nprint(conflicts)",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Animal A",
          "labels 0 and 1"
        ],
        [
          "QC flag",
          "conflicting label"
        ],
        [
          "Action",
          "stop and inspect"
        ]
      ],
      "output": "['A']",
      "note": "A label contradiction could reflect curation or biological design errors. Do not repair it by keeping an arbitrary first or last observation.",
      "goal": "L01-G01"
    },
    {
      "title": "A shared animal in train and test is leakage",
      "say": "A split is invalid for unseen-animal evaluation when the same subject ID occurs in both groups. Even if their image fields differ, the test cannot be considered independent of training for that biological subject.",
      "code": "train={'A','B'};test={'B','C'}\nprint(sorted(train & test))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Train",
          "A, B"
        ],
        [
          "Test",
          "B, C"
        ],
        [
          "Leaked subject",
          "B"
        ]
      ],
      "output": "['B']",
      "note": "Image-level novelty is not biological independence; the same subject can produce correlated data even when no pixels are identical.",
      "goal": "L01-G02"
    },
    {
      "title": "Different fields from one animal can leak across the split",
      "say": "Names A-1 and A-2 identify distinct microscope fields, not distinct animals. Comparing only the full field IDs would miss their shared origin, so extract subject IDs before checking train/test overlap.",
      "code": "train_fields=['A-1','B-1']\ntest_fields=['A-2','C-1']\nsubject=lambda x:x.split('-')[0]\nprint(sorted({subject(x) for x in train_fields}&{subject(x) for x in test_fields}))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Train fields",
          "A-1, B-1"
        ],
        [
          "Test fields",
          "A-2, C-1"
        ],
        [
          "Leaked animal",
          "A"
        ]
      ],
      "output": "['A']",
      "note": "Real grouping should derive from authoritative animal/sample metadata rather than parsing arbitrary filename delimiters in production.",
      "goal": "L01-G02"
    },
    {
      "title": "Hold out complete biological groups",
      "say": "An explicitly disjoint partition puts A and B in training and C and D in testing. Check the intersection directly and preserve group IDs so no later row selection can accidentally mix acquisition fields.",
      "code": "train={'A','B'};test={'C','D'}\nprint(train.isdisjoint(test),len(train|test))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Training animals",
          "A, B"
        ],
        [
          "Test animals",
          "C, D"
        ],
        [
          "Overlap",
          "none"
        ]
      ],
      "output": "True 4",
      "note": "Group-disjoint splits are necessary but not always sufficient: batch, litter, experiment date or microscope conditions may create further dependencies.",
      "goal": "L01-G02"
    },
    {
      "title": "GroupShuffleSplit keeps animal fields together",
      "say": "Use scikit-learn's GroupShuffleSplit with a declared seed and a group ID for every row. Four invented animals each have two fields; splitting half the animals produces four training fields and four test fields with no subject overlap.",
      "code": "from sklearn.model_selection import GroupShuffleSplit\ngroups=['A','A','B','B','C','C','D','D']\ntr,te=next(GroupShuffleSplit(n_splits=1,test_size=.5,random_state=0).split(range(8),groups=groups))\nprint(len(tr),len(te),len({groups[i] for i in tr}&{groups[i] for i in te}))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Input groups",
          "4 animals"
        ],
        [
          "Train/test fields",
          "4 and 4"
        ],
        [
          "Shared animals",
          "0"
        ]
      ],
      "output": "4 4 0",
      "note": "The split targets groups, not independent microscope fields. A fixed random seed makes a choice reproducible, not biologically valid by itself.",
      "goal": "L01-G03"
    },
    {
      "title": "A fixed seed does not rescue an incorrectly grouped split",
      "say": "Suppose someone deterministically puts field 0 and field 2 in training and the corresponding other fields in test. Repeating that choice perfectly would still leak both animal A and B across the boundary.",
      "code": "groups=['A','A','B','B']\ntrain_idx=[0,2];test_idx=[1,3]\nprint(sorted({groups[i] for i in train_idx}&{groups[i] for i in test_idx}))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Train fields",
          "0, 2"
        ],
        [
          "Test fields",
          "1, 3"
        ],
        [
          "Overlap",
          "A and B"
        ]
      ],
      "output": "['A', 'B']",
      "note": "Reproducibility of a bad design is still a bad design; provide correct group metadata to the splitter before setting its seed.",
      "goal": "L01-G03"
    },
    {
      "title": "In a group split, test_size means subjects rather than image rows",
      "say": "A split with uneven fields per animal still holds out two of four groups when test_size is one half. The number of fields in each side may differ, because the algorithm respects whole subjects rather than a fixed field percentage.",
      "code": "from sklearn.model_selection import GroupShuffleSplit\ngroups=['A','A','A','B','C','D']\ntr,te=next(GroupShuffleSplit(n_splits=1,test_size=.5,random_state=0).split(range(len(groups)),groups=groups))\nprint(len({groups[i] for i in tr}),len({groups[i] for i in te}))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "All subjects",
          "4"
        ],
        [
          "Train subjects",
          "2"
        ],
        [
          "Test subjects",
          "2"
        ]
      ],
      "output": "2 2",
      "note": "Subject counts matter when interpreting model uncertainty; an apparently large number of fields may reflect only a handful of independent animals.",
      "goal": "L01-G03"
    },
    {
      "title": "An imputer learns medians from training data only",
      "say": "SimpleImputer learns the training median for each numeric feature. The missing third entry does not contribute a value; the median of one and three is two, and held-out test observations must not influence that fitted statistic.",
      "code": "import numpy as np\nfrom sklearn.impute import SimpleImputer\ntrain=np.array([[1.],[3.],[np.nan]])\nimp=SimpleImputer(strategy='median').fit(train)\nprint(imp.statistics_.tolist())",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Training observed",
          "1 and 3"
        ],
        [
          "Missing",
          "NaN"
        ],
        [
          "Learned median",
          "2.0"
        ]
      ],
      "output": "[2.0]",
      "note": "Fit preprocessing after the subject-level split. A median computed from all images, including held-out animals, leaks distributional information.",
      "goal": "L01-G04"
    },
    {
      "title": "Predict the training-only median before revealing it",
      "say": "Train features are one, three and missing. The reserved test feature is one hundred. Before seeing the next output, decide whether training-only median imputation should learn two, three or some value influenced by the high test observation.",
      "code": "import numpy as np\nfrom sklearn.impute import SimpleImputer\ntrain=np.array([[1.],[3.],[np.nan]])\ntest=np.array([[100.]])\nimp=SimpleImputer(strategy='median').fit(train)\nprint(float(imp.statistics_[0]))",
      "focus": [
        3,
        4,
        5,
        6
      ],
      "visual": [
        [
          "Train values",
          "1, 3, NaN"
        ],
        [
          "Test value",
          "100 (reserved)"
        ],
        [
          "Training median",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "Think about which array is passed to fit. No held-out values should influence training statistics even if their labels are hidden.",
      "goal": "L01-G04",
      "checkpoint": true
    },
    {
      "title": "Reveal: the correct training median is 2.0",
      "say": "The observed training values are one and three, so their median is exactly two. The test value one hundred is never included in the imputer's fit, and it can be transformed later using only the trained parameters.",
      "code": "import numpy as np\nfrom sklearn.impute import SimpleImputer\ntrain=np.array([[1.],[3.],[np.nan]])\ntest=np.array([[100.]])\nimp=SimpleImputer(strategy='median').fit(train)\nprint(float(imp.statistics_[0]))",
      "focus": [
        3,
        4,
        5,
        6
      ],
      "visual": [
        [
          "Training median",
          "2.0"
        ],
        [
          "Test value",
          "not fitted"
        ],
        [
          "Leakage",
          "none in this step"
        ]
      ],
      "output": "2.0",
      "note": "Keeping the test out of the imputer fit is a minimum requirement; real data may also need subject-aware batch handling and external validation.",
      "goal": "L01-G04"
    },
    {
      "title": "Including a test observation changes the learned median",
      "say": "If the reserved test value one hundred is improperly combined with the training array before fitting, the observed median becomes three. This demonstrates a data leak even though the test label was never used.",
      "code": "import numpy as np\ntrain=np.array([1.,3.,np.nan]);test=np.array([100.])\nprint(float(np.nanmedian(train)),float(np.nanmedian(np.r_[train,test])))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Correct median",
          "2.0 (train)"
        ],
        [
          "Leaked median",
          "3.0 (all data)"
        ],
        [
          "Mistake",
          "test influenced fit"
        ]
      ],
      "output": "2.0 3.0",
      "note": "A leak can occur through unsupervised preprocessing: fitting scaling or imputation on the test feature distribution is not a fair held-out evaluation.",
      "goal": "L01-G04"
    },
    {
      "title": "A Pipeline can fit imputation and scaling on training only",
      "say": "The scikit-learn Pipeline fits the imputer and scaler on training rows, and then supports transforming the held-out test rows without learning new parameters from them. Here the centered training feature has mean zero.",
      "code": "import numpy as np\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler\ntrain=np.array([[1.],[3.],[np.nan]])\np=Pipeline([('impute',SimpleImputer(strategy='median')),('scale',StandardScaler())]).fit(train)\nprint(round(float(p.transform(train).mean()),7),p.named_steps['impute'].statistics_.tolist())",
      "focus": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "visual": [
        [
          "Median",
          "2.0 from train"
        ],
        [
          "Scaled train mean",
          "0.0"
        ],
        [
          "Test",
          "transform only"
        ]
      ],
      "output": "0.0 [2.0]",
      "note": "The pipeline helps prevent fit leakage, but cannot fix unrecognized shared animals, laboratory batches or inappropriate target definitions.",
      "goal": "L01-G04"
    },
    {
      "title": "Capstone: split by animal, then fit imputation on train",
      "say": "Combine a grouped split and train-only preprocessing with actual scikit-learn. Four synthetic animals contribute eight fields. The seeded split holds out two whole animals, fits the numeric imputer on training fields, and reports the observed training median.",
      "code": "import numpy as np\nfrom sklearn.model_selection import GroupShuffleSplit\nfrom sklearn.impute import SimpleImputer\ngroups=['A','A','B','B','C','C','D','D']\nX=np.arange(1,9,dtype=float).reshape(-1,1)\ntr,te=next(GroupShuffleSplit(n_splits=1,test_size=.5,random_state=0).split(X,groups=groups))\nimp=SimpleImputer(strategy='median').fit(X[tr])\nprint({'train_rows':len(tr),'test_rows':len(te),'group_overlap':len({groups[i] for i in tr}&{groups[i] for i in te}),'train_median':float(imp.statistics_[0])})",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "visual": [
        [
          "Train/test",
          "4 fields each"
        ],
        [
          "Group overlap",
          "0"
        ],
        [
          "Train median",
          "2.5"
        ]
      ],
      "output": "{'train_rows': 4, 'test_rows': 4, 'group_overlap': 0, 'train_median': 2.5}",
      "note": "This is a synthetic preprocessing audit, not a trained classifier, validated microscopy phenotype or estimate of out-of-animal predictive accuracy.",
      "goal": "L01-CAPSTONE"
    },
    {
      "title": "Independent transfer: detect leakage in a new experiment",
      "say": "Return to the editor with a different invented animal-by-field dataset containing uneven field counts, a conflicting subject label, a hidden shared group, missing features and a very large held-out value. First audit the biological units and group split, then fit imputation and scaling on training animals only, without copying this tutorial solution.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Unit",
          "one class per animal"
        ],
        [
          "Split",
          "zero shared animals"
        ],
        [
          "Fit",
          "train only; audit missing"
        ]
      ],
      "output": "",
      "note": "Independent transfer should use genuinely new inputs and keep all original metadata; automated success cannot establish biological validity or learner mastery.",
      "goal": "L01-CAPSTONE"
    }
  ]
}]);})();
