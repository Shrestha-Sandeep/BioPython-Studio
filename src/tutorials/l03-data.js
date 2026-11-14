// L03 — grouped validation and honest interpretation of synthetic microscopy ML.
"use strict";
(()=>{window.BioPythonMLTutorials=Object.freeze([...(window.BioPythonMLTutorials||[]),{
  "id": "l03-chapter",
  "chapter": "L03",
  "title": "Evaluate models on unseen biological subjects",
  "short": "Grouped CV, class errors and probability diagnostics",
  "minutes": "18–24 min",
  "goals": [
    "L03-G01",
    "L03-G02",
    "L03-G03",
    "L03-G04",
    "L03-CAPSTONE"
  ],
  "steps": [
    {
      "title": "The destination: an auditable evaluation on unseen animals",
      "say": "The final machine-learning lesson compares a baseline and a small classifier without treating correlated microscope fields as independent animals. You will create group-disjoint validation folds, inspect positive-class errors and probability predictions, and report the limits of six synthetic animals instead of claiming biological model validation.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Source",
          "6 invented animals, 12 fields"
        ],
        [
          "Design",
          "group-disjoint CV"
        ],
        [
          "Report",
          "class metrics and uncertainty"
        ]
      ],
      "output": "",
      "note": "Every feature, label, animal ID, score and plot in this chapter is an invented fixture. It cannot establish real phenotype predictability or validated microscope-batch generalization.",
      "goal": "L03-G01"
    },
    {
      "title": "Twelve microscope fields may represent only six animals",
      "say": "The synthetic group sequence contains two fields from each of six animals. Any model may have twelve input rows, but the number of biological subjects supporting generalization is six and must be reported explicitly.",
      "code": "groups=list('AABBCCDDEEFF')\nprint(len(groups),len(set(groups)))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Image rows",
          "12"
        ],
        [
          "Independent subjects",
          "6"
        ],
        [
          "Grouped IDs",
          "A–F"
        ]
      ],
      "output": "12 6",
      "note": "Repeated fields are correlated; additional imaging of the same animal does not create extra biological replicates or recover a weak independent sample size.",
      "goal": "L03-G01"
    },
    {
      "title": "GroupKFold reserves whole animals in every fold",
      "say": "GroupKFold creates three train-validation partitions while keeping the fields of each animal together. This fixed example has six groups, and every validation fold contains whole animals rather than randomly selected fields.",
      "code": "from sklearn.model_selection import GroupKFold\ngroups=list('AABBCCDDEEFF')\nfolds=list(GroupKFold(n_splits=3).split(range(len(groups)),groups=groups))\nprint(len(folds))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Animals",
          "6"
        ],
        [
          "CV folds",
          "3"
        ],
        [
          "Unit",
          "animal"
        ]
      ],
      "output": "3",
      "note": "Group-aware CV is appropriate only when group IDs represent the relevant dependency structure; litter, culture batch and experiment date may require coarser groups.",
      "goal": "L03-G01"
    },
    {
      "title": "Each animal must appear in validation exactly once",
      "say": "Unlike repeated random holdouts, GroupKFold places each subject in one validation fold across the three partitions. Counting subject appearances verifies this contract without confusing two fields from one animal with two held-out independent subjects.",
      "code": "from collections import Counter\nfrom sklearn.model_selection import GroupKFold\ngroups=list('AABBCCDDEEFF')\nheld=[g for _,te in GroupKFold(3).split(range(len(groups)),groups=groups) for g in {groups[i] for i in te}]\nprint(sorted(Counter(held).items()))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "A–F",
          "one validation fold each"
        ],
        [
          "Fields",
          "two per animal"
        ],
        [
          "Overlap",
          "none within each fold"
        ]
      ],
      "output": "[('A', 1), ('B', 1), ('C', 1), ('D', 1), ('E', 1), ('F', 1)]",
      "note": "Each validation subject is used once in this CV scheme; the model and preprocessing must still be refitted from scratch inside every training fold.",
      "goal": "L03-G01"
    },
    {
      "title": "A field-level train/test partition can leak two entire animals",
      "say": "Imagine splitting alternating fields of two animals into training and validation. The field indices are distinct, but both animals occur on both sides, which invalidates a claim of performance on truly unseen animals.",
      "code": "groups=['A','A','B','B']\ntrain_idx=[0,2];test_idx=[1,3]\nprint(sorted({groups[i] for i in train_idx}&{groups[i] for i in test_idx}))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Training fields",
          "A1, B1"
        ],
        [
          "Validation fields",
          "A2, B2"
        ],
        [
          "Shared animals",
          "A and B"
        ]
      ],
      "output": "['A', 'B']",
      "note": "Do not split by field or image filename when biological subjects, dishes, preparations or batches introduce shared variation.",
      "goal": "L03-G01"
    },
    {
      "title": "High accuracy can hide failure on the rare positive class",
      "say": "For three negative subjects and one positive, a classifier that predicts every sample negative obtains seventy-five percent accuracy. Positive recall is zero and balanced accuracy is one half, exposing the failed minority-class detection.",
      "code": "from sklearn.metrics import accuracy_score,recall_score,balanced_accuracy_score\ny=[0,0,0,1];pred=[0,0,0,0]\nprint(accuracy_score(y,pred),recall_score(y,pred,zero_division=0),balanced_accuracy_score(y,pred))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Overall accuracy",
          "0.75"
        ],
        [
          "Positive recall",
          "0.0"
        ],
        [
          "Balanced accuracy",
          "0.50"
        ]
      ],
      "output": "0.75 0.0 0.5",
      "note": "A tiny synthetic class imbalance does not establish real disease, phenotype or screening prevalence. Always declare which class is positive.",
      "goal": "L03-G02"
    },
    {
      "title": "The confusion matrix preserves the different error types",
      "say": "A confusion matrix counts true negatives, false positives, false negatives and true positives. With one of each in this invented example, scikit-learn returns the ordered four values rather than a single misleading accuracy.",
      "code": "from sklearn.metrics import confusion_matrix\ny=[0,0,1,1];pred=[0,1,1,0]\nprint(confusion_matrix(y,pred,labels=[0,1]).ravel().tolist())",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "TN / FP",
          "1 / 1"
        ],
        [
          "FN / TP",
          "1 / 1"
        ],
        [
          "Positive class",
          "label 1"
        ]
      ],
      "output": "[1, 1, 1, 1]",
      "note": "A field-level confusion matrix can still overweight animals with many images. Independent experimental evaluation needs subject-aware aggregation or modeling.",
      "goal": "L03-G02"
    },
    {
      "title": "Precision and recall answer different scientific questions",
      "say": "Precision asks what fraction of predicted positives truly had the positive label, while recall asks what fraction of actual positives were found. The simple toy confusion matrix yields one half for both, but they will diverge with different error patterns.",
      "code": "from sklearn.metrics import precision_score,recall_score\ny=[0,0,1,1];pred=[0,1,1,0]\nprint(precision_score(y,pred,zero_division=0),recall_score(y,pred,zero_division=0))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Precision",
          "TP/(TP+FP)"
        ],
        [
          "Recall",
          "TP/(TP+FN)"
        ],
        [
          "Both",
          "0.50 in this fixture"
        ]
      ],
      "output": "0.5 0.5",
      "note": "The relevance of FP versus FN depends on the biological hypothesis and experiment; neither metric alone demonstrates real generalization.",
      "goal": "L03-G02"
    },
    {
      "title": "Declare how undefined positive-class metrics are handled",
      "say": "If an evaluation set has only negative labels, positive recall would have a zero denominator. Set zero_division equal to zero explicitly rather than treating an undefined class-specific rate as a meaningful observed zero.",
      "code": "from sklearn.metrics import recall_score,precision_score\ny=[0,0];pred=[0,0]\nprint(recall_score(y,pred,pos_label=1,zero_division=0),precision_score(y,pred,pos_label=1,zero_division=0))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Positive truth count",
          "0"
        ],
        [
          "Positive predictions",
          "0"
        ],
        [
          "Reported policy",
          "zero_division=0"
        ]
      ],
      "output": "0.0 0.0",
      "note": "This is a software-reporting convention, not evidence that a real classifier achieves zero positive recall. Note absent classes as an evaluation limitation.",
      "goal": "L03-G02"
    },
    {
      "title": "Brier loss measures squared probability error",
      "say": "For two invented binary outcomes zero and one, predicting positive-class probabilities 0.2 and 0.8 gives squared errors of 0.04 each. Their average Brier score is 0.04, computed using the real scikit-learn metric.",
      "code": "from sklearn.metrics import brier_score_loss\nprint(round(float(brier_score_loss([0,1],[.2,.8],pos_label=1)),3))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Truth",
          "0,1"
        ],
        [
          "Probabilities",
          "0.2,0.8"
        ],
        [
          "Brier loss",
          "0.040"
        ]
      ],
      "output": "0.04",
      "note": "The Brier score mixes prediction discrimination, calibration and uncertainty. A low value alone is not proof that probabilities are calibrated on external subjects.",
      "goal": "L03-G03"
    },
    {
      "title": "A hard class threshold discards probability information",
      "say": "Both a 0.51 prediction and a 0.99 prediction become class one under a 0.5 cutoff, although their Brier contributions for a wrong outcome differ substantially. Keep the actual probability vector when evaluating confidence.",
      "code": "probs=[.2,.8]\nprint([int(p>=.5) for p in probs])",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Probabilities",
          "0.2 and 0.8"
        ],
        [
          "Hard classes",
          "0 and 1"
        ],
        [
          "Information lost",
          "confidence magnitude"
        ]
      ],
      "output": "[0, 1]",
      "note": "The 0.5 threshold is an arbitrary decision policy. In real problems it should reflect class prevalence, costs and validation, not test-set tuning.",
      "goal": "L03-G03"
    },
    {
      "title": "Predict the Brier score for two unfamiliar probabilities",
      "say": "Consider an invented pair of ground-truth labels zero and one with predicted positive probabilities 0.1 and 0.6. Calculate the two squared errors, average them and predict the three-decimal Brier loss before showing the printed result.",
      "code": "from sklearn.metrics import brier_score_loss\ny=[0,1];p=[.1,.6]\nprint(round(float(brier_score_loss(y,p,pos_label=1)),3))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Truth",
          "0,1"
        ],
        [
          "Prediction",
          "0.1,0.6"
        ],
        [
          "Brier loss",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "Compute error from the probability of class one, not the predicted hard label. Do not reveal any independent Prove target or code solution.",
      "goal": "L03-G03",
      "checkpoint": true
    },
    {
      "title": "Reveal: the Brier loss is 0.085",
      "say": "For the first negative sample, 0.1 squared contributes 0.01. For the second positive sample, the error is negative 0.4, squared to 0.16. The mean of those errors is 0.085.",
      "code": "from sklearn.metrics import brier_score_loss\ny=[0,1];p=[.1,.6]\nprint(round(float(brier_score_loss(y,p,pos_label=1)),3))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Squared error 1",
          "0.01"
        ],
        [
          "Squared error 2",
          "0.16"
        ],
        [
          "Mean",
          "0.085"
        ]
      ],
      "output": "0.085",
      "note": "A Brier calculation from two synthetic examples can teach arithmetic, but cannot establish reliability, model uncertainty or real biological calibration.",
      "goal": "L03-G03"
    },
    {
      "title": "Matching mean probability to prevalence is not calibration",
      "say": "These four invented predictions average 0.5, and the actual positive proportion is also 0.5. Yet two confident predictions are wrong, yielding a comparatively large Brier loss of 0.41 despite matching overall means.",
      "code": "from sklearn.metrics import brier_score_loss\ny=[0,1,0,1];p=[.1,.1,.9,.9]\nprint(round(sum(p)/len(p),1),round(sum(y)/len(y),1),round(float(brier_score_loss(y,p,pos_label=1)),2))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Mean probability",
          "0.50"
        ],
        [
          "Observed positive rate",
          "0.50"
        ],
        [
          "Brier loss",
          "0.41"
        ]
      ],
      "output": "0.5 0.5 0.41",
      "note": "One global average hides local calibration and discrimination problems. Interpretation requires enough independent subjects across probability bins.",
      "goal": "L03-G03"
    },
    {
      "title": "Reliability bins built from two subjects are unstable",
      "say": "Suppose two low-score and two high-score observations each contain one positive subject. Both bins show an observed positive fraction of 0.5 despite predicted scores of about 0.2 and 0.8, but such small bins fluctuate enormously.",
      "code": "p=[.2,.2,.8,.8];y=[0,1,0,1]\nlo=[y[i] for i,v in enumerate(p) if v<.5]\nhi=[y[i] for i,v in enumerate(p) if v>=.5]\nprint(sum(lo)/len(lo),sum(hi)/len(hi))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Low-score bin",
          "2 subjects, 50% positive"
        ],
        [
          "High-score bin",
          "2 subjects, 50% positive"
        ],
        [
          "Reliability",
          "unestablished"
        ]
      ],
      "output": "0.5 0.5",
      "note": "A four-subject toy reliability plot is not an empirical calibration study. Report bin sizes, uncertainty and independent experiment grouping.",
      "goal": "L03-G03"
    },
    {
      "title": "Verify zero animal overlap in each GroupKFold partition",
      "say": "The biological IDs used by GroupKFold remain disjoint within each training and validation pair, even though every animal eventually appears in validation across the full three-fold cycle. An explicit overlap test is part of the scientific QA.",
      "code": "from sklearn.model_selection import GroupKFold\ngroups=list('AABBCCDDEEFF')\nfolds=list(GroupKFold(3).split(range(len(groups)),groups=groups))\nprint(len(folds),sum(bool({groups[i] for i in tr}&{groups[i] for i in te}) for tr,te in folds))",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Folds",
          "3"
        ],
        [
          "Within-fold shared animals",
          "0"
        ],
        [
          "Each animal",
          "held out once"
        ]
      ],
      "output": "3 0",
      "note": "A group-safe partition prevents same-subject leakage but does not by itself remove hidden batch confounding or supply more independent animals.",
      "goal": "L03-G04"
    },
    {
      "title": "Compare the dummy and logistic classifier within grouped folds",
      "say": "With real scikit-learn, the same three subject-held-out partitions are used to fit a majority-only dummy and a train-scaled regularized logistic model. Their illustrative balanced-accuracy scores differ, but six synthetic subjects make these numbers scientifically unstable.",
      "code": "from sklearn.model_selection import GroupKFold\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import balanced_accuracy_score\ngroups=list('AABBCCDDEEFF');X=[[i/10] for i in range(12)];y=[0]*6+[1]*6\nreal=[];dummy=[]\nfor tr,te in GroupKFold(3).split(X,y,groups):\n model=make_pipeline(StandardScaler(),LogisticRegression(C=1,max_iter=300,random_state=0)).fit([X[i] for i in tr],[y[i] for i in tr])\n baseline=DummyClassifier(strategy='most_frequent').fit([X[i] for i in tr],[y[i] for i in tr])\n truth=[y[i] for i in te]\n real.append(round(float(balanced_accuracy_score(truth,model.predict([X[i] for i in te]))),2))\n dummy.append(round(float(balanced_accuracy_score(truth,baseline.predict([X[i] for i in te]))),2))\nprint(real,dummy)",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "visual": [
        [
          "Logistic balanced accuracy",
          "0.75,1.00,0.75"
        ],
        [
          "Dummy balanced accuracy",
          "0.50 each"
        ],
        [
          "Biological units",
          "6 invented animals"
        ]
      ],
      "output": "[0.75, 1.0, 0.75] [0.5, 0.5, 0.5]",
      "note": "Even a group-safe model on six animal IDs can be highly unstable, confounded and uncalibrated. These scores demonstrate code mechanics only.",
      "goal": "L03-G04"
    },
    {
      "title": "A dozen image rows cannot solve a six-animal uncertainty problem",
      "say": "The grouping scheme contains twelve images from six invented animals. Reporting the independent subject count alongside validation folds prevents a large-looking image count from being mistaken for a reliable estimate of population-level predictive performance.",
      "code": "groups=list('AABBCCDDEEFF')\nprint({'animals':len(set(groups)),'fields':len(groups),'folds':3})",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Biological n",
          "6"
        ],
        [
          "Fields",
          "12"
        ],
        [
          "CV folds",
          "3"
        ]
      ],
      "output": "{'animals': 6, 'fields': 12, 'folds': 3}",
      "note": "A rigorous future study would address sample-size planning, class balance, laboratory batch effects and external data collection before choosing a production model.",
      "goal": "L03-G04"
    },
    {
      "title": "Capstone: produce an auditable group-safe evaluation report",
      "say": "Recompute three subject-held-out folds, training a regularized logistic pipeline and dummy model only on each fold's training animals. Record balanced accuracy, overlap and the total number of validation fields to show the evaluation mechanics without overclaiming biological performance.",
      "code": "from sklearn.model_selection import GroupKFold\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import balanced_accuracy_score\ng=list('AABBCCDDEEFF');X=[[i/10] for i in range(12)];y=[0]*6+[1]*6\nls=[];ds=[];leaks=0;fields=0\nfor tr,te in GroupKFold(3).split(X,y,groups=g):\n leaks+=len({g[i] for i in tr}&{g[i] for i in te});fields+=len(te)\n m=make_pipeline(StandardScaler(),LogisticRegression(C=1,max_iter=300,random_state=0)).fit([X[i] for i in tr],[y[i] for i in tr])\n d=DummyClassifier(strategy='most_frequent').fit([X[i] for i in tr],[y[i] for i in tr])\n truth=[y[i] for i in te]\n ls.append(round(float(balanced_accuracy_score(truth,m.predict([X[i] for i in te]))),2))\n ds.append(round(float(balanced_accuracy_score(truth,d.predict([X[i] for i in te]))),2))\nprint({'n_folds':3,'group_leaks':leaks,'validation_fields':fields,'logistic':ls,'dummy':ds})",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "visual": [
        [
          "Folds/field validation",
          "3 / 12"
        ],
        [
          "Group leakage",
          "0"
        ],
        [
          "Scores",
          "dummy vs logistic per fold"
        ]
      ],
      "output": "{'n_folds': 3, 'group_leaks': 0, 'validation_fields': 12, 'logistic': [0.75, 1.0, 0.75], 'dummy': [0.5, 0.5, 0.5]}",
      "note": "The report is auditable code on toy animals, not a validated classifier for real microscopy or molecular phenotypes. Calibration and causal biology remain untested.",
      "goal": "L03-CAPSTONE"
    },
    {
      "title": "Independent transfer: defend a model evaluation on new biological units",
      "say": "Return to the editor and evaluate a different synthetic experiment with unequal field counts per animal, imbalanced classes and held-out probability predictions. Verify group disjointness, each subject used once in validation, train-only model fitting, positive-class error metrics and Brier loss; report n at the independent animal level.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Group CV",
          "subjects held out once"
        ],
        [
          "Metrics",
          "balanced accuracy and recall"
        ],
        [
          "Probabilities",
          "Brier with limits"
        ]
      ],
      "output": "",
      "note": "Transfer uses new data and no worked Prove solutions. Before claiming real scientific utility, require independent biological replication and representative held-out experiments.",
      "goal": "L03-CAPSTONE"
    }
  ]
}]);})();
